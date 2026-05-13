import { env } from './env'
import { logger } from '../utils/logger'

// In-memory fallback when Redis is not configured
const memCache = new Map<string, { value: string; expiresAt: number }>()

let redisEnabled = false

export async function initRedis(): Promise<void> {
  if (!env.REDIS_URL) {
    logger.warn('REDIS_URL not set — using in-memory cache (not suitable for production)')
    return
  }
  try {
    const { default: Redis } = await import('ioredis')
    const client = new Redis(env.REDIS_URL, { maxRetriesPerRequest: 1, connectTimeout: 3000 })
    await client.ping()
    redisEnabled = true
    logger.info('Redis connected')
    ;(globalThis as Record<string, unknown>).__redis = client
  } catch (err) {
    logger.warn('Redis unavailable — using in-memory cache fallback', { err })
  }
}

function redisClient(): import('ioredis').Redis | null {
  return (globalThis as Record<string, unknown>).__redis as import('ioredis').Redis | null ?? null
}

export async function getCache<T>(key: string): Promise<T | null> {
  if (redisEnabled) {
    const data = await redisClient()!.get(key)
    return data ? (JSON.parse(data) as T) : null
  }
  const entry = memCache.get(key)
  if (!entry) return null
  if (entry.expiresAt < Date.now()) { memCache.delete(key); return null }
  return JSON.parse(entry.value) as T
}

export async function setCache(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  const serialized = JSON.stringify(value)
  if (redisEnabled) {
    await redisClient()!.set(key, serialized, 'EX', ttlSeconds)
    return
  }
  memCache.set(key, { value: serialized, expiresAt: Date.now() + ttlSeconds * 1000 })
}

export async function deleteCache(key: string): Promise<void> {
  if (redisEnabled) { await redisClient()!.del(key); return }
  memCache.delete(key)
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  if (redisEnabled) {
    const keys = await redisClient()!.keys(pattern)
    if (keys.length) await redisClient()!.del(...keys)
    return
  }
  const regex = new RegExp('^' + pattern.replace('*', '.*') + '$')
  for (const key of memCache.keys()) {
    if (regex.test(key)) memCache.delete(key)
  }
}
