/**
 * Mock data factory functions for the Shoppers Stop MVP.
 * Each factory accepts a partial override so tests can customise only what they need.
 */

import { FCTier, Gender, OrderStatus, PaymentMethod, ProductCategory } from '@typedefs/enums'
import type {
  FullProduct,
  Price,
  Size,
  Colour,
  Review,
  RatingInfo,
  DeliveryInfo,
  ReturnPolicy,
} from '@typedefs/product'
import type { FullUser, Address, SavedCard, CommunicationPrefs } from '@typedefs/user'
import type { Cart, CartItem, FullOrder, OrderItem, PaymentInfo, TrackingEvent } from '@typedefs/order'
import type { FirstCitizenAccount, PointTransaction } from '@typedefs/firstcitizen'

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _seq = 0
const uid = (prefix: string) => `${prefix}-${String(++_seq).padStart(4, '0')}`

// ─── Sub-type factories ───────────────────────────────────────────────────────

export function makePrice(overrides: Partial<Price> = {}): Price {
  const mrp = overrides.mrp ?? 4999
  const selling = overrides.selling ?? Math.round(mrp * 0.8)
  const discountPercent = Math.round(((mrp - selling) / mrp) * 100)
  return { mrp, selling, discount: mrp - selling, discountPercent, ...overrides }
}

export function makeSize(label: string, overrides: Partial<Size> = {}): Size {
  return { label, available: true, stockCount: 10, ...overrides }
}

export function makeColour(name: string, hex: string, overrides: Partial<Colour> = {}): Colour {
  return { name, hex, ...overrides }
}

export function makeReview(overrides: Partial<Review> = {}): Review {
  return {
    id: uid('rev'),
    userId: uid('usr'),
    userName: 'Priya S.',
    rating: 4,
    title: 'Great quality',
    body: 'Loved the fabric and fit. Would highly recommend.',
    helpful: 12,
    verified: true,
    createdAt: '2025-03-15T10:00:00Z',
    ...overrides,
  }
}

export function makeRatingInfo(overrides: Partial<RatingInfo> = {}): RatingInfo {
  return {
    average: 4.2,
    count: 148,
    distribution: { 1: 4, 2: 6, 3: 18, 4: 52, 5: 68 },
    ...overrides,
  }
}

export function makeDeliveryInfo(overrides: Partial<DeliveryInfo> = {}): DeliveryInfo {
  return {
    freeAbove: 499,
    standardCharge: 99,
    estimatedDays: '3–5 business days',
    expressAvailable: true,
    ...overrides,
  }
}

export function makeReturnPolicy(overrides: Partial<ReturnPolicy> = {}): ReturnPolicy {
  return {
    returnable: true,
    returnWindowDays: 30,
    conditions: 'Original tags must be intact. Sale items excluded.',
    ...overrides,
  }
}

// ─── FullProduct ──────────────────────────────────────────────────────────────

export function makeProduct(overrides: Partial<FullProduct> = {}): FullProduct {
  const id = overrides.id ?? uid('prod')
  const seed = id.replace(/\W/g, '')
  return {
    id,
    sku: overrides.sku ?? `SKU-${seed.toUpperCase()}`,
    name: 'Classic Cotton Kurta',
    brand: 'W',
    category: ProductCategory.WOMEN,
    subCategory: 'Kurta',
    images: [
      `https://picsum.photos/seed/${seed}/600/800`,
      `https://picsum.photos/seed/${seed}-2/600/800`,
      `https://picsum.photos/seed/${seed}-3/600/800`,
    ],
    thumbnails: [
      `https://picsum.photos/seed/${seed}/150/200`,
      `https://picsum.photos/seed/${seed}-2/150/200`,
      `https://picsum.photos/seed/${seed}-3/150/200`,
    ],
    price: makePrice(),
    sizes: [
      makeSize('XS', { stockCount: 3 }),
      makeSize('S'),
      makeSize('M'),
      makeSize('L'),
      makeSize('XL', { stockCount: 2 }),
      makeSize('XXL', { available: false, stockCount: 0 }),
    ],
    colours: [
      makeColour('Ivory', '#FFFFF0', { imageIndex: 0 }),
      makeColour('Rose Pink', '#FF66B2', { imageIndex: 1 }),
      makeColour('Teal', '#008B8B', { imageIndex: 2 }),
    ],
    description:
      'A timeless classic kurta in breathable cotton. Perfect for everyday wear and casual occasions.',
    material: '100% Cotton',
    careInstructions: 'Machine wash cold. Do not tumble dry. Iron on medium heat.',
    countryOfOrigin: 'India',
    ratings: makeRatingInfo(),
    reviews: [makeReview(), makeReview({ rating: 5, userName: 'Anjali M.', title: 'Perfect fit!' })],
    tags: ['cotton', 'kurta', 'ethnic', 'casual'],
    inStock: true,
    stockBySizeColour: {
      S_Ivory: 8, M_Ivory: 10, L_Ivory: 6,
      S_RosePink: 5, M_RosePink: 7, L_RosePink: 4,
      S_Teal: 3, M_Teal: 5, L_Teal: 2,
    },
    fcPointsEarnable: 40,
    deliveryInfo: makeDeliveryInfo(),
    returnPolicy: makeReturnPolicy(),
    relatedProducts: [],
    completeLookProducts: [],
    ...overrides,
  }
}

// ─── Address ──────────────────────────────────────────────────────────────────

export function makeAddress(overrides: Partial<Address> = {}): Address {
  return {
    id: uid('addr'),
    label: 'Home',
    fullName: 'Priya Sharma',
    mobile: '9876543210',
    line1: '14B, Shastri Nagar',
    line2: 'Near Metro Station',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    isDefault: true,
    ...overrides,
  }
}

export function makeSavedCard(overrides: Partial<SavedCard> = {}): SavedCard {
  return {
    id: uid('card'),
    last4: '4242',
    expiry: '09/27',
    network: 'Visa',
    holderName: 'Priya Sharma',
    ...overrides,
  }
}

// ─── FullUser ─────────────────────────────────────────────────────────────────

export function makeUser(overrides: Partial<FullUser> = {}): FullUser {
  const prefs: CommunicationPrefs = { emailOffers: true, smsAlerts: true, pushNotifications: false }
  return {
    uid: uid('usr'),
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    mobile: '9876543210',
    gender: Gender.FEMALE,
    birthday: '1992-04-15',
    firstCitizenNumber: 'FC-9000-1234-5678',
    tier: FCTier.SILVER_EDGE,
    addresses: [makeAddress()],
    defaultAddressId: undefined,
    savedCards: [makeSavedCard()],
    savedUpiIds: ['priya.sharma@okaxis'],
    wishlist: [],
    communicationPrefs: prefs,
    ...overrides,
  }
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export function makeCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: uid('ci'),
    productId: uid('prod'),
    brand: 'W',
    name: 'Classic Cotton Kurta',
    image: 'https://picsum.photos/seed/kurta/300/400',
    size: 'M',
    colour: 'Ivory',
    price: 3999,
    quantity: 1,
    fcPointsEarnable: 40,
    ...overrides,
  }
}

export function makeCart(overrides: Partial<Cart> = {}): Cart {
  const items = overrides.items ?? [makeCartItem()]
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const couponDiscount = overrides.couponDiscount ?? 0
  const fcPointsRedeemed = overrides.fcPointsRedeemed ?? 0
  const delivery = subtotal >= 499 ? 0 : 99
  const discount = couponDiscount + fcPointsRedeemed
  return {
    items,
    couponCode: undefined,
    couponDiscount,
    fcPointsRedeemed,
    subtotal,
    discount,
    delivery,
    total: subtotal - discount + delivery,
    ...overrides,
  }
}

// ─── Order ────────────────────────────────────────────────────────────────────

export function makeOrderItem(overrides: Partial<OrderItem> = {}): OrderItem {
  return {
    id: uid('oi'),
    productId: uid('prod'),
    brand: 'W',
    name: 'Classic Cotton Kurta',
    image: 'https://picsum.photos/seed/kurta/300/400',
    size: 'M',
    colour: 'Ivory',
    quantity: 1,
    unitPrice: 3999,
    totalPrice: 3999,
    ...overrides,
  }
}

export function makePaymentInfo(overrides: Partial<PaymentInfo> = {}): PaymentInfo {
  return {
    method: PaymentMethod.UPI,
    reference: 'priya.sharma@okaxis',
    fcPointsUsed: 0,
    transactionId: uid('txn'),
    ...overrides,
  }
}

export function makeTrackingEvent(status: string, overrides: Partial<TrackingEvent> = {}): TrackingEvent {
  return {
    status,
    timestamp: new Date().toISOString(),
    description: status,
    completed: true,
    ...overrides,
  }
}

export function makeOrder(overrides: Partial<FullOrder> = {}): FullOrder {
  const items = overrides.items ?? [makeOrderItem()]
  const subtotal = items.reduce((s, i) => s + i.totalPrice, 0)
  return {
    orderId: `SS-2025-${String(Math.floor(Math.random() * 99999)).padStart(6, '0')}`,
    userId: uid('usr'),
    items,
    address: makeAddress(),
    payment: makePaymentInfo(),
    status: OrderStatus.DELIVERED,
    placedAt: '2025-04-10T12:00:00Z',
    estimatedDelivery: '2025-04-14',
    tracking: [
      makeTrackingEvent('Order Placed'),
      makeTrackingEvent('Confirmed'),
      makeTrackingEvent('Shipped'),
      makeTrackingEvent('Delivered'),
    ],
    fcPointsEarned: Math.round(subtotal / 100),
    invoice: `https://shoppersstop.com/invoice/${uid('inv')}.pdf`,
    ...overrides,
  }
}

// ─── FirstCitizenAccount ──────────────────────────────────────────────────────

export function makePointTransaction(overrides: Partial<PointTransaction> = {}): PointTransaction {
  return {
    id: uid('tx'),
    type: 'earned',
    description: 'Purchase reward',
    points: 120,
    balance: 2840,
    date: '2025-05-08',
    ...overrides,
  }
}

export function makeFirstCitizenAccount(
  overrides: Partial<FirstCitizenAccount> = {},
): FirstCitizenAccount {
  return {
    memberId: 'FC-9000-1234-5678',
    tier: FCTier.SILVER_EDGE,
    pointsBalance: 2840,
    annualSpend: 38200,
    memberSince: '2021-06-01',
    expiryDate: '2026-06-30',
    transactions: [
      makePointTransaction({ id: 'tx1', date: '2025-05-08', description: 'Purchase #SSL20250508', points: 120, balance: 2840 }),
      makePointTransaction({ id: 'tx2', date: '2025-05-02', type: 'bonus',    description: 'Birthday Bonus',        points: 500, balance: 2720 }),
      makePointTransaction({ id: 'tx3', date: '2025-04-28', type: 'redeemed', description: 'Redeemed at checkout',  points: -200, balance: 2220 }),
      makePointTransaction({ id: 'tx4', date: '2025-04-15', description: 'Purchase #SSL20250415', points: 85,  balance: 2420 }),
      makePointTransaction({ id: 'tx5', date: '2025-02-28', type: 'expired',  description: 'Bonus points expired', points: -100, balance: 2335 }),
    ],
    linkedCards: ['card-0001'],
    ...overrides,
  }
}
