import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess, parsePagination, paginate } from '../utils/response'
import { Errors } from '../utils/errors'
import { indexProduct, deleteProductIndex } from '../services/search.service'
import { uploadProductImage } from '../services/storage.service'
import { parse } from 'csv-parse/sync'
import { deleteCache, deleteCachePattern, getCache, setCache } from '../config/redis'

export async function listProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>)
    const { category, brand, minPrice, maxPrice, size, colour, sort, q } = req.query as Record<string, string>

    const where: Record<string, unknown> = { status: { not: 'deleted' } }
    if (category) where.category = { slug: category }
    if (brand) where.brand = { slug: brand }
    if (minPrice || maxPrice) where.sellingPrice = {
      ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
      ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
    }
    if (q) where.name = { contains: q, mode: 'insensitive' }

    const orderBy: Record<string, unknown> =
      sort === 'price_asc' ? { sellingPrice: 'asc' }
      : sort === 'price_desc' ? { sellingPrice: 'desc' }
      : sort === 'newest' ? { createdAt: 'desc' }
      : { isFeatured: 'desc' }

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({ where, orderBy, skip, take: limit, include: { brand: true, category: true } }),
      prisma.product.count({ where }),
    ])

    sendSuccess(res, products, 200, paginate(page, limit, total))
  } catch (err) {
    next(err)
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cacheKey = `product:${req.params.id}`
    const cached = await getCache(cacheKey)
    if (cached) { sendSuccess(res, cached); return }

    const product = await prisma.product.findFirst({
      where: { id: req.params.id, status: { not: 'deleted' } },
      include: {
        brand: true,
        category: true,
        variants: true,
        reviews: { where: { status: 'approved' }, take: 10, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true } } } },
      },
    })
    if (!product) throw Errors.PRODUCT_NOT_FOUND(req.params.id)

    await setCache(cacheKey, product, 600)
    sendSuccess(res, product)
  } catch (err) {
    next(err)
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, brandId, categoryId, mrp, sellingPrice, description, tags, variants } = req.body as {
      name: string; brandId: string; categoryId: string; mrp: number; sellingPrice: number
      description?: string; tags?: string[]; variants?: { sku: string; size: string; colour: string; stock: number }[]
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()

    const product = await prisma.product.create({
      data: {
        name, brandId, categoryId, mrp, sellingPrice, description, tags: tags ?? [], slug,
        variants: variants?.length
          ? { create: variants.map(v => ({ ...v, status: v.stock > 10 ? 'healthy' : v.stock > 0 ? 'low' : 'out_of_stock' as never })) }
          : undefined,
      },
      include: { brand: true, category: true, variants: true },
    })

    await indexProduct({
      objectID: product.id, name: product.name, brand: product.brand.name,
      category: product.category.name, mrp: parseFloat(product.mrp.toString()),
      sellingPrice: parseFloat(product.sellingPrice.toString()),
      thumbnailUrl: product.thumbnailUrl, tags: product.tags, status: product.status,
    })

    sendSuccess(res, product, 201)
  } catch (err) {
    next(err)
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await prisma.product.findFirst({ where: { id: req.params.id, status: { not: 'deleted' } } })
    if (!product) throw Errors.PRODUCT_NOT_FOUND(req.params.id)

    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
      include: { brand: true, category: true, variants: true },
    })

    await deleteCache(`product:${req.params.id}`)
    await indexProduct({
      objectID: updated.id, name: updated.name, brand: updated.brand.name,
      category: updated.category.name, mrp: parseFloat(updated.mrp.toString()),
      sellingPrice: parseFloat(updated.sellingPrice.toString()),
      thumbnailUrl: updated.thumbnailUrl, tags: updated.tags, status: updated.status,
    })

    sendSuccess(res, updated)
  } catch (err) {
    next(err)
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await prisma.product.findFirst({ where: { id: req.params.id, status: { not: 'deleted' } } })
    if (!product) throw Errors.PRODUCT_NOT_FOUND(req.params.id)

    await prisma.product.update({ where: { id: req.params.id }, data: { status: 'deleted' } })
    await deleteCache(`product:${req.params.id}`)
    await deleteProductIndex(req.params.id)

    sendSuccess(res, { deleted: true })
  } catch (err) {
    next(err)
  }
}

export async function bulkImportProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) throw Errors.VALIDATION_ERROR('CSV file required')

    const records = parse(req.file.buffer.toString(), { columns: true, skip_empty_lines: true }) as {
      name: string; brandSlug: string; categorySlug: string; mrp: string; sellingPrice: string
      sku: string; size: string; colour: string; stock: string
    }[]

    let created = 0
    for (const row of records) {
      const brand = await prisma.brand.findUnique({ where: { slug: row.brandSlug } })
      const category = await prisma.category.findUnique({ where: { slug: row.categorySlug } })
      if (!brand || !category) continue

      const slug = row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now() + created
      await prisma.product.upsert({
        where: { slug },
        create: {
          name: row.name, slug, brandId: brand.id, categoryId: category.id,
          mrp: parseFloat(row.mrp), sellingPrice: parseFloat(row.sellingPrice),
          variants: { create: [{ sku: row.sku, size: row.size, colour: row.colour, stock: parseInt(row.stock, 10) }] },
        },
        update: {},
      })
      created++
    }

    sendSuccess(res, { created })
  } catch (err) {
    next(err)
  }
}
