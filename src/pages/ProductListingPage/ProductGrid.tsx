import { ProductCard } from './ProductCard'
import type { PLPProduct } from '@typedefs/product'

interface ProductGridProps {
  products: PLPProduct[]
  isLoading: boolean
  listName?: string
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-card">
      <div className="skeleton" style={{ paddingTop: '133.33%' }} />
      <div className="p-3 space-y-2">
        <div className="skeleton h-2.5 w-14 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="flex gap-1 mt-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-5 w-7 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProductGrid({ products, isLoading, listName = 'PLP' }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="w-20 h-20 mb-5 rounded-full bg-gray-100 flex items-center justify-center text-4xl">
          🛍️
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No products found</h3>
        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
          Try adjusting or clearing your filters to discover more styles.
        </p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
      role="list"
      aria-label="Product grid"
    >
      {products.map((product, index) => (
        <div key={product.id} role="listitem">
          <ProductCard product={product} position={index + 1} listName={listName} />
        </div>
      ))}
    </div>
  )
}
