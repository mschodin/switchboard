'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { endpointSchema } from '@/lib/validators'
import type { ActionResult } from '@/types/api'
import type { Endpoint } from '@/types/database'

export async function getEndpoints(options?: {
  tags?: string[]
  search?: string
  status?: 'active' | 'inactive' | 'deprecated'
}) {
  const supabase = createServerClient()

  let query = supabase
    .from('endpoints')
    .select(
      `
      *,
      endpoint_tags(
        tag:tags(*)
      )
    `
    )
    .eq('status', options?.status ?? 'active')
    .order('created_at', { ascending: false })

  // Apply search filter
  if (options?.search) {
    query = query.or(
      `title.ilike.%${options.search}%,` +
        `company.ilike.%${options.search}%,` +
        `description.ilike.%${options.search}%`
    )
  }

  const { data, error } = await query

  if (error) throw error

  // Client-side tag filtering (for OR logic across multiple tags)
  let endpoints = data ?? []

  if (options?.tags && options.tags.length > 0) {
    endpoints = endpoints.filter((endpoint) => {
      const endpointTagSlugs =
        endpoint.endpoint_tags
          ?.map((et: any) => et.tag?.slug)
          .filter(Boolean) ?? []
      return options.tags!.some((tag) => endpointTagSlugs.includes(tag))
    })
  }

  return endpoints
}

export async function getEndpointById(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('endpoints')
    .select(
      `
      *,
      endpoint_tags(
        tag:tags(*)
      )
    `
    )
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createEndpoint(formData: FormData): Promise<ActionResult<Endpoint>> {
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

  // Validate input
  const validated = endpointSchema.safeParse({
    company: formData.get('company'),
    title: formData.get('title'),
    description: formData.get('description'),
    protocol: formData.get('protocol'),
    address: formData.get('address'),
    ports: formData.get('ports'),
    tagIds: formData.getAll('tagIds'),
    iconUrl: formData.get('iconUrl') || null,
  })

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  // Create endpoint
  const { data: endpoint, error: insertError } = await supabase
    .from('endpoints')
    .insert({
      company: validated.data.company,
      title: validated.data.title,
      description: validated.data.description,
      protocol: validated.data.protocol,
      address: validated.data.address,
      ports: validated.data.ports,
      icon_url: validated.data.iconUrl,
      created_by: user.id,
    })
    .select()
    .single()

  if (insertError) {
    return { error: { root: [insertError.message] } }
  }

  // Add tags
  if (validated.data.tagIds.length > 0) {
    await supabase.from('endpoint_tags').insert(
      validated.data.tagIds.map((tagId) => ({
        endpoint_id: endpoint.id,
        tag_id: tagId,
      }))
    )
  }

  revalidatePath('/')
  return { success: true, data: endpoint }
}

export async function updateEndpoint(
  id: string,
  formData: FormData
): Promise<ActionResult<Endpoint>> {
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

  // Validate input
  const validated = endpointSchema.safeParse({
    company: formData.get('company'),
    title: formData.get('title'),
    description: formData.get('description'),
    protocol: formData.get('protocol'),
    address: formData.get('address'),
    ports: formData.get('ports'),
    tagIds: formData.getAll('tagIds'),
    iconUrl: formData.get('iconUrl') || null,
  })

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  // Update endpoint
  const { data: endpoint, error: updateError } = await supabase
    .from('endpoints')
    .update({
      company: validated.data.company,
      title: validated.data.title,
      description: validated.data.description,
      protocol: validated.data.protocol,
      address: validated.data.address,
      ports: validated.data.ports,
      icon_url: validated.data.iconUrl,
    })
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    return { error: { root: [updateError.message] } }
  }

  // Update tags - delete and recreate
  await supabase.from('endpoint_tags').delete().eq('endpoint_id', id)

  if (validated.data.tagIds.length > 0) {
    await supabase.from('endpoint_tags').insert(
      validated.data.tagIds.map((tagId) => ({
        endpoint_id: id,
        tag_id: tagId,
      }))
    )
  }

  revalidatePath('/')
  return { success: true, data: endpoint }
}

export async function deleteEndpoint(id: string): Promise<ActionResult> {
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

  const { error } = await supabase.from('endpoints').delete().eq('id', id)

  if (error) {
    return { error: { root: [error.message] } }
  }

  revalidatePath('/')
  return { success: true }
}
