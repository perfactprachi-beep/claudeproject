import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess, parsePagination, paginate } from '../utils/response'
import { Errors } from '../utils/errors'

export async function getProductReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>)
    const [reviews, total] = await prisma.$transaction([
      prisma.review.findMany({
        where: { productId: req.params.id, status: 'approved' },
        skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, avatarUrl: true } } },
      }),
      prisma.review.count({ where: { productId: req.params.id, status: 'approved' } }),
    ])
    sendSuccess(res, reviews, 200, paginate(page, limit, total))
  } catch (err) {
    next(err)
  }
}

export async function submitReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const { rating, title, body } = req.body as { rating: number; title?: string; body: string }

    // Verify purchase
    const purchase = await prisma.orderItem.findFirst({
      where: { productId: req.params.id, order: { userId: req.userId, status: 'delivered' } },
    })

    const review = await prisma.review.create({
      data: {
        productId: req.params.id, userId: req.userId,
        rating, title, body,
        isVerified: Boolean(purchase),
      },
    })
    sendSuccess(res, review, 201)
  } catch (err) {
    next(err)
  }
}

export async function approveReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.review.update({ where: { id: req.params.id }, data: { status: 'approved' } })
    sendSuccess(res, { approved: true })
  } catch (err) {
    next(err)
  }
}

export async function deleteReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.review.delete({ where: { id: req.params.id } })
    sendSuccess(res, { deleted: true })
  } catch (err) {
    next(err)
  }
}
