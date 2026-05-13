import { getAlgoliaClient, PRODUCTS_INDEX } from '../config/algolia'
import { prisma } from '../config/database'
import { logger } from '../utils/logger'

export interface AlgoliaProduct {
  objectID: string
  name: string
  brand: string
  category: string
  mrp: number
  sellingPrice: number
  thumbnailUrl: string | null
  tags: string[]
  status: string
}

function client() {
  return getAlgoliaClient()
}

export async function indexProduct(product: AlgoliaProduct): Promise<void> {
  const c = client()
  if (!c) return
  try {
    await c.saveObject({ indexName: PRODUCTS_INDEX, body: product })
  } catch (err) {
    logger.error('Algolia index product failed', { err, productId: product.objectID })
  }
}

export async function deleteProductIndex(productId: string): Promise<void> {
  const c = client()
  if (!c) return
  try {
    await c.deleteObject({ indexName: PRODUCTS_INDEX, objectID: productId })
  } catch (err) {
    logger.error('Algolia delete product failed', { err, productId })
  }
}

export async function fullReindex(): Promise<void> {
  const c = client()
  if (!c) { logger.warn('Algolia not configured — skipping reindex'); return }

  const products = await prisma.product.findMany({
    where: { status: { not: 'deleted' } },
    include: { brand: true, category: true },
  })

  const objects: AlgoliaProduct[] = products.map((p) => ({
    objectID: p.id,
    name: p.name,
    brand: p.brand.name,
    category: p.category.name,
    mrp: p.mrp,
    sellingPrice: p.sellingPrice,
    thumbnailUrl: p.thumbnailUrl,
    tags: JSON.parse(p.tags),
    status: p.status,
  }))

  await c.saveObjects({ indexName: PRODUCTS_INDEX, objects })
  logger.info(`Reindexed ${objects.length} products to Algolia`)
}

export async function searchProducts(query: string, options: Record<string, unknown> = {}): Promise<unknown> {
  const c = client()
  if (!c) {
    // Fallback: simple DB search
    const results = await prisma.product.findMany({
      where: { name: { contains: query }, status: { not: 'deleted' } },
      include: { brand: true, category: true },
      take: (options.hitsPerPage as number) ?? 20,
    })
    return { hits: results, nbHits: results.length, query }
  }
  return c.searchSingleIndex({ indexName: PRODUCTS_INDEX, searchParams: { query, hitsPerPage: 20, ...options } })
}

export async function getAutocompleteSuggestions(query: string): Promise<string[]> {
  const c = client()
  if (!c) {
    const results = await prisma.product.findMany({
      where: { name: { contains: query }, status: 'active' },
      select: { name: true }, take: 5,
    })
    return results.map((r) => r.name)
  }
  const result = await c.searchSingleIndex({
    indexName: PRODUCTS_INDEX,
    searchParams: { query, hitsPerPage: 5, attributesToRetrieve: ['name'] },
  }) as { hits: { name: string }[] }
  return result.hits.map((h) => h.name)
}
