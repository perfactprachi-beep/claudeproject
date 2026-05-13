import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess } from '../utils/response'
import { Errors } from '../utils/errors'

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, mobile: true, gender: true, birthday: true, avatarUrl: true, status: true, createdAt: true },
    })
    if (!user) throw Errors.NOT_FOUND('User')
    sendSuccess(res, user)
  } catch (err) {
    next(err)
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const { name, mobile, gender, birthday } = req.body as { name?: string; mobile?: string; gender?: string; birthday?: string }
    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: { name, mobile, gender: gender as never, birthday: birthday ? new Date(birthday) : undefined },
      select: { id: true, name: true, email: true, mobile: true, gender: true, birthday: true },
    })
    sendSuccess(res, updated)
  } catch (err) {
    next(err)
  }
}

export async function getAddresses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const addresses = await prisma.address.findMany({ where: { userId: req.userId }, orderBy: { isDefault: 'desc' } })
    sendSuccess(res, addresses)
  } catch (err) {
    next(err)
  }
}

export async function addAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const { label, fullName, mobile, line1, line2, city, state, pincode, isDefault } = req.body as {
      label?: string; fullName: string; mobile: string; line1: string; line2?: string; city: string; state: string; pincode: string; isDefault?: boolean
    }

    if (isDefault) {
      await prisma.address.updateMany({ where: { userId: req.userId }, data: { isDefault: false } })
    }

    const address = await prisma.address.create({
      data: { userId: req.userId!, label, fullName, mobile, line1, line2, city, state, pincode, isDefault: isDefault ?? false },
    })
    sendSuccess(res, address, 201)
  } catch (err) {
    next(err)
  }
}

export async function updateAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const address = await prisma.address.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!address) throw Errors.NOT_FOUND('Address')

    if (req.body.isDefault) {
      await prisma.address.updateMany({ where: { userId: req.userId }, data: { isDefault: false } })
    }

    const updated = await prisma.address.update({ where: { id: req.params.id }, data: req.body })
    sendSuccess(res, updated)
  } catch (err) {
    next(err)
  }
}

export async function deleteAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const address = await prisma.address.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!address) throw Errors.NOT_FOUND('Address')
    await prisma.address.delete({ where: { id: req.params.id } })
    sendSuccess(res, { deleted: true })
  } catch (err) {
    next(err)
  }
}

export async function getWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.userId },
      include: { product: { include: { brand: true } } },
    })
    sendSuccess(res, items)
  } catch (err) {
    next(err)
  }
}

export async function addToWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: req.userId, productId: req.params.productId } },
      create: { userId: req.userId, productId: req.params.productId },
      update: {},
    })
    sendSuccess(res, { added: true })
  } catch (err) {
    next(err)
  }
}

export async function removeFromWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) throw Errors.UNAUTHORIZED()
    await prisma.wishlistItem.deleteMany({ where: { userId: req.userId, productId: req.params.productId } })
    sendSuccess(res, { removed: true })
  } catch (err) {
    next(err)
  }
}
