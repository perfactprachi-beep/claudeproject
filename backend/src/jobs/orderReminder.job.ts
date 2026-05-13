import cron from 'node-cron'
import { prisma } from '../config/database'
import { sendEmail } from '../services/email.service'
import { logger } from '../utils/logger'

// Daily 9 AM: email reminder for pending orders > 24 hours
export function startOrderReminderJob(): void {
  cron.schedule('0 9 * * *', async () => {
    logger.info('Running order reminder job')
    try {
      const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000)

      const pendingOrders = await prisma.order.findMany({
        where: { status: 'pending', createdAt: { lte: threshold } },
        include: { user: { select: { email: true, name: true } } },
        take: 100,
      })

      for (const order of pendingOrders) {
        await sendEmail({
          to: order.user.email,
          subject: `Complete your order #${order.id}`,
          html: `<p>Hi ${order.user.name}, your order <strong>#${order.id}</strong> is still pending. Complete payment to confirm it.</p>`,
        })
      }

      logger.info(`Order reminders sent — ${pendingOrders.length} orders`)
    } catch (err) {
      logger.error('Order reminder job failed', { err })
    }
  }, { timezone: 'Asia/Kolkata' })
}
