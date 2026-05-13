import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess } from '../utils/response'
import { Errors } from '../utils/errors'

export async function getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null, isActive: true },
      include: { children: { where: { isActive: true } } },
      orderBy: { sortOrder: 'asc' },
    })
    sendSuccess(res, categories)
  } catch (err) {
    next(err)
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, parentId, imageUrl, sortOrder } = req.body as { name: string; parentId?: string; imageUrl?: string; sortOrder?: number }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const category = await prisma.category.create({ data: { name, slug, parentId, imageUrl, sortOrder: sortOrder ?? 0 } })
    sendSuccess(res, category, 201)
  } catch (err) {
    next(err)
  }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await prisma.category.update({ where: { id: req.params.id }, data: req.body })
    sendSuccess(res, category)
  } catch (err) {
    next(err)
  }
}
