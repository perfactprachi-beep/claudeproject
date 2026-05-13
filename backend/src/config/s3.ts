import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from './env'

export const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

export async function uploadToS3(key: string, body: Buffer, contentType: string): Promise<string> {
  await s3.send(new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  }))
  return `${env.S3_BUCKET_URL}/${key}`
}

export async function deleteFromS3(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
  }))
}

export async function getPresignedUrl(key: string, ttlSeconds = 3600): Promise<string> {
  return getSignedUrl(s3, new PutObjectCommand({ Bucket: env.S3_BUCKET_NAME, Key: key }), { expiresIn: ttlSeconds })
}
