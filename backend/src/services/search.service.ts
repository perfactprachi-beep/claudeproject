import { algoliaClient, PRODUCTS_INDEX } from '../config/algolia'
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

export async function indexProduct(product: AlgoliaProduct): Promise<void> {
  try {
    await algoliaClient.saveObject({ indexName: PRODUCTS_INDEX, body: product })
  } catch (err) {
    logger.error('Algolia index product failed', { err, productId: product.objectID })
  }
}

export async function deleteProductIndex(productId: string): Promise<void> {
  try {
    await algoliaClient.deleteObject({ indexName: PRODUCTS_INDEX, objectID: productId })
  } catch (err) {
    logger.error('Algolia delete product failed', { err, productId })
  }
}

export async function fullReindex(): Promise<void> {
  const products = await prisma.product.findMany({
    where: { status: { not: 'deleted' } },
    include: { brand: true, category: true },
  })

  const objects: AlgoliaProduct[] = products.map((p) => ({
    objectID: p.id,
    name: p.name,
    brand: p.brand.name,
    category: p.category.name,
    mrp: parseFloat(p.mrp.toString()),
    sellingPrice: parseFloat(p.sellingPrice.toString()),
    thumbnailUrl: p.thumbnailUrl,
    tags: p.tags,
    status: p.status,
  }))

  await algoliaClient.saveObjects({ indexName: PRODUCTS_INDEX, objects })
  logger.info(`Reindexed ${objects.length} products to Algolia`)
}

export async function searchProducts(query: string, options: Record<string, unknown> = {}): Promise<unknown> {
  return algoliaClient.searchSingleIndex({
    indexName: PRODUCTS_INDEX,
    searchParams: { query, hitsPerPage: 20, ...options },
  })
}

export async function getAutocompleteSuggestions(query: string): Promise<string[]> {
  const result = await algoliaClient.searchSingleIndex({
    indexName: PRODUCTS_INDEX,
    searchParams: { query, hitsPerPage: 5, attributesToRetrieve: ['name'] },
  }) as { hits: { name: string }[] }
  return result.hits.map((h) => h.name)
}
