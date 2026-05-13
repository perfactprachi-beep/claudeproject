import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { firebaseAuth } from '../config/firebase'
import { getOrCreateFCAccount } from '../services/fc.service'
import { sendSuccess } from '../utils/response'
import { Errors } from '../utils/errors'

export async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token } = req.body as { token: string }
    if (!token) throw Errors.VALIDATION_ERROR('token is required')

    const decoded = await firebaseAuth.verifyIdToken(token)
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      include: { fcAccount: { include: { transactions: { take: 5, orderBy: { createdAt: 'desc' } } } } },
    })

    if (!user) {
      sendSuccess(res, { authenticated: false, requiresRegistration: true })
      return
    }

    sendSuccess(res, { authenticated: true, user, fcAccount: user.fcAccount })
  } catch (err) {
    next(err)
  }
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { firebaseUid, name, email, mobile, gender, birthday } = req.body as {
      firebaseUid: string; name: string; email: string; mobile?: string; gender?: string; birthday?: string
    }

    const existing = await prisma.user.findUnique({ where: { firebaseUid } })
    if (existing) {
      sendSuccess(res, { user: existing })
      return
    }

    const user = await prisma.user.create({
      data: {
        firebaseUid,
        name,
        email,
        mobile,
        gender: gender as never,
        birthday: birthday ? new Date(birthday) : undefined,
      },
    })

    await getOrCreateFCAccount(user.id)
    sendSuccess(res, { user }, 201)
  } catch (err) {
    next(err)
  }
}

export async function adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string }

    const staff = await prisma.staffMember.findUnique({ where: { email }, select: { id: true, role: true, status: true, name: true } })
    if (!staff) throw Errors.UNAUTHORIZED()
    if (staff.status === 'suspended') throw Errors.INSUFFICIENT_PERMISSIONS()

    // Firebase handles actual password auth — we verify the ID token from the client
    sendSuccess(res, { message: 'Use Firebase client SDK to sign in, then pass the ID token.' })
  } catch (err) {
    next(err)
  }
}
