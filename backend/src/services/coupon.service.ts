import { prisma } from '../config/database'
import { Errors } from '../utils/errors'
import { calcCouponDiscount } from '../utils/priceCalc'

export async function validateCoupon(
  code: string,
  subtotal: number,
  userId: string,
  isFirstCitizen = false,
): Promise<{ couponId: string; discount: number; type: string; value: number }> {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })

  if (!coupon || coupon.status === 'inactive') throw Errors.COUPON_INVALID()

  const now = new Date()
  if (coupon.expiry < now || coupon.startDate > now) throw Errors.COUPON_EXPIRED()

  if (coupon.usageCount >= coupon.usageLimit) throw Errors.COUPON_INVALID()

  if (subtotal < parseFloat(coupon.minOrderValue.toString())) {
    throw Errors.COUPON_MIN_ORDER_NOT_MET(parseFloat(coupon.minOrderValue.toString()))
  }

  if (coupon.applicableTo === 'first_citizens' && !isFirstCitizen) throw Errors.COUPON_INVALID()

  const userUsages = await prisma.couponUsage.count({ where: { couponId: coupon.id, userId } })
  if (userUsages >= coupon.userLimit) throw Errors.COUPON_INVALID()

  const discount = calcCouponDiscount(subtotal, coupon.type, parseFloat(coupon.value.toString()))

  return { couponId: coupon.id, discount, type: coupon.type, value: parseFloat(coupon.value.toString()) }
}

export async function recordCouponUsage(couponId: string, userId: string, orderId: string): Promise<void> {
  await prisma.$transaction([
    prisma.couponUsage.create({ data: { couponId, userId, orderId } }),
    prisma.coupon.update({ where: { id: couponId }, data: { usageCount: { increment: 1 } } }),
  ])
}
