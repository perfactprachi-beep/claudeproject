import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { FilterPanel } from './FilterPanel'
import { MobileFilterSheet } from './MobileFilterSheet'
import { ActiveFilters } from './ActiveFilters'
import { SortBar } from './SortBar'
import { ProductGrid } from './ProductGrid'
import { usePLPStore } from '@store/usePLPStore'
import { WOMEN_ETHNIC_WEAR } from '@data/products/womenEthnicWear'
import type { PLPProduct, ProductSize } from '@typedefs/product'

const PAGE_SIZE = 12

interface CategoryMeta {
  title: string
  breadcrumb: string[]
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  'women-ethnic-wear': {
    title: "Women's Ethnic Wear",
    breadcrumb: ['Women', 'Ethnic Wear'],
  },
}

function getProducts(slug: string): PLPProduct[] {
  if (slug === 'women-ethnic-wear') return WOMEN_ETHNIC_WEAR
  return []
}

export function ProductListingPage() {
  const { categorySlug = '' } = useParams<{ categorySlug: string }>()
  const { filters, sortBy, clearFilters } = usePLPStore()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [isLoading, setIsLoading] = useState(true)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const meta = CATEGORY_META[categorySlug] ?? { title: 'Products', breadcrumb: ['Products'] }
  const allProducts = useMemo(() => getProducts(categorySlug), [categorySlug])

  // Simulate network fetch
  useEffect(() => {
    setIsLoading(true)
    const t = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(t)
  }, [categorySlug])

  // Reset pagination when filters/sort change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filters, sortBy])

  // Preserve scroll position across back navigation
  useEffect(() => {
    const key = `plp-scroll-${categorySlug}`
    const saved = sessionStorage.getItem(key)
    if (saved) {
      requestAnimationFrame(() => window.scrollTo(0, parseInt(saved, 10)))
      sessionStorage.removeItem(key)
    }
    return () => {
      sessionStorage.setItem(key, String(Math.round(window.scrollY)))
    }
  }, [categorySlug])

  // Apply filters
  const filtered = useMemo(() => {
    let list = [...allProducts]

    if (filters.brands.length > 0) {
      list = list.filter((p) => filters.brands.includes(p.brand))
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000) {
      list = list.filter(
        (p) => p.sellingPrice >= filters.priceRange[0] && p.sellingPrice <= filters.priceRange[1],
      )
    }
    if (filters.sizes.length > 0) {
      list = list.filter((p) =>
        filters.sizes.some((s) => p.availableSizes.includes(s as ProductSize)),
      )
    }
    if (filters.colours.length > 0) {
      list = list.filter((p) => filters.colours.includes(p.colourName))
    }
    if (filters.minDiscount !== null) {
      list = list.filter((p) => p.discountPercent >= filters.minDiscount!)
    }
    if (filters.inStockOnly) {
      list = list.filter((p) => p.inStock)
    }

    // Sort
    switch (sortBy) {
      case 'new_arrivals':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'price_low':
        list.sort((a, b) => a.sellingPrice - b.sellingPrice)
        break
      case 'price_high':
        list.sort((a, b) => b.sellingPrice - a.sellingPrice)
        break
      case 'bestsellers':
        list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
        break
      case 'biggest_discount':
        list.sort((a, b) => b.discountPercent - a.discountPercent)
        break
      default:
        break
    }

    return list
  }, [allProducts, filters, sortBy])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const loadMore = useCallback(() => {
    setVisibleCount((n) => Math.min(n + PAGE_SIZE, filtered.length))
  }, [filtered.length])

  const filterCount =
    filters.brands.length +
    filters.sizes.length +
    filters.colours.length +
    (filters.minDiscount !== null ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000 ? 1 : 0)

  return (
    <div className="min-h-screen bg-brand-warm">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-2.5">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-xs text-gray-500 flex-wrap">
              <li>
                <Link to="/" className="hover:text-brand-red transition-colors">
                  Home
                </Link>
              </li>
              {meta.breadcrumb.map((crumb, i) => (
                <li key={i} className="flex items-center gap-1">
                  <ChevronRight size={11} className="text-gray-300 flex-shrink-0" />
                  {i === meta.breadcrumb.length - 1 ? (
                    <span className="text-gray-700 font-medium" aria-current="page">
                      {crumb}
                    </span>
                  ) : (
                    <span className="hover:text-brand-red cursor-pointer transition-colors">
                      {crumb}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      {/* Page title */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 md:py-5">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-brand-navy">
            {meta.title}
          </h1>
        </div>
      </div>

      {/* Layout: sidebar + main */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 lg:gap-8">
          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-card p-4">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Filters
                  </h2>
                  {filterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-brand-red font-semibold hover:underline"
                    >
                      Clear ({filterCount})
                    </button>
                  )}
                </div>
                <FilterPanel />
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0">
            <SortBar
              totalProducts={filtered.length}
              filterCount={filterCount}
              onOpenMobileFilters={() => setMobileFilterOpen(true)}
            />

            {/* Active filter chips */}
            {filterCount > 0 && (
              <div className="mb-4">
                <ActiveFilters />
              </div>
            )}

            {/* Product grid */}
            <ProductGrid
              products={visible}
              isLoading={isLoading}
              listName={meta.title}
            />

            {/* Pagination */}
            {!isLoading && filtered.length > 0 && (
              <div className="mt-10 text-center">
                {hasMore ? (
                  <>
                    <p className="text-sm text-gray-500 mb-3">
                      Showing{' '}
                      <span className="font-semibold text-gray-800">{visible.length}</span> of{' '}
                      <span className="font-semibold text-gray-800">{filtered.length}</span>{' '}
                      products
                    </p>
                    <button
                      onClick={loadMore}
                      className="inline-flex items-center gap-2 px-8 py-3 border-2 border-brand-navy text-brand-navy text-sm font-bold rounded-lg hover:bg-brand-navy hover:text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2"
                    >
                      Load More
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 pb-4">
                    You've seen all {filtered.length} products
                  </p>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <MobileFilterSheet
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      />
    </div>
  )
}
