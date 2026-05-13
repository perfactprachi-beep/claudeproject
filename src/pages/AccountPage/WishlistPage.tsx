import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWishlistStore } from '@store/useWishlistStore'
import { useCartStore } from '@store/useCartStore'
import { WOMEN_ETHNIC_WEAR } from '@data/products/womenEthnicWear'
import { formatINR } from '@utils/format'
import { cn } from '@utils/cn'

const ALL_PRODUCTS = [...WOMEN_ETHNIC_WEAR]

export const WishlistPage = () => {
  const productIds = useWishlistStore((s) => s.productIds)
  const toggle = useWishlistStore((s) => s.toggle)
  const addItem = useCartStore((s) => s.addItem)

  const wishlistProducts = ALL_PRODUCTS.filter((p) => productIds.includes(p.id))

  const handleMoveToBag = (product: typeof ALL_PRODUCTS[0]) => {
    addItem({
      id: `${product.id}-M-${Date.now()}`,
      productId: product.id,
      brand: product.brand,
      name: product.name,
      image: product.image,
      size: 'M',
      price: product.sellingPrice,
      quantity: 1,
    })
    toggle(product.id)
  }

  if (productIds.length === 0) {
    return <EmptyWishlist />
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold font-serif text-gray-900">Wishlist</h1>
        <p className="text-sm text-gray-400">{wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {wishlistProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden flex flex-col group"
          >
            {/* Image */}
            <div className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden">
              <Link to={`/product/${product.slug}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </Link>
              {product.discountPercent > 0 && (
                <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {product.discountPercent}% OFF
                </span>
              )}
              <button
                onClick={() => toggle(product.id)}
                aria-label="Remove from wishlist"
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm text-brand-red hover:bg-red-50 transition-colors"
              >
                <Heart size={13} fill="currentColor" />
              </button>
            </div>

            {/* Details */}
            <div className="p-3 flex flex-col gap-2 flex-1">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{product.brand}</p>
                <p className="text-xs text-gray-800 leading-snug mt-0.5 line-clamp-2">{product.name}</p>
              </div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-bold font-mono text-gray-900 text-sm">{formatINR(product.sellingPrice)}</span>
                {product.mrp > product.sellingPrice && (
                  <span className="text-xs text-gray-400 line-through font-mono">{formatINR(product.mrp)}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-1.5 mt-auto pt-1">
                <button
                  onClick={() => handleMoveToBag(product)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1 h-8 rounded-lg text-[11px] font-semibold',
                    'bg-brand-red text-white hover:bg-[#A8001A] transition-colors',
                  )}
                >
                  <ShoppingBag size={12} /> Move to Bag
                </button>
                <button
                  onClick={() => toggle(product.id)}
                  aria-label="Remove"
                  className="w-8 h-8 rounded-lg border border-[#E8E8E8] flex items-center justify-center text-gray-400 hover:text-danger hover:border-red-200 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyWishlist() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold font-serif text-gray-900">Wishlist</h1>
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-white rounded-2xl border border-[#EBEBEB]">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <Heart size={28} className="text-brand-red/40" />
        </div>
        <div>
          <p className="font-semibold text-gray-700">Your wishlist is empty</p>
          <p className="text-sm text-gray-400 mt-1">Save items you love and find them here</p>
        </div>
        <Link
          to="/"
          className="mt-2 px-6 py-2.5 bg-brand-red text-white text-sm font-semibold rounded-lg hover:bg-[#A8001A] transition-colors"
        >
          Start Wishlisting
        </Link>
      </div>
    </div>
  )
}
