import cron from 'node-cron'
import { prisma } from '../config/database'
import { expirePoints } from '../services/fc.service'
import { logger } from '../utils/logger'

// Daily 2 AM: expire FC points past expiry date
export function startFcPointsExpiryJob(): void {
  cron.schedule('0 2 * * *', async () => {
    logger.info('Running FC points expiry job')
    try {
      const accounts = await prisma.firstCitizenAccount.findMany({
        where: { expiryDate: { lte: new Date() }, pointsBalance: { gt: 0 } },
        select: { id: true },
      })

      let totalExpired = 0
      for (const account of accounts) {
        const expired = await expirePoints(account.id)
        totalExpired += expired
      }

      logger.info(`FC points expiry complete — expired ${totalExpired} points across ${accounts.length} accounts`)
    } catch (err) {
      logger.error('FC points expiry job failed', { err })
    }
  }, { timezone: 'Asia/Kolkata' })
}
