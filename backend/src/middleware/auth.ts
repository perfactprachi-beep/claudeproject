import { Request, Response, NextFunction } from 'express'
import { getFirebaseAuth } from '../config/firebase'
import { prisma } from '../config/database'
import { Errors } from '../utils/errors'
import { env } from '../config/env'

export type AdminRole = 'super_admin' | 'catalogue_mgr' | 'order_mgr' | 'support_agent'

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

const DEV_BYPASS = env.isDev && !env.FIREBASE_PROJECT_ID

export async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (DEV_BYPASS) {
      // In dev without Firebase, accept any Bearer token as the user ID
      const authHeader = req.headers.authorization
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7)
        req.firebaseUid = token
        req.userId = token
      }
      next()
      return
    }

    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) throw Errors.UNAUTHORIZED()
    const token = authHeader.slice(7)

    const auth = getFirebaseAuth()
    if (!auth) throw Errors.UNAUTHORIZED()

    const decoded = await auth.verifyIdToken(token)
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
    if (DEV_BYPASS) {
      // Dev bypass: pass ?role=super_admin in query or use header x-dev-role
      const role = (req.headers['x-dev-role'] as string) || (req.query.role as string) || 'super_admin'
      req.staffRole = role as AdminRole
      req.staffId = 'dev-staff-id'
      next()
      return
    }

    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) throw Errors.UNAUTHORIZED()
    const token = authHeader.slice(7)

    const auth = getFirebaseAuth()
    if (!auth) throw Errors.UNAUTHORIZED()

    const decoded = await auth.verifyIdToken(token)

    const staff = await prisma.staffMember.findUnique({
      where: { firebaseUid: decoded.uid },
      select: { id: true, role: true, status: true },
    })

    if (!staff) throw Errors.INSUFFICIENT_PERMISSIONS()
    if (staff.status === 'suspended') throw Errors.INSUFFICIENT_PERMISSIONS()

    req.staffId = staff.id
    req.staffRole = staff.role as AdminRole
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
