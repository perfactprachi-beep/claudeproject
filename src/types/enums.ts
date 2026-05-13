export enum FCTier {
  CLASSIC     = 'Classic',
  SILVER_EDGE = 'Silver Edge',
  PLATINUM    = 'Platinum',
  BLACK       = 'Black',
}

export enum OrderStatus {
  PENDING    = 'Pending',
  CONFIRMED  = 'Confirmed',
  PROCESSING = 'Processing',
  SHIPPED    = 'Shipped',
  DELIVERED  = 'Delivered',
  CANCELLED  = 'Cancelled',
  RETURNED   = 'Returned',
}

export enum PaymentMethod {
  UPI         = 'UPI',
  CARD        = 'Card',
  NET_BANKING = 'Net Banking',
  EMI         = 'EMI',
  COD         = 'Cash on Delivery',
  FC_POINTS   = 'First Citizen Points',
}

export enum ProductCategory {
  WOMEN       = 'Women',
  MEN         = 'Men',
  KIDS        = 'Kids',
  BEAUTY      = 'Beauty',
  HOME        = 'Home',
  ACCESSORIES = 'Accessories',
  FOOTWEAR    = 'Footwear',
}

export enum Gender {
  MALE             = 'Male',
  FEMALE           = 'Female',
  OTHER            = 'Other',
  PREFER_NOT_TO_SAY = 'Prefer not to say',
}
