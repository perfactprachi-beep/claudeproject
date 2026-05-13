import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { confirmPayment, verifyWebhookSignature, initiateRefund, createRazorpayOrder } from '../services/payment.service'
import { sendSuccess } from '../utils/response'
import { Errors } from '../utils/errors'
import { logger } from '../utils/logger'

export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { amount, receipt } = req.body as { amount: number; receipt: string }
    const order = await createRazorpayOrder(amount, 'INR', receipt)
    sendSuccess(res, order)
  } catch (err) {
    next(err)
  }
}

export async function verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body as {
      razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string; orderId: string
    }

    await confirmPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature)
    await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'paid', razorpayPaymentId, status: 'confirmed' } })
    sendSuccess(res, { verified: true })
  } catch (err) {
    next(err)
  }
}

export async function webhook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const signature = req.headers['x-razorpay-signature'] as string
    const body = JSON.stringify(req.body)

    if (!verifyWebhookSignature(body, signature)) {
      res.status(400).json({ error: 'Invalid signature' })
      return
    }

    const { event, payload } = req.body as { event: string; payload: { payment?: { entity?: { order_id?: string; id?: string } } } }
    const entity = payload?.payment?.entity

    if (event === 'payment.captured' && entity?.order_id) {
      await prisma.order.updateMany({
        where: { razorpayOrderId: entity.order_id },
        data: { paymentStatus: 'paid', status: 'confirmed', razorpayPaymentId: entity.id },
      })
    } else if (event === 'refund.processed' && entity?.id) {
      logger.info('Refund processed', { paymentId: entity.id })
    }

    res.json({ received: true })
  } catch (err) {
    next(err)
  }
}

export async function adminRefund(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderId, amount } = req.body as { orderId: string; amount: number }
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order?.razorpayPaymentId) throw Errors.NOT_FOUND('Payment')

    const refundId = await initiateRefund(order.razorpayPaymentId, amount)
    await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'refunded' } })
    sendSuccess(res, { refundId })
  } catch (err) {
    next(err)
  }
}
