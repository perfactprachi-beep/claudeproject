import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Search, ChevronRight, Flame, SlidersHorizontal, X } from 'lucide-react'
import { FilterPanel } from '@pages/ProductListingPage/FilterPanel'
import { MobileFilterSheet } from '@pages/ProductListingPage/MobileFilterSheet'
import { ActiveFilters } from '@pages/ProductListingPage/ActiveFilters'
import { SortBar } from '@pages/ProductListingPage/SortBar'
import { ProductGrid } from '@pages/ProductListingPage/ProductGrid'
import { usePLPStore } from '@store/usePLPStore'
import { WOMEN_ETHNIC_WEAR } from '@data/products/womenEthnicWear'
import { SPELL_CORRECTIONS, DID_YOU_MEAN } from '@data/search'
import { trackViewSearchResults } from '@utils/analytics'
import type { PLPProduct, ProductSize } from '@typedefs/product'
import { cn } from '@utils/cn'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CategoryOption {
  label: string
  value: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12

const CATEGORY_OPTIONS: CategoryOption[] = [
  { label: 'Kurtis',       value: 'kurti' },
  { label: 'Sarees',       value: 'saree' },
  { label: 'Salwar Suits', value: 'suit'  },
]

// ─── Product search ───────────────────────────────────────────────────────────

function searchProducts(query: string): PLPProduct[] {
  const lower = query.toLowerCase().trim()
  if (!lower) return WOMEN_ETHNIC_WEAR
  return WOMEN_ETHNIC_WEAR.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.brand.toLowerCase().includes(lower) ||
      p.subCategory.toLowerCase().includes(lower) ||
      p.colourName.toLowerCase().includes(lower),
  )
}

// ─── Category filter chip ─────────────────────────────────────────────────────

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
        active
          ? 'bg-[#C0001D] border-[#C0001D] text-white'
          : 'bg-white border-[#DCDCDC] text-gray-700 hover:border-gray-400',
      )}
    >
      {label}
      {active && <X size={11} className="shrink-0" />}
    </button>
  )
}

// ─── No Results ───────────────────────────────────────────────────────────────

function NoResults({ query }: { query: string }) {
  const navigate = useNavigate()
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12">
      {/* Message + action chips */}
      <div className="text-center max-w-md mx-auto mb-14">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
          <Search size={28} className="text-gray-300" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          No results for &ldquo;{query}&rdquo;
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          We couldn&apos;t find anything matching your search. Try one of these:
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="flex items-center gap-2 px-4 py-2 border border-[#DCDCDC] rounded-full text-sm text-gray-600">
            <span aria-hidden>✏️</span> Check spelling
          </span>
          <span className="flex items-center gap-2 px-4 py-2 border border-[#DCDCDC] rounded-full text-sm text-gray-600">
            <span aria-hidden>🔍</span> Try broader terms
          </span>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 border border-[#DCDCDC] rounded-full text-sm text-gray-700 hover:border-[#C0001D] hover:text-[#C0001D] transition-colors"
          >
            <span aria-hidden>📂</span> Browse categories
          </Link>
        </div>
      </div>

      {/* Trending Now strip */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Flame size={16} className="text-[#C0001D]" />
          Trending Now
        </h2>
        <ProductGrid
          products={WOMEN_ETHNIC_WEAR.filter((p) => p.isBestseller).slice(0, 4)}
          isLoading={false}
          listName="Trending"
        />
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/category/women-ethnic-wear')}
            className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-[#1A1A2E] text-[#1A1A2E] text-sm font-bold rounded-lg hover:bg-[#1A1A2E] hover:text-white transition-all"
          >
            View All Products
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SearchPage() {
  const [searchParams]        = useSearchParams()
  const rawQuery              = searchParams.get('q') ?? ''

  // Spell correction
  const lowerRaw              = rawQuery.toLowerCase().trim()
  const correctedQuery        = SPELL_CORRECTIONS[lowerRaw] ?? rawQuery
  const isAutoCorrected       = !!SPELL_CORRECTIONS[lowerRaw]
  const lowerCorrected        = correctedQuery.toLowerCase().trim()
  const didYouMean            = DID_YOU_MEAN[lowerCorrected] ?? null

  const { filters, sortBy, clearFilters } = usePLPStore()

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [visibleCount, setVisibleCount]             = useState(PAGE_SIZE)
  const [isLoading, setIsLoading]                   = useState(true)
  const [mobileFilterOpen, setMobileFilterOpen]     = useState(false)

  // Base results for corrected query
  const baseResults = useMemo(() => searchProducts(correctedQuery), [correctedQuery])

  // Simulate fetch delay
  useEffect(() => {
    setIsLoading(true)
    const t = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(t)
  }, [correctedQuery])

  // Reset pagination when anything filter-related changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filters, sortBy, selectedCategories, correctedQuery])

  // Apply all filters + sort
  const filtered = useMemo(() => {
    let list = [...baseResults]

    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.subCategory))
    }
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

    switch (sortBy) {
      case 'new_arrivals':     list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break
      case 'price_low':        list.sort((a, b) => a.sellingPrice - b.sellingPrice); break
      case 'price_high':       list.sort((a, b) => b.sellingPrice - a.sellingPrice); break
      case 'bestsellers':      list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0)); break
      case 'biggest_discount': list.sort((a, b) => b.discountPercent - a.discountPercent); break
    }

    return list
  }, [baseResults, filters, sortBy, selectedCategories])

  const visible      = filtered.slice(0, visibleCount)
  const hasMore      = visibleCount < filtered.length
  const hasNoResults = !isLoading && baseResults.length === 0

  // GA4: view_search_results fires when results are ready
  useEffect(() => {
    if (!isLoading && correctedQuery) {
      trackViewSearchResults(correctedQuery, filtered.length)
    }
  }, [isLoading, correctedQuery, filtered.length])

  const filterCount =
    filters.brands.length +
    filters.sizes.length +
    filters.colours.length +
    selectedCategories.length +
    (filters.minDiscount !== null ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000 ? 1 : 0)

  const toggleCategory = useCallback((value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    )
  }, [])

  const clearAll = useCallback(() => {
    clearFilters()
    setSelectedCategories([])
  }, [clearFilters])

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-brand-warm">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 md:py-5">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex items-center gap-1 text-xs text-gray-500 flex-wrap">
              <li>
                <Link to="/" className="hover:text-[#C0001D] transition-colors">Home</Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight size={11} className="text-gray-300 shrink-0" />
                <span className="text-gray-700 font-medium">Search</span>
              </li>
            </ol>
          </nav>

          {/* Heading */}
          {!isLoading && (
            hasNoResults ? (
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A2E]">
                No results for &ldquo;{rawQuery}&rdquo;
              </h1>
            ) : isAutoCorrected ? (
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A2E]">
                  Showing results for &ldquo;
                  <span className="text-[#C0001D]">{correctedQuery}</span>&rdquo;
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  No results for &ldquo;{rawQuery}&rdquo;. Showing results for &ldquo;{correctedQuery}&rdquo; instead.
                </p>
              </div>
            ) : (
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A2E]">
                Showing {baseResults.length} results for &ldquo;
                <span className="text-[#C0001D]">{rawQuery}</span>&rdquo;
              </h1>
            )
          )}

          {/* Did you mean */}
          {!hasNoResults && didYouMean && (
            <p className="text-sm text-gray-600 mt-2">
              Did you mean:{' '}
              <Link
                to={`/search?q=${encodeURIComponent(didYouMean)}`}
                className="text-[#C0001D] font-semibold hover:underline"
              >
                {didYouMean}
              </Link>
              ?
            </p>
          )}
        </div>
      </div>

      {/* ── No results ──────────────────────────────────────────────────────── */}
      {hasNoResults ? (
        <NoResults query={rawQuery} />
      ) : (
        /* ── Results layout ─────────────────────────────────────────────────── */
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex gap-6 lg:gap-8">

            {/* ── Desktop sidebar ────────────────────────────────────────── */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl shadow-card p-4">
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                      Filters
                    </h2>
                    {filterCount > 0 && (
                      <button
                        onClick={clearAll}
                        className="text-xs text-[#C0001D] font-semibold hover:underline"
                      >
                        Clear ({filterCount})
                      </button>
                    )}
                  </div>

                  {/* Category filter (search-specific — sits above PLP filters) */}
                  <div className="border-b border-gray-100 pb-4 mb-1">
                    <button
                      className="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-800"
                    >
                      Category
                    </button>
                    <div className="space-y-2.5">
                      {CATEGORY_OPTIONS.map(({ label, value }) => (
                        <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(value)}
                            onChange={() => toggleCategory(value)}
                            className="w-4 h-4 accent-[#C0001D] rounded"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <FilterPanel />
                </div>
              </div>
            </aside>

            {/* ── Main content ────────────────────────────────────────────── */}
            <main className="flex-1 min-w-0">

              {/* Mobile category chips (above SortBar) */}
              <div className="lg:hidden flex items-center gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
                <span className="text-xs font-semibold text-gray-500 shrink-0 flex items-center gap-1">
                  <SlidersHorizontal size={13} /> Category:
                </span>
                {CATEGORY_OPTIONS.map(({ label, value }) => (
                  <CategoryChip
                    key={value}
                    label={label}
                    active={selectedCategories.includes(value)}
                    onClick={() => toggleCategory(value)}
                  />
                ))}
              </div>

              <SortBar
                totalProducts={filtered.length}
                filterCount={filterCount}
                onOpenMobileFilters={() => setMobileFilterOpen(true)}
              />

              {/* Active filter chips */}
              {filterCount > 0 && (
                <div className="mb-4 flex flex-col gap-2">
                  <ActiveFilters />
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((val) => {
                        const opt = CATEGORY_OPTIONS.find((c) => c.value === val)
                        return (
                          <button
                            key={val}
                            onClick={() => toggleCategory(val)}
                            className="flex items-center gap-1.5 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            Category: {opt?.label}
                            <X size={11} />
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Product grid */}
              <ProductGrid
                products={visible}
                isLoading={isLoading}
                listName={`Search: ${correctedQuery}`}
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
                        onClick={() =>
                          setVisibleCount((n) => Math.min(n + PAGE_SIZE, filtered.length))
                        }
                        className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#1A1A2E] text-[#1A1A2E] text-sm font-bold rounded-lg hover:bg-[#1A1A2E] hover:text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A2E] focus-visible:ring-offset-2"
                      >
                        Load More
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 pb-4">
                      You&apos;ve seen all {filtered.length} products
                    </p>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* Mobile filter sheet */}
      <MobileFilterSheet
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      />
    </div>
  )
}
