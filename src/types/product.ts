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
