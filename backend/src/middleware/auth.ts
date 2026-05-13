import { Request, Response, NextFunction } from 'express'
import { firebaseAuth } from '../config/firebase'
import { prisma } from '../config/database'
import { Errors } from '../utils/errors'
import { AdminRole } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      userId?: string
      firebaseUid?: string
      staffId?: string
      staffRole?: AdminRole
    }
  }
}

export async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      throw Errors.UNAUTHORIZED()
    }
    const token = authHeader.slice(7)
    const decoded = await firebaseAuth.verifyIdToken(token)
    req.firebaseUid = decoded.uid

    const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid }, select: { id: true } })
    if (user) req.userId = user.id

    next()
  } catch (err: unknown) {
    const isFirebaseError = (e: unknown): e is { code: string } =>
      typeof e === 'object' && e !== null && 'code' in e
    if (isFirebaseError(err) && String(err.code).includes('auth/id-token-expired')) {
      next(Errors.TOKEN_EXPIRED())
    } else if (err instanceof Error && err.name === 'AppError') {
      next(err)
    } else {
      next(Errors.UNAUTHORIZED())
    }
  }
}

export async function verifyAdminToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) throw Errors.UNAUTHORIZED()

    const token = authHeader.slice(7)
    const decoded = await firebaseAuth.verifyIdToken(token)

    const staff = await prisma.staffMember.findUnique({
      where: { firebaseUid: decoded.uid },
      select: { id: true, role: true, status: true },
    })

    if (!staff) throw Errors.INSUFFICIENT_PERMISSIONS()
    if (staff.status === 'suspended') throw Errors.INSUFFICIENT_PERMISSIONS()

    req.staffId = staff.id
    req.staffRole = staff.role
    next()
  } catch (err) {
    next(err)
  }
}

export function requireRole(...roles: AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.staffRole || !roles.includes(req.staffRole)) {
      next(Errors.INSUFFICIENT_PERMISSIONS())
      return
    }
    next()
  }
}

export function requireUser(req: Request, res: Response, next: NextFunction): void {
  if (!req.userId) {
    next(Errors.UNAUTHORIZED())
    return
  }
  next()
}
