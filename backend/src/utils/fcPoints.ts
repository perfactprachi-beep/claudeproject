import { FCTier } from '@prisma/client'

export const POINTS_VALUE_INR = 0.25 // 1 point = ₹0.25

export const TIER_RULES: Record<FCTier, { minSpend: number; pointsRate: number }> = {
  classic:  { minSpend: 0,       pointsRate: 1 },  // 1 point per ₹100
  silver:   { minSpend: 10000,   pointsRate: 2 },  // 2 points per ₹100
  gold:     { minSpend: 30000,   pointsRate: 3 },  // 3 points per ₹100
  platinum: { minSpend: 75000,   pointsRate: 5 },  // 5 points per ₹100
}

export function computeTier(annualSpend: number): FCTier {
  if (annualSpend >= 75000) return 'platinum'
  if (annualSpend >= 30000) return 'gold'
  if (annualSpend >= 10000) return 'silver'
  return 'classic'
}

export function computePointsEarned(orderTotal: number, tier: FCTier): number {
  const rate = TIER_RULES[tier].pointsRate
  return Math.floor((orderTotal / 100) * rate)
}

export function pointsToInr(points: number): number {
  return Math.round(points * POINTS_VALUE_INR * 100) / 100
}

export function inrToPoints(amount: number): number {
  return Math.ceil(amount / POINTS_VALUE_INR)
}

export function maxRedeemablePoints(orderTotal: number): number {
  // Max 25% of order value redeemable in points
  const maxDiscount = orderTotal * 0.25
  return inrToPoints(maxDiscount)
}
