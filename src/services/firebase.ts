import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  RecaptchaVerifier,
  type Auth,
  type ConfirmationResult,
} from 'firebase/auth'

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY

let app: FirebaseApp | null = null
let auth: Auth | null = null

if (apiKey) {
  const firebaseConfig = {
    apiKey,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  }
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  auth = getAuth(app)
}

export { auth }

const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')
googleProvider.addScope('profile')

export function setupRecaptcha(containerId: string): RecaptchaVerifier | null {
  if (!auth) return null
  return new RecaptchaVerifier(auth, containerId, { size: 'invisible' })
}

export async function sendPhoneOTP(mobile: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult | null> {
  if (!auth) return null
  return signInWithPhoneNumber(auth, `+91${mobile}`, recaptchaVerifier)
}

export async function confirmPhoneOTP(confirmationResult: ConfirmationResult, otp: string): Promise<string> {
  const result = await confirmationResult.confirm(otp)
  return result.user.getIdToken()
}

export async function signInWithGoogle(): Promise<string | null> {
  if (!auth) return null
  const result = await signInWithPopup(auth, googleProvider)
  return result.user.getIdToken()
}

export async function signInAdmin(email: string, password: string): Promise<string | null> {
  if (!auth) return null
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user.getIdToken()
}

export async function getIdToken(): Promise<string | null> {
  if (!auth?.currentUser) return null
  return auth.currentUser.getIdToken()
}

export async function signOut(): Promise<void> {
  await auth?.signOut()
}
