import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { ZodSchema } from 'zod'
import { Errors } from '../utils/errors'

export function validate(chains: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(chains.map((chain) => chain.run(req)))
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const msg = errors.array().map((e) => e.msg).join('; ')
      next(Errors.VALIDATION_ERROR(msg))
      return
    }
    next()
  }
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const msg = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
      next(Errors.VALIDATION_ERROR(msg))
      return
    }
    req.body = result.data
    next()
  }
}
