import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag, Trash2, Tag, ChevronRight, Truck,
  RotateCcw, Shield, Heart, Zap, X, CheckCircle2,
  Plus, Minus, ArrowLeft,
} from 'lucide-react'
import { useCartStore, type CartItem } from '@store/useCartStore'
import { useWishlistStore } from '@store/useWishlistStore'
import { useAuthStore } from '@store/useAuthStore'
import { WOMEN_ETHNIC_WEAR } from '@data/products/womenEthnicWear'
import { formatINR } from '@utils/format'
import { cn } from '@utils/cn'

// ─── Constants ─────────────────────────────────────────────────────────────────

const FREE_DELIVERY_THRESHOLD = 999
const DELIVERY_FEE = 99
const FC_POINTS_BALANCE = 2840
const FC_RATE = 1 // 1 point = ₹1

const AVAILABLE_COUPONS = [
  { code: 'FC10',       label: '10% off — First Citizen',    maxSave: 500  },
  { code: 'NEWUSER100', label: '₹100 off on first purchase', maxSave: 100  },
  { code: 'PREPAID50',  label: '₹50 off on prepaid orders',  maxSave: 50   },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getMRP(item: CartItem): number {
  const product = WOMEN_ETHNIC_WEAR.find((p) => p.id === item.productId)
  return product?.mrp ?? item.price
}

function applyCouponDiscount(subtotal: number, code: string): number {
  if (code === 'FC10')        return Math.min(Math.round(subtotal * 0.10), 500)
  if (code === 'NEWUSER100')  return subtotal >= 999 ? 100 : 0
  if (code === 'PREPAID50')   return 50
  return 0
}

// ─── Empty cart ────────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-24 h-24 rounded-2xl bg-[#F5F5F5] flex items-center justify-center mb-6">
        <ShoppingBag size={40} className="text-gray-300" />
      </div>
      <h2 className="font-serif text-2xl font-bold text-[#1A1A2E] mb-2">Your bag is empty</h2>
      <p className="text-sm text-gray-500 mb-8 max-w-xs">
        Looks like you haven&apos;t added anything yet. Discover our latest collections.
      </p>
      <Link
        to="/category/women-ethnic-wear"
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C0001D] text-white text-sm font-bold rounded-lg hover:bg-[#A8001A] transition-colors"
      >
        Start Shopping
        <ChevronRight size={16} />
      </Link>
    </div>
  )
}

// ─── Cart item row ──────────────────────────────────────────────────────────────

function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem, updateQuantity } = useCartStore()
  const { toggle, isWishlisted }       = useWishlistStore()
  const wishlisted = isWishlisted(item.productId)
  const mrp        = getMRP(item)
  const savings    = (mrp - item.price) * item.quantity

  return (
    <article className="flex gap-4 py-5 border-b border-[#F0F0F0] last:border-0">

      {/* Thumbnail */}
      <Link
        to={`/product/${item.productId}/${item.productId}`}
        className="shrink-0 w-[88px] h-[112px] rounded-xl overflow-hidden bg-gray-100 block"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://picsum.photos/seed/${item.productId}/200/267`
          }}
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
            {item.brand}
          </p>
          <Link
            to={`/product/${item.productId}/${item.productId}`}
            className="text-sm font-semibold text-gray-900 leading-snug hover:text-[#C0001D] transition-colors line-clamp-2"
          >
            {item.name}
          </Link>
        </div>

        {/* Size chip */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Size:</span>
          <span className="px-2.5 py-0.5 border border-[#DCDCDC] rounded-full text-xs font-semibold text-gray-700 bg-white">
            {item.size}
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-mono text-base font-bold text-gray-900">
            {formatINR(item.price)}
          </span>
          {mrp > item.price && (
            <span className="font-mono text-xs text-gray-400 line-through">
              {formatINR(mrp)}
            </span>
          )}
          {savings > 0 && (
            <span className="text-[11px] font-semibold text-[#16A34A] bg-green-50 px-1.5 py-0.5 rounded-sm">
              Save {formatINR(savings)}
            </span>
          )}
        </div>

        {/* Actions row */}
        <div className="flex items-center gap-4 mt-auto">
          {/* Qty stepper */}
          <div className="flex items-center gap-0 border border-[#DCDCDC] rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => {
                if (item.quantity <= 1) removeItem(item.id)
                else updateQuantity(item.id, item.quantity - 1)
              }}
              aria-label="Decrease quantity"
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Minus size={13} />
            </button>
            <span className="w-8 text-center text-sm font-bold text-gray-900 select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => { if (item.quantity < 5) updateQuantity(item.id, item.quantity + 1) }}
              disabled={item.quantity >= 5}
              aria-label="Increase quantity"
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:text-gray-300 transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Wishlist */}
          <button
            onClick={() => toggle(item.productId)}
            aria-label={wishlisted ? 'Remove from Wishlist' : 'Move to Wishlist'}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#C0001D] transition-colors"
          >
            <Heart
              size={14}
              className={wishlisted ? 'fill-[#C0001D] text-[#C0001D]' : ''}
            />
            Wishlist
          </button>

          {/* Remove */}
          <button
            onClick={() => removeItem(item.id)}
            aria-label="Remove item"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors ml-auto"
          >
            <Trash2 size={13} />
            Remove
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── Coupon section ────────────────────────────────────────────────────────────

function CouponSection({
  applied,
  onApply,
  onRemove,
}: {
  applied: string | null
  onApply: (code: string) => void
  onRemove: () => void
}) {
  const [input,  setInput]  = useState('')
  const [error,  setError]  = useState('')
  const [open,   setOpen]   = useState(false)

  function handleApply(code: string) {
    const normalised = code.trim().toUpperCase()
    const valid = AVAILABLE_COUPONS.find((c) => c.code === normalised)
    if (!valid) { setError('Invalid coupon code. Please try again.'); return }
    setError('')
    onApply(normalised)
    setInput('')
    setOpen(false)
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-800 font-mono">{applied}</p>
            <p className="text-xs text-green-700">Coupon applied successfully</p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-1 text-green-500 hover:text-green-700 transition-colors"
          aria-label="Remove coupon"
        >
          <X size={15} />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Input row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value.toUpperCase()); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleApply(input)}
            placeholder="Enter coupon code"
            className={cn(
              'w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm font-mono focus:outline-none focus:ring-1 transition-colors uppercase',
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                : 'border-[#DCDCDC] focus:border-[#C0001D] focus:ring-[#C0001D]/20',
            )}
          />
        </div>
        <button
          onClick={() => handleApply(input)}
          className="px-5 py-2.5 bg-[#1A1A2E] text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors shrink-0"
        >
          Apply
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Available coupons toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-[#C0001D] font-semibold hover:underline flex items-center gap-1"
      >
        {open ? 'Hide' : 'View'} available coupons
        <ChevronRight size={12} className={cn('transition-transform', open && 'rotate-90')} />
      </button>

      {open && (
        <div className="space-y-2">
          {AVAILABLE_COUPONS.map((c) => (
            <div
              key={c.code}
              className="flex items-center justify-between gap-3 border border-dashed border-[#C0001D]/30 bg-[#FFF8F8] rounded-xl px-4 py-3"
            >
              <div>
                <p className="text-xs font-bold text-[#C0001D] font-mono tracking-wider">{c.code}</p>
                <p className="text-xs text-gray-600 mt-0.5">{c.label}</p>
              </div>
              <button
                onClick={() => handleApply(c.code)}
                className="shrink-0 text-xs font-bold text-[#C0001D] border border-[#C0001D]/30 px-3 py-1.5 rounded-lg hover:bg-[#C0001D]/5 transition-colors"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── FC Points panel ───────────────────────────────────────────────────────────

function FCPointsPanel({
  maxPoints,
  applied,
  onApply,
  onRemove,
}: {
  maxPoints: number
  applied: number
  onApply: (pts: number) => void
  onRemove: () => void
}) {
  const [pts, setPts] = useState(applied || 200)
  const [open, setOpen] = useState(false)

  if (!open && applied === 0) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 hover:text-[#C0001D] transition-colors"
      >
        <span className="flex items-center gap-2">
          <Zap size={15} className="text-[#C0001D]" />
          Use First Citizen Points
          <span className="text-xs font-normal text-gray-400 ml-1">({maxPoints.toLocaleString('en-IN')} available)</span>
        </span>
        <ChevronRight size={14} className="text-gray-400" />
      </button>
    )
  }

  if (applied > 0) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={15} className="text-[#C0001D]" />
          <p className="text-sm font-semibold text-gray-800">
            <span className="font-mono text-[#C0001D]">{applied.toLocaleString('en-IN')} FC Points</span>
            {' '}applied → {formatINR(applied * FC_RATE)} off
          </p>
        </div>
        <button onClick={onRemove} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
          <X size={13} /> Remove
        </button>
      </div>
    )
  }

  const valid = pts >= 200 && pts <= maxPoints
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Zap size={15} className="text-[#C0001D]" />
        <p className="text-sm font-semibold text-gray-800">First Citizen Points</p>
        <span className="text-xs text-gray-400">({maxPoints.toLocaleString('en-IN')} available)</span>
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          min={200}
          max={maxPoints}
          value={pts}
          onChange={(e) => setPts(Number(e.target.value))}
          className="w-28 border border-[#DCDCDC] rounded-lg px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:border-[#C0001D] focus:ring-1 focus:ring-[#C0001D]/20"
        />
        <button
          onClick={() => { if (valid) { onApply(pts); setOpen(false) } }}
          disabled={!valid}
          className="flex-1 py-2 bg-[#1A1A2E] text-white text-xs font-bold rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Apply — save {formatINR(valid ? pts * FC_RATE : 0)}
        </button>
        <button onClick={() => setOpen(false)} className="p-2 text-gray-400 hover:text-gray-600">
          <X size={14} />
        </button>
      </div>
      {pts < 200 && <p className="text-[11px] text-red-500">Minimum 200 points required</p>}
      {pts > maxPoints && <p className="text-[11px] text-red-500">You only have {maxPoints.toLocaleString('en-IN')} points</p>}
    </div>
  )
}

// ─── Price summary sidebar ──────────────────────────────────────────────────────

interface PriceSummaryProps {
  subtotalMRP: number
  subtotalSelling: number
  couponDiscount: number
  fcDiscount: number
  deliveryFee: number
  itemCount: number
  onCheckout: () => void
}

function PriceSummary({
  subtotalMRP,
  subtotalSelling,
  couponDiscount,
  fcDiscount,
  deliveryFee,
  itemCount,
  onCheckout,
}: PriceSummaryProps) {
  const productDiscount = subtotalMRP - subtotalSelling
  const total = subtotalSelling - couponDiscount - fcDiscount + deliveryFee
  const totalSavings = productDiscount + couponDiscount + fcDiscount + (deliveryFee === 0 ? DELIVERY_FEE : 0)

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden sticky top-24">
      <div className="px-5 py-4 border-b border-[#F0F0F0]">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Price Details</h2>
        <p className="text-xs text-gray-400 mt-0.5">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
      </div>

      <div className="px-5 py-4 space-y-3">
        <div className="flex justify-between text-sm text-gray-700">
          <span>Total MRP</span>
          <span className="font-mono">{formatINR(subtotalMRP)}</span>
        </div>
        <div className="flex justify-between text-sm text-[#16A34A]">
          <span>Discount on MRP</span>
          <span className="font-mono">−{formatINR(productDiscount)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-sm text-[#16A34A]">
            <span>Coupon Discount</span>
            <span className="font-mono">−{formatINR(couponDiscount)}</span>
          </div>
        )}
        {fcDiscount > 0 && (
          <div className="flex justify-between text-sm text-[#C0001D]">
            <span className="flex items-center gap-1">
              <Zap size={12} />FC Points
            </span>
            <span className="font-mono">−{formatINR(fcDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-gray-700">
          <span>Delivery Fee</span>
          {deliveryFee === 0
            ? <span className="font-semibold text-[#16A34A]">FREE</span>
            : <span className="font-mono">{formatINR(deliveryFee)}</span>
          }
        </div>

        <div className="border-t border-[#F0F0F0] pt-3 flex justify-between font-bold text-gray-900">
          <span>Total Amount</span>
          <span className="font-mono text-lg">{formatINR(total)}</span>
        </div>
      </div>

      {totalSavings > 0 && (
        <div className="mx-5 mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-center">
          <p className="text-xs font-semibold text-green-800">
            You save <span className="font-mono text-sm">{formatINR(totalSavings)}</span> on this order 🎉
          </p>
        </div>
      )}

      <div className="px-5 pb-5">
        <button
          onClick={onCheckout}
          className="w-full py-4 bg-[#C0001D] text-white text-sm font-bold rounded-xl hover:bg-[#A8001A] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Proceed to Checkout
          <ChevronRight size={16} />
        </button>
        <p className="text-[10px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
          <Shield size={10} />
          100% Secure payments
        </p>
      </div>

      {/* Trust pills */}
      <div className="border-t border-[#F8F8F8] px-5 py-4 flex flex-col gap-2">
        {[
          { icon: <Shield size={13} />,    text: 'Secure SSL checkout' },
          { icon: <RotateCcw size={13} />, text: 'Easy 15-day returns' },
          { icon: <Truck size={13} />,     text: 'Free delivery on ₹999+' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-gray-400">{icon}</span>
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export function CartPage() {
  const navigate = useNavigate()
  const { items } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const [couponCode, setCouponCode]   = useState<string | null>(null)
  const [fcPointsApplied, setFCPoints] = useState(0)

  const totals = useMemo(() => {
    const subtotalMRP     = items.reduce((s, i) => s + getMRP(i) * i.quantity, 0)
    const subtotalSelling = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const couponDiscount  = couponCode
      ? applyCouponDiscount(subtotalSelling, couponCode)
      : 0
    const fcDiscount   = fcPointsApplied * FC_RATE
    const deliveryFee  = subtotalSelling >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
    const itemCount    = items.reduce((s, i) => s + i.quantity, 0)
    return { subtotalMRP, subtotalSelling, couponDiscount, fcDiscount, deliveryFee, itemCount }
  }, [items, couponCode, fcPointsApplied])

  const needsForFreeDelivery =
    totals.subtotalSelling < FREE_DELIVERY_THRESHOLD
      ? FREE_DELIVERY_THRESHOLD - totals.subtotalSelling
      : 0

  function handleCheckout() {
    if (!isAuthenticated) {
      navigate('/login')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <div className="min-h-screen bg-brand-warm">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-xs text-gray-500">
              <li><Link to="/" className="hover:text-[#C0001D] transition-colors">Home</Link></li>
              <li className="flex items-center gap-1">
                <ChevronRight size={11} className="text-gray-300" />
                <span className="text-gray-700 font-medium">Shopping Bag</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">

        {/* ── Title ───────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-serif text-2xl font-bold text-[#1A1A2E]">
            My Bag
            {items.length > 0 && (
              <span className="ml-2 text-sm font-sans font-normal text-gray-400">
                ({totals.itemCount} item{totals.itemCount !== 1 ? 's' : ''})
              </span>
            )}
          </h1>
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

            {/* ══ LEFT ════════════════════════════════════════════════════ */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">

              {/* Delivery progress bar */}
              {needsForFreeDelivery > 0 ? (
                <div className="bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 flex items-center gap-3">
                  <Truck size={16} className="text-[#C0001D] shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-700">
                      Add <strong className="font-mono text-[#C0001D]">{formatINR(needsForFreeDelivery)}</strong> more for
                      <strong className="text-[#16A34A]"> FREE delivery</strong>
                    </p>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-[#C0001D] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((totals.subtotalSelling / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                  <p className="text-xs font-semibold text-green-800">
                    Your order qualifies for FREE delivery!
                  </p>
                </div>
              )}

              {/* Items card */}
              <div className="bg-white border border-[#EBEBEB] rounded-2xl px-4 sm:px-5">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>

              {/* Coupon card */}
              <div className="bg-white border border-[#EBEBEB] rounded-2xl px-4 sm:px-5 py-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Tag size={14} className="text-[#C0001D]" />
                  Coupons & Offers
                </h3>
                <CouponSection
                  applied={couponCode}
                  onApply={setCouponCode}
                  onRemove={() => setCouponCode(null)}
                />
              </div>

              {/* FC Points card */}
              <div className="bg-white border border-[#EBEBEB] rounded-2xl px-4 sm:px-5 py-4">
                <FCPointsPanel
                  maxPoints={FC_POINTS_BALANCE}
                  applied={fcPointsApplied}
                  onApply={setFCPoints}
                  onRemove={() => setFCPoints(0)}
                />
              </div>
            </div>

            {/* ══ RIGHT — Price summary ═══════════════════════════════════ */}
            <div className="w-full lg:w-[340px] shrink-0">
              <PriceSummary
                {...totals}
                onCheckout={handleCheckout}
              />
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
