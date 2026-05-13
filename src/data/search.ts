export interface SearchBrand {
  name: string
  abbr: string
  color: string
  bg: string
  href: string
}

export interface CategoryShortcut {
  label: string
  breadcrumb: string[]
  href: string
}

// ─── Suggestion pool (sorted by popularity) ───────────────────────────────────
const SUGGESTION_POOL: string[] = [
  'kurti', 'kurti sets', 'floral kurti', 'printed kurti', 'anarkali kurti', 'cotton kurti',
  'kurta', 'kurta pajama', 'kurta sets for men',
  'saree', 'silk saree', 'georgette saree', 'cotton saree', 'printed saree', 'banarasi saree',
  'salwar suit', 'salwar kameez', 'palazzo suit', 'patiala suit',
  'lehenga', 'lehenga choli', 'bridal lehenga', 'indo western lehenga',
  'dresses', 'floral dresses', 'maxi dress', 'midi dress', 'wrap dress', 'bodycon dress',
  'watches', 'analog watches', 'digital watches', 'women watches', 'luxury watches',
  'perfume', 'perfume gift set', 'perfume for women', 'men perfume', 'eau de parfum',
  'handbag', 'tote bag', 'clutch bag', 'sling bag', 'leather bag',
  'jeans', 'skinny jeans', 'wide leg jeans', 'boyfriend jeans',
  'tops', 'crop top', 'tank top', 'shirt', 'casual shirts', 'formal shirts',
  'shoes', 'heels', 'block heels', 'flats', 'sneakers', 'loafers',
  'sunglasses', 'aviator sunglasses',
  'jewellery', 'earrings', 'necklace', 'bangles', 'bracelet',
  'winter wear', 'jacket', 'blazer', 'sweater', 'cardigan',
  'ethnic wear', 'indo western', 'festive wear', 'party wear',
]

export function getSuggestions(query: string): string[] {
  const lower = query.toLowerCase().trim()
  if (lower.length < 2) return []
  return SUGGESTION_POOL.filter((s) => s.includes(lower)).slice(0, 6)
}

// ─── Popular brands shown in dropdown ────────────────────────────────────────
export const POPULAR_BRANDS: SearchBrand[] = [
  { name: 'W',     abbr: 'W',  color: '#E63946', bg: '#FFF0F0', href: '/category/women' },
  { name: 'Biba',  abbr: 'Bi', color: '#C0001D', bg: '#FFF5F5', href: '/category/women' },
  { name: 'AND',   abbr: 'AN', color: '#1A1A2E', bg: '#F0F0F6', href: '/category/women' },
  { name: 'Mango', abbr: 'Mg', color: '#B8860B', bg: '#FFFBEE', href: '/category/women' },
]

// ─── Category shortcuts keyed by trigger word ─────────────────────────────────
const CATEGORY_MAP: Record<string, CategoryShortcut[]> = {
  kurti:   [{ label: 'Women › Ethnic Wear › Kurtis',   breadcrumb: ['Women', 'Ethnic Wear', 'Kurtis'],   href: '/category/women-ethnic-wear' }],
  saree:   [{ label: 'Women › Ethnic Wear › Sarees',   breadcrumb: ['Women', 'Ethnic Wear', 'Sarees'],   href: '/category/women-ethnic-wear' }],
  salwar:  [{ label: 'Women › Ethnic Wear › Suits',    breadcrumb: ['Women', 'Ethnic Wear', 'Suits'],    href: '/category/women-ethnic-wear' }],
  lehenga: [{ label: 'Women › Ethnic Wear › Lehengas', breadcrumb: ['Women', 'Ethnic Wear', 'Lehengas'], href: '/category/women-ethnic-wear' }],
  dress:   [{ label: 'Women › Western Wear › Dresses', breadcrumb: ['Women', 'Western Wear', 'Dresses'], href: '/category/women' }],
  watch:   [{ label: 'Accessories › Watches',          breadcrumb: ['Accessories', 'Watches'],           href: '/category/accessories' }],
  bag:     [{ label: 'Accessories › Bags',             breadcrumb: ['Accessories', 'Bags'],              href: '/category/accessories' }],
  perfume: [{ label: 'Beauty › Fragrance',             breadcrumb: ['Beauty', 'Fragrance'],              href: '/category/beauty' }],
  shoe:    [{ label: 'Footwear › Women',               breadcrumb: ['Footwear', 'Women'],                href: '/category/footwear' }],
  heel:    [{ label: 'Footwear › Heels',               breadcrumb: ['Footwear', 'Heels'],                href: '/category/footwear' }],
}

export function getCategoryShortcuts(query: string): CategoryShortcut[] {
  const lower = query.toLowerCase().trim()
  const key = Object.keys(CATEGORY_MAP).find((k) => lower.includes(k))
  return key ? CATEGORY_MAP[key] : []
}

// ─── Trending searches (shown in dropdown and no-results page) ────────────────
export const TRENDING_SEARCHES: string[] = [
  'Floral Dresses',
  'Perfume Gift Set',
  'Analog Watches',
  'Summer Kurtis',
  "Men's Casual Shirts",
]

// ─── Spell corrections — auto-correct on results page ────────────────────────
export const SPELL_CORRECTIONS: Record<string, string> = {
  kurtii:       'kurti',
  kurtti:       'kurti',
  'kurti ':     'kurti',
  shari:        'saree',
  saari:        'saree',
  'sharee':     'saree',
  dreses:       'dresses',
  dresse:       'dresses',
  perfum:       'perfume',
  'salwar sut': 'salwar suit',
  lehnga:       'lehenga',
  jeens:        'jeans',
  jewellry:     'jewellery',
}

// ─── "Did you mean" — near-miss alternatives ─────────────────────────────────
export const DID_YOU_MEAN: Record<string, string> = {
  kurta:  'kurti',
  kurtha: 'kurta',
  sari:   'saree',
  dress:  'dresses',
  purfume:'perfume',
}
