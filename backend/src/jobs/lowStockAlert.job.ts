import cron from 'node-cron'
import { prisma } from '../config/database'
import { sendLowStockAlert } from '../services/email.service'
import { env } from '../config/env'
import { logger } from '../utils/logger'

const CATALOGUE_EMAIL = 'catalogue@shoppersstop.com'

// Daily 6 AM: send low-stock alert to catalogue team
export function startLowStockAlertJob(): void {
  cron.schedule('0 6 * * *', async () => {
    logger.info('Running low stock alert job')
    try {
      const lowStockItems = await prisma.productVariant.findMany({
        where: { status: { in: ['low', 'out_of_stock'] } },
        include: { product: { select: { name: true } } },
        take: 50,
      })

      if (!lowStockItems.length) return

      await sendLowStockAlert(
        CATALOGUE_EMAIL,
        lowStockItems.map((i) => ({ sku: i.sku, product: i.product.name, stock: i.stock })),
      )

      logger.info(`Low stock alert sent — ${lowStockItems.length} items`)
    } catch (err) {
      logger.error('Low stock alert job failed', { err })
    }
  }, { timezone: 'Asia/Kolkata' })
}
