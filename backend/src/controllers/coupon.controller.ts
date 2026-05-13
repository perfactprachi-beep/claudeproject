import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess } from '../utils/response'
import { validateCoupon } from '../services/coupon.service'
import { Errors } from '../utils/errors'

export async function validate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { code, subtotal } = req.body as { code: string; subtotal: number }
    const userId = req.userId ?? 'guest'
    const result = await validateCoupon(code, subtotal, userId)
    sendSuccess(res, result)
  } catch (err) {
    next(err)
  }
}

export async function adminListCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
    sendSuccess(res, coupons)
  } catch (err) {
    next(err)
  }
}

export async function adminCreateCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = req.body
    const coupon = await prisma.coupon.create({
      data: { ...data, code: String(data.code).toUpperCase() },
    })
    sendSuccess(res, coupon, 201)
  } catch (err) {
    next(err)
  }
}

export async function adminUpdateCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const coupon = await prisma.coupon.update({ where: { id: req.params.id }, data: req.body })
    sendSuccess(res, coupon)
  } catch (err) {
    next(err)
  }
}

export async function adminToggleCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const coupon = await prisma.coupon.findUnique({ where: { id: req.params.id } })
    if (!coupon) throw Errors.NOT_FOUND('Coupon')
    const updated = await prisma.coupon.update({
      where: { id: req.params.id },
      data: { status: coupon.status === 'active' ? 'inactive' : 'active' },
    })
    sendSuccess(res, updated)
  } catch (err) {
    next(err)
  }
}
