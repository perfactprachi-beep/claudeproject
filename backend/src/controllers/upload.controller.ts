import { Request, Response, NextFunction } from 'express'
import { getPresignedUrl } from '../config/s3'
import { sendSuccess } from '../utils/response'
import { Errors } from '../utils/errors'
import { env } from '../config/env'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const KEY_PREFIXES: Record<string, string> = {
  product: 'products',
  banner: 'banners',
  brand: 'brands',
  avatar: 'users',
  return: 'returns',
}

export async function getPresignedUploadUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { fileName, contentType, folder = 'product', resourceId } = req.body as {
      fileName: string
      contentType: string
      folder?: string
      resourceId?: string
    }

    if (!ALLOWED_TYPES.includes(contentType)) throw Errors.VALIDATION_ERROR('Invalid file type')
    if (!fileName) throw Errors.VALIDATION_ERROR('fileName is required')

    const prefix = KEY_PREFIXES[folder] ?? 'misc'
    const ext = fileName.split('.').pop() ?? 'jpg'
    const key = resourceId
      ? `${prefix}/${resourceId}/${Date.now()}.${ext}`
      : `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`

    const uploadUrl = await getPresignedUrl(key, 300)
    const publicUrl = `${env.S3_BUCKET_URL}/${key}`

    sendSuccess(res, { uploadUrl, publicUrl, key })
  } catch (err) {
    next(err)
  }
}
