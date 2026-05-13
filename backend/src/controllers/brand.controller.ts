import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess } from '../utils/response'

export async function getBrands(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    })
    sendSuccess(res, brands)
  } catch (err) {
    next(err)
  }
}

export async function createBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, logoUrl } = req.body as { name: string; logoUrl?: string }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const brand = await prisma.brand.create({ data: { name, slug, logoUrl } })
    sendSuccess(res, brand, 201)
  } catch (err) {
    next(err)
  }
}

export async function updateBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const brand = await prisma.brand.update({ where: { id: req.params.id }, data: req.body })
    sendSuccess(res, brand)
  } catch (err) {
    next(err)
  }
}
