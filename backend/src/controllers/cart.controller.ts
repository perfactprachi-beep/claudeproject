import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess } from '../utils/response'
import { Errors } from '../utils/errors'
import { validateCoupon } from '../services/coupon.service'
import { calcCartTotals, toNumber } from '../utils/priceCalc'
import { maxRedeemablePoints, pointsToInr } from '../utils/fcPoints'

async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (userId) {
    return prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: { items: { include: { product: true, variant: true } }, coupon: true },
    })
  }
  if (sessionId) {
    return prisma.cart.upsert({
      where: { sessionId },
      create: { sessionId },
      update: {},
      include: { items: { include: { product: true, variant: true } }, coupon: true },
    })
  }
  throw Errors.UNAUTHORIZED()
}

export async function getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cart = await getOrCreateCart(req.userId, req.headers['x-session-id'] as string)
    const subtotal = cart.items.reduce((s, i) => s + toNumber(i.product.sellingPrice) * i.quantity, 0)
    const totals = calcCartTotals(subtotal, cart.coupon?.type, cart.coupon ? toNumber(cart.coupon.value) : undefined, cart.fcPointsApplied)
    sendSuccess(res, { cart, totals })
  } catch (err) {
    next(err)
  }
}

export async function addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { productId, variantId, quantity = 1 } = req.body as { productId: string; variantId: string; quantity?: number }

    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } })
    if (!variant) throw Errors.PRODUCT_NOT_FOUND(variantId)
    if (variant.stock < quantity) throw Errors.OUT_OF_STOCK(variant.sku)

    const cart = await getOrCreateCart(req.userId, req.headers['x-session-id'] as string)

    await prisma.cartItem.upsert({
      where: { cartId_variantId: { cartId: cart.id, variantId } },
      create: { cartId: cart.id, productId, variantId, quantity },
      update: { quantity: { increment: quantity } },
    })

    sendSuccess(res, { added: true })
  } catch (err) {
    next(err)
  }
}

export async function updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { quantity } = req.body as { quantity: number }
    if (quantity < 1) {
      await prisma.cartItem.delete({ where: { id: req.params.itemId } })
    } else {
      const item = await prisma.cartItem.findUnique({ where: { id: req.params.itemId }, include: { variant: true } })
      if (!item) throw Errors.NOT_FOUND('Cart item')
      if (item.variant.stock < quantity) throw Errors.OUT_OF_STOCK(item.variant.sku)
      await prisma.cartItem.update({ where: { id: req.params.itemId }, data: { quantity } })
    }
    sendSuccess(res, { updated: true })
  } catch (err) {
    next(err)
  }
}

export async function removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.cartItem.delete({ where: { id: req.params.itemId } })
    sendSuccess(res, { removed: true })
  } catch (err) {
    next(err)
  }
}

export async function applyCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { code } = req.body as { code: string }
    if (!req.userId) throw Errors.UNAUTHORIZED()

    const cart = await getOrCreateCart(req.userId)
    const subtotal = cart.items.reduce((s, i) => s + toNumber(i.product.sellingPrice) * i.quantity, 0)

    const fcAccount = await prisma.firstCitizenAccount.findUnique({ where: { userId: req.userId } })
    const { couponId, discount } = await validateCoupon(code, subtotal, req.userId, Boolean(fcAccount))

    await prisma.cart.update({ where: { id: cart.id }, data: { couponId } })
    sendSuccess(res, { applied: true, discount })
  } catch (err) {
    next(err)
  }
}

export async function removeCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cart = await getOrCreateCart(req.userId)
    await prisma.cart.update({ where: { id: cart.id }, data: { couponId: null } })
    sendSuccess(res, { removed: true })
  } catch (err) {
    next(err)
  }
}

export async function toggleFcPoints(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const { apply } = req.body as { apply: boolean }

    const [cart, fcAccount] = await Promise.all([
      getOrCreateCart(req.userId),
      prisma.firstCitizenAccount.findUnique({ where: { userId: req.userId } }),
    ])

    if (!fcAccount) throw Errors.INSUFFICIENT_FC_POINTS()
    const subtotal = cart.items.reduce((s, i) => s + toNumber(i.product.sellingPrice) * i.quantity, 0)
    const max = maxRedeemablePoints(subtotal)
    const pointsToApply = apply ? Math.min(fcAccount.pointsBalance, max) : 0

    await prisma.cart.update({ where: { id: cart.id }, data: { fcPointsApplied: pointsToApply } })
    sendSuccess(res, { applied: apply, pointsApplied: pointsToApply, discount: pointsToInr(pointsToApply) })
  } catch (err) {
    next(err)
  }
}
