import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess } from '../utils/response'
import { checkPincodeServiceability, createShipment } from '../services/delivery.service'
import { Errors } from '../utils/errors'

export async function checkPincode(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { pincode } = req.body as { pincode: string }
    if (!/^\d{6}$/.test(pincode)) throw Errors.VALIDATION_ERROR('Invalid pincode format')
    const result = await checkPincodeServiceability(pincode)
    sendSuccess(res, result)
  } catch (err) {
    next(err)
  }
}

export async function createManifest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderId } = req.body as { orderId: string }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, address: true, items: { include: { product: true, variant: true } } },
    })
    if (!order) throw Errors.NOT_FOUND('Order')

    const shipment = await createShipment({
      orderId: order.id,
      customerName: order.address.fullName,
      mobile: order.address.mobile,
      address: order.address.line1 + (order.address.line2 ? `, ${order.address.line2}` : ''),
      city: order.address.city,
      state: order.address.state,
      pincode: order.address.pincode,
      items: order.items.map((i) => ({
        name: i.productName, sku: i.variant.sku, qty: i.quantity, price: parseFloat(i.unitPrice.toString()),
      })),
      total: parseFloat(order.total.toString()),
    })

    if (shipment) {
      await prisma.order.update({
        where: { id: orderId },
        data: { trackingNumber: shipment.trackingNumber, shiprocketShipmentId: shipment.shipmentId },
      })
    }

    sendSuccess(res, shipment ?? { error: 'Shipment creation failed' })
  } catch (err) {
    next(err)
  }
}
