import type {
  AdminProduct, AdminOrder, ReturnRequest, Coupon, AdminCustomer,
  Banner, InventoryItem, StaffMember, AuditLog, FCMember
} from '../types/admin'

export const MOCK_ADMIN_PRODUCTS: AdminProduct[] = [
  { id: 'P001', name: 'Floral Anarkali Kurta', brand: 'Biba', sku: 'BIBA-ANA-001', category: 'Women', subcategory: 'Ethnic Wear', mrp: 3499, sellingPrice: 2799, stock: 45, status: 'active', thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&h=80&fit=crop', createdAt: '2024-01-15', tags: ['kurta', 'ethnic', 'floral'] },
  { id: 'P002', name: 'Slim Fit Chinos', brand: "Allen Solly", sku: 'AS-CHN-002', category: 'Men', subcategory: 'Trousers', mrp: 2499, sellingPrice: 1999, stock: 3, status: 'active', thumbnail: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=80&h=80&fit=crop', createdAt: '2024-01-20', tags: ['chinos', 'casual'] },
  { id: 'P003', name: 'Banarasi Silk Saree', brand: 'Fabindia', sku: 'FAB-SAR-003', category: 'Women', subcategory: 'Sarees', mrp: 8999, sellingPrice: 7199, stock: 0, status: 'out_of_stock', thumbnail: 'https://images.unsplash.com/photo-1617627143233-36b1e2e38dba?w=80&h=80&fit=crop', createdAt: '2024-02-01', tags: ['saree', 'silk', 'wedding'] },
  { id: 'P004', name: 'Classic Oxford Shirt', brand: 'Van Heusen', sku: 'VH-OXF-004', category: 'Men', subcategory: 'Shirts', mrp: 1999, sellingPrice: 1599, stock: 72, status: 'active', thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=80&h=80&fit=crop', createdAt: '2024-02-10', tags: ['shirt', 'formal'] },
  { id: 'P005', name: 'Embroidered Lehenga', brand: 'W', sku: 'W-LEH-005', category: 'Women', subcategory: 'Lehenga', mrp: 12999, sellingPrice: 9999, stock: 12, status: 'draft', thumbnail: 'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=80&h=80&fit=crop', createdAt: '2024-02-15', tags: ['lehenga', 'festive'] },
  { id: 'P006', name: 'Running Sneakers', brand: 'Nike', sku: 'NK-RUN-006', category: 'Footwear', subcategory: 'Sports', mrp: 5999, sellingPrice: 4799, stock: 28, status: 'active', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop', createdAt: '2024-03-01', tags: ['sneakers', 'running', 'sports'] },
  { id: 'P007', name: 'Moisturizing Face Cream', brand: 'Lakme', sku: 'LAK-FC-007', category: 'Beauty', subcategory: 'Skincare', mrp: 899, sellingPrice: 719, stock: 150, status: 'active', thumbnail: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=80&h=80&fit=crop', createdAt: '2024-03-05', tags: ['skincare', 'moisturizer'] },
  { id: 'P008', name: 'Formal Blazer', brand: 'Peter England', sku: 'PE-BLZ-008', category: 'Men', subcategory: 'Blazers', mrp: 6999, sellingPrice: 5599, stock: 8, status: 'active', thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=80&h=80&fit=crop', createdAt: '2024-03-10', tags: ['blazer', 'formal'] },
]

export const MOCK_ADMIN_ORDERS: AdminOrder[] = [
  { id: 'ORD-2024-001', customerId: 'C001', customerName: 'Priya Sharma', customerMobile: '9876543210', customerFCTier: 'Platinum', date: '2024-03-15 14:32', items: [{ productId: 'P001', productName: 'Floral Anarkali Kurta', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=60&h=60&fit=crop', size: 'M', colour: 'Pink', quantity: 1, price: 2799 }], amount: 2799, paymentMethod: 'UPI', status: 'delivered', trackingNumber: 'SHR123456', courier: 'Shiprocket', deliveryAddress: '12, MG Road, Bangalore 560001', transactionId: 'TXN9876' },
  { id: 'ORD-2024-002', customerId: 'C002', customerName: 'Rahul Verma', customerMobile: '9871234567', customerFCTier: 'Silver Edge', date: '2024-03-15 11:20', items: [{ productId: 'P004', productName: 'Classic Oxford Shirt', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=60&h=60&fit=crop', size: 'L', colour: 'White', quantity: 2, price: 1599 }], amount: 3198, paymentMethod: 'Card', status: 'shipped', trackingNumber: 'DEL789012', courier: 'Delhivery', deliveryAddress: '45, Connaught Place, Delhi 110001', transactionId: 'TXN5432' },
  { id: 'ORD-2024-003', customerId: 'C003', customerName: 'Anjali Patel', customerMobile: '9988776655', customerFCTier: 'Classic', date: '2024-03-15 09:45', items: [{ productId: 'P006', productName: 'Running Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop', size: '7', colour: 'Black', quantity: 1, price: 4799 }], amount: 4799, paymentMethod: 'COD', status: 'processing', deliveryAddress: '78, FC Road, Pune 411004', transactionId: 'TXN1234' },
  { id: 'ORD-2024-004', customerId: 'C004', customerName: 'Vikram Singh', customerMobile: '9765432109', customerFCTier: 'Black', date: '2024-03-14 18:55', items: [{ productId: 'P008', productName: 'Formal Blazer', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=60&h=60&fit=crop', size: '40', colour: 'Navy', quantity: 1, price: 5599 }], amount: 5599, paymentMethod: 'Card', status: 'pending', deliveryAddress: '23, Park Street, Kolkata 700016', transactionId: 'TXN8765' },
  { id: 'ORD-2024-005', customerId: 'C005', customerName: 'Meera Nair', customerMobile: '9654321098', customerFCTier: 'Platinum', date: '2024-03-14 15:30', items: [{ productId: 'P003', productName: 'Banarasi Silk Saree', image: 'https://images.unsplash.com/photo-1617627143233-36b1e2e38dba?w=60&h=60&fit=crop', size: 'Free', colour: 'Red', quantity: 1, price: 7199 }], amount: 7199, paymentMethod: 'UPI', status: 'cancelled', deliveryAddress: '56, Marine Drive, Mumbai 400002', transactionId: 'TXN3456' },
  { id: 'ORD-2024-006', customerId: 'C001', customerName: 'Priya Sharma', customerMobile: '9876543210', customerFCTier: 'Platinum', date: '2024-03-13 12:00', items: [{ productId: 'P007', productName: 'Moisturizing Face Cream', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=60&h=60&fit=crop', size: '50ml', colour: 'NA', quantity: 2, price: 719 }], amount: 1438, paymentMethod: 'Card', status: 'returned', deliveryAddress: '12, MG Road, Bangalore 560001', transactionId: 'TXN7890' },
]

export const MOCK_RETURNS: ReturnRequest[] = [
  { id: 'RET-001', orderId: 'ORD-2024-006', customerId: 'C001', customerName: 'Priya Sharma', product: 'Moisturizing Face Cream', reason: 'Product damaged on delivery', requestedDate: '2024-03-14', refundAmount: 1438, status: 'pending', photos: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop'], customerNote: 'The packaging was broken when I received it.' },
  { id: 'RET-002', orderId: 'ORD-2024-003', customerId: 'C003', customerName: 'Anjali Patel', product: 'Running Sneakers', reason: 'Wrong size delivered', requestedDate: '2024-03-13', refundAmount: 4799, status: 'approved', photos: [], customerNote: 'I ordered size 7 but received size 8.', refundMethod: 'original' },
  { id: 'RET-003', orderId: 'ORD-2024-002', customerId: 'C002', customerName: 'Rahul Verma', product: 'Classic Oxford Shirt', reason: 'Quality not as expected', requestedDate: '2024-03-12', refundAmount: 1599, status: 'rejected', photos: [], customerNote: 'The fabric feels very thin.' },
]

export const MOCK_COUPONS: Coupon[] = [
  { id: 'CPN-001', code: 'WELCOME20', type: 'percent', value: 20, minOrderValue: 1000, usageCount: 342, usageLimit: 1000, userLimit: 1, expiry: '2024-06-30', startDate: '2024-01-01', applicableTo: 'new_users', status: 'active' },
  { id: 'CPN-002', code: 'FC100', type: 'flat', value: 100, minOrderValue: 2000, usageCount: 1205, usageLimit: 5000, userLimit: 3, expiry: '2024-12-31', startDate: '2024-01-01', applicableTo: 'first_citizens', status: 'active' },
  { id: 'CPN-003', code: 'FREEDEL', type: 'free_delivery', value: 0, minOrderValue: 999, usageCount: 890, usageLimit: 2000, userLimit: 2, expiry: '2024-04-30', startDate: '2024-03-01', applicableTo: 'all', status: 'active' },
  { id: 'CPN-004', code: 'HOLI30', type: 'percent', value: 30, minOrderValue: 3000, usageCount: 2000, usageLimit: 2000, userLimit: 1, expiry: '2024-03-25', startDate: '2024-03-20', applicableTo: 'all', status: 'inactive', categories: ['Women', 'Men'] },
]

export const MOCK_CUSTOMERS: AdminCustomer[] = [
  { uid: 'C001', name: 'Priya Sharma', email: 'priya.sharma@gmail.com', mobile: '9876543210', joined: '2022-03-15', orders: 24, ltv: 58420, fcTier: 'Platinum', gender: 'Female', birthday: '1990-05-12', fcCardNumber: 'FC-PLT-001234', fcPoints: 4280, annualSpend: 28500, status: 'active' },
  { uid: 'C002', name: 'Rahul Verma', email: 'rahul.verma@yahoo.com', mobile: '9871234567', joined: '2023-01-20', orders: 8, ltv: 18900, fcTier: 'Silver Edge', gender: 'Male', birthday: '1985-11-30', fcCardNumber: 'FC-SLV-005678', fcPoints: 1520, annualSpend: 12400, status: 'active' },
  { uid: 'C003', name: 'Anjali Patel', email: 'anjali.patel@gmail.com', mobile: '9988776655', joined: '2023-06-10', orders: 3, ltv: 6200, fcTier: 'Classic', gender: 'Female', birthday: '1995-07-22', fcCardNumber: 'FC-CLS-009012', fcPoints: 310, annualSpend: 6200, status: 'active' },
  { uid: 'C004', name: 'Vikram Singh', email: 'vikram.singh@outlook.com', mobile: '9765432109', joined: '2020-08-01', orders: 67, ltv: 215000, fcTier: 'Black', gender: 'Male', birthday: '1978-02-14', fcCardNumber: 'FC-BLK-000156', fcPoints: 18700, annualSpend: 95000, status: 'active' },
  { uid: 'C005', name: 'Meera Nair', email: 'meera.nair@gmail.com', mobile: '9654321098', joined: '2023-09-05', orders: 12, ltv: 34500, fcTier: 'Platinum', gender: 'Female', birthday: '1992-12-08', fcCardNumber: 'FC-PLT-007890', fcPoints: 2890, annualSpend: 34500, status: 'active' },
  { uid: 'C006', name: 'Arjun Reddy', email: 'arjun.reddy@gmail.com', mobile: '9543210987', joined: '2024-01-15', orders: 1, ltv: 1299, fcTier: 'Classic', gender: 'Male', birthday: '2000-06-18', fcCardNumber: 'FC-CLS-011234', fcPoints: 65, annualSpend: 1299, status: 'blocked' },
]

export const MOCK_BANNERS: Banner[] = [
  { id: 'BAN-001', name: 'Summer Sale Hero', page: 'homepage', position: 'hero_carousel', desktopImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=200&fit=crop', mobileImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=250&fit=crop', headline: 'Summer Sale — Up to 50% Off', ctaLabel: 'Shop Now', ctaUrl: '/category/women', startDate: '2024-04-01', endDate: '2024-04-30', evergreen: false, priority: 1, status: 'scheduled' },
  { id: 'BAN-002', name: 'Free Delivery Bar', page: 'all', position: 'announcement_bar', desktopImage: '', mobileImage: '', headline: 'Free Delivery on orders above ₹999', ctaLabel: 'Shop Now', ctaUrl: '/', startDate: '2024-01-01', evergreen: true, priority: 1, status: 'active' },
  { id: 'BAN-003', name: 'FC Exclusive Popup', page: 'homepage', position: 'popup', desktopImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop', mobileImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=300&fit=crop', headline: 'Join First Citizen — Earn on Every Purchase', ctaLabel: 'Join Now', ctaUrl: '/first-citizen', startDate: '2024-02-01', endDate: '2024-03-31', evergreen: false, priority: 1, status: 'expired' },
]

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'INV-001', productId: 'P001', product: 'Floral Anarkali Kurta', sku: 'BIBA-ANA-001-M-PNK', size: 'M', colour: 'Pink', currentStock: 12, reorderLevel: 10, status: 'healthy', lastUpdated: '2024-03-15', category: 'Women', brand: 'Biba' },
  { id: 'INV-002', productId: 'P001', product: 'Floral Anarkali Kurta', sku: 'BIBA-ANA-001-L-PNK', size: 'L', colour: 'Pink', currentStock: 3, reorderLevel: 10, status: 'low', lastUpdated: '2024-03-14', category: 'Women', brand: 'Biba' },
  { id: 'INV-003', productId: 'P002', product: 'Slim Fit Chinos', sku: 'AS-CHN-002-32-KHK', size: '32', colour: 'Khaki', currentStock: 0, reorderLevel: 5, status: 'out_of_stock', lastUpdated: '2024-03-13', category: 'Men', brand: 'Allen Solly' },
  { id: 'INV-004', productId: 'P004', product: 'Classic Oxford Shirt', sku: 'VH-OXF-004-L-WHT', size: 'L', colour: 'White', currentStock: 25, reorderLevel: 10, status: 'healthy', lastUpdated: '2024-03-15', category: 'Men', brand: 'Van Heusen' },
  { id: 'INV-005', productId: 'P006', product: 'Running Sneakers', sku: 'NK-RUN-006-7-BLK', size: '7', colour: 'Black', currentStock: 4, reorderLevel: 8, status: 'low', lastUpdated: '2024-03-12', category: 'Footwear', brand: 'Nike' },
  { id: 'INV-006', productId: 'P008', product: 'Formal Blazer', sku: 'PE-BLZ-008-40-NVY', size: '40', colour: 'Navy', currentStock: 0, reorderLevel: 5, status: 'out_of_stock', lastUpdated: '2024-03-10', category: 'Men', brand: 'Peter England' },
  { id: 'INV-007', productId: 'P007', product: 'Moisturizing Face Cream', sku: 'LAK-FC-007-50ML', size: '50ml', colour: 'NA', currentStock: 150, reorderLevel: 20, status: 'healthy', lastUpdated: '2024-03-15', category: 'Beauty', brand: 'Lakme' },
]

export const MOCK_STAFF: StaffMember[] = [
  { id: 'S001', name: 'Prachi Danak', email: 'admin@shoppersstop.com', role: 'super_admin', lastActive: '2024-03-15 16:45', status: 'active', joinedDate: '2020-01-10' },
  { id: 'S002', name: 'Kavya Reddy', email: 'kavya.reddy@shoppersstop.com', role: 'catalogue_mgr', lastActive: '2024-03-15 14:20', status: 'active', joinedDate: '2021-06-15' },
  { id: 'S003', name: 'Suresh Kumar', email: 'suresh.kumar@shoppersstop.com', role: 'order_mgr', lastActive: '2024-03-15 15:55', status: 'active', joinedDate: '2022-03-01' },
  { id: 'S004', name: 'Deepa Thomas', email: 'deepa.thomas@shoppersstop.com', role: 'support_agent', lastActive: '2024-03-14 18:00', status: 'active', joinedDate: '2023-01-20' },
  { id: 'S005', name: 'Arun Sharma', email: 'arun.sharma@shoppersstop.com', role: 'support_agent', lastActive: '2024-02-28 12:00', status: 'suspended', joinedDate: '2022-09-10' },
]

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'LOG-001', timestamp: '2024-03-15 16:45:23', staffName: 'Prachi Danak', staffId: 'S001', action: 'Product Published', module: 'products', recordId: 'P004', details: 'Published Classic Oxford Shirt' },
  { id: 'LOG-002', timestamp: '2024-03-15 15:30:10', staffName: 'Suresh Kumar', staffId: 'S003', action: 'Order Status Updated', module: 'orders', recordId: 'ORD-2024-002', details: 'Status changed: Confirmed → Shipped' },
  { id: 'LOG-003', timestamp: '2024-03-15 14:20:05', staffName: 'Kavya Reddy', staffId: 'S002', action: 'Product Updated', module: 'products', recordId: 'P001', details: 'Updated stock for Floral Anarkali Kurta' },
  { id: 'LOG-004', timestamp: '2024-03-15 12:15:44', staffName: 'Deepa Thomas', staffId: 'S004', action: 'Return Approved', module: 'returns', recordId: 'RET-002', details: 'Approved return for Anjali Patel — ₹4,799 refund initiated' },
  { id: 'LOG-005', timestamp: '2024-03-15 10:00:12', staffName: 'Prachi Danak', staffId: 'S001', action: 'Coupon Created', module: 'coupons', recordId: 'CPN-004', details: 'Created HOLI30 — 30% off coupon' },
]

export const MOCK_FC_MEMBERS: FCMember[] = [
  { uid: 'C001', name: 'Priya Sharma', email: 'priya.sharma@gmail.com', mobile: '9876543210', tier: 'Platinum', cardNumber: 'FC-PLT-001234', pointsBalance: 4280, pointsIssuedMTD: 850, pointsRedeemedMTD: 200, annualSpend: 28500, joinedDate: '2022-03-15', expiryDate: '2025-03-15' },
  { uid: 'C004', name: 'Vikram Singh', email: 'vikram.singh@outlook.com', mobile: '9765432109', tier: 'Black', cardNumber: 'FC-BLK-000156', pointsBalance: 18700, pointsIssuedMTD: 3800, pointsRedeemedMTD: 1000, annualSpend: 95000, joinedDate: '2020-08-01', expiryDate: '2025-08-01' },
  { uid: 'C005', name: 'Meera Nair', email: 'meera.nair@gmail.com', mobile: '9654321098', tier: 'Platinum', cardNumber: 'FC-PLT-007890', pointsBalance: 2890, pointsIssuedMTD: 690, pointsRedeemedMTD: 0, annualSpend: 34500, joinedDate: '2023-09-05', expiryDate: '2025-09-05' },
  { uid: 'C002', name: 'Rahul Verma', email: 'rahul.verma@yahoo.com', mobile: '9871234567', tier: 'Silver Edge', cardNumber: 'FC-SLV-005678', pointsBalance: 1520, pointsIssuedMTD: 248, pointsRedeemedMTD: 100, annualSpend: 12400, joinedDate: '2023-01-20', expiryDate: '2025-01-20' },
  { uid: 'C003', name: 'Anjali Patel', email: 'anjali.patel@gmail.com', mobile: '9988776655', tier: 'Classic', cardNumber: 'FC-CLS-009012', pointsBalance: 310, pointsIssuedMTD: 62, pointsRedeemedMTD: 0, annualSpend: 6200, joinedDate: '2023-06-10', expiryDate: '2025-06-10' },
]

export const REVENUE_DATA = Array.from({ length: 14 }, (_, i) => {
  const date = new Date('2024-03-15')
  date.setDate(date.getDate() - (13 - i))
  return {
    date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    revenue: Math.floor(80000 + Math.random() * 120000),
    orders: Math.floor(40 + Math.random() * 80),
  }
})

export const ORDER_STATUS_DATA = [
  { name: 'Delivered', value: 420, color: '#16a34a' },
  { name: 'Processing', value: 85, color: '#2563eb' },
  { name: 'Pending', value: 34, color: '#d97706' },
  { name: 'Cancelled', value: 28, color: '#dc2626' },
]

export const TIER_DISTRIBUTION = [
  { name: 'Classic', value: 4520, color: '#6b7280' },
  { name: 'Silver Edge', value: 2180, color: '#9ca3af' },
  { name: 'Platinum', value: 980, color: '#7c3aed' },
  { name: 'Black', value: 320, color: '#111827' },
]
