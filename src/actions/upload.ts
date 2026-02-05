'use server'

import { createServerClient } from '@/lib/supabase/server'
import { STORAGE_BUCKET, MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } from '@/lib/constants'
import type { ActionResult } from '@/types/api'

export async function uploadEndpointIcon(formData: FormData): Promise<ActionResult<{ url: string }>> {
  const supabase = createServerClient()

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: { root: ['Authentication required'] } }
  }

  const file = formData.get('file') as File
  if (!file) {
    return { error: { root: ['No file provided'] } }
  }

  // Validate file
  if (file.size > MAX_FILE_SIZE) {
    return { error: { root: ['File size must be less than 2MB'] } }
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: { root: ['File must be PNG, JPG, SVG, or WebP'] } }
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${Date.now()}.${fileExt}`

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    return { error: { root: [uploadError.message] } }
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName)

  return { success: true, data: { url: publicUrl } }
}
