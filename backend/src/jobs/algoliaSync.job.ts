import cron from 'node-cron'
import { prisma } from '../config/database'
import { indexProduct } from '../services/search.service'
import { logger } from '../utils/logger'

// Hourly: delta sync changed products to Algolia
export function startAlgoliaSyncJob(): void {
  cron.schedule('0 * * * *', async () => {
    logger.info('Running Algolia delta sync job')
    try {
      const since = new Date(Date.now() - 65 * 60 * 1000) // past 65 minutes

      const products = await prisma.product.findMany({
        where: { updatedAt: { gte: since }, status: { not: 'deleted' } },
        include: { brand: true, category: true },
      })

      for (const p of products) {
        await indexProduct({
          objectID: p.id,
          name: p.name,
          brand: p.brand.name,
          category: p.category.name,
          mrp: parseFloat(p.mrp.toString()),
          sellingPrice: parseFloat(p.sellingPrice.toString()),
          thumbnailUrl: p.thumbnailUrl,
          tags: p.tags,
          status: p.status,
        })
      }

      if (products.length) logger.info(`Algolia delta sync — ${products.length} products synced`)
    } catch (err) {
      logger.error('Algolia sync job failed', { err })
    }
  })
}
