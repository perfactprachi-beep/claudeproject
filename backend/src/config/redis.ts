import Redis from 'ioredis'
import { env } from './env'
import { logger } from '../utils/logger'

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
})

redis.on('connect', () => logger.info('Redis connected'))
redis.on('error', (err) => logger.error('Redis error', err))

export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get(key)
  return data ? (JSON.parse(data) as T) : null
}

export async function setCache(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
}

export async function deleteCache(key: string): Promise<void> {
  await redis.del(key)
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern)
  if (keys.length) await redis.del(...keys)
}
