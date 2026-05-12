import type { Product } from '@typedefs/product'

export const trendingProducts: Product[] = [
  {
    id: 'prod-001',
    brand: 'W',
    name: 'Floral Wrap Midi Dress',
    mrp: 3499,
    sellingPrice: 1999,
    discountPercent: 43,
    image:
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=480&h=640&q=80&auto=format&fit=crop',
    category: 'women',
    slug: 'w-floral-wrap-midi-dress',
    rating: 4.3,
    reviewCount: 128,
    isNew: true,
  },
  {
    id: 'prod-002',
    brand: 'Zodiac',
    name: 'Slim Fit Formal Shirt',
    mrp: 2299,
    sellingPrice: 1499,
    discountPercent: 35,
    image:
      'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=480&h=640&q=80&auto=format&fit=crop',
    category: 'men',
    slug: 'zodiac-slim-fit-formal-shirt',
    rating: 4.5,
    reviewCount: 256,
    isBestseller: true,
  },
  {
    id: 'prod-003',
    brand: 'MAC',
    name: 'Ruby Woo Retro Matte Lipstick',
    mrp: 1850,
    sellingPrice: 1665,
    discountPercent: 10,
    image:
      'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=480&h=640&q=80&auto=format&fit=crop',
    category: 'beauty',
    slug: 'mac-ruby-woo-retro-matte-lipstick',
    rating: 4.8,
    reviewCount: 512,
    isBestseller: true,
  },
  {
    id: 'prod-004',
    brand: 'Caprese',
    name: 'Structured Leather Tote Bag',
    mrp: 5999,
    sellingPrice: 3599,
    discountPercent: 40,
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=480&h=640&q=80&auto=format&fit=crop',
    category: 'bags',
    slug: 'caprese-structured-leather-tote-bag',
    rating: 4.4,
    reviewCount: 89,
    isNew: true,
  },
]
