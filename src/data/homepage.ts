import type { Product } from '@typedefs/product'

// ---------- PROMO BANNERS (3-col grid below hero) ----------

export interface PromoBanner {
  id: string
  title: string
  subtitle: string
  offerText: string
  ctaLabel: string
  ctaLink: string
  image: string
  bgFrom: string
  bgTo: string
  dark: boolean
}

export const promoBanners: PromoBanner[] = [
  {
    id: 'pb-1',
    title: 'House of\nShoppers Stop',
    subtitle: 'Best of Indian Fashion',
    offerText: 'Up to 70% OFF',
    ctaLabel: 'Shop Now',
    ctaLink: '/brands/house-of-shoppers-stop',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=420&q=80&auto=format&fit=crop',
    bgFrom: '#C0001D',
    bgTo: '#7A0012',
    dark: true,
  },
  {
    id: 'pb-2',
    title: 'Clinique',
    subtitle: 'Skincare That Actually Works',
    offerText: 'Up to 50% OFF',
    ctaLabel: 'Explore',
    ctaLink: '/brands/clinique',
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=420&q=80&auto=format&fit=crop',
    bgFrom: '#F7F3EE',
    bgTo: '#EDE8E2',
    dark: false,
  },
  {
    id: 'pb-3',
    title: 'EDGE by Titan',
    subtitle: "World's Slimmest Watches",
    offerText: 'New Collection',
    ctaLabel: 'Discover',
    ctaLink: '/brands/titan-edge',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=420&q=80&auto=format&fit=crop',
    bgFrom: '#D4AF37',
    bgTo: '#B8962E',
    dark: true,
  },
]

// ---------- DEAL PRODUCTS ----------

export const dealProducts: Product[] = [
  {
    id: 'deal-001',
    brand: 'BOSS',
    name: 'Gentleman Chronograph Watch',
    mrp: 32000,
    sellingPrice: 19999,
    discountPercent: 38,
    image:
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400&h=533&q=80&auto=format&fit=crop',
    category: 'watches',
    slug: 'boss-gentleman-chronograph-watch',
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: 'deal-002',
    brand: 'Titan',
    name: 'Raga Diamond Edition Watch',
    mrp: 15000,
    sellingPrice: 8999,
    discountPercent: 40,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=533&q=80&auto=format&fit=crop',
    category: 'watches',
    slug: 'titan-raga-diamond-edition',
    rating: 4.4,
    reviewCount: 234,
    isBestseller: true,
  },
  {
    id: 'deal-003',
    brand: 'Estee Lauder',
    name: 'Advanced Night Repair Serum',
    mrp: 9800,
    sellingPrice: 6860,
    discountPercent: 30,
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=533&q=80&auto=format&fit=crop',
    category: 'beauty',
    slug: 'estee-lauder-advanced-night-repair',
    rating: 4.7,
    reviewCount: 512,
    isBestseller: true,
  },
  {
    id: 'deal-004',
    brand: 'Biba',
    name: 'Embroidered Anarkali Kurta',
    mrp: 4299,
    sellingPrice: 2149,
    discountPercent: 50,
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=533&q=80&auto=format&fit=crop',
    category: 'women',
    slug: 'biba-embroidered-anarkali-kurta',
    rating: 4.3,
    reviewCount: 178,
    isNew: true,
  },
  {
    id: 'deal-005',
    brand: 'Jack & Jones',
    name: 'Slim Fit Stretch Jeans',
    mrp: 3499,
    sellingPrice: 1749,
    discountPercent: 50,
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=533&q=80&auto=format&fit=crop',
    category: 'men',
    slug: 'jack-jones-slim-fit-stretch-jeans',
    rating: 4.4,
    reviewCount: 320,
    isBestseller: true,
  },
  {
    id: 'deal-006',
    brand: 'Hidesign',
    name: 'Full-Grain Leather Tote',
    mrp: 6999,
    sellingPrice: 4199,
    discountPercent: 40,
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=533&q=80&auto=format&fit=crop',
    category: 'bags',
    slug: 'hidesign-full-grain-leather-tote',
    rating: 4.5,
    reviewCount: 145,
  },
]

// ---------- LUXURY BRANDS ----------

export interface LuxuryBrand {
  id: string
  name: string
  tagline: string
  link: string
}

export const luxuryBrands: LuxuryBrand[] = [
  { id: 'boss',    name: 'BOSS',         tagline: 'Premium Menswear',    link: '/brands/hugo-boss' },
  { id: 'dg',      name: 'D&G',          tagline: 'Italian Luxury',       link: '/brands/dolce-gabbana' },
  { id: 'burberry',name: 'Burberry',     tagline: 'British Heritage',     link: '/brands/burberry' },
  { id: 'versace', name: 'Versace',      tagline: 'Bold Italian Fashion', link: '/brands/versace' },
  { id: 'mk',      name: 'M. Kors',      tagline: 'Modern Luxury',        link: '/brands/michael-kors' },
  { id: 'armani',  name: 'Armani',       tagline: 'Timeless Elegance',    link: '/brands/armani' },
]

// ---------- HOME PRODUCTS ----------

export const homeProducts: Product[] = [
  {
    id: 'home-001',
    brand: 'HomeStop',
    name: '400TC Cotton Bedsheet Set',
    mrp: 3999,
    sellingPrice: 1999,
    discountPercent: 50,
    image:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&q=80&auto=format&fit=crop',
    category: 'home',
    slug: 'homestop-400tc-cotton-bedsheet',
    rating: 4.2,
    reviewCount: 234,
    isNew: true,
  },
  {
    id: 'home-002',
    brand: 'HomeStop',
    name: 'Hand-painted Ceramic Planter',
    mrp: 1499,
    sellingPrice: 899,
    discountPercent: 40,
    image:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&q=80&auto=format&fit=crop',
    category: 'home',
    slug: 'homestop-ceramic-planter-handpainted',
    rating: 4.4,
    reviewCount: 89,
  },
  {
    id: 'home-003',
    brand: 'HomeStop',
    name: 'Luxury Soy Wax Candle Set',
    mrp: 1299,
    sellingPrice: 849,
    discountPercent: 35,
    image:
      'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400&h=400&q=80&auto=format&fit=crop',
    category: 'home',
    slug: 'homestop-soy-wax-candle-set',
    rating: 4.6,
    reviewCount: 156,
    isBestseller: true,
  },
  {
    id: 'home-004',
    brand: 'HomeStop',
    name: 'Handwoven Cotton Throw Blanket',
    mrp: 2499,
    sellingPrice: 1499,
    discountPercent: 40,
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&q=80&auto=format&fit=crop',
    category: 'home',
    slug: 'homestop-handwoven-cotton-throw',
    rating: 4.3,
    reviewCount: 78,
    isNew: true,
  },
]
