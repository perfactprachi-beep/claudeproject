import { useState, useRef, useEffect } from 'react'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { usePLPStore } from '@store/usePLPStore'
import { trackSortChanged } from '@utils/analytics'
import type { SortOption } from '@typedefs/product'
import { cn } from '@utils/cn'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'new_arrivals', label: 'New Arrivals' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'bestsellers', label: 'Best Sellers' },
  { value: 'biggest_discount', label: 'Biggest Discount' },
]

interface SortBarProps {
  totalProducts: number
  filterCount: number
  onOpenMobileFilters: () => void
}

export function SortBar({ totalProducts, filterCount, onOpenMobileFilters }: SortBarProps) {
  const { sortBy, setSortBy } = usePLPStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Relevance'

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  function handleSort(option: SortOption) {
    setSortBy(option)
    trackSortChanged(option)
    setIsOpen(false)
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 mb-4">
      {/* Left — product count + mobile filter button */}
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{totalProducts}</span> Products
        </p>

        {/* Mobile filter trigger — hidden on desktop */}
        <button
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-400 transition-colors"
          aria-label="Open filters"
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {filterCount > 0 && (
            <span className="flex items-center justify-center w-4 h-4 bg-brand-red text-white text-[10px] font-bold rounded-full">
              {filterCount}
            </span>
          )}
        </button>
      </div>

      {/* Right — sort dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-sm hover:text-gray-900 transition-colors"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="text-gray-400 hidden sm:inline">Sort by:</span>
          <span className="font-medium text-gray-800">{currentLabel}</span>
          <ChevronDown
            size={15}
            className={cn('text-gray-500 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </button>

        {isOpen && (
          <div
            role="listbox"
            aria-label="Sort options"
            className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-dropdown border border-gray-100 z-30 overflow-hidden animate-fade-in"
          >
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                role="option"
                aria-selected={sortBy === option.value}
                onClick={() => handleSort(option.value)}
                className={cn(
                  'w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors',
                  sortBy === option.value
                    ? 'text-brand-red font-semibold bg-red-50'
                    : 'text-gray-700',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
