export type AdminRole = 'super_admin' | 'catalogue_mgr' | 'order_mgr' | 'support_agent'
export type Permission = 'full' | 'view' | 'none'

export interface AdminUser {
  uid: string
  name: string
  email: string
  role: AdminRole
  avatar?: string
  lastActive: string
  status: 'active' | 'suspended'
}

export interface RBACMatrix {
  [module: string]: Record<AdminRole, Permission>
}

export const RBAC: RBACMatrix = {
  dashboard:    { super_admin: 'view',  catalogue_mgr: 'view',  order_mgr: 'view',  support_agent: 'view' },
  products:     { super_admin: 'full',  catalogue_mgr: 'full',  order_mgr: 'view',  support_agent: 'view' },
  categories:   { super_admin: 'full',  catalogue_mgr: 'full',  order_mgr: 'none',  support_agent: 'none' },
  inventory:    { super_admin: 'full',  catalogue_mgr: 'full',  order_mgr: 'view',  support_agent: 'none' },
  brands:       { super_admin: 'full',  catalogue_mgr: 'full',  order_mgr: 'none',  support_agent: 'none' },
  orders:       { super_admin: 'full',  catalogue_mgr: 'view',  order_mgr: 'full',  support_agent: 'full' },
  returns:      { super_admin: 'full',  catalogue_mgr: 'none',  order_mgr: 'full',  support_agent: 'full' },
  coupons:      { super_admin: 'full',  catalogue_mgr: 'full',  order_mgr: 'view',  support_agent: 'view' },
  customers:    { super_admin: 'full',  catalogue_mgr: 'view',  order_mgr: 'view',  support_agent: 'full' },
  loyalty:      { super_admin: 'full',  catalogue_mgr: 'view',  order_mgr: 'view',  support_agent: 'full' },
  banners:      { super_admin: 'full',  catalogue_mgr: 'full',  order_mgr: 'none',  support_agent: 'none' },
  search:       { super_admin: 'full',  catalogue_mgr: 'full',  order_mgr: 'none',  support_agent: 'none' },
  analytics:    { super_admin: 'full',  catalogue_mgr: 'view',  order_mgr: 'view',  support_agent: 'none' },
  staff:        { super_admin: 'full',  catalogue_mgr: 'none',  order_mgr: 'none',  support_agent: 'none' },
  settings:     { super_admin: 'full',  catalogue_mgr: 'none',  order_mgr: 'none',  support_agent: 'none' },
}

export function canAccess(role: AdminRole, module: string): boolean {
  return RBAC[module]?.[role] !== 'none'
}

export function canEdit(role: AdminRole, module: string): boolean {
  return RBAC[module]?.[role] === 'full'
}

export interface AdminProduct {
  id: string
  name: string
  brand: string
  sku: string
  category: string
  subcategory: string
  mrp: number
  sellingPrice: number
  stock: number
  status: 'active' | 'draft' | 'out_of_stock'
  thumbnail: string
  createdAt: string
  tags: string[]
}

export interface AdminOrder {
  id: string
  customerId: string
  customerName: string
  customerMobile: string
  customerFCTier: string
  date: string
  items: AdminOrderItem[]
  amount: number
  paymentMethod: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  trackingNumber?: string
  courier?: string
  deliveryAddress: string
  transactionId: string
  internalNote?: string
}

export interface AdminOrderItem {
  productId: string
  productName: string
  image: string
  size: string
  colour: string
  quantity: number
  price: number
}

export interface ReturnRequest {
  id: string
  orderId: string
  customerId: string
  customerName: string
  product: string
  reason: string
  requestedDate: string
  refundAmount: number
  status: 'pending' | 'approved' | 'rejected'
  photos: string[]
  customerNote: string
  refundMethod?: 'original' | 'store_credit' | 'fc_points'
}

export interface Coupon {
  id: string
  code: string
  type: 'percent' | 'flat' | 'free_delivery' | 'buy_x_get_y'
  value: number
  minOrderValue: number
  usageCount: number
  usageLimit: number
  userLimit: number
  expiry: string
  startDate: string
  applicableTo: 'all' | 'first_citizens' | 'new_users'
  status: 'active' | 'inactive'
  categories?: string[]
  brands?: string[]
}

export interface AdminCustomer {
  uid: string
  name: string
  email: string
  mobile: string
  joined: string
  orders: number
  ltv: number
  fcTier: string
  gender: string
  birthday: string
  fcCardNumber: string
  fcPoints: number
  annualSpend: number
  status: 'active' | 'blocked'
}

export interface Banner {
  id: string
  name: string
  page: 'homepage' | 'plp' | 'pdp' | 'cart' | 'all'
  position: 'hero_carousel' | 'announcement_bar' | 'section_banner' | 'popup'
  desktopImage: string
  mobileImage: string
  headline?: string
  ctaLabel?: string
  ctaUrl?: string
  startDate: string
  endDate?: string
  evergreen: boolean
  priority: number
  status: 'active' | 'scheduled' | 'expired'
}

export interface InventoryItem {
  id: string
  productId: string
  product: string
  sku: string
  size: string
  colour: string
  currentStock: number
  reorderLevel: number
  status: 'out_of_stock' | 'low' | 'healthy'
  lastUpdated: string
  category: string
  brand: string
}

export interface StaffMember {
  id: string
  name: string
  email: string
  role: AdminRole
  lastActive: string
  status: 'active' | 'suspended'
  joinedDate: string
}

export interface AuditLog {
  id: string
  timestamp: string
  staffName: string
  staffId: string
  action: string
  module: string
  recordId: string
  details: string
}

export interface FCMember {
  uid: string
  name: string
  email: string
  mobile: string
  tier: string
  cardNumber: string
  pointsBalance: number
  pointsIssuedMTD: number
  pointsRedeemedMTD: number
  annualSpend: number
  joinedDate: string
  expiryDate: string
}
