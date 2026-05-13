import { prisma } from '../config/database'
import { PointTransactionType, FCTier } from '@prisma/client'
import { computeTier, computePointsEarned } from '../utils/fcPoints'
import { Errors } from '../utils/errors'

export async function getOrCreateFCAccount(userId: string): Promise<{ id: string; tier: FCTier; pointsBalance: number }> {
  let account = await prisma.firstCitizenAccount.findUnique({ where: { userId } })
  if (!account) {
    const cardNumber = `FC${Date.now().toString().slice(-9)}`
    account = await prisma.firstCitizenAccount.create({
      data: { userId, cardNumber, tier: 'classic', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
    })
  }
  return account
}

export async function awardPoints(
  accountId: string,
  points: number,
  type: PointTransactionType,
  description: string,
  orderId?: string,
): Promise<void> {
  await prisma.$transaction([
    prisma.firstCitizenAccount.update({
      where: { id: accountId },
      data: { pointsBalance: { increment: points }, pointsIssuedMTD: { increment: points } },
    }),
    prisma.pointTransaction.create({
      data: { accountId, type, points, description, orderId },
    }),
  ])
}

export async function redeemPoints(
  accountId: string,
  points: number,
  description: string,
  orderId?: string,
): Promise<void> {
  const account = await prisma.firstCitizenAccount.findUnique({ where: { id: accountId } })
  if (!account || account.pointsBalance < points) throw Errors.INSUFFICIENT_FC_POINTS()

  await prisma.$transaction([
    prisma.firstCitizenAccount.update({
      where: { id: accountId },
      data: { pointsBalance: { decrement: points }, pointsRedeemedMTD: { increment: points } },
    }),
    prisma.pointTransaction.create({
      data: { accountId, type: 'redeemed', points: -points, description, orderId },
    }),
  ])
}

export async function adjustPoints(
  accountId: string,
  points: number,
  type: 'adjusted_credit' | 'adjusted_debit',
  description: string,
): Promise<void> {
  if (type === 'adjusted_debit') {
    const account = await prisma.firstCitizenAccount.findUnique({ where: { id: accountId } })
    if (!account || account.pointsBalance < points) throw Errors.INSUFFICIENT_FC_POINTS()
  }
  const delta = type === 'adjusted_credit' ? points : -points
  await prisma.$transaction([
    prisma.firstCitizenAccount.update({
      where: { id: accountId },
      data: { pointsBalance: { increment: delta } },
    }),
    prisma.pointTransaction.create({
      data: { accountId, type, points: delta, description },
    }),
  ])
}

export async function updateTierAfterOrder(accountId: string, orderTotal: number, tier: FCTier): Promise<void> {
  const account = await prisma.firstCitizenAccount.findUnique({ where: { id: accountId } })
  if (!account) return

  const newSpend = parseFloat(account.annualSpend.toString()) + orderTotal
  const newTier = computeTier(newSpend)
  const pointsEarned = computePointsEarned(orderTotal, tier)

  await prisma.firstCitizenAccount.update({
    where: { id: accountId },
    data: { annualSpend: newSpend, tier: newTier },
  })

  await awardPoints(accountId, pointsEarned, 'earned_purchase', `Points earned on order`, undefined)
}

export async function expirePoints(accountId: string): Promise<number> {
  const now = new Date()
  const expiredTxns = await prisma.pointTransaction.findMany({
    where: { accountId, expiresAt: { lte: now }, type: { not: 'expired' } },
  })
  const totalExpired = expiredTxns.reduce((s, t) => s + Math.max(0, t.points), 0)
  if (!totalExpired) return 0

  await prisma.$transaction([
    prisma.firstCitizenAccount.update({
      where: { id: accountId },
      data: { pointsBalance: { decrement: totalExpired } },
    }),
    prisma.pointTransaction.create({
      data: { accountId, type: 'expired', points: -totalExpired, description: 'Points expired' },
    }),
  ])
  return totalExpired
}
