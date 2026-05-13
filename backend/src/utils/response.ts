import { Response } from 'express'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200, meta?: PaginationMeta): void {
  res.status(statusCode).json({ success: true, data, ...(meta ? { meta } : {}) })
}

export function sendError(res: Response, code: string, message: string, statusCode = 400): void {
  res.status(statusCode).json({ success: false, error: { code, message, statusCode } })
}

export function paginate(page: number, limit: number, total: number): PaginationMeta {
  return { page, limit, total, totalPages: Math.ceil(total / limit) }
}

export function parsePagination(query: Record<string, unknown>): { page: number; limit: number; skip: number } {
  const page = Math.max(1, parseInt(String(query.page ?? '1'), 10))
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? '20'), 10)))
  return { page, limit, skip: (page - 1) * limit }
}
