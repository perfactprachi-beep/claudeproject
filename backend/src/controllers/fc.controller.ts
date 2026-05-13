import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess, parsePagination, paginate } from '../utils/response'
import { Errors } from '../utils/errors'
import { getOrCreateFCAccount, adjustPoints } from '../services/fc.service'

export async function getAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const account = await getOrCreateFCAccount(req.userId)
    sendSuccess(res, account)
  } catch (err) {
    next(err)
  }
}

export async function getTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>)

    const account = await prisma.firstCitizenAccount.findUnique({ where: { userId: req.userId } })
    if (!account) throw Errors.NOT_FOUND('FC Account')

    const [transactions, total] = await prisma.$transaction([
      prisma.pointTransaction.findMany({
        where: { accountId: account.id }, skip, take: limit, orderBy: { createdAt: 'desc' },
      }),
      prisma.pointTransaction.count({ where: { accountId: account.id } }),
    ])

    sendSuccess(res, transactions, 200, paginate(page, limit, total))
  } catch (err) {
    next(err)
  }
}

export async function adminAdjustPoints(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, points, type, description } = req.body as {
      userId: string; points: number; type: 'adjusted_credit' | 'adjusted_debit'; description: string
    }
    const account = await prisma.firstCitizenAccount.findUnique({ where: { userId } })
    if (!account) throw Errors.NOT_FOUND('FC Account')
    await adjustPoints(account.id, points, type, description)
    sendSuccess(res, { adjusted: true })
  } catch (err) {
    next(err)
  }
}

export async function adminBulkAward(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userIds, points, description } = req.body as { userIds: string[]; points: number; description: string }
    let awarded = 0
    for (const userId of userIds) {
      const account = await prisma.firstCitizenAccount.findUnique({ where: { userId } })
      if (!account) continue
      await adjustPoints(account.id, points, 'adjusted_credit', description)
      awarded++
    }
    sendSuccess(res, { awarded })
  } catch (err) {
    next(err)
  }
}

export async function updateTierRules(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { rules } = req.body as { rules: { tier: string; minSpend: number; pointsRate: number }[] }
    for (const rule of rules) {
      await prisma.fCTierRule.upsert({
        where: { tier: rule.tier as never },
        create: { tier: rule.tier as never, minSpend: rule.minSpend, pointsRate: rule.pointsRate },
        update: { minSpend: rule.minSpend, pointsRate: rule.pointsRate },
      })
    }
    sendSuccess(res, { updated: true })
  } catch (err) {
    next(err)
  }
}
