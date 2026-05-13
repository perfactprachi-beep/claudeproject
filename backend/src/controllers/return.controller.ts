import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess, parsePagination, paginate } from '../utils/response'
import { Errors } from '../utils/errors'
import { awardPoints } from '../services/fc.service'

const RETURN_WINDOW_DAYS = 30

export async function submitReturn(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const { orderId, productName, reason, customerNote, refundAmount, refundMethod } = req.body as {
      orderId: string; productName: string; reason: string; customerNote?: string; refundAmount: number; refundMethod?: string
    }

    const order = await prisma.order.findFirst({ where: { id: orderId, userId: req.userId } })
    if (!order) throw Errors.NOT_FOUND('Order')

    const daysSinceOrder = (Date.now() - order.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceOrder > RETURN_WINDOW_DAYS) throw Errors.RETURN_WINDOW_EXPIRED()

    const returnReq = await prisma.return.create({
      data: {
        orderId, userId: req.userId, productName, reason,
        customerNote, refundAmount,
        refundMethod: (refundMethod as never) ?? 'original',
      },
    })

    sendSuccess(res, returnReq, 201)
  } catch (err) {
    next(err)
  }
}

export async function getUserReturns(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const returns = await prisma.return.findMany({
      where: { userId: req.userId }, orderBy: { requestedDate: 'desc' },
    })
    sendSuccess(res, returns)
  } catch (err) {
    next(err)
  }
}

export async function adminGetReturns(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>)
    const { status } = req.query as { status?: string }

    const where = status ? { status: status as never } : {}
    const [returns, total] = await prisma.$transaction([
      prisma.return.findMany({
        where, skip, take: limit, orderBy: { requestedDate: 'desc' },
        include: { user: { select: { name: true, email: true } }, order: true },
      }),
      prisma.return.count({ where }),
    ])
    sendSuccess(res, returns, 200, paginate(page, limit, total))
  } catch (err) {
    next(err)
  }
}

export async function updateReturnStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, rejectionNote, refundMethod } = req.body as { status: 'approved' | 'rejected'; rejectionNote?: string; refundMethod?: string }
    const returnReq = await prisma.return.findUnique({ where: { id: req.params.id }, include: { user: true } })
    if (!returnReq) throw Errors.NOT_FOUND('Return request')

    await prisma.return.update({
      where: { id: req.params.id },
      data: { status, rejectionNote, refundMethod: refundMethod as never, resolvedAt: new Date() },
    })

    if (status === 'approved' && refundMethod === 'fc_points') {
      const account = await prisma.firstCitizenAccount.findUnique({ where: { userId: returnReq.userId } })
      if (account) {
        const points = Math.floor(parseFloat(returnReq.refundAmount.toString()) / 0.25)
        await awardPoints(account.id, points, 'refund_credit', `Refund credit for return ${returnReq.id}`, returnReq.orderId)
      }
    }

    sendSuccess(res, { updated: true })
  } catch (err) {
    next(err)
  }
}
