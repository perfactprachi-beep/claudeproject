import { startFcPointsExpiryJob } from './fcPointsExpiry.job'
import { startLowStockAlertJob } from './lowStockAlert.job'
import { startOrderReminderJob } from './orderReminder.job'
import { startWeeklyDigestJob } from './weeklyDigest.job'
import { startAlgoliaSyncJob } from './algoliaSync.job'
import { logger } from '../utils/logger'

export function startAllJobs(): void {
  startFcPointsExpiryJob()
  startLowStockAlertJob()
  startOrderReminderJob()
  startWeeklyDigestJob()
  startAlgoliaSyncJob()
  logger.info('All cron jobs started')
}
