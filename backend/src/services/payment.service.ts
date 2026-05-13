import crypto from 'crypto'
import { getRazorpay } from '../config/razorpay'
import { prisma } from '../config/database'
import { env } from '../config/env'
import { Errors } from '../utils/errors'
import { logger } from '../utils/logger'

export async function createRazorpayOrder(amount: number, currency = 'INR', receipt: string): Promise<{
  orderId: string
  amount: number
  currency: string
  keyId: string
}> {
  const razorpay = getRazorpay()

  if (!razorpay) {
    // Dev mode: return a mock order
    const mockOrderId = `order_dev_${Date.now()}`
    await prisma.payment.create({
      data: { razorpayOrderId: mockOrderId, amount: Math.round(amount * 100), currency, status: 'pending' },
    })
    return { orderId: mockOrderId, amount: Math.round(amount * 100), currency, keyId: env.RAZORPAY_KEY_ID }
  }

  const order = await razorpay.orders.create({ amount: Math.round(amount * 100), currency, receipt })
  await prisma.payment.create({
    data: { razorpayOrderId: order.id, amount: order.amount as number, currency: order.currency, status: 'pending' },
  })
  return { orderId: order.id, amount: order.amount as number, currency: order.currency, keyId: env.RAZORPAY_KEY_ID }
}

export function verifyPaymentSignature(razorpayOrderId: string, razorpayPaymentId: string, signature: string): boolean {
  if (env.isDev && razorpayOrderId.startsWith('order_dev_')) return true
  const body = `${razorpayOrderId}|${razorpayPaymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')
  return expectedSignature === signature
}

export async function confirmPayment(razorpayOrderId: string, razorpayPaymentId: string, signature: string): Promise<void> {
  if (!verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, signature)) {
    throw Errors.PAYMENT_VERIFICATION_FAILED()
  }
  await prisma.payment.update({
    where: { razorpayOrderId },
    data: { razorpayPaymentId, status: 'paid' },
  })
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const expected = crypto
    .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex')
  return expected === signature
}

export async function initiateRefund(razorpayPaymentId: string, amount: number): Promise<string> {
  const razorpay = getRazorpay()
  if (!razorpay) {
    logger.warn('Razorpay not configured — simulating refund in dev mode')
    const mockRefundId = `rfnd_dev_${Date.now()}`
    await prisma.payment.update({
      where: { razorpayPaymentId },
      data: { refundId: mockRefundId, refundAmount: Math.round(amount * 100), status: 'refunded' },
    })
    return mockRefundId
  }
  try {
    const refund = await razorpay.payments.refund(razorpayPaymentId, { amount: Math.round(amount * 100) })
    await prisma.payment.update({
      where: { razorpayPaymentId },
      data: { refundId: refund.id, refundAmount: refund.amount as number, status: 'refunded' },
    })
    return refund.id
  } catch (err) {
    logger.error('Razorpay refund failed', { err, razorpayPaymentId })
    throw Errors.PAYMENT_FAILED()
  }
}
