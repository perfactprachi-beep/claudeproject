import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ── IMAGE URL SETS ────────────────────────────────────────────────────────────
const IMG = {
  we: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=750&fit=crop', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=750&fit=crop'],
  ww: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=750&fit=crop', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop'],
  mf: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=750&fit=crop', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=750&fit=crop'],
  mc: ['https://images.unsplash.com/photo-1555069519-127aadecd574?w=600&h=750&fit=crop', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop'],
  b:  ['https://images.unsplash.com/photo-1631214524020-3c69cc5cd3e8?w=600&h=750&fit=crop', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop'],
  f:  ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=750&fit=crop', 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=750&fit=crop'],
  h:  ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=750&fit=crop', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=750&fit=crop'],
  wa: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=750&fit=crop', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=750&fit=crop'],
}

// ── VARIANT HELPERS ───────────────────────────────────────────────────────────
type V = { size: string; colour: string; colourHex?: string; stockQuantity: number; skuVariant: string; isActive: boolean }

/** clothing variants: sizes × colours, stocks[] maps to each size index */
function cv(sku: string, sizes: string[], colours: { c: string; h?: string }[], stocks: number[]): V[] {
  return colours.flatMap(({ c, h }) =>
    sizes.map((size, i) => ({
      size, colour: c, colourHex: h,
      stockQuantity: stocks[i] ?? 5,
      skuVariant: `${sku}-${c.replace(/\W/g, '').slice(0, 4).toUpperCase()}-${size.replace(/\W/g, '').toUpperCase()}`,
      isActive: true,
    }))
  )
}

/** simple variants: explicit size + colour + stock per entry */
function sv(sku: string, items: { size: string; colour: string; h?: string; stock: number }[]): V[] {
  return items.map(({ size, colour, h, stock }, i) => ({
    size, colour, colourHex: h, stockQuantity: stock,
    skuVariant: `${sku}-VAR${i + 1}`,
    isActive: true,
  }))
}

// Stock arrays: [XS/28, S/30, M/32, L/34, XL/36, XXL/38]
const DEF  = [8,  20, 25, 20, 12,  7]  // default healthy stock
const LOW  = [1,   2,  2,  1,  0,  0]  // low stock  (total = 6 < 10)
const ZERO = [0,   0,  0,  0,  0,  0]  // out of stock

// ── PRODUCT DEFINITIONS ───────────────────────────────────────────────────────
type P = {
  sku: string; name: string; slug: string; brandSlug: string; categorySlug: string
  description: string; material?: string; careInstructions?: string; countryOfOrigin: string
  mrp: number; sellingPrice: number; fcPointsEarnable: number
  imgs: string[]; variants: V[]
}

const PRODUCTS: P[] = [
  // ─── WOMEN (1–15) ───────────────────────────────────────────────────────────
  {
    sku: 'SSL-W-001', name: 'Floral Wrap Kurta', slug: 'biba-floral-wrap-kurta-001',
    brandSlug: 'biba', categorySlug: 'women',
    description: 'A graceful floral wrap kurta crafted from lightweight rayon fabric. Perfect for casual outings and festive gatherings.',
    material: 'Rayon', careInstructions: 'Hand wash cold, do not wring', countryOfOrigin: 'India',
    mrp: 3499, sellingPrice: 1799, fcPointsEarnable: 180, imgs: IMG.we,
    variants: cv('SSL-W-001', ['XS','S','M','L','XL','XXL'], [{c:'Pink',h:'#FFB6C1'},{c:'Blue',h:'#6CB4E4'},{c:'Yellow',h:'#FFD700'}], DEF),
  },
  {
    sku: 'SSL-W-002', name: 'Banarasi Silk Saree', slug: 'w-banarasi-silk-saree-002',
    brandSlug: 'w', categorySlug: 'women',
    description: 'Luxurious Banarasi silk saree with intricate zari work and a rich pallu. A timeless piece for weddings and special occasions.',
    material: 'Silk', careInstructions: 'Dry clean only', countryOfOrigin: 'India',
    mrp: 8999, sellingPrice: 4999, fcPointsEarnable: 500, imgs: IMG.we,
    variants: sv('SSL-W-002', [{size:'Free',colour:'Red',h:'#B22222',stock:15},{size:'Free',colour:'Green',h:'#228B22',stock:10},{size:'Free',colour:'Purple',h:'#800080',stock:12}]),
  },
  {
    sku: 'SSL-W-003', name: 'Embroidered Salwar Suit', slug: 'and-embroidered-salwar-suit-003',
    brandSlug: 'and', categorySlug: 'women',
    description: 'Beautifully embroidered salwar suit in breathable cotton fabric. Comes with matching dupatta and palazzo pants.',
    material: 'Cotton', careInstructions: 'Hand wash separately', countryOfOrigin: 'India',
    mrp: 4999, sellingPrice: 2499, fcPointsEarnable: 250, imgs: IMG.we,
    variants: cv('SSL-W-003', ['XS','S','M','L','XL'], [{c:'Teal',h:'#008080'},{c:'Coral',h:'#FF6B6B'}], DEF.slice(0,5)),
  },
  {
    sku: 'SSL-W-004', name: 'Cotton Anarkali Dress', slug: 'mango-cotton-anarkali-dress-004',
    brandSlug: 'mango', categorySlug: 'women',
    description: 'Flowy cotton anarkali dress with mirror embellishments and elasticated waist. Pairs beautifully with kolhapuri sandals.',
    material: '100% Cotton', careInstructions: 'Machine wash cold', countryOfOrigin: 'India',
    mrp: 2499, sellingPrice: 1299, fcPointsEarnable: 130, imgs: IMG.we,
    variants: cv('SSL-W-004', ['S','M','L','XL','XXL'], [{c:'Orange',h:'#FF8C00'},{c:'Navy',h:'#001F5B'}], DEF.slice(1)),
  },
  {
    sku: 'SSL-W-005', name: 'Printed Palazzo Set', slug: 'w-printed-palazzo-set-005',
    brandSlug: 'w', categorySlug: 'women',
    description: 'Vibrant printed palazzo set with matching kurta top in breathable georgette. The flowy silhouette ensures all-day comfort.',
    material: 'Georgette', careInstructions: 'Hand wash cold', countryOfOrigin: 'India',
    mrp: 2799, sellingPrice: 1499, fcPointsEarnable: 150, imgs: IMG.we,
    variants: cv('SSL-W-005', ['S','M','L','XL'], [{c:'Mustard',h:'#E8B84B'},{c:'Black',h:'#000000'}], [18,25,22,14]),
  },
  {
    sku: 'SSL-W-006', name: 'Chanderi Silk Dupatta', slug: 'biba-chanderi-silk-dupatta-006',
    brandSlug: 'biba', categorySlug: 'women',
    description: 'Delicate Chanderi silk dupatta with gold and silver zari border. A versatile accessory to elevate any ethnic outfit.',
    material: 'Chanderi Silk', careInstructions: 'Dry clean only', countryOfOrigin: 'India',
    mrp: 1799, sellingPrice: 899, fcPointsEarnable: 90, imgs: IMG.we,
    variants: sv('SSL-W-006', [  // LOW STOCK — total 3
      {size:'Free',colour:'Gold',h:'#FFD700',stock:2},{size:'Free',colour:'Silver',h:'#C0C0C0',stock:1},
    ]),
  },
  {
    sku: 'SSL-W-007', name: 'Western Flared Dress', slug: 'mango-western-flared-dress-007',
    brandSlug: 'mango', categorySlug: 'women',
    description: 'Chic western flared dress in premium polyester blend with sweetheart neckline. Ideal for parties, brunches and evening events.',
    material: 'Polyester Blend', careInstructions: 'Machine wash gentle cycle', countryOfOrigin: 'Bangladesh',
    mrp: 4999, sellingPrice: 2999, fcPointsEarnable: 300, imgs: IMG.ww,
    variants: cv('SSL-W-007', ['XS','S','M','L'], [{c:'White',h:'#FFFFFF'},{c:'Red',h:'#DC143C'},{c:'Black',h:'#000000'}], [8,20,20,15]),
  },
  {
    sku: 'SSL-W-008', name: 'Linen Blazer', slug: 'and-linen-blazer-008',
    brandSlug: 'and', categorySlug: 'women',
    description: 'Structured linen blazer with notched lapels and two-button closure. Effortlessly transitions from office to evening.',
    material: 'Linen', careInstructions: 'Dry clean recommended', countryOfOrigin: 'India',
    mrp: 5999, sellingPrice: 3499, fcPointsEarnable: 350, imgs: IMG.ww,
    variants: cv('SSL-W-008', ['S','M','L','XL'], [{c:'Beige',h:'#F5F5DC'},{c:'Sage',h:'#B2AC88'}], [15,22,20,12]),
  },
  {
    sku: 'SSL-W-009', name: 'Block Print Kurti', slug: 'w-block-print-kurti-009',
    brandSlug: 'w', categorySlug: 'women',
    description: 'Handcrafted block print kurti featuring traditional Rajasthani motifs. Made from soft cotton for everyday comfort.',
    material: '100% Cotton', careInstructions: 'Hand wash cold, dry in shade', countryOfOrigin: 'India',
    mrp: 1999, sellingPrice: 999, fcPointsEarnable: 100, imgs: IMG.we,
    variants: cv('SSL-W-009', ['S','M','L','XL','XXL'], [{c:'Indigo',h:'#3F51B5'},{c:'Terracotta',h:'#C06030'}], DEF.slice(1)),
  },
  {
    sku: 'SSL-W-010', name: 'Georgette Lehenga Set', slug: 'biba-georgette-lehenga-set-010',
    brandSlug: 'biba', categorySlug: 'women',
    description: 'Stunning georgette lehenga set with heavy embroidery and sequin work. Complete with blouse and dupatta for a complete festive look.',
    material: 'Georgette', careInstructions: 'Dry clean only', countryOfOrigin: 'India',
    mrp: 12999, sellingPrice: 6999, fcPointsEarnable: 700, imgs: IMG.we,
    variants: cv('SSL-W-010', ['S','M','L','XL'], [{c:'Pink',h:'#FFB6C1'},{c:'Maroon',h:'#800000'}], [12,18,15,10]),
  },
  {
    sku: 'SSL-W-011', name: 'Straight Fit Jeans', slug: 'mango-straight-fit-jeans-011',
    brandSlug: 'mango', categorySlug: 'women',
    description: 'Classic straight fit jeans in premium stretch denim with five-pocket styling. A wardrobe essential for every woman.',
    material: '98% Cotton, 2% Elastane', careInstructions: 'Machine wash cold, tumble dry low', countryOfOrigin: 'Bangladesh',
    mrp: 3999, sellingPrice: 2499, fcPointsEarnable: 250, imgs: IMG.ww,
    variants: cv('SSL-W-011', ['26','28','30','32','34'], [{c:'Dark Wash',h:'#00008B'},{c:'Light Wash',h:'#6495ED'}], [8,15,20,15,10]),
  },
  {
    sku: 'SSL-W-012', name: 'Striped Co-ord Set', slug: 'and-striped-coord-set-012',
    brandSlug: 'and', categorySlug: 'women',
    description: 'Trendy striped co-ord set featuring a crop top and wide-leg pants. The navy and white stripes give a nautical-chic vibe.',
    material: 'Viscose Blend', careInstructions: 'Hand wash cold', countryOfOrigin: 'India',
    mrp: 3199, sellingPrice: 1799, fcPointsEarnable: 180, imgs: IMG.ww,
    variants: cv('SSL-W-012', ['XS','S','M','L','XL'], [{c:'Blue+White',h:'#4169E1'}], DEF.slice(0,5)),
  },
  {
    sku: 'SSL-W-013', name: 'Velvet Party Gown', slug: 'w-velvet-party-gown-013',
    brandSlug: 'w', categorySlug: 'women',
    description: 'Opulent velvet party gown with off-shoulder neckline and floor-length silhouette. Makes a statement at every celebration.',
    material: 'Velvet', careInstructions: 'Dry clean only', countryOfOrigin: 'India',
    mrp: 14999, sellingPrice: 7999, fcPointsEarnable: 800, imgs: IMG.ww,
    variants: cv('SSL-W-013', ['S','M','L'], [{c:'Emerald',h:'#50C878'},{c:'Burgundy',h:'#800020'}], [10,18,15]),
  },
  {
    sku: 'SSL-W-014', name: 'Crop Top + Skirt Set', slug: 'mango-crop-top-skirt-set-014',
    brandSlug: 'mango', categorySlug: 'women',
    description: 'Playful lavender crop top and mini skirt set in soft jersey fabric. Perfect for summer outings and casual weekends.',
    material: 'Cotton Jersey', careInstructions: 'Machine wash cold', countryOfOrigin: 'Bangladesh',
    mrp: 2199, sellingPrice: 1199, fcPointsEarnable: 120, imgs: IMG.ww,
    variants: cv('SSL-W-014', ['XS','S','M','L'], [{c:'Lavender',h:'#E6E6FA'}], ZERO.slice(0,4)), // OUT OF STOCK
  },
  {
    sku: 'SSL-W-015', name: 'Printed Maxi Dress', slug: 'biba-printed-maxi-dress-015',
    brandSlug: 'biba', categorySlug: 'women',
    description: 'Breezy printed maxi dress with V-neckline and adjustable tie-back. The vibrant floral print is inspired by Indian garden motifs.',
    material: 'Rayon', careInstructions: 'Hand wash cold, dry in shade', countryOfOrigin: 'India',
    mrp: 2999, sellingPrice: 1599, fcPointsEarnable: 160, imgs: IMG.ww,
    variants: cv('SSL-W-015', ['S','M','L','XL','XXL'], [{c:'Floral Print',h:'#FF6B6B'}], DEF.slice(1)),
  },

  // ─── MEN (16–27) ────────────────────────────────────────────────────────────
  {
    sku: 'SSL-M-001', name: 'Slim Fit Chinos', slug: 'zodiac-slim-fit-chinos-016',
    brandSlug: 'zodiac', categorySlug: 'men',
    description: 'Tailored slim fit chinos in premium stretch cotton twill. A smart-casual essential that works from office to weekend.',
    material: '97% Cotton, 3% Elastane', careInstructions: 'Machine wash warm, iron when damp', countryOfOrigin: 'India',
    mrp: 3999, sellingPrice: 2199, fcPointsEarnable: 220, imgs: IMG.mf,
    variants: cv('SSL-M-001', ['28','30','32','34','36','38'], [{c:'Khaki',h:'#C3B091'},{c:'Navy',h:'#001F5B'},{c:'Olive',h:'#556B2F'}], DEF),
  },
  {
    sku: 'SSL-M-002', name: 'Oxford Button-Down Shirt', slug: 'and-oxford-button-down-shirt-017',
    brandSlug: 'and', categorySlug: 'men',
    description: 'Crisp Oxford button-down shirt in wrinkle-resistant cotton blend. A versatile piece that pairs with chinos and formal trousers alike.',
    material: '60% Cotton, 40% Polyester', careInstructions: 'Machine wash warm, tumble dry low', countryOfOrigin: 'India',
    mrp: 2999, sellingPrice: 1599, fcPointsEarnable: 160, imgs: IMG.mf,
    variants: cv('SSL-M-002', ['S','M','L','XL'], [{c:'White',h:'#FFFFFF'},{c:'Blue',h:'#6CB4E4'},{c:'Striped',h:'#87CEEB'}], [18,25,22,15]),
  },
  {
    sku: 'SSL-M-003', name: 'Classic Polo T-Shirt', slug: 'jack-and-jones-classic-polo-tshirt-018',
    brandSlug: 'jack-and-jones', categorySlug: 'men',
    description: 'Timeless polo t-shirt in premium piqué cotton with signature logo embroidery. Available in versatile solid colours.',
    material: '100% Cotton Piqué', careInstructions: 'Machine wash 30°C, do not bleach', countryOfOrigin: 'Bangladesh',
    mrp: 1799, sellingPrice: 999, fcPointsEarnable: 100, imgs: IMG.mc,
    variants: cv('SSL-M-003', ['S','M','L','XL','XXL'], [{c:'Navy',h:'#001F5B'},{c:'White',h:'#FFFFFF'},{c:'Black',h:'#000000'}], DEF.slice(1)),
  },
  {
    sku: 'SSL-M-004', name: 'Formal Blazer', slug: 'zodiac-formal-blazer-019',
    brandSlug: 'zodiac', categorySlug: 'men',
    description: 'Premium formal blazer in Italian-inspired wool blend with slim fit construction. Ideal for business meetings and formal events.',
    material: 'Wool Blend', careInstructions: 'Dry clean only', countryOfOrigin: 'India',
    mrp: 9999, sellingPrice: 5999, fcPointsEarnable: 600, imgs: IMG.mf,
    variants: cv('SSL-M-004', ['38','40','42','44','46'], [{c:'Charcoal',h:'#36454F'},{c:'Navy',h:'#001F5B'}], [8,15,18,12,8]),
  },
  {
    sku: 'SSL-M-005', name: 'Cargo Jogger Pants', slug: 'jack-and-jones-cargo-jogger-pants-020',
    brandSlug: 'jack-and-jones', categorySlug: 'men',
    description: 'Utility-inspired cargo jogger pants with six pockets and elasticated waistband. Street-style comfort meets everyday function.',
    material: '100% Cotton', careInstructions: 'Machine wash cold', countryOfOrigin: 'Bangladesh',
    mrp: 2999, sellingPrice: 1799, fcPointsEarnable: 180, imgs: IMG.mc,
    variants: cv('SSL-M-005', ['S','M','L','XL'], [{c:'Olive',h:'#556B2F'},{c:'Grey',h:'#808080'},{c:'Black',h:'#000000'}], [15,22,20,12]),
  },
  {
    sku: 'SSL-M-006', name: 'Linen Kurta', slug: 'and-linen-kurta-021',
    brandSlug: 'and', categorySlug: 'men',
    description: 'Relaxed fit linen kurta with Mandarin collar and side pockets. Breathable and effortlessly stylish for warm weather.',
    material: '100% Linen', careInstructions: 'Hand wash cold, dry flat', countryOfOrigin: 'India',
    mrp: 2499, sellingPrice: 1299, fcPointsEarnable: 130, imgs: IMG.mf,
    variants: cv('SSL-M-006', ['S','M','L','XL','XXL'], [{c:'White',h:'#FFFFFF'},{c:'Sky Blue',h:'#87CEEB'}], DEF.slice(1)),
  },
  {
    sku: 'SSL-M-007', name: 'Slim Fit Formal Trousers', slug: 'zodiac-slim-fit-formal-trousers-022',
    brandSlug: 'zodiac', categorySlug: 'men',
    description: 'Precision-tailored slim fit formal trousers with flat front and quarter-top pockets. A wardrobe cornerstone for the modern professional.',
    material: 'Poly-Viscose', careInstructions: 'Dry clean recommended, iron on medium', countryOfOrigin: 'India',
    mrp: 3999, sellingPrice: 2499, fcPointsEarnable: 250, imgs: IMG.mf,
    variants: cv('SSL-M-007', ['28','30','32','34','36','38'], [{c:'Black',h:'#000000'},{c:'Charcoal',h:'#36454F'},{c:'Grey',h:'#808080'}], DEF),
  },
  {
    sku: 'SSL-M-008', name: 'Graphic Print T-Shirt', slug: 'jack-and-jones-graphic-print-tshirt-023',
    brandSlug: 'jack-and-jones', categorySlug: 'men',
    description: 'Bold graphic print t-shirt in soft combed cotton jersey. Features exclusive Jack & Jones artwork on the chest.',
    material: '100% Combed Cotton', careInstructions: 'Machine wash 30°C, wash inside out', countryOfOrigin: 'Bangladesh',
    mrp: 1499, sellingPrice: 799, fcPointsEarnable: 80, imgs: IMG.mc,
    variants: cv('SSL-M-008', ['S','M','L','XL'], [{c:'White',h:'#FFFFFF'},{c:'Black',h:'#000000'}], [18,25,20,14]),
  },
  {
    sku: 'SSL-M-009', name: 'Denim Jacket', slug: 'jack-and-jones-denim-jacket-024',
    brandSlug: 'jack-and-jones', categorySlug: 'men',
    description: 'Classic washed denim jacket with button-through front and chest pockets. A timeless layering piece for any wardrobe.',
    material: '100% Cotton Denim', careInstructions: 'Machine wash cold, tumble dry low', countryOfOrigin: 'Bangladesh',
    mrp: 5999, sellingPrice: 3499, fcPointsEarnable: 350, imgs: IMG.mc,
    variants: cv('SSL-M-009', ['S','M','L','XL'], [{c:'Dark Wash',h:'#00008B'}], [10,18,15,10]),
  },
  {
    sku: 'SSL-M-010', name: 'Nehru Collar Bandhgala', slug: 'and-nehru-collar-bandhgala-025',
    brandSlug: 'and', categorySlug: 'men',
    description: 'Regal Nehru collar bandhgala in premium brocade fabric with intricate self-texture. Perfect for weddings, receptions and festive events.',
    material: 'Brocade', careInstructions: 'Dry clean only', countryOfOrigin: 'India',
    mrp: 7999, sellingPrice: 4999, fcPointsEarnable: 500, imgs: IMG.mf,
    variants: cv('SSL-M-010', ['38','40','42','44','46'], [{c:'Ivory',h:'#FFFFF0'},{c:'Black',h:'#000000'}], [8,12,15,10,7]),
  },
  {
    sku: 'SSL-M-011', name: 'Chequered Casual Shirt', slug: 'zodiac-chequered-casual-shirt-026',
    brandSlug: 'zodiac', categorySlug: 'men',
    description: 'Classic chequered casual shirt in soft cotton blend with button-down collar. Versatile enough for office and weekend wear.',
    material: '55% Cotton, 45% Polyester', careInstructions: 'Machine wash warm', countryOfOrigin: 'India',
    mrp: 2799, sellingPrice: 1499, fcPointsEarnable: 150, imgs: IMG.mc,
    variants: cv('SSL-M-011', ['S','M','L','XL','XXL'], [{c:'Red/Black',h:'#B22222'},{c:'Blue/Grey',h:'#4169E1'}], DEF.slice(1)),
  },
  {
    sku: 'SSL-M-012', name: 'Merino Wool Crewneck', slug: 'jack-and-jones-merino-wool-crewneck-027',
    brandSlug: 'jack-and-jones', categorySlug: 'men',
    description: 'Luxuriously soft merino wool crewneck sweater with ribbed cuffs and hem. An investment piece that only gets better with wear.',
    material: '100% Merino Wool', careInstructions: 'Hand wash cold, dry flat', countryOfOrigin: 'Bangladesh',
    mrp: 4999, sellingPrice: 2999, fcPointsEarnable: 300, imgs: IMG.mf,
    variants: cv('SSL-M-012', ['S','M','L','XL'], [{c:'Camel',h:'#C19A6B'},{c:'Navy',h:'#001F5B'}], [10,18,15,12]),
  },

  // ─── BEAUTY (28–37) ─────────────────────────────────────────────────────────
  {
    sku: 'SSL-B-001', name: 'Matte Lip Studio', slug: 'mac-matte-lip-studio-028',
    brandSlug: 'mac', categorySlug: 'beauty',
    description: 'Iconic MAC matte lipstick with rich, pigmented formula and long-lasting wear. A cult classic loved by makeup artists worldwide.',
    countryOfOrigin: 'USA', mrp: 1600, sellingPrice: 999, fcPointsEarnable: 100, imgs: IMG.b,
    variants: sv('SSL-B-001', [{size:'ONE SIZE',colour:'Ruby Woo',h:'#9B111E',stock:45},{size:'ONE SIZE',colour:'Velvet Teddy',h:'#C4734E',stock:38}]),
  },
  {
    sku: 'SSL-B-002', name: 'Studio Fix Foundation', slug: 'mac-studio-fix-foundation-029',
    brandSlug: 'mac', categorySlug: 'beauty',
    description: 'Full-coverage liquid foundation with 24-hour matte finish and SPF 15 protection. Available in 40+ shades for all skin tones.',
    countryOfOrigin: 'USA', mrp: 3800, sellingPrice: 2499, fcPointsEarnable: 250, imgs: IMG.b,
    variants: sv('SSL-B-002', [{size:'ONE SIZE',colour:'NC15',h:'#F5CBA7',stock:25},{size:'ONE SIZE',colour:'NC25',h:'#E8B88A',stock:30},{size:'ONE SIZE',colour:'NC35',h:'#D4A574',stock:28},{size:'ONE SIZE',colour:'NC42',h:'#C4874A',stock:20}]),
  },
  {
    sku: 'SSL-B-003', name: 'Advanced Night Repair Serum', slug: 'estee-lauder-advanced-night-repair-serum-030',
    brandSlug: 'estee-lauder', categorySlug: 'beauty',
    description: 'Estée Lauder\'s iconic serum with patented ChronoluxCB Technology. Visibly reduces the look of multiple signs of aging overnight.',
    countryOfOrigin: 'USA', mrp: 9500, sellingPrice: 6999, fcPointsEarnable: 700, imgs: IMG.b,
    variants: sv('SSL-B-003', [{size:'50ml',colour:'Clear',h:'#F0E6D3',stock:20}]),
  },
  {
    sku: 'SSL-B-004', name: 'Double Wear Foundation', slug: 'estee-lauder-double-wear-foundation-031',
    brandSlug: 'estee-lauder', categorySlug: 'beauty',
    description: '24-hour wear foundation that stays fresh through heat and humidity with a naturally matte finish. Suitable for all skin types.',
    countryOfOrigin: 'USA', mrp: 4800, sellingPrice: 3499, fcPointsEarnable: 350, imgs: IMG.b,
    variants: sv('SSL-B-004', [{size:'ONE SIZE',colour:'Ecru',h:'#F5F0E8',stock:22},{size:'ONE SIZE',colour:'Ivory',h:'#FFFFF0',stock:18},{size:'ONE SIZE',colour:'Sand',h:'#C2B280',stock:25}]),
  },
  {
    sku: 'SSL-B-005', name: 'Kajal Intensifier', slug: 'smashbox-kajal-intensifier-032',
    brandSlug: 'smashbox', categorySlug: 'beauty',
    description: 'Intensely pigmented kajal pencil for bold, smoky eyes that last all day. Smudge-proof formula with built-in sharpener.',
    countryOfOrigin: 'USA', mrp: 999, sellingPrice: 599, fcPointsEarnable: 60, imgs: IMG.b,
    variants: sv('SSL-B-005', [{size:'ONE SIZE',colour:'Black',h:'#000000',stock:55},{size:'ONE SIZE',colour:'Brown',h:'#8B4513',stock:35}]),
  },
  {
    sku: 'SSL-B-006', name: 'Photo Finish Primer', slug: 'smashbox-photo-finish-primer-033',
    brandSlug: 'smashbox', categorySlug: 'beauty',
    description: 'Hollywood-born makeup primer that blurs pores and fine lines for a flawless photo-ready base. Extends makeup wear up to 12 hours.',
    countryOfOrigin: 'USA', mrp: 4500, sellingPrice: 2999, fcPointsEarnable: 300, imgs: IMG.b,
    variants: sv('SSL-B-006', [{size:'30ml',colour:'Clear',h:'#FAFAFA',stock:30}]),
  },
  {
    sku: 'SSL-B-007', name: 'Moisturizing Sunscreen SPF50', slug: 'estee-lauder-moisturizing-sunscreen-spf50-034',
    brandSlug: 'estee-lauder', categorySlug: 'beauty',
    description: 'Lightweight mineral sunscreen providing broad-spectrum SPF 50 protection while deeply hydrating the skin. Non-greasy formula for daily use.',
    countryOfOrigin: 'USA', mrp: 2800, sellingPrice: 1999, fcPointsEarnable: 200, imgs: IMG.b,
    variants: sv('SSL-B-007', [{size:'75ml',colour:'Clear',h:'#FAFAFA',stock:40}]),
  },
  {
    sku: 'SSL-B-008', name: 'Retinol Eye Cream', slug: 'estee-lauder-retinol-eye-cream-035',
    brandSlug: 'estee-lauder', categorySlug: 'beauty',
    description: 'Powerful retinol-infused eye cream that targets dark circles, puffiness and fine lines. Gentle enough for the delicate eye area.',
    countryOfOrigin: 'USA', mrp: 6500, sellingPrice: 4999, fcPointsEarnable: 500, imgs: IMG.b,
    variants: sv('SSL-B-008', [{size:'15ml',colour:'Cream',h:'#FFF8DC',stock:18}]),
  },
  {
    sku: 'SSL-B-009', name: 'Kohl Eye Pencil', slug: 'mac-kohl-eye-pencil-036',
    brandSlug: 'mac', categorySlug: 'beauty',
    description: 'Creamy kohl eye pencil that glides on smoothly for intense definition. Retractable formula that requires no sharpener.',
    countryOfOrigin: 'USA', mrp: 1100, sellingPrice: 699, fcPointsEarnable: 70, imgs: IMG.b,
    variants: sv('SSL-B-009', [{size:'ONE SIZE',colour:'Black',h:'#000000',stock:50},{size:'ONE SIZE',colour:'Navy',h:'#001F5B',stock:30},{size:'ONE SIZE',colour:'Bronze',h:'#CD7F32',stock:25}]),
  },
  {
    sku: 'SSL-B-010', name: 'Lipglass Clear Gloss', slug: 'mac-lipglass-clear-gloss-037',
    brandSlug: 'mac', categorySlug: 'beauty',
    description: 'MAC\'s iconic Lipglass delivers intense, high-shine gloss with a non-sticky feel. Enriched with vitamin E for moisturized lips.',
    countryOfOrigin: 'USA', mrp: 1800, sellingPrice: 1299, fcPointsEarnable: 130, imgs: IMG.b,
    variants: sv('SSL-B-010', [{size:'ONE SIZE',colour:'Clear',h:'#FAFAFA',stock:40},{size:'ONE SIZE',colour:'Pink',h:'#FFB6C1',stock:35},{size:'ONE SIZE',colour:'Nude',h:'#E8C4A0',stock:28}]),
  },

  // ─── FRAGRANCE (38–42) ──────────────────────────────────────────────────────
  {
    sku: 'SSL-F-001', name: 'Beautiful Magnolia EDP', slug: 'estee-lauder-beautiful-magnolia-edp-038',
    brandSlug: 'estee-lauder', categorySlug: 'fragrance',
    description: 'A lush floral fragrance centered on magnolia with notes of rose, raspberry and sandalwood. An ode to natural beauty and optimism.',
    countryOfOrigin: 'USA', mrp: 10500, sellingPrice: 7999, fcPointsEarnable: 800, imgs: IMG.f,
    variants: sv('SSL-F-001', [{size:'100ml',colour:'EDP',h:'#F4C2C2',stock:22}]),
  },
  {
    sku: 'SSL-F-002', name: 'Pleasures EDP', slug: 'estee-lauder-pleasures-edp-039',
    brandSlug: 'estee-lauder', categorySlug: 'fragrance',
    description: 'A fresh, radiant floral fragrance with top notes of white flowers, green peony and transparent woods. Light yet lingering.',
    countryOfOrigin: 'USA', mrp: 7200, sellingPrice: 5499, fcPointsEarnable: 550, imgs: IMG.f,
    variants: sv('SSL-F-002', [{size:'50ml',colour:'EDP',h:'#E8D5C4',stock:18}]),
  },
  {
    sku: 'SSL-F-003', name: 'Irresistible EDP', slug: 'mango-irresistible-edp-040',
    brandSlug: 'mango', categorySlug: 'fragrance',
    description: 'A captivating floral fragrance with notes of rose, peony and musk. Modern and irresistibly feminine.',
    countryOfOrigin: 'Spain', mrp: 6500, sellingPrice: 4999, fcPointsEarnable: 500, imgs: IMG.f,
    variants: sv('SSL-F-003', [{size:'80ml',colour:'EDP',h:'#FADADD',stock:15}]),
  },
  {
    sku: 'SSL-F-004', name: 'Youth Dew Parfum', slug: 'estee-lauder-youth-dew-parfum-041',
    brandSlug: 'estee-lauder', categorySlug: 'fragrance',
    description: 'Estée Lauder\'s legendary Youth Dew — a rich, spicy oriental fragrance that defined a generation. Deep, sensual and timeless.',
    countryOfOrigin: 'USA', mrp: 8000, sellingPrice: 6499, fcPointsEarnable: 650, imgs: IMG.f,
    variants: sv('SSL-F-004', [{size:'67ml',colour:'Parfum',h:'#C8A97E',stock:2}]), // LOW STOCK
  },
  {
    sku: 'SSL-F-005', name: 'Him EDT', slug: 'zodiac-him-edt-042',
    brandSlug: 'zodiac', categorySlug: 'fragrance',
    description: 'A sophisticated men\'s fragrance with fresh bergamot top notes, cedarwood heart and amber base. Clean, confident and masculine.',
    countryOfOrigin: 'India', mrp: 3800, sellingPrice: 2499, fcPointsEarnable: 250, imgs: IMG.f,
    variants: sv('SSL-F-005', [{size:'100ml',colour:'EDT',h:'#B0C4DE',stock:4}]), // LOW STOCK
  },

  // ─── HOME (43–47) ───────────────────────────────────────────────────────────
  {
    sku: 'SSL-H-001', name: 'Cotton Percale Bedsheet Set', slug: 'caprese-cotton-percale-bedsheet-set-043',
    brandSlug: 'caprese', categorySlug: 'home',
    description: 'Premium 300 thread count cotton percale bedsheet set with two pillow covers. Soft, breathable and gets better with every wash.',
    material: '100% Cotton', careInstructions: 'Machine wash cold, tumble dry low', countryOfOrigin: 'India',
    mrp: 3499, sellingPrice: 1999, fcPointsEarnable: 200, imgs: IMG.h,
    variants: sv('SSL-H-001', [{size:'Queen',colour:'White',h:'#FFFFFF',stock:25},{size:'Queen',colour:'Ivory',h:'#FFFFF0',stock:20},{size:'Queen',colour:'Blue',h:'#6CB4E4',stock:18}]),
  },
  {
    sku: 'SSL-H-002', name: 'Bamboo Hand Towel Set 4pc', slug: 'caprese-bamboo-hand-towel-set-044',
    brandSlug: 'caprese', categorySlug: 'home',
    description: 'Ultra-soft bamboo hand towel set with quick-dry technology. Antibacterial and hypoallergenic — perfect for sensitive skin.',
    material: '70% Bamboo, 30% Cotton', careInstructions: 'Machine wash warm, tumble dry low', countryOfOrigin: 'India',
    mrp: 1799, sellingPrice: 999, fcPointsEarnable: 100, imgs: IMG.h,
    variants: sv('SSL-H-002', [{size:'Set of 4',colour:'Coral',h:'#FF6B6B',stock:30},{size:'Set of 4',colour:'Sage',h:'#B2AC88',stock:25},{size:'Set of 4',colour:'White',h:'#FFFFFF',stock:35}]),
  },
  {
    sku: 'SSL-H-003', name: 'Ceramic Dinner Set 18pc', slug: 'caprese-ceramic-dinner-set-045',
    brandSlug: 'caprese', categorySlug: 'home',
    description: 'Elegant 18-piece ceramic dinner set including 6 dinner plates, 6 side plates and 6 bowls. Microwave and dishwasher safe.',
    material: 'Ceramic', careInstructions: 'Dishwasher safe, avoid sudden temperature changes', countryOfOrigin: 'India',
    mrp: 5999, sellingPrice: 3499, fcPointsEarnable: 350, imgs: IMG.h,
    variants: sv('SSL-H-003', [{size:'18 Piece',colour:'White',h:'#FFFFFF',stock:15},{size:'18 Piece',colour:'Floral',h:'#FFB6C1',stock:12}]),
  },
  {
    sku: 'SSL-H-004', name: 'Scented Soy Candle', slug: 'caprese-scented-soy-candle-046',
    brandSlug: 'caprese', categorySlug: 'home',
    description: 'Hand-poured natural soy wax candle with cotton wick and premium fragrance oils. Burns for up to 45 hours with minimal soot.',
    material: 'Soy Wax', careInstructions: 'Never leave unattended while burning, keep away from drafts', countryOfOrigin: 'India',
    mrp: 1200, sellingPrice: 699, fcPointsEarnable: 70, imgs: IMG.h,
    variants: sv('SSL-H-004', [{size:'200g',colour:'Lavender',h:'#E6E6FA',stock:40},{size:'200g',colour:'Sandalwood',h:'#DEB887',stock:35}]),
  },
  {
    sku: 'SSL-H-005', name: 'Geometric Cushion Cover Set', slug: 'caprese-geometric-cushion-cover-set-047',
    brandSlug: 'caprese', categorySlug: 'home',
    description: 'Set of 3 geometric print cushion covers in boho-chic design with zipper closure. Adds colour and texture to any living space.',
    material: 'Cotton Canvas', careInstructions: 'Machine wash cold, dry in shade', countryOfOrigin: 'India',
    mrp: 1499, sellingPrice: 799, fcPointsEarnable: 80, imgs: IMG.h,
    variants: sv('SSL-H-005', [ // OUT OF STOCK
      {size:'Set of 3',colour:'Teal',h:'#008080',stock:0},{size:'Set of 3',colour:'Mustard',h:'#E8B84B',stock:0},{size:'Set of 3',colour:'Grey',h:'#808080',stock:0},
    ]),
  },

  // ─── WATCHES (48–50) ────────────────────────────────────────────────────────
  {
    sku: 'SSL-WA-001', name: 'Classic Leather Strap Watch', slug: 'zodiac-classic-leather-strap-watch-048',
    brandSlug: 'zodiac', categorySlug: 'watches',
    description: 'Timeless analog watch with Japanese quartz movement, mineral crystal glass and genuine leather strap. Water resistant to 30m.',
    material: 'Stainless Steel Case, Genuine Leather Strap', careInstructions: 'Avoid prolonged water exposure, wipe with dry cloth', countryOfOrigin: 'India',
    mrp: 7499, sellingPrice: 4999, fcPointsEarnable: 500, imgs: IMG.wa,
    variants: sv('SSL-WA-001', [{size:'ONE SIZE',colour:'Black',h:'#000000',stock:20},{size:'ONE SIZE',colour:'Brown',h:'#8B4513',stock:18}]),
  },
  {
    sku: 'SSL-WA-002', name: 'Stainless Chronograph', slug: 'zodiac-stainless-chronograph-049',
    brandSlug: 'zodiac', categorySlug: 'watches',
    description: 'Precision quartz chronograph with tachymeter bezel, luminous hands and stainless steel bracelet. Water resistant to 50m.',
    material: 'Stainless Steel', careInstructions: 'Rinse with fresh water after saltwater exposure', countryOfOrigin: 'India',
    mrp: 5499, sellingPrice: 3499, fcPointsEarnable: 350, imgs: IMG.wa,
    variants: sv('SSL-WA-002', [{size:'ONE SIZE',colour:'Silver',h:'#C0C0C0',stock:15},{size:'ONE SIZE',colour:'Gold',h:'#FFD700',stock:12}]),
  },
  {
    sku: 'SSL-WA-003', name: 'Ladies Pearl Dial Watch', slug: 'zodiac-ladies-pearl-dial-watch-050',
    brandSlug: 'zodiac', categorySlug: 'watches',
    description: 'Elegant ladies watch with genuine mother-of-pearl dial, diamond-cut bezel and premium mesh bracelet. Comes in a signature gift box.',
    material: 'Stainless Steel, Mother-of-Pearl Dial', careInstructions: 'Avoid water exposure, store in the provided case', countryOfOrigin: 'India',
    mrp: 8999, sellingPrice: 5999, fcPointsEarnable: 600, imgs: IMG.wa,
    variants: sv('SSL-WA-003', [{size:'ONE SIZE',colour:'Rose Gold',h:'#B76E79',stock:12},{size:'ONE SIZE',colour:'Silver',h:'#C0C0C0',stock:10}]),
  },
]

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Seeding Shoppers Stop database...\n')

  // ── 1. USERS ──────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shoppersstop.com' }, update: {},
    create: { firebaseUid: 'dev-super-admin-uid', email: 'admin@shoppersstop.com', name: 'Super Admin', mobile: '+919999900000', role: 'ADMIN', adminRole: 'SUPER_ADMIN', isActive: true },
  })
  await prisma.user.upsert({
    where: { email: 'catalogue@shoppersstop.com' }, update: {},
    create: { firebaseUid: 'dev-catalogue-mgr-uid', email: 'catalogue@shoppersstop.com', name: 'Kavya Reddy', mobile: '+919999900001', role: 'ADMIN', adminRole: 'CATALOGUE_MGR', isActive: true },
  })
  await prisma.user.upsert({
    where: { email: 'orders@shoppersstop.com' }, update: {},
    create: { firebaseUid: 'dev-order-mgr-uid', email: 'orders@shoppersstop.com', name: 'Suresh Kumar', mobile: '+919999900002', role: 'ADMIN', adminRole: 'ORDER_MGR', isActive: true },
  })
  await prisma.user.upsert({
    where: { email: 'support@shoppersstop.com' }, update: {},
    create: { firebaseUid: 'dev-support-uid', email: 'support@shoppersstop.com', name: 'Deepa Thomas', mobile: '+919999900003', role: 'ADMIN', adminRole: 'SUPPORT', isActive: true },
  })
  console.log('✅ Admin + 3 staff users ready')

  // ── 2. CATEGORIES ─────────────────────────────────────────────────────────
  const categoryData = [
    { name: 'Women', slug: 'women', sortOrder: 1 }, { name: 'Men', slug: 'men', sortOrder: 2 },
    { name: 'Beauty', slug: 'beauty', sortOrder: 3 }, { name: 'Fragrance', slug: 'fragrance', sortOrder: 4 },
    { name: 'Home', slug: 'home', sortOrder: 5 }, { name: 'Watches', slug: 'watches', sortOrder: 6 },
  ]
  const cats: Record<string, string> = {}
  for (const c of categoryData) {
    const cat = await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: { ...c, isActive: true } })
    cats[c.slug] = cat.id
  }
  console.log('✅ 6 categories ready')

  // ── 3. BRANDS ─────────────────────────────────────────────────────────────
  const brandData = [
    { name: 'Biba', slug: 'biba', isFeatured: true, sortOrder: 1 },
    { name: 'W', slug: 'w', isFeatured: true, sortOrder: 2 },
    { name: 'AND', slug: 'and', isFeatured: true, sortOrder: 3 },
    { name: 'Zodiac', slug: 'zodiac', isFeatured: false, sortOrder: 4 },
    { name: 'Mango', slug: 'mango', isFeatured: true, sortOrder: 5 },
    { name: 'MAC', slug: 'mac', isFeatured: true, sortOrder: 6 },
    { name: 'Estée Lauder', slug: 'estee-lauder', isFeatured: true, sortOrder: 7 },
    { name: 'Jack & Jones', slug: 'jack-and-jones', isFeatured: false, sortOrder: 8 },
    { name: 'Caprese', slug: 'caprese', isFeatured: false, sortOrder: 9 },
    { name: 'Smashbox', slug: 'smashbox', isFeatured: false, sortOrder: 10 },
  ]
  const brands: Record<string, string> = {}
  for (const b of brandData) {
    const brand = await prisma.brand.upsert({ where: { slug: b.slug }, update: {}, create: { ...b, isActive: true } })
    brands[b.slug] = brand.id
  }
  console.log('✅ 10 brands ready')

  // ── 4. COUPONS ────────────────────────────────────────────────────────────
  const upsertCoupon = (data: Record<string, unknown>) =>
    (prisma.coupon.upsert as (a: unknown) => Promise<unknown>)({ where: { code: data['code'] }, update: data, create: data })

  await upsertCoupon({ code: 'FC10', type: 'PERCENT', value: 10, minOrderValue: 500, maxDiscount: 300, usageLimitPerUser: 1, applicableTo: 'FC_MEMBERS', startsAt: new Date('2025-01-01'), expiresAt: new Date('2025-12-31'), isActive: true })
  await upsertCoupon({ code: 'SALE20', type: 'PERCENT', value: 20, minOrderValue: 2000, maxDiscount: 1000, usageLimit: 5000, usageLimitPerUser: 1, applicableTo: 'ALL', startsAt: new Date('2025-01-01'), expiresAt: new Date('2025-06-30'), isActive: true })
  await upsertCoupon({ code: 'WELCOME150', type: 'FLAT', value: 150, minOrderValue: 999, usageLimitPerUser: 1, applicableTo: 'NEW_USERS', startsAt: new Date('2025-01-01'), expiresAt: new Date('2026-03-31'), isActive: true })
  console.log('✅ 3 coupons ready (FC10 / SALE20 / WELCOME150)')

  // ── 5. FC TIER RULES ──────────────────────────────────────────────────────
  const tiers = [
    { tier: 'CLASSIC' as const, minSpend: 0, pointsRate: 1.0 },
    { tier: 'SILVER_EDGE' as const, minSpend: 25000, pointsRate: 2.0 },
    { tier: 'PLATINUM' as const, minSpend: 100000, pointsRate: 3.0 },
    { tier: 'BLACK' as const, minSpend: 200000, pointsRate: 5.0 },
  ]
  for (const t of tiers) {
    await prisma.fcTierRule.upsert({ where: { tier: t.tier }, update: t, create: t })
  }
  console.log('✅ FC tier rules: Classic / Silver Edge / Platinum / Black')

  // ── 6. BANNERS ────────────────────────────────────────────────────────────
  const bannerData = [
    { name: 'New Season. New You.', page: 'HOMEPAGE' as const, position: 'HERO' as const, desktopImageUrl: IMG.we[0], mobileImageUrl: IMG.we[0], headline: 'New Season. New You.', ctaLabel: 'Shop Women', ctaUrl: '/category/women', priority: 1, isActive: true },
    { name: 'Beauty Redefined.', page: 'HOMEPAGE' as const, position: 'SECTION' as const, desktopImageUrl: IMG.b[0], mobileImageUrl: IMG.b[0], headline: 'Beauty Redefined.', ctaLabel: 'Shop Beauty', ctaUrl: '/category/beauty', priority: 2, isActive: true },
    { name: 'For the Modern Man.', page: 'HOMEPAGE' as const, position: 'ANNOUNCEMENT' as const, desktopImageUrl: IMG.mf[0], mobileImageUrl: IMG.mf[0], headline: 'For the Modern Man.', ctaLabel: 'Shop Men', ctaUrl: '/category/men', priority: 3, isActive: false },
  ]
  for (const b of bannerData) {
    const exists = await prisma.banner.findFirst({ where: { name: b.name } })
    if (!exists) await prisma.banner.create({ data: { ...b, startsAt: new Date(), createdById: admin.id } })
  }
  console.log('✅ 3 banners ready')

  // ── 7. PRODUCTS (50) ──────────────────────────────────────────────────────
  console.log('\n📦 Seeding 50 products...')
  let created = 0

  for (const p of PRODUCTS) {
    const { imgs, variants, brandSlug, categorySlug, ...fields } = p
    const discountPercent = p.mrp > p.sellingPrice
      ? parseFloat((((p.mrp - p.sellingPrice) / p.mrp) * 100).toFixed(2)) : 0

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...fields, brandId: brands[brandSlug], categoryId: cats[categorySlug], discountPercent },
      create: { ...fields, brandId: brands[brandSlug], categoryId: cats[categorySlug], discountPercent, status: 'ACTIVE', publishedAt: new Date(), metaTitle: p.name },
    })

    await prisma.productImage.deleteMany({ where: { productId: product.id } })
    await prisma.productImage.createMany({
      data: imgs.map((url, i) => ({
        productId: product.id, url,
        thumbnailUrl: url.replace('w=600&h=750', 'w=300&h=375'),
        sortOrder: i, isPrimary: i === 0,
      })),
    })

    await prisma.productVariant.deleteMany({ where: { productId: product.id } })
    await prisma.productVariant.createMany({ data: variants.map(v => ({ ...v, productId: product.id })) })

    created++
    console.log(`  [${String(created).padStart(2, '0')}/50] ${p.name}`)
  }

  // ── 8. VERIFICATION ───────────────────────────────────────────────────────
  console.log('\n📊 Verification:')
  console.log('  Categories:', await prisma.category.count(), '(expect 6)')
  console.log('  Brands    :', await prisma.brand.count(), '(expect 10)')
  console.log('  Products  :', await prisma.product.count(), '(expect 50)')
  console.log('  Variants  :', await prisma.productVariant.count(), '(expect ~220)')
  console.log('  Images    :', await prisma.productImage.count(), '(expect 100)')
  console.log('  Coupons   :', await prisma.coupon.count(), '(expect 3)')
  console.log('  Banners   :', await prisma.banner.count(), '(expect 3)')
  console.log('\n🎉 Seed complete!')
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
