import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess, parsePagination, paginate } from '../utils/response'
import { Errors } from '../utils/errors'

export async function getStaff(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const staff = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true, name: true, email: true, mobile: true,
        adminRole: true, isActive: true, createdAt: true, updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    sendSuccess(res, staff)
  } catch (err) {
    next(err)
  }
}

export async function createStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, adminRole, mobile } = req.body as {
      name: string; email: string; adminRole: string; mobile?: string
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw Errors.CONFLICT('A staff member with this email already exists.')

    const staff = await prisma.user.create({
      data: {
        firebaseUid: `pending-${Date.now()}`,
        name,
        email,
        mobile: mobile ?? null,
        role: 'ADMIN',
        adminRole: adminRole as any,
        isActive: true,
      },
      select: {
        id: true, name: true, email: true, mobile: true,
        adminRole: true, isActive: true, createdAt: true,
      },
    })

    sendSuccess(res, staff, 201)
  } catch (err) {
    next(err)
  }
}

export async function changeRole(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { adminRole } = req.body as { adminRole: string }
    const staff = await prisma.user.findUnique({ where: { id: req.params.id } })
    if (!staff || staff.role !== 'ADMIN') throw Errors.NOT_FOUND('Staff member')

    await prisma.user.update({
      where: { id: req.params.id },
      data: { adminRole: adminRole as any },
    })
    sendSuccess(res, { updated: true })
  } catch (err) {
    next(err)
  }
}

export async function changeStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { isActive } = req.body as { isActive: boolean }
    const staff = await prisma.user.findUnique({ where: { id: req.params.id } })
    if (!staff || staff.role !== 'ADMIN') throw Errors.NOT_FOUND('Staff member')

    await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive },
    })
    sendSuccess(res, { updated: true })
  } catch (err) {
    next(err)
  }
}

export async function getAuditLog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>)
    const [logs, total] = await prisma.$transaction([
      prisma.staffAuditLog.findMany({
        skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { staffUser: { select: { name: true, email: true } } },
      }),
      prisma.staffAuditLog.count(),
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

    const where: Record<string, unknown> = { role: 'CUSTOMER' }
    if (status === 'blocked') where.isActive = false
    if (status === 'active') where.isActive = true
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { mobile: { contains: search } },
    ]

    const [customers, total] = await prisma.$transaction([
      prisma.user.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: {
          fcAccount: { select: { tier: true, pointsBalance: true, annualSpend: true } },
          _count: { select: { orders: true } },
        },
      }),
      prisma.user.count({ where }),
    ])
    sendSuccess(res, customers, 200, paginate(page, limit, total))
  } catch (err) {
    next(err)
  }
}
