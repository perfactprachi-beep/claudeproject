import { useEffect } from 'react'
import { X } from 'lucide-react'
import { FilterPanel } from './FilterPanel'
import { usePLPStore } from '@store/usePLPStore'

interface MobileFilterSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileFilterSheet({ isOpen, onClose }: MobileFilterSheetProps) {
  const { filters, clearFilters } = usePLPStore()

  const filterCount =
    filters.brands.length +
    filters.sizes.length +
    filters.colours.length +
    (filters.minDiscount !== null ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000 ? 1 : 0)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl max-h-[88vh] flex flex-col lg:hidden animate-slide-up"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <span className="text-base font-semibold text-gray-900">
            Filters{' '}
            {filterCount > 0 && (
              <span className="text-brand-red">({filterCount})</span>
            )}
          </span>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="p-1.5 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable filter content */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          <FilterPanel />
        </div>

        {/* Sticky footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3 bg-white">
          <button
            onClick={clearFilters}
            className="flex-1 py-3 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-brand-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  )
}
