import type { OrderStatus, PaymentMethod } from './enums'
import type { Address } from './user'

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string
  productId: string
  brand: string
  name: string
  image: string
  size: string
  colour?: string
  price: number
  quantity: number
  fcPointsEarnable?: number
}

export interface Cart {
  items: CartItem[]
  couponCode?: string
  couponDiscount: number
  fcPointsRedeemed: number
  subtotal: number
  discount: number
  delivery: number
  total: number
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export interface PaymentInfo {
  method: PaymentMethod
  /** Last 4 digits of card, UPI VPA, bank name, etc. */
  reference?: string
  fcPointsUsed?: number
  transactionId?: string
}

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

/**
 * Complete order model with full payment, tracking, and FC points info.
 * Lightweight variant used by mock data: {@link Order}
 */
export interface FullOrder {
  orderId: string
  userId: string
  items: OrderItem[]
  address: Address
  payment: PaymentInfo
  status: OrderStatus
  placedAt: string
  estimatedDelivery?: string
  tracking: TrackingEvent[]
  fcPointsEarned: number
  invoice?: string
}
