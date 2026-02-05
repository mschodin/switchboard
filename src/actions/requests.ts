'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { endpointSchema } from '@/lib/validators'
import type { ActionResult } from '@/types/api'
import type { EndpointRequest } from '@/types/database'

export async function submitEndpointRequest(
  formData: FormData
): Promise<ActionResult<EndpointRequest>> {
  const supabase = createServerClient()

  // Verify authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    console.error('Auth error:', authError)
    return { error: { root: [`Authentication error: ${authError.message}`] } }
  }

  if (!user) {
    return { error: { root: ['Authentication required'] } }
  }

  // Debug: log user ID for troubleshooting
  console.log('Submitting request for user:', user.id)

  // Validate input
  const validated = endpointSchema.safeParse({
    company: formData.get('company'),
    title: formData.get('title'),
    description: formData.get('description') ?? undefined,
    protocol: formData.get('protocol'),
    address: formData.get('address'),
    ports: formData.get('ports') ?? undefined,
    tagIds: formData.getAll('tagIds'),
    iconUrl: formData.get('iconUrl') || null,
  })

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  // Create endpoint request
  const { data: request, error: insertError } = await supabase
    .from('endpoint_requests')
    .insert({
      company: validated.data.company,
      title: validated.data.title,
      description: validated.data.description,
      protocol: validated.data.protocol,
      address: validated.data.address,
      ports: validated.data.ports,
      icon_url: validated.data.iconUrl,
      submitted_by: user.id,
      request_status: 'pending',
    })
    .select()
    .single()

  if (insertError) {
    console.error('endpoint_requests insert error:', insertError)
    return { error: { root: [insertError.message] } }
  }

  // Add tags
  if (validated.data.tagIds.length > 0) {
    const { error: tagsError } = await supabase.from('endpoint_request_tags').insert(
      validated.data.tagIds.map((tagId) => ({
        request_id: request.id,
        tag_id: tagId,
      }))
    )
    if (tagsError) {
      console.error('endpoint_request_tags insert error:', tagsError)
      // Clean up the request if tags failed
      await supabase.from('endpoint_requests').delete().eq('id', request.id)
      return { error: { root: [`Failed to add tags: ${tagsError.message}`] } }
    }
  }

  revalidatePath('/my-submissions')
  revalidatePath('/admin/requests')
  return { success: true, data: request, message: 'Endpoint submitted for review' }
}

export async function getUserSubmissions() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Authentication required')
  }

  const { data, error } = await supabase
    .from('endpoint_requests')
    .select(
      `
      *,
      endpoint_request_tags(
        tag:tags(*)
      )
    `
    )
    .eq('submitted_by', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getPendingRequests() {
  const supabase = createServerClient()

  // Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Authentication required')
  }

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleData?.role !== 'admin') {
    throw new Error('Admin access required')
  }

  const { data, error } = await supabase
    .from('endpoint_requests')
    .select(
      `
      *,
      endpoint_request_tags(
        tag:tags(*)
      )
    `
    )
    .eq('request_status', 'pending')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function approveRequest(requestId: string): Promise<ActionResult> {
  const supabase = createServerClient()

  // Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: { root: ['Authentication required'] } }
  }

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleData?.role !== 'admin') {
    return { error: { root: ['Admin access required'] } }
  }

  // Call the database function
  const { data, error } = await supabase.rpc('approve_endpoint_request', {
    request_id: requestId,
  })

  if (error) {
    return { error: { root: [error.message] } }
  }

  revalidatePath('/')
  revalidatePath('/admin/requests')
  return { success: true, message: 'Request approved successfully' }
}

export async function rejectRequest(requestId: string): Promise<ActionResult> {
  const supabase = createServerClient()

  // Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: { root: ['Authentication required'] } }
  }

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleData?.role !== 'admin') {
    return { error: { root: ['Admin access required'] } }
  }

  // Call the database function
  const { error } = await supabase.rpc('reject_endpoint_request', {
    request_id: requestId,
  })

  if (error) {
    return { error: { root: [error.message] } }
  }

  revalidatePath('/admin/requests')
  return { success: true, message: 'Request rejected' }
}

export async function deleteSubmission(requestId: string): Promise<ActionResult> {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: { root: ['Authentication required'] } }
  }

  const { error } = await supabase
    .from('endpoint_requests')
    .delete()
    .eq('id', requestId)
    .eq('submitted_by', user.id)
    .eq('request_status', 'pending')

  if (error) {
    return { error: { root: [error.message] } }
  }

  revalidatePath('/my-submissions')
  return { success: true, message: 'Submission deleted' }
}

export async function getAdminStats() {
  const supabase = createServerClient()

  // Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Authentication required')
  }

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleData?.role !== 'admin') {
    throw new Error('Admin access required')
  }

  // Get pending requests count
  const { count: pendingRequests } = await supabase
    .from('endpoint_requests')
    .select('*', { count: 'exact', head: true })
    .eq('request_status', 'pending')

  // Get total endpoints count
  const { count: totalEndpoints } = await supabase
    .from('endpoints')
    .select('*', { count: 'exact', head: true })

  // Get active endpoints count
  const { count: activeEndpoints } = await supabase
    .from('endpoints')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  // Get total users count
  const { count: totalUsers } = await supabase
    .from('user_roles')
    .select('*', { count: 'exact', head: true })

  return {
    pendingRequests: pendingRequests ?? 0,
    totalEndpoints: totalEndpoints ?? 0,
    activeEndpoints: activeEndpoints ?? 0,
    totalUsers: totalUsers ?? 0,
  }
}
