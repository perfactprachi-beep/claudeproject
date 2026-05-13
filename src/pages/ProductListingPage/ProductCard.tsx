import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Bell } from 'lucide-react'
import { useWishlistStore } from '@store/useWishlistStore'
import { useCartStore } from '@store/useCartStore'
import { formatINR } from '@utils/format'
import { trackProductClick, trackAddToWishlist } from '@utils/analytics'
import type { PLPProduct } from '@typedefs/product'
import { cn } from '@utils/cn'

interface ProductCardProps {
  product: PLPProduct
  position: number
  listName: string
}

export function ProductCard({ product, position, listName }: ProductCardProps) {
  const [addedToBag, setAddedToBag] = useState(false)
  const { toggle, isWishlisted } = useWishlistStore()
  const { addItem } = useCartStore()
  const wishlisted = isWishlisted(product.id)

  // Show max 4 standard sizes on card (not Free Size)
  const displaySizes =
    product.subCategory !== 'saree' ? product.sizes.slice(0, 4) : []

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    toggle(product.id)
    if (!wishlisted) trackAddToWishlist(product.id)
  }

  function handleAddToBag(e: React.MouseEvent) {
    e.preventDefault()
    if (!product.inStock) return
    const size = product.availableSizes[0] ?? 'Free Size'
    addItem({
      id: `${product.id}-${size}`,
      productId: product.id,
      brand: product.brand,
      name: product.name,
      image: product.images[0],
      size,
      price: product.sellingPrice,
      quantity: 1,
    })
    setAddedToBag(true)
    setTimeout(() => setAddedToBag(false), 2000)
  }

  function handleNotifyMe(e: React.MouseEvent) {
    e.preventDefault()
    // Placeholder — would open a notify-me modal in production
  }

  return (
    <article className="product-card group relative bg-white rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-200">
      {/* ── IMAGE BLOCK ─────────────────────────────────────────────── */}
      <Link
        to={`/product/${product.id}/${product.slug}`}
        onClick={() => trackProductClick(product.id, product.name, position, listName)}
        className="block relative overflow-hidden"
        style={{ paddingTop: '133.33%' }}
        aria-label={`View ${product.brand} ${product.name}`}
      >
        {/* Primary image */}
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
            !product.inStock && 'opacity-40',
            product.images[1] && 'group-hover:opacity-0',
          )}
          onError={(e) => {
            ;(e.target as HTMLImageElement).src =
              `https://picsum.photos/seed/${product.id}-fb/450/600`
          }}
        />

        {/* Hover / secondary image */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        )}

        {/* Out-of-stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/20">
            <span className="bg-white/95 text-gray-600 text-[11px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Badges — top left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
          {product.isNew && (
            <span className="bg-brand-navy text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist — top right */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white hover:scale-110 transition-all"
        >
          <Heart
            size={15}
            className={cn(
              'transition-colors',
              wishlisted ? 'fill-brand-red text-brand-red' : 'text-gray-500',
            )}
          />
        </button>

        {/* Add to Bag / Notify Me — slides up on desktop hover */}
        <div className="add-to-bag-reveal absolute bottom-0 inset-x-0">
          {product.inStock ? (
            <button
              onClick={handleAddToBag}
              className={cn(
                'w-full py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors',
                addedToBag
                  ? 'bg-discount text-white'
                  : 'bg-brand-navy text-white hover:bg-gray-800',
              )}
            >
              {addedToBag ? '✓ Added to Bag' : 'Add to Bag'}
            </button>
          ) : (
            <button
              onClick={handleNotifyMe}
              className="w-full py-2.5 text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Bell size={12} />
              Notify Me
            </button>
          )}
        </div>
      </Link>

      {/* ── CARD BODY ───────────────────────────────────────────────── */}
      <div className="p-3">
        {/* Brand */}
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
          {product.brand}
        </p>

        {/* Product name */}
        <p className="text-sm text-gray-800 line-clamp-2 leading-snug mb-2 min-h-[2.5rem]">
          {product.name}
        </p>

        {/* Price row */}
        <div className="flex items-baseline gap-2 flex-wrap mb-2">
          <span className="text-sm font-bold text-gray-900">
            {formatINR(product.sellingPrice)}
          </span>
          {product.mrp > product.sellingPrice && (
            <>
              <span className="text-xs text-gray-400 line-through">
                {formatINR(product.mrp)}
              </span>
              <span className="text-[11px] font-bold text-discount">
                {product.discountPercent}% OFF
              </span>
            </>
          )}
        </div>

        {/* Size chips */}
        {displaySizes.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {displaySizes.map((size) => {
              const available = product.availableSizes.includes(size)
              return (
                <span
                  key={size}
                  title={available ? size : `${size} – Sold Out`}
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 border rounded font-medium',
                    available
                      ? 'border-gray-200 text-gray-600'
                      : 'border-gray-100 text-gray-300 line-through',
                  )}
                >
                  {size}
                </span>
              )
            })}
            {product.sizes.length > 4 && (
              <span className="text-[10px] text-gray-400">+{product.sizes.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
