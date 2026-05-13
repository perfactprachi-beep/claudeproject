import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess } from '../utils/response'

export async function revenueAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { from, to } = req.query as { from?: string; to?: string }
    const startDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = to ? new Date(to) : new Date()

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate, lte: endDate }, paymentStatus: 'paid' },
      select: { createdAt: true, total: true, paymentMethod: true },
    })

    const totalRevenue = orders.reduce((s, o) => s + parseFloat(o.total.toString()), 0)
    const byDay: Record<string, number> = {}
    for (const o of orders) {
      const day = o.createdAt.toISOString().split('T')[0]
      byDay[day] = (byDay[day] ?? 0) + parseFloat(o.total.toString())
    }

    sendSuccess(res, { totalRevenue, orderCount: orders.length, byDay })
  } catch (err) {
    next(err)
  }
}

export async function orderAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const statusGroups = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    })
    const byStatus = Object.fromEntries(statusGroups.map((g) => [g.status, g._count.status]))
    const total = await prisma.order.count()
    sendSuccess(res, { total, byStatus })
  } catch (err) {
    next(err)
  }
}

export async function customerAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [total, newThisMonth, byTier] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }),
      prisma.firstCitizenAccount.groupBy({ by: ['tier'], _count: { tier: true } }),
    ])
    const tierBreakdown = Object.fromEntries(byTier.map((t) => [t.tier, t._count.tier]))
    sendSuccess(res, { total, newThisMonth, tierBreakdown })
  } catch (err) {
    next(err)
  }
}

export async function productAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    })

    const withNames = await Promise.all(topProducts.map(async (p) => {
      const product = await prisma.product.findUnique({ where: { id: p.productId }, select: { name: true } })
      return { productId: p.productId, name: product?.name ?? 'Unknown', unitsSold: p._sum.quantity }
    }))

    sendSuccess(res, { topProducts: withNames })
  } catch (err) {
    next(err)
  }
}

export async function searchAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Placeholder — real data would come from Algolia Analytics API
    sendSuccess(res, { message: 'Integrate Algolia Analytics API for search data.' })
  } catch (err) {
    next(err)
  }
}
