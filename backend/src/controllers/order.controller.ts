import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess, parsePagination, paginate } from '../utils/response'
import { Errors } from '../utils/errors'
import { calcCartTotals, toNumber } from '../utils/priceCalc'
import { redeemPoints, updateTierAfterOrder, getOrCreateFCAccount } from '../services/fc.service'
import { recordCouponUsage } from '../services/coupon.service'
import { createRazorpayOrder } from '../services/payment.service'
import { sendOrderConfirmation } from '../services/email.service'

export async function placeOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const { addressId, paymentMethod } = req.body as { addressId: string; paymentMethod: string }

    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: { items: { include: { product: true, variant: true } }, coupon: true },
    })
    if (!cart || !cart.items.length) throw Errors.VALIDATION_ERROR('Cart is empty')

    // Validate stock
    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) throw Errors.OUT_OF_STOCK(item.variant.sku)
    }

    const subtotal = cart.items.reduce((s, i) => s + toNumber(i.product.sellingPrice) * i.quantity, 0)
    const totals = calcCartTotals(subtotal, cart.coupon?.type, cart.coupon ? toNumber(cart.coupon.value) : undefined, cart.fcPointsApplied)

    const fcAccount = await getOrCreateFCAccount(req.userId)

    // Redeem FC points if applied
    if (cart.fcPointsApplied > 0) {
      await redeemPoints(fcAccount.id, cart.fcPointsApplied, 'FC points redeemed on order')
    }

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(totals.total, 'INR', `order-${Date.now()}`)

    // Create DB order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const o = await tx.order.create({
        data: {
          userId: req.userId!,
          addressId,
          subtotal: totals.subtotal,
          discount: totals.discount,
          fcPointsRedeemed: cart.fcPointsApplied,
          fcDiscount: totals.fcDiscount,
          deliveryCharge: totals.deliveryCharge,
          total: totals.total,
          paymentMethod: paymentMethod as never,
          couponId: cart.couponId,
          razorpayOrderId: razorpayOrder.orderId,
          items: {
            create: cart.items.map((i) => ({
              productId: i.productId,
              variantId: i.variantId,
              productName: i.product.name,
              size: i.variant.size,
              colour: i.variant.colour,
              quantity: i.quantity,
              unitPrice: i.product.sellingPrice,
              imageUrl: i.product.thumbnailUrl,
            })),
          },
        },
      })

      // Deduct stock
      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
      await tx.cart.update({ where: { id: cart.id }, data: { couponId: null, fcPointsApplied: 0 } })

      return o
    })

    // Record coupon usage
    if (cart.couponId) await recordCouponUsage(cart.couponId, req.userId, order.id)

    // Award FC points
    await updateTierAfterOrder(fcAccount.id, totals.total, fcAccount.tier)

    // Send confirmation email (non-blocking)
    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { email: true } })
    if (user) sendOrderConfirmation(user.email, order.id, totals.total).catch(() => {})

    sendSuccess(res, { order, razorpayOrder }, 201)
  } catch (err) {
    next(err)
  }
}

export async function getUserOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>)

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' },
        skip, take: limit,
        include: { items: true, address: true },
      }),
      prisma.order.count({ where: { userId: req.userId } }),
    ])

    sendSuccess(res, orders, 200, paginate(page, limit, total))
  } catch (err) {
    next(err)
  }
}

export async function getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const order = await prisma.order.findFirst({
      where: { id: req.params.orderId, userId: req.userId },
      include: { items: { include: { product: true } }, address: true, coupon: true },
    })
    if (!order) throw Errors.NOT_FOUND('Order')
    sendSuccess(res, order)
  } catch (err) {
    next(err)
  }
}

export async function cancelOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const order = await prisma.order.findFirst({ where: { id: req.params.orderId, userId: req.userId } })
    if (!order) throw Errors.NOT_FOUND('Order')
    if (!['pending', 'confirmed'].includes(order.status)) throw Errors.ORDER_NOT_CANCELLABLE()

    await prisma.order.update({ where: { id: order.id }, data: { status: 'cancelled' } })

    // Restore stock
    const items = await prisma.orderItem.findMany({ where: { orderId: order.id } })
    for (const item of items) {
      await prisma.productVariant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } })
    }

    sendSuccess(res, { cancelled: true })
  } catch (err) {
    next(err)
  }
}

export async function adminGetOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>)
    const { status, search } = req.query as { status?: string; search?: string }

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (search) where.OR = [{ id: { contains: search } }, { user: { name: { contains: search, mode: 'insensitive' } } }]

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true, mobile: true } }, address: true, items: true },
      }),
      prisma.order.count({ where }),
    ])

    sendSuccess(res, orders, 200, paginate(page, limit, total))
  } catch (err) {
    next(err)
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, trackingNumber, courier } = req.body as { status: string; trackingNumber?: string; courier?: string }
    const order = await prisma.order.findUnique({ where: { id: req.params.orderId } })
    if (!order) throw Errors.NOT_FOUND('Order')

    await prisma.order.update({
      where: { id: req.params.orderId },
      data: { status: status as never, ...(trackingNumber ? { trackingNumber } : {}), ...(courier ? { courier } : {}) },
    })

    sendSuccess(res, { updated: true })
  } catch (err) {
    next(err)
  }
}

export async function addOrderNote(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { note } = req.body as { note: string }
    await prisma.order.update({ where: { id: req.params.orderId }, data: { internalNote: note } })
    sendSuccess(res, { updated: true })
  } catch (err) {
    next(err)
  }
}
