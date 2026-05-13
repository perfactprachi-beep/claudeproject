import { uploadToS3, deleteFromS3 } from '../config/s3'
import { nanoid } from 'crypto'

export async function uploadProductImage(buffer: Buffer, mimeType: string): Promise<string> {
  const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg'
  const key = `products/${Date.now()}-${nanoid(8)}.${ext}`
  return uploadToS3(key, buffer, mimeType)
}

export async function uploadBannerImage(buffer: Buffer, mimeType: string): Promise<string> {
  const ext = mimeType === 'image/png' ? 'png' : 'jpg'
  const key = `banners/${Date.now()}-${nanoid(8)}.${ext}`
  return uploadToS3(key, buffer, mimeType)
}

export async function uploadReturnPhoto(buffer: Buffer, mimeType: string): Promise<string> {
  const key = `returns/${Date.now()}-${nanoid(8)}.jpg`
  return uploadToS3(key, buffer, mimeType)
}

export async function deleteAsset(url: string): Promise<void> {
  const base = process.env.S3_BUCKET_URL ?? ''
  if (url.startsWith(base)) {
    const key = url.slice(base.length + 1)
    await deleteFromS3(key)
  }
}

function nanoid(n: number): string {
  return require('crypto').randomBytes(n).toString('hex').slice(0, n)
}
