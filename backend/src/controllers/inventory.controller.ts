import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess, parsePagination, paginate } from '../utils/response'
import { parse } from 'csv-parse/sync'
import { Errors } from '../utils/errors'

export async function getInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>)
    const { status, category, brand } = req.query as { status?: string; category?: string; brand?: string }

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (category) where.product = { category: { slug: category } }
    if (brand) where.product = { ...(where.product as object ?? {}), brand: { slug: brand } }

    const [items, total] = await prisma.$transaction([
      prisma.productVariant.findMany({
        where, skip, take: limit, orderBy: { status: 'asc' },
        include: { product: { include: { brand: true, category: true } } },
      }),
      prisma.productVariant.count({ where }),
    ])

    sendSuccess(res, items, 200, paginate(page, limit, total))
  } catch (err) {
    next(err)
  }
}

export async function updateStock(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { stock, reorderLevel } = req.body as { stock: number; reorderLevel?: number }
    const status = stock === 0 ? 'out_of_stock' : stock <= (reorderLevel ?? 10) ? 'low' : 'healthy'
    const variant = await prisma.productVariant.update({
      where: { id: req.params.skuId },
      data: { stock, ...(reorderLevel !== undefined ? { reorderLevel } : {}), status },
    })
    sendSuccess(res, variant)
  } catch (err) {
    next(err)
  }
}

export async function bulkImportStock(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) throw Errors.VALIDATION_ERROR('CSV file required')

    const records = parse(req.file.buffer.toString(), { columns: true, skip_empty_lines: true }) as {
      sku: string; stock: string; reorderLevel?: string
    }[]

    let updated = 0
    for (const row of records) {
      const stock = parseInt(row.stock, 10)
      const reorderLevel = row.reorderLevel ? parseInt(row.reorderLevel, 10) : undefined
      const status = stock === 0 ? 'out_of_stock' : stock <= (reorderLevel ?? 10) ? 'low' : 'healthy'

      const result = await prisma.productVariant.updateMany({
        where: { sku: row.sku },
        data: { stock, ...(reorderLevel !== undefined ? { reorderLevel } : {}), status },
      })
      updated += result.count
    }

    sendSuccess(res, { updated })
  } catch (err) {
    next(err)
  }
}
