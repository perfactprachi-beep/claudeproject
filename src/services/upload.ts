import { api } from './api'

interface PresignedUrlResponse {
  uploadUrl: string
  publicUrl: string
  key: string
}

type UploadFolder = 'product' | 'banner' | 'brand' | 'avatar' | 'return'

export async function uploadImage(
  file: File,
  folder: UploadFolder = 'product',
  resourceId?: string,
): Promise<string> {
  const { uploadUrl, publicUrl } = await api.post<PresignedUrlResponse>(
    '/admin/upload/presigned-url',
    { fileName: file.name, contentType: file.type, folder, resourceId },
  )

  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })

  return publicUrl
}
