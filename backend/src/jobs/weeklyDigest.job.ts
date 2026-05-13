import cron from 'node-cron'
import { prisma } from '../config/database'
import { sendWeeklyRevenueDigest } from '../services/email.service'
import { logger } from '../utils/logger'

const SUPER_ADMIN_EMAIL = 'admin@shoppersstop.com'

// Weekly Sunday midnight: revenue digest to Super Admin
export function startWeeklyDigestJob(): void {
  cron.schedule('0 0 * * 0', async () => {
    logger.info('Running weekly revenue digest job')
    try {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const orders = await prisma.order.findMany({
        where: { createdAt: { gte: weekAgo }, paymentStatus: 'paid' },
        select: { total: true },
      })

      const revenue = orders.reduce((s, o) => s + parseFloat(o.total.toString()), 0)
      await sendWeeklyRevenueDigest(SUPER_ADMIN_EMAIL, revenue, orders.length)
      logger.info(`Weekly digest sent — ₹${revenue} revenue, ${orders.length} orders`)
    } catch (err) {
      logger.error('Weekly digest job failed', { err })
    }
  }, { timezone: 'Asia/Kolkata' })
}
