import { env } from '../config/env'
import { logger } from '../utils/logger'

const MSG91_BASE = 'https://api.msg91.com/api/v5'

export async function sendOTP(mobile: string): Promise<boolean> {
  if (!env.MSG91_AUTH_KEY) {
    logger.warn('MSG91 not configured — skipping OTP send')
    return true
  }
  try {
    const res = await fetch(`${MSG91_BASE}/otp?template_id=${env.MSG91_OTP_TEMPLATE_ID}&mobile=91${mobile}&authkey=${env.MSG91_AUTH_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json() as { type: string }
    return data.type === 'success'
  } catch (err) {
    logger.error('MSG91 send OTP failed', { err, mobile })
    return false
  }
}

export async function verifyOTP(mobile: string, otp: string): Promise<boolean> {
  if (!env.MSG91_AUTH_KEY) return true
  try {
    const res = await fetch(`${MSG91_BASE}/otp/verify?mobile=91${mobile}&otp=${otp}&authkey=${env.MSG91_AUTH_KEY}`, {
      method: 'POST',
    })
    const data = await res.json() as { type: string }
    return data.type === 'success'
  } catch (err) {
    logger.error('MSG91 verify OTP failed', { err, mobile })
    return false
  }
}

export async function sendOrderSMS(mobile: string, orderNumber: string): Promise<void> {
  await sendTransactionalSMS(mobile, `Your Shoppers Stop order #${orderNumber} has been placed successfully. Track your order in the app.`)
}

export async function sendShippingSMS(mobile: string, orderNumber: string, trackingNumber: string): Promise<void> {
  await sendTransactionalSMS(mobile, `Your Shoppers Stop order #${orderNumber} has been shipped. Track with AWB: ${trackingNumber}`)
}

export async function sendDeliverySMS(mobile: string, orderNumber: string): Promise<void> {
  await sendTransactionalSMS(mobile, `Your Shoppers Stop order #${orderNumber} has been delivered. We hope you love it!`)
}

export async function sendFCPointsSMS(mobile: string, points: number, balance: number): Promise<void> {
  await sendTransactionalSMS(mobile, `You earned ${points} First Citizen points on your purchase. Total balance: ${balance} pts.`)
}

async function sendTransactionalSMS(mobile: string, message: string): Promise<void> {
  if (!env.MSG91_AUTH_KEY) {
    logger.warn('MSG91 not configured — skipping SMS', { mobile })
    return
  }
  try {
    await fetch(`${MSG91_BASE}/flow/`, {
      method: 'POST',
      headers: {
        authkey: env.MSG91_AUTH_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: env.MSG91_SENDER_ID,
        short_url: '0',
        mobiles: `91${mobile}`,
        message,
      }),
    })
  } catch (err) {
    logger.error('MSG91 transactional SMS failed', { err, mobile })
  }
}
