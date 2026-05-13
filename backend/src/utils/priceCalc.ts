import { Decimal } from '@prisma/client/runtime/library'

export interface CartTotals {
  subtotal: number
  discount: number
  fcDiscount: number
  deliveryCharge: number
  total: number
}

export function toNumber(val: Decimal | number | string): number {
  return typeof val === 'number' ? val : parseFloat(val.toString())
}

export function calcDeliveryCharge(subtotal: number): number {
  return subtotal >= 999 ? 0 : 79
}

export function calcCouponDiscount(
  subtotal: number,
  couponType: string,
  couponValue: number,
): number {
  switch (couponType) {
    case 'percent':
      return Math.round((subtotal * couponValue) / 100)
    case 'flat':
      return Math.min(couponValue, subtotal)
    case 'free_delivery':
      return 0 // handled in deliveryCharge
    default:
      return 0
  }
}

export function calcCartTotals(
  subtotal: number,
  couponType?: string,
  couponValue?: number,
  fcPointsApplied = 0,
  pointValueInr = 0.25,
): CartTotals {
  const discount =
    couponType && couponValue
      ? calcCouponDiscount(subtotal, couponType, couponValue)
      : 0

  const afterDiscount = subtotal - discount
  const fcDiscount = Math.round(fcPointsApplied * pointValueInr)
  const afterFc = Math.max(0, afterDiscount - fcDiscount)

  const freeDelivery = couponType === 'free_delivery'
  const deliveryCharge = freeDelivery ? 0 : calcDeliveryCharge(afterFc)
  const total = afterFc + deliveryCharge

  return { subtotal, discount, fcDiscount, deliveryCharge, total }
}
