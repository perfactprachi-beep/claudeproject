import './config/env'
import { env } from './config/env'
import { logger } from './utils/logger'

async function bootstrap(): Promise<void> {
  // Init optional services (non-fatal in dev)
  const { initFirebase } = await import('./config/firebase')
  const { initRedis } = await import('./config/redis')
  await initFirebase()
  await initRedis()

  // DB
  const { connectDB } = await import('./config/database')
  await connectDB()
  logger.info('Database connected')

  // Start Express
  const { default: app } = await import('./app')
  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`)
    if (env.isDev && !env.FIREBASE_PROJECT_ID) {
      logger.warn('DEV BYPASS MODE: No Firebase — admin routes accept any Bearer token. Pass x-dev-role header to set role.')
    }
  })

  if (env.isProd) {
    const { startAllJobs } = await import('./jobs')
    startAllJobs()
  }

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal} — shutting down gracefully`)
    server.close(async () => {
      const { disconnectDB } = await import('./config/database')
      await disconnectDB()
      process.exit(0)
    })
    setTimeout(() => process.exit(1), 10_000)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err)
  process.exit(1)
})
