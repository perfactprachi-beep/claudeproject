// ─── Lightweight product card (used by PLP / carousels) ──────────────────────

export interface Product {
  id: string
  brand: string
  name: string
  mrp: number
  sellingPrice: number
  discountPercent: number
  image: string
  hoverImage?: string
  category: string
  slug: string
  rating?: number
  reviewCount?: number
  isNew?: boolean
  isBestseller?: boolean
}

// ─── Full product detail model ────────────────────────────────────────────────

/** Nested price breakdown for a product */
export interface Price {
  mrp: number
  selling: number
  discount: number
  discountPercent: number
}

/** Size option with availability */
export interface Size {
  label: string
  available: boolean
  stockCount?: number
}

/** Colour swatch option */
export interface Colour {
  name: string
  hex: string
  /** Index into FullProduct.images for a colour-specific hero shot */
  imageIndex?: number
}

/** Customer-submitted product review */
export interface Review {
  id: string
  userId: string
  userName: string
  rating: 1 | 2 | 3 | 4 | 5
  title?: string
  body: string
  images?: string[]
  helpful: number
  verified: boolean
  createdAt: string
}

/** Aggregated rating info */
export interface RatingInfo {
  average: number
  count: number
  distribution: Record<1 | 2 | 3 | 4 | 5, number>
}

/** Delivery time and charges */
export interface DeliveryInfo {
  freeAbove: number
  standardCharge: number
  estimatedDays: string
  expressAvailable: boolean
}

/** Return policy for a product */
export interface ReturnPolicy {
  returnable: boolean
  returnWindowDays: number
  conditions?: string
}

/**
 * Complete product detail model with all fields required for a PDP.
 * Lightweight listing variant: {@link Product}
 */
export interface FullProduct {
  id: string
  sku: string
  name: string
  brand: string
  category: string
  subCategory: string
  images: string[]
  thumbnails: string[]
  price: Price
  sizes: Size[]
  colours: Colour[]
  description: string
  material: string
  careInstructions: string
  countryOfOrigin: string
  ratings: RatingInfo
  reviews: Review[]
  tags: string[]
  inStock: boolean
  /** Key format: `${sizeLabel}_${colourName}` */
  stockBySizeColour: Record<string, number>
  fcPointsEarnable: number
  deliveryInfo: DeliveryInfo
  returnPolicy: ReturnPolicy
  relatedProducts: string[]
  completeLookProducts: string[]
}

export interface HeroSlide {
  id: string
  headline: string
  subHeadline: string
  ctaLabel: string
  ctaLink: string
  image: string
  theme: 'light' | 'dark'
}

export interface Category {
  id: string
  name: string
  image: string
  link: string
}

export interface Brand {
  id: string
  name: string
  link: string
}

export interface Article {
  id: string
  title: string
  image: string
  link: string
  category: string
  readTime: number
}

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size'

export type SubCategory = 'saree' | 'kurti' | 'suit'

export type SortOption =
  | 'relevance'
  | 'new_arrivals'
  | 'price_low'
  | 'price_high'
  | 'bestsellers'
  | 'biggest_discount'

export interface PLPProduct extends Product {
  subCategory: SubCategory
  sizes: ProductSize[]
  availableSizes: ProductSize[]
  inStock: boolean
  colourHex: string
  colourName: string
  images: [string, string]
}

export interface FilterState {
  brands: string[]
  priceRange: [number, number]
  sizes: ProductSize[]
  colours: string[]
  minDiscount: number | null
  inStockOnly: boolean
}
