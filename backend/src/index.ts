import './config/env'
import app from './app'
import { connectDB, disconnectDB } from './config/database'
import { startAllJobs } from './jobs'
import { env } from './config/env'
import { logger } from './utils/logger'

async function bootstrap(): Promise<void> {
  await connectDB()
  logger.info('Database connected')

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`)
  })

  if (env.isProd) startAllJobs()

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal} — shutting down gracefully`)
    server.close(async () => {
      await disconnectDB()
      process.exit(0)
    })
    setTimeout(() => process.exit(1), 10_000)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT',  () => shutdown('SIGINT'))
}

bootstrap().catch((err) => {
  logger.error('Failed to start server', { err })
  process.exit(1)
})
