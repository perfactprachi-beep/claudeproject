import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/errors'
import { logger } from '../utils/logger'

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message, statusCode: err.statusCode },
    })
    return
  }

  const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
  logger.error('Unhandled error', { message, stack: err instanceof Error ? err.stack : undefined, path: req.path })

  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong.', statusCode: 500 },
  })
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found.`, statusCode: 404 },
  })
}
