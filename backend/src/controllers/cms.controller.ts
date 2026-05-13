import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess } from '../utils/response'
import { Errors } from '../utils/errors'

export async function getActiveBanners(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, position } = req.query as { page?: string; position?: string }
    const now = new Date()

    const banners = await prisma.banner.findMany({
      where: {
        status: 'active',
        startDate: { lte: now },
        OR: [{ evergreen: true }, { endDate: { gte: now } }],
        ...(page ? { page: page as never } : {}),
        ...(position ? { position: position as never } : {}),
      },
      orderBy: { priority: 'asc' },
    })

    sendSuccess(res, banners)
  } catch (err) {
    next(err)
  }
}

export async function adminListBanners(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const banners = await prisma.banner.findMany({ orderBy: [{ status: 'asc' }, { priority: 'asc' }] })
    sendSuccess(res, banners)
  } catch (err) {
    next(err)
  }
}

export async function adminCreateBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const banner = await prisma.banner.create({ data: req.body })
    sendSuccess(res, banner, 201)
  } catch (err) {
    next(err)
  }
}

export async function adminUpdateBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const banner = await prisma.banner.update({ where: { id: req.params.id }, data: req.body })
    sendSuccess(res, banner)
  } catch (err) {
    next(err)
  }
}

export async function adminDeleteBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const banner = await prisma.banner.findUnique({ where: { id: req.params.id } })
    if (!banner) throw Errors.NOT_FOUND('Banner')
    await prisma.banner.delete({ where: { id: req.params.id } })
    sendSuccess(res, { deleted: true })
  } catch (err) {
    next(err)
  }
}
