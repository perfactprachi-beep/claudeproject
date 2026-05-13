import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Heart, ShoppingBag, Star, ChevronRight, ChevronDown, ChevronUp,
  Truck, RotateCcw, Shield, Zap, Share2, Bell, Minus, Plus, X,
  Tag, ThumbsUp,
} from 'lucide-react'
import { useCartStore } from '@store/useCartStore'
import { useWishlistStore } from '@store/useWishlistStore'
import { useAuthStore } from '@store/useAuthStore'
import { WOMEN_ETHNIC_WEAR } from '@data/products/womenEthnicWear'
import { formatINR } from '@utils/format'
import {
  trackViewItem, trackAddToCart, trackAddToWishlist, trackSelectItem,
} from '@utils/analytics'
import type { PLPProduct, ProductSize } from '@typedefs/product'
import { cn } from '@utils/cn'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Review {
  id: string
  author: string
  location: string
  rating: number
  date: string
  title: string
  body: string
  helpful: number
  verified: boolean
}

interface Offer {
  code: string
  description: string
  saving: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1', author: 'Sneha M.', location: 'Mumbai', rating: 5,
    date: '02 May 2025', title: 'Absolutely love it!',
    body: 'The fabric quality is amazing and the fit is perfect. Received so many compliments at the family function. The colour is exactly as shown — vibrant and rich. Will definitely buy more from this brand.',
    helpful: 24, verified: true,
  },
  {
    id: 'r2', author: 'Priyanka R.', location: 'Bengaluru', rating: 4,
    date: '18 Apr 2025', title: 'Good quality, slightly long',
    body: "Beautiful colour and the material is very comfortable for all-day wear. The length runs a bit long for my height (5'2\") but overall very happy with the purchase. Delivery was also super fast.",
    helpful: 11, verified: true,
  },
  {
    id: 'r3', author: 'Deepa K.', location: 'Delhi', rating: 5,
    date: '05 Apr 2025', title: 'Perfect for festive occasions',
    body: 'Wore this for a family puja and everyone asked where I bought it from. The embroidery details are exquisite and the packaging was also very luxurious. Shoppers Stop never disappoints.',
    helpful: 18, verified: false,
  },
]

const MOCK_OFFERS: Offer[] = [
  { code: 'FC10',       description: '10% off with your First Citizen card. Max discount ₹500.',      saving: 'Save up to ₹500' },
  { code: 'NEWUSER100', description: '₹100 off on your first purchase. Min order value ₹999.',        saving: 'Save ₹100' },
  { code: 'PREPAID50',  description: 'Extra ₹50 off on prepaid orders (UPI / Card / Net Banking).',   saving: 'Save ₹50' },
]

const RATING_BREAKDOWN = [
  { star: 5, pct: 58 },
  { star: 4, pct: 24 },
  { star: 3, pct: 10 },
  { star: 2, pct:  5 },
  { star: 1, pct:  3 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGallery(p: PLPProduct): string[] {
  return [
    p.images[0],
    p.images[1],
    `https://picsum.photos/seed/${p.id}-c/450/600`,
    `https://picsum.photos/seed/${p.id}-d/450/600`,
  ]
}

function deliveryDate(daysAhead: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })
}

// ─── StarRating ───────────────────────────────────────────────────────────────

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200'
          }
        />
      ))}
    </span>
  )
}

// ─── AccordionSection ─────────────────────────────────────────────────────────

function AccordionSection({
  title, children, defaultOpen = false,
}: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[#EBEBEB] last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full py-4 text-sm font-semibold text-gray-900 hover:text-[#C0001D] transition-colors text-left"
        aria-expanded={open}
      >
        {title}
        {open
          ? <ChevronUp size={16} className="text-gray-400 shrink-0" />
          : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
      </button>
      {open && <div className="pb-5 text-sm text-gray-600 leading-relaxed">{children}</div>}
    </div>
  )
}

// ─── Size Guide Modal ─────────────────────────────────────────────────────────

function SizeGuideModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-[#EBEBEB]">
          <h3 className="font-serif text-lg font-bold text-[#1A1A2E]">Size Guide</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-600" />
          </button>
        </div>
        <div className="p-5">
          <p className="text-xs text-gray-500 mb-4">All measurements are in inches. For the best fit, measure over your innerwear.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F8F8]">
                  {['Size', 'Chest', 'Waist', 'Hips', 'Length'].map((h) => (
                    <th key={h} className="border border-[#EBEBEB] px-3 py-2.5 text-left font-bold text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['XS',  '32–33', '26–27', '34–35', '40–42'],
                  ['S',   '34–35', '28–29', '36–37', '41–43'],
                  ['M',   '36–37', '30–31', '38–39', '42–44'],
                  ['L',   '38–39', '32–33', '40–41', '43–45'],
                  ['XL',  '40–41', '34–35', '42–43', '44–46'],
                  ['XXL', '42–43', '36–37', '44–45', '45–47'],
                ].map(([size, ...vals]) => (
                  <tr key={size} className="border border-[#EBEBEB] hover:bg-[#FAFAFA]">
                    <td className="px-3 py-2.5 font-bold text-gray-900">{size}</td>
                    {vals.map((v, i) => (
                      <td key={i} className="px-3 py-2.5 text-gray-600">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Tip: If you&apos;re between sizes, we recommend sizing up for a relaxed fit.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── You May Also Like carousel ───────────────────────────────────────────────

function YouMayAlsoLike({ current }: { current: PLPProduct }) {
  const navigate = useNavigate()
  const products = WOMEN_ETHNIC_WEAR
    .filter((p) => p.id !== current.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 6)

  return (
    <section className="mt-14">
      <h2 className="font-serif text-xl md:text-2xl font-bold text-[#1A1A2E] mb-5">
        You May Also Like
      </h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {products.map((p, i) => (
          <button
            key={p.id}
            onClick={() => {
              trackSelectItem(p.id, p.name, i + 1, 'You May Also Like')
              navigate(`/product/${p.id}/${p.slug}`)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="shrink-0 w-44 text-left group"
          >
            <div
              className="relative rounded-xl overflow-hidden bg-white shadow-card mb-3"
              style={{ paddingTop: '133%' }}
            >
              <img
                src={p.images[0]}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${p.id}-fb/450/600`
                }}
              />
              {p.isNew && (
                <span className="absolute top-2 left-2 bg-[#1A1A2E] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                  New
                </span>
              )}
              {p.isBestseller && (
                <span className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                  Bestseller
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{p.brand}</p>
            <p className="text-xs text-gray-800 line-clamp-2 leading-snug mt-0.5 font-medium">{p.name}</p>
            <div className="flex items-baseline gap-1.5 mt-1.5 flex-wrap">
              <span className="text-sm font-bold text-gray-900">{formatINR(p.sellingPrice)}</span>
              {p.mrp > p.sellingPrice && (
                <span className="text-[10px] text-gray-400 line-through">{formatINR(p.mrp)}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

// ─── Complete the Look ────────────────────────────────────────────────────────

function CompleteTheLook({ current }: { current: PLPProduct }) {
  const navigate  = useNavigate()
  const { addItem } = useCartStore()
  const [added, setAdded] = useState(false)

  const bundle = WOMEN_ETHNIC_WEAR
    .filter((p) => p.id !== current.id && p.subCategory !== current.subCategory && p.inStock)
    .slice(0, 2)

  if (bundle.length < 2) return null

  const allThree  = [current, ...bundle]
  const totalMRP  = allThree.reduce((s, p) => s + p.mrp, 0)
  const totalSale = allThree.reduce((s, p) => s + p.sellingPrice, 0)

  function handleAddAll() {
    bundle.forEach((p) => {
      const size = p.availableSizes[0] ?? 'Free Size'
      addItem({ id: `${p.id}-${size}`, productId: p.id, brand: p.brand, name: p.name, image: p.images[0], size, price: p.sellingPrice, quantity: 1 })
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <section className="mt-14">
      <h2 className="font-serif text-xl md:text-2xl font-bold text-[#1A1A2E] mb-5">
        Complete the Look
      </h2>
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 md:p-6">
        <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-1 mb-5">
          {allThree.map((p, i) => (
            <div key={p.id} className="shrink-0 flex flex-col items-center gap-2">
              {i > 0 && (
                <span className="text-lg font-bold text-gray-300 self-center hidden md:block">+</span>
              )}
              <button
                onClick={() => {
                  trackSelectItem(p.id, p.name, i + 1, 'Complete the Look')
                  navigate(`/product/${p.id}/${p.slug}`)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="group"
              >
                <div className="w-28 md:w-36 rounded-xl overflow-hidden shadow-card" style={{ paddingTop: '133%', position: 'relative' }}>
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {i === 0 && (
                    <span className="absolute top-2 left-2 bg-[#C0001D] text-white text-[9px] font-bold px-2 py-0.5 rounded">
                      This item
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 mt-1.5 text-center line-clamp-1">{p.brand}</p>
                <p className="text-xs font-bold text-gray-900 text-center">{formatINR(p.sellingPrice)}</p>
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#F0F0F0] pt-4">
          <div>
            <p className="text-sm text-gray-600">
              Bundle price:{' '}
              <strong className="text-xl font-bold text-gray-900">{formatINR(totalSale)}</strong>{' '}
              <span className="text-sm text-gray-400 line-through">{formatINR(totalMRP)}</span>
            </p>
            <p className="text-xs text-green-600 font-semibold mt-0.5">
              You save {formatINR(totalMRP - totalSale)} on this look
            </p>
          </div>
          <button
            onClick={handleAddAll}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shrink-0',
              added ? 'bg-green-600 text-white' : 'bg-[#1A1A2E] text-white hover:bg-gray-800',
            )}
          >
            <ShoppingBag size={16} />
            {added ? '✓ Added all to Bag' : 'Add All to Bag'}
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Sticky Bottom Bar (mobile) ───────────────────────────────────────────────

function StickyBottomBar({
  product, onAddToBag,
}: {
  product: PLPProduct; onAddToBag: () => void
}) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#EBEBEB] px-4 py-3 flex items-center gap-3"
      style={{ boxShadow: '0 -4px 16px rgba(0,0,0,0.08)' }}>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 truncate">{product.brand}</p>
        <p className="text-sm font-bold text-gray-900 truncate leading-tight">{formatINR(product.sellingPrice)}</p>
      </div>
      {product.inStock ? (
        <button
          onClick={onAddToBag}
          className="shrink-0 bg-[#C0001D] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-red-800 active:scale-95 transition-all"
        >
          Add to Bag
        </button>
      ) : (
        <button className="shrink-0 bg-gray-100 text-gray-600 text-sm font-bold px-6 py-3 rounded-xl">
          Notify Me
        </button>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string; productSlug: string }>()
  const navigate        = useNavigate()

  const product = WOMEN_ETHNIC_WEAR.find((p) => p.id === productId) ?? null

  const [activeImage, setActiveImage]     = useState(0)
  const [zoomed, setZoomed]               = useState(false)
  const [selectedSize, setSelectedSize]   = useState<ProductSize | null>(null)
  const [quantity, setQuantity]           = useState(1)
  const [sizeError, setSizeError]         = useState(false)
  const [addedToBag, setAddedToBag]       = useState(false)
  const [pincode, setPincode]             = useState('')
  const [pincodeMsg, setPincodeMsg]       = useState<{ text: string; ok: boolean } | null>(null)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [copiedCode, setCopiedCode]       = useState<string | null>(null)

  const sizeRef = useRef<HTMLDivElement>(null)

  const { addItem }              = useCartStore()
  const { toggle, isWishlisted } = useWishlistStore()
  const { isAuthenticated }      = useAuthStore()

  const wishlisted = product ? isWishlisted(product.id) : false
  const isSaree    = product?.subCategory === 'saree'
  const gallery    = product ? getGallery(product) : []
  const fcPoints   = product ? Math.floor((product.sellingPrice / 100) * 2) : 0

  // GA4: view_item on mount
  useEffect(() => {
    if (product) {
      trackViewItem(product.id, product.name, product.brand, product.sellingPrice)
    }
  }, [product?.id])

  // ── Not found ─────────────────────────────────────────────────────────────

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-warm flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-4xl mb-2">🛍️</div>
        <h1 className="font-serif text-2xl font-bold text-[#1A1A2E]">Product not found</h1>
        <p className="text-sm text-gray-500">This product doesn&apos;t exist or has been removed.</p>
        <button
          onClick={() => navigate('/category/women-ethnic-wear')}
          className="mt-2 px-6 py-3 bg-[#C0001D] text-white text-sm font-bold rounded-xl hover:bg-red-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleAddToBag = useCallback(() => {
    if (!product.inStock) return
    if (!isSaree && !selectedSize) {
      setSizeError(true)
      sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSizeError(false)
    const size = isSaree ? ('Free Size' as ProductSize) : selectedSize!
    for (let q = 0; q < quantity; q++) {
      addItem({
        id: `${product.id}-${size}`,
        productId: product.id,
        brand: product.brand,
        name: product.name,
        image: product.images[0],
        size,
        price: product.sellingPrice,
        quantity,
      })
    }
    trackAddToCart(product.id, product.name, product.sellingPrice, quantity)
    setAddedToBag(true)
    setTimeout(() => setAddedToBag(false), 2500)
  }, [product, isSaree, selectedSize, quantity, addItem])

  const handleBuyNow = () => {
    handleAddToBag()
    if (!product.inStock) return
    if (!isSaree && !selectedSize) return
    navigate('/cart')
  }

  const handleWishlist = () => {
    toggle(product.id)
    if (!wishlisted) trackAddToWishlist(product.id)
  }

  function handleCheckPincode() {
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeMsg({ text: 'Enter a valid 6-digit pincode.', ok: false })
      return
    }
    const unserviceable = ['400001']
    if (unserviceable.includes(pincode)) {
      setPincodeMsg({ text: 'Sorry, delivery is not available at this pincode.', ok: false })
    } else {
      setPincodeMsg({
        text: `Delivery by ${deliveryDate(4)} · Free for prepaid orders`,
        ok: true,
      })
    }
  }

  function handleCopyCode(code: string) {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const avgRating   = product.rating ?? 4.2
  const reviewCount = product.reviewCount ?? 128

  return (
    <>
      <div className="min-h-screen bg-brand-warm pb-20 lg:pb-0">

        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-2.5">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1 text-xs text-gray-500 flex-wrap">
                <li><Link to="/" className="hover:text-[#C0001D] transition-colors">Home</Link></li>
                <li className="flex items-center gap-1">
                  <ChevronRight size={11} className="text-gray-300 shrink-0" />
                  <Link to="/category/women-ethnic-wear" className="hover:text-[#C0001D] transition-colors">
                    Women&apos;s Ethnic Wear
                  </Link>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight size={11} className="text-gray-300 shrink-0" />
                  <span className="text-gray-700 font-medium truncate max-w-[180px] sm:max-w-xs">
                    {product.name}
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-14">

            {/* ══ LEFT — IMAGE GALLERY ════════════════════════════════════ */}
            <div className="lg:w-[52%] flex flex-col-reverse md:flex-row gap-3 lg:sticky lg:top-24 lg:self-start">

              {/* Thumbnail strip */}
              <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible scrollbar-hide">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      'shrink-0 w-[60px] h-[76px] rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C0001D]',
                      i === activeImage
                        ? 'border-[#C0001D]'
                        : 'border-transparent hover:border-gray-300',
                    )}
                    aria-label={`Image ${i + 1}`}
                    aria-pressed={i === activeImage}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://picsum.photos/seed/${product.id}-t${i}/450/600`
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className="flex-1 relative">
                <div
                  className="relative rounded-2xl overflow-hidden bg-white shadow-card cursor-zoom-in"
                  style={{ paddingTop: '125%' }}
                  onClick={() => setZoomed((z) => !z)}
                  role="button"
                  aria-label="Click to zoom"
                >
                  <img
                    src={gallery[activeImage]}
                    alt={product.name}
                    className={cn(
                      'absolute inset-0 w-full h-full object-cover transition-transform duration-500 origin-center',
                      zoomed ? 'scale-150 cursor-zoom-out' : 'scale-100',
                    )}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://picsum.photos/seed/${product.id}-main/450/600`
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                    {product.isNew && (
                      <span className="bg-[#1A1A2E] text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-widest">
                        New Arrival
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-widest">
                        Bestseller
                      </span>
                    )}
                    <span className="bg-[#C0001D] text-white text-[10px] font-bold px-2.5 py-1 rounded">
                      {product.discountPercent}% OFF
                    </span>
                  </div>

                  {/* 360° badge */}
                  <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">
                    360° View
                  </span>

                  {/* Zoom hint */}
                  {!zoomed && (
                    <span className="absolute bottom-3 right-3 bg-white/80 text-gray-600 text-[10px] px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">
                      Click to zoom
                    </span>
                  )}

                  {/* Share */}
                  <button
                    aria-label="Share product"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all pointer-events-auto"
                  >
                    <Share2 size={14} className="text-gray-600" />
                  </button>

                  {/* OOS overlay */}
                  {!product.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 pointer-events-none">
                      <span className="bg-white/95 text-gray-700 text-sm font-bold px-5 py-2.5 rounded-full shadow-md uppercase tracking-wide">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ══ RIGHT — PRODUCT INFO ════════════════════════════════════ */}
            <div className="lg:w-[48%] flex flex-col gap-5">

              {/* Brand + wishlist */}
              <div className="flex items-start justify-between gap-3">
                <Link
                  to="/category/women-ethnic-wear"
                  className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-[#C0001D] transition-colors"
                >
                  {product.brand}
                </Link>
                <button
                  onClick={handleWishlist}
                  aria-label={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                  className={cn(
                    'w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 transition-all hover:scale-110',
                    wishlisted
                      ? 'border-[#C0001D] bg-[#C0001D]'
                      : 'border-gray-200 bg-white hover:border-[#C0001D]',
                  )}
                >
                  <Heart
                    size={16}
                    className={wishlisted ? 'fill-white text-white' : 'text-gray-500'}
                  />
                </button>
              </div>

              {/* Product name */}
              <h1 className="font-serif text-xl md:text-2xl font-bold text-[#1A1A2E] leading-snug -mt-2">
                {product.name}
              </h1>

              {/* Rating row */}
              {product.rating && (
                <div className="flex items-center gap-3 flex-wrap -mt-2">
                  <div className="flex items-center gap-2 bg-white border border-[#EBEBEB] rounded-lg px-3 py-1.5">
                    <StarRating rating={avgRating} />
                    <span className="text-sm font-bold text-gray-900">{avgRating.toFixed(1)}</span>
                  </div>
                  <a
                    href="#reviews"
                    className="text-xs text-gray-500 hover:text-[#C0001D] transition-colors underline underline-offset-2"
                  >
                    {reviewCount.toLocaleString('en-IN')} Ratings &amp; Reviews
                  </a>
                </div>
              )}

              {/* Price block */}
              <div className="border-t border-[#F0F0F0] pt-4">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-gray-900">{formatINR(product.sellingPrice)}</span>
                  {product.mrp > product.sellingPrice && (
                    <>
                      <span className="text-base text-gray-400 line-through">{formatINR(product.mrp)}</span>
                      <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        {product.discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
              </div>

              {/* FC Points — logged-in only */}
              {isAuthenticated && (
                <div className="flex items-center gap-2 bg-[#FFF5F5] border border-[#FFD7D7] rounded-xl px-4 py-2.5">
                  <Zap size={15} className="text-[#C0001D] shrink-0" />
                  <p className="text-xs text-gray-700">
                    Earn <strong className="text-[#C0001D]">{fcPoints} FC Points</strong> on this purchase
                  </p>
                </div>
              )}

              {/* Colour */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Colour: <span className="font-bold text-gray-900">{product.colourName}</span>
                </p>
                <div
                  className="w-9 h-9 rounded-full border-[3px] border-[#C0001D] ring-2 ring-[#C0001D] ring-offset-2 shadow-sm"
                  style={{ backgroundColor: product.colourHex }}
                  title={product.colourName}
                  role="img"
                  aria-label={`Selected colour: ${product.colourName}`}
                />
              </div>

              {/* Size selector */}
              {!isSaree && (
                <div ref={sizeRef}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={cn(
                      'text-xs font-semibold transition-colors',
                      sizeError ? 'text-red-600' : 'text-gray-700',
                    )}>
                      {sizeError ? '⚠ Please select a size to continue' : 'Select Size'}
                    </p>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-xs text-[#C0001D] font-semibold hover:underline"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Select a size">
                    {product.sizes.map((size) => {
                      const available = product.availableSizes.includes(size)
                      return (
                        <button
                          key={size}
                          disabled={!available}
                          onClick={() => { setSelectedSize(size); setSizeError(false) }}
                          className={cn(
                            'relative min-w-[52px] px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C0001D]',
                            !available
                              ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-[#FAFAFA] overflow-hidden'
                              : selectedSize === size
                                ? 'border-[#C0001D] bg-[#C0001D] text-white shadow-sm'
                                : 'border-[#DCDCDC] text-gray-800 hover:border-gray-500 bg-white',
                          )}
                          aria-label={`Size ${size}${!available ? ' — Sold Out' : ''}`}
                          aria-pressed={selectedSize === size}
                        >
                          {size}
                          {!available && (
                            <span
                              className="absolute inset-0 pointer-events-none"
                              aria-hidden
                              style={{
                                background:
                                  'linear-gradient(to top right,transparent calc(50% - 0.5px),#D1D5DB calc(50% - 0.5px),#D1D5DB calc(50% + 0.5px),transparent calc(50% + 0.5px))',
                              }}
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quantity stepper */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Quantity</p>
                <div className="flex items-center gap-0 border border-[#DCDCDC] rounded-xl w-fit overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:text-gray-300 transition-colors"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-gray-900 select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                    disabled={quantity >= 5}
                    aria-label="Increase quantity"
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:text-gray-300 transition-colors"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                {quantity >= 5 && (
                  <p className="text-xs text-amber-600 mt-1.5">Max 5 per order</p>
                )}
              </div>

              {/* In-stock indicator */}
              <div className="flex items-center gap-2 -mt-1">
                <span className={cn('w-2 h-2 rounded-full shrink-0', product.inStock ? 'bg-green-500' : 'bg-gray-400')} />
                <span className={cn('text-xs font-semibold', product.inStock ? 'text-green-700' : 'text-gray-500')}>
                  {product.inStock ? 'In Stock — Ready to Ship' : 'Currently Out of Stock'}
                </span>
              </div>

              {/* CTA row */}
              <div className="flex gap-3">
                {product.inStock ? (
                  <>
                    <button
                      onClick={handleAddToBag}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all',
                        addedToBag
                          ? 'bg-green-600 text-white'
                          : 'bg-[#C0001D] text-white hover:bg-red-800 active:scale-[0.98]',
                      )}
                    >
                      <ShoppingBag size={17} />
                      {addedToBag ? '✓ Added to Bag' : 'Add to Bag'}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold border-2 border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-white transition-all active:scale-[0.98]"
                    >
                      Buy Now
                    </button>
                  </>
                ) : (
                  <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    <Bell size={16} />
                    Notify Me When Available
                  </button>
                )}
              </div>

              {/* Delivery check */}
              <div className="bg-white border border-[#EBEBEB] rounded-xl p-4">
                <p className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                  <Truck size={13} className="text-[#C0001D]" /> Check Delivery
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, ''))
                      setPincodeMsg(null)
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckPincode()}
                    placeholder="Enter 6-digit pincode"
                    className="flex-1 border border-[#DCDCDC] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C0001D] focus:ring-1 focus:ring-[#C0001D]/20 transition-colors"
                  />
                  <button
                    onClick={handleCheckPincode}
                    className="px-4 py-2.5 bg-[#1A1A2E] text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Check
                  </button>
                </div>
                {pincodeMsg && (
                  <p className={cn('text-xs mt-2.5 font-medium', pincodeMsg.ok ? 'text-green-700' : 'text-red-600')}>
                    {pincodeMsg.ok ? '✓ ' : '✗ '}{pincodeMsg.text}
                  </p>
                )}
                {pincodeMsg?.ok && (
                  <button className="text-xs text-[#C0001D] font-semibold mt-1.5 hover:underline">
                    Available at nearby Store →
                  </button>
                )}
              </div>

              {/* Service pills */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Truck size={16} />,     label: 'Free Delivery', sub: 'Orders ₹999+' },
                  { icon: <RotateCcw size={16} />, label: 'Easy Returns',  sub: '15-day policy' },
                  { icon: <Shield size={16} />,    label: '100% Genuine',  sub: 'Certified brand' },
                ].map(({ icon, label, sub }) => (
                  <div key={label} className="bg-white border border-[#EBEBEB] rounded-xl p-3 flex flex-col items-center text-center gap-1">
                    <span className="text-gray-500">{icon}</span>
                    <p className="text-[11px] font-bold text-gray-800">{label}</p>
                    <p className="text-[10px] text-gray-400">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Accordions */}
              <div className="bg-white border border-[#EBEBEB] rounded-xl px-5 py-1">

                {/* Offers */}
                <AccordionSection title={`Offers & Coupons (${MOCK_OFFERS.length})`} defaultOpen>
                  <div className="flex flex-col gap-3">
                    {MOCK_OFFERS.map((offer) => (
                      <div
                        key={offer.code}
                        className="flex items-start justify-between gap-3 border border-dashed border-[#C0001D]/30 bg-[#FFF8F8] rounded-xl px-4 py-3"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Tag size={12} className="text-[#C0001D]" />
                            <code className="text-xs font-bold text-[#C0001D] tracking-wider">{offer.code}</code>
                          </div>
                          <p className="text-xs text-gray-600">{offer.description}</p>
                          <p className="text-xs font-semibold text-green-700 mt-0.5">{offer.saving}</p>
                        </div>
                        <button
                          onClick={() => handleCopyCode(offer.code)}
                          className="shrink-0 text-xs font-bold text-[#C0001D] border border-[#C0001D]/30 px-3 py-1.5 rounded-lg hover:bg-[#C0001D]/5 transition-colors"
                        >
                          {copiedCode === offer.code ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                </AccordionSection>

                {/* Product Details */}
                <AccordionSection title="Product Details">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {[
                      ['Brand',         product.brand],
                      ['Colour',        product.colourName],
                      ['Fabric',        'Premium Blended'],
                      ['Care',          'Dry Clean Only'],
                      ['Occasion',      'Festive / Casual'],
                      ['Origin',        'India'],
                      ['SKU',           product.id.toUpperCase()],
                      ['Style Code',    `SSL-${product.id.split('-')[1]}`],
                    ].map(([label, value]) => (
                      <div key={label} className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</span>
                        <span className="text-xs font-semibold text-gray-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </AccordionSection>

                {/* Return Policy */}
                <AccordionSection title="Return & Exchange Policy">
                  <div className="flex items-start gap-3">
                    <RotateCcw size={16} className="text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Easy 15-day returns. Free pickup.</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Return pickup scheduled within 24 hours of request</li>
                        <li>Item must be unused, unwashed with original tags</li>
                        <li>Refund credited within 5–7 business days</li>
                        <li>Exchange available at any Shoppers Stop store</li>
                      </ul>
                    </div>
                  </div>
                </AccordionSection>

              </div>
            </div>
          </div>

          {/* ── Reviews ──────────────────────────────────────────────────── */}
          <section id="reviews" className="mt-14 scroll-mt-24">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[#1A1A2E] mb-6">
              Ratings &amp; Reviews
            </h2>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Rating summary */}
              <div className="lg:w-64 shrink-0">
                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
                  <div className="text-center mb-5">
                    <p className="text-5xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                    <StarRating rating={avgRating} size={18} />
                    <p className="text-xs text-gray-500 mt-2">
                      {reviewCount.toLocaleString('en-IN')} ratings
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {RATING_BREAKDOWN.map(({ star, pct }) => (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-gray-500 shrink-0 text-right">{star}</span>
                        <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-7 text-gray-400 text-right shrink-0">{pct}%</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => !isAuthenticated && navigate('/login')}
                    className="w-full mt-5 py-2.5 border-2 border-[#1A1A2E] text-[#1A1A2E] text-xs font-bold rounded-xl hover:bg-[#1A1A2E] hover:text-white transition-all"
                  >
                    Write a Review
                  </button>
                </div>
              </div>

              {/* Review cards */}
              <div className="flex-1 flex flex-col gap-4">
                {MOCK_REVIEWS.map((review) => (
                  <article
                    key={review.id}
                    className="bg-white rounded-2xl border border-[#EBEBEB] p-5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1A1A2E] flex items-center justify-center shrink-0">
                          <span className="text-white text-sm font-bold">
                            {review.author.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{review.author}</p>
                          <p className="text-xs text-gray-400">{review.location} · {review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg shrink-0">
                        <Star size={11} className="fill-green-600 text-green-600" />
                        <span className="text-xs font-bold text-green-700">{review.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-gray-900 mb-1">{review.title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F5F5F5]">
                      <div className="flex items-center gap-1.5">
                        {review.verified && (
                          <span className="text-xs text-green-600 font-semibold">✓ Verified Purchase</span>
                        )}
                      </div>
                      <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors">
                        <ThumbsUp size={12} />
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ── You May Also Like ─────────────────────────────────────── */}
          <YouMayAlsoLike current={product} />

          {/* ── Complete the Look ─────────────────────────────────────── */}
          <CompleteTheLook current={product} />

        </div>
      </div>

      {/* ── Size guide modal ─────────────────────────────────────────── */}
      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}

      {/* ── Sticky bottom bar (mobile) ────────────────────────────────── */}
      <StickyBottomBar product={product} onAddToBag={handleAddToBag} />
    </>
  )
}
