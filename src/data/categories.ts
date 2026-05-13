import type { Category, HeroSlide, Article } from '@typedefs/product'

export const homeCategories: Category[] = [
  {
    id: 'women',
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&q=80&auto=format&fit=crop',
    link: '/category/women',
  },
  {
    id: 'men',
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&q=80&auto=format&fit=crop',
    link: '/category/men',
  },
  {
    id: 'beauty',
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&q=80&auto=format&fit=crop',
    link: '/category/beauty',
  },
  {
    id: 'fragrance',
    name: 'Fragrance',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=500&q=80&auto=format&fit=crop',
    link: '/category/fragrance',
  },
  {
    id: 'home',
    name: 'Home',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=500&q=80&auto=format&fit=crop',
    link: '/category/home',
  },
  {
    id: 'watches',
    name: 'Watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&q=80&auto=format&fit=crop',
    link: '/category/watches',
  },
]

export const heroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    headline: 'New Season. New You.',
    subHeadline: "Discover the Women's Summer–Spring Collection 2026",
    ctaLabel: 'Shop Now',
    ctaLink: '/category/women',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&q=80&auto=format&fit=crop',
    theme: 'dark',
  },
  {
    id: 'slide-2',
    headline: 'Beauty Redefined.',
    subHeadline: "SSBeauty — India's Curated Prestige Beauty Destination",
    ctaLabel: 'Explore Beauty',
    ctaLink: '/category/beauty',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&q=80&auto=format&fit=crop',
    theme: 'dark',
  },
  {
    id: 'slide-3',
    headline: 'Home Stories.',
    subHeadline: 'HomeStop — Curated Decor for Every Living Space',
    ctaLabel: 'Shop Home',
    ctaLink: '/category/home',
    image:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80&auto=format&fit=crop',
    theme: 'light',
  },
]

export const editorialArticles: Article[] = [
  {
    id: 'art-001',
    title: '5 Looks to Own This Monsoon',
    image:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=720&h=480&q=80&auto=format&fit=crop',
    link: '/style-hub/5-looks-monsoon',
    category: 'Style Guide',
    readTime: 4,
  },
  {
    id: 'art-002',
    title: 'Beauty Picks Under ₹999',
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=720&h=480&q=80&auto=format&fit=crop',
    link: '/style-hub/beauty-picks-under-999',
    category: 'Beauty',
    readTime: 3,
  },
]
