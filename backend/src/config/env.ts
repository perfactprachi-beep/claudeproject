import dotenv from 'dotenv'
dotenv.config()

function required(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing required env var: ${key}`)
  return val
}

function optional(key: string, fallback = ''): string {
  return process.env[key] ?? fallback
}

export const env = {
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '4000'), 10),
  FRONTEND_URL: optional('FRONTEND_URL', 'http://localhost:5173'),

  DATABASE_URL: required('DATABASE_URL'),
  REDIS_URL: optional('REDIS_URL', 'redis://localhost:6379'),

  FIREBASE_PROJECT_ID: required('FIREBASE_PROJECT_ID'),
  FIREBASE_CLIENT_EMAIL: required('FIREBASE_CLIENT_EMAIL'),
  FIREBASE_PRIVATE_KEY: required('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),

  AWS_ACCESS_KEY_ID: optional('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: optional('AWS_SECRET_ACCESS_KEY'),
  AWS_REGION: optional('AWS_REGION', 'ap-south-1'),
  S3_BUCKET_NAME: optional('S3_BUCKET_NAME'),
  S3_BUCKET_URL: optional('S3_BUCKET_URL'),

  SENDGRID_API_KEY: optional('SENDGRID_API_KEY'),
  SENDGRID_FROM_EMAIL: optional('SENDGRID_FROM_EMAIL', 'noreply@shoppersstop.com'),
  SENDGRID_FROM_NAME: optional('SENDGRID_FROM_NAME', 'Shoppers Stop'),

  MSG91_AUTH_KEY: optional('MSG91_AUTH_KEY'),
  MSG91_SENDER_ID: optional('MSG91_SENDER_ID', 'SHPSTO'),
  MSG91_OTP_TEMPLATE_ID: optional('MSG91_OTP_TEMPLATE_ID'),

  ALGOLIA_APP_ID: optional('ALGOLIA_APP_ID'),
  ALGOLIA_ADMIN_KEY: optional('ALGOLIA_ADMIN_KEY'),
  ALGOLIA_SEARCH_KEY: optional('ALGOLIA_SEARCH_KEY'),
  ALGOLIA_INDEX_NAME: optional('ALGOLIA_INDEX_NAME', 'shoppers_stop_products'),

  RAZORPAY_KEY_ID: optional('RAZORPAY_KEY_ID'),
  RAZORPAY_KEY_SECRET: optional('RAZORPAY_KEY_SECRET'),
  RAZORPAY_WEBHOOK_SECRET: optional('RAZORPAY_WEBHOOK_SECRET'),

  SHIPROCKET_EMAIL: optional('SHIPROCKET_EMAIL'),
  SHIPROCKET_PASSWORD: optional('SHIPROCKET_PASSWORD'),
  SHIPROCKET_BASE_URL: optional('SHIPROCKET_BASE_URL', 'https://apiv2.shiprocket.in/v1/external'),

  JWT_SECRET: optional('JWT_SECRET', 'change-me-in-production'),

  RATE_LIMIT_WINDOW_MS: parseInt(optional('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(optional('RATE_LIMIT_MAX_REQUESTS', '100'), 10),

  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV !== 'production',
}
