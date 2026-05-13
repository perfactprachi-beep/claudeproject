import { env } from './env'

let _razorpay: InstanceType<typeof import('razorpay')> | null = null

export function getRazorpay() {
  if (_razorpay) return _razorpay
  if (!env.RAZORPAY_KEY_ID || env.RAZORPAY_KEY_ID === 'rzp_test_placeholder') return null
  const Razorpay = require('razorpay')
  _razorpay = new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET })
  return _razorpay
}
