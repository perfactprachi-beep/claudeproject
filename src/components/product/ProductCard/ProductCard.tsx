import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@utils/cn'
import { formatINR } from '@utils/format'
import { useWishlistStore } from '@store/useWishlistStore'
import { trackProductImpression } from '@utils/analytics'
import type { Product } from '@typedefs/product'

interface ProductCardProps {
  product: Product
  position?: number
}

export const ProductCard = ({ product, position = 0 }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { toggle, isWishlisted } = useWishlistStore()
  const wishlisted = isWishlisted(product.id)

  useEffect(() => {
    trackProductImpression(product.id, position)
  }, [product.id, position])

  return (
    <article className="product-card group relative bg-white rounded-md overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300">
      {/* Badge */}
      {(product.isNew || product.isBestseller) && (
        <span
          className={cn(
            'absolute top-2 left-2 z-10 px-2 py-0.5 text-[10px] font-semibold rounded-sm uppercase tracking-wider pointer-events-none',
            product.isBestseller
              ? 'bg-brand-red text-white'
              : 'bg-brand-navy text-white',
          )}
        >
          {product.isBestseller ? 'Bestseller' : 'New'}
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={() => toggle(product.id)}
        aria-label={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
        className={cn(
          'absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full',
          'bg-white shadow-card transition-all duration-200',
          'opacity-0 group-hover:opacity-100 hover:scale-110',
        )}
      >
        <Heart
          size={16}
          className={wishlisted ? 'fill-brand-red text-brand-red' : 'text-gray-500'}
        />
      </button>

      {/* Image + Add to Bag */}
      <a href={`/product/${product.slug}`} className="block overflow-hidden">
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          {!imageLoaded && <div className="absolute inset-0 skeleton" />}
          <img
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={cn(
              'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105',
              !imageLoaded && 'opacity-0',
            )}
          />
        </div>

        {/* "Add to Bag" slides up on hover */}
        <div className="overflow-hidden">
          <div className="add-to-bag-reveal bg-brand-navy text-white text-sm font-semibold text-center py-3 tracking-widest uppercase">
            Add to Bag
          </div>
        </div>
      </a>

      {/* Info */}
      <div className="p-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5 font-sans">
          {product.brand}
        </p>
        <p className="text-sm text-gray-800 line-clamp-2 mb-2 leading-snug font-sans">
          {product.name}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm font-medium text-gray-900">
            {formatINR(product.sellingPrice)}
          </span>
          {product.mrp !== product.sellingPrice && (
            <span className="font-mono text-xs text-gray-400 line-through">
              {formatINR(product.mrp)}
            </span>
          )}
          {product.discountPercent >= 1 && (
            <span className="text-[11px] font-semibold text-discount bg-green-50 px-1.5 py-0.5 rounded-sm">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
