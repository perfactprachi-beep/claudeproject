import type { OrderStatus, PaymentMethod } from './enums'
import type { Address } from './user'

export interface OrderItem {
  id: string
  productId: string
  brand: string
  name: string
  image: string
  size: string
  colour?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface TrackingEvent {
  status: string
  timestamp: string
  location?: string
  description: string
  completed: boolean
}

export interface Order {
  id: string
  date: string
  items: OrderItem[]
  subtotal: number
  discount: number
  deliveryCharge: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  shippingAddress: Address
  tracking?: {
    awb: string
    courier: string
    events: TrackingEvent[]
  }
  invoiceUrl?: string
  estimatedDelivery?: string
}
