import { env } from './env'
import { logger } from '../utils/logger'

let _auth: import('firebase-admin').auth.Auth | null = null

export function getFirebaseAuth(): import('firebase-admin').auth.Auth | null {
  return _auth
}

export async function initFirebase(): Promise<void> {
  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    logger.warn('Firebase credentials not set — auth middleware will use DEV BYPASS mode')
    return
  }
  try {
    const admin = await import('firebase-admin')
    if (!admin.default.apps.length) {
      admin.default.initializeApp({
        credential: admin.default.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: env.FIREBASE_PRIVATE_KEY,
        }),
      })
    }
    _auth = admin.default.auth()
    logger.info('Firebase Admin SDK initialized')
  } catch (err) {
    logger.warn('Firebase init failed — auth middleware will use DEV BYPASS mode', { err })
  }
}
