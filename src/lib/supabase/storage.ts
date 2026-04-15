import { createBrowserClient } from './client'
import { STORAGE_BUCKET, MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } from '../constants'

export async function uploadIcon(
  file: File,
  userId: string
): Promise<{ url: string | null; error: string | null }> {
  // Validate file
  if (file.size > MAX_FILE_SIZE) {
    return { url: null, error: 'File size must be less than 2MB' }
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { url: null, error: 'File must be PNG, JPG, SVG, or WebP' }
  }

  const supabase = createBrowserClient()

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    return { url: null, error: uploadError.message }
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName)

  return { url: publicUrl, error: null }
}

export async function deleteIcon(url: string): Promise<{ error: string | null }> {
  const supabase = createBrowserClient()

  // Extract file path from URL
  const urlParts = url.split(`/${STORAGE_BUCKET}/`)
  if (urlParts.length < 2) {
    return { error: 'Invalid URL format' }
  }

  const filePath = urlParts[1]

  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath])

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}
