import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { firebaseAuth } from '../config/firebase'
import { sendSuccess, parsePagination, paginate } from '../utils/response'
import { Errors } from '../utils/errors'
import { AdminRole } from '@prisma/client'

export async function getStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const staff = await prisma.staffMember.findMany({ orderBy: { joinedDate: 'desc' } })
    sendSuccess(res, staff)
  } catch (err) {
    next(err)
  }
}

export async function createStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, role, sendInvite } = req.body as { name: string; email: string; role: AdminRole; sendInvite?: boolean }

    const existing = await prisma.staffMember.findUnique({ where: { email } })
    if (existing) throw Errors.CONFLICT('A staff member with this email already exists.')

    // Create Firebase user
    const fbUser = await firebaseAuth.createUser({ email, displayName: name })
    await firebaseAuth.setCustomUserClaims(fbUser.uid, { role })

    const staff = await prisma.staffMember.create({
      data: { firebaseUid: fbUser.uid, name, email, role },
    })

    if (sendInvite) {
      // In production: send password reset / invite email via Firebase
      await firebaseAuth.generatePasswordResetLink(email)
    }

    sendSuccess(res, staff, 201)
  } catch (err) {
    next(err)
  }
}

export async function changeRole(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { role } = req.body as { role: AdminRole }
    const staff = await prisma.staffMember.findUnique({ where: { id: req.params.id } })
    if (!staff) throw Errors.NOT_FOUND('Staff member')

    await prisma.staffMember.update({ where: { id: req.params.id }, data: { role } })
    if (staff.firebaseUid) await firebaseAuth.setCustomUserClaims(staff.firebaseUid, { role })

    sendSuccess(res, { updated: true })
  } catch (err) {
    next(err)
  }
}

export async function changeStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status } = req.body as { status: 'active' | 'suspended' }
    const staff = await prisma.staffMember.findUnique({ where: { id: req.params.id } })
    if (!staff) throw Errors.NOT_FOUND('Staff member')

    await prisma.staffMember.update({ where: { id: req.params.id }, data: { status } })
    if (staff.firebaseUid) {
      await firebaseAuth.updateUser(staff.firebaseUid, { disabled: status === 'suspended' })
    }

    sendSuccess(res, { updated: true })
  } catch (err) {
    next(err)
  }
}

export async function getAuditLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>)
    const [logs, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { staff: { select: { name: true } } },
      }),
      prisma.auditLog.count(),
    ])
    sendSuccess(res, logs, 200, paginate(page, limit, total))
  } catch (err) {
    next(err)
  }
}

export async function getCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>)
    const { search, status } = req.query as { search?: string; status?: string }

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { mobile: { contains: search } },
    ]

    const [customers, total] = await prisma.$transaction([
      prisma.user.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { fcAccount: { select: { tier: true, pointsBalance: true, annualSpend: true } }, _count: { select: { orders: true } } },
      }),
      prisma.user.count({ where }),
    ])
    sendSuccess(res, customers, 200, paginate(page, limit, total))
  } catch (err) {
    next(err)
  }
}
