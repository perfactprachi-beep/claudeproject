import { X } from 'lucide-react'
import { usePLPStore } from '@store/usePLPStore'
import { formatINR } from '@utils/format'
import type { FilterState } from '@typedefs/product'

interface Chip {
  label: string
  filterKey: keyof FilterState
  value?: string
}

export function ActiveFilters() {
  const { filters, removeFilter, clearFilters } = usePLPStore()

  const chips: Chip[] = [
    ...filters.brands.map((b) => ({ label: b, filterKey: 'brands' as keyof FilterState, value: b })),
    ...filters.sizes.map((s) => ({ label: s, filterKey: 'sizes' as keyof FilterState, value: s })),
    ...filters.colours.map((c) => ({ label: c, filterKey: 'colours' as keyof FilterState, value: c })),
    ...(filters.minDiscount !== null
      ? [{ label: `${filters.minDiscount}%+ Off`, filterKey: 'minDiscount' as keyof FilterState }]
      : []),
    ...(filters.inStockOnly
      ? [{ label: 'In Stock', filterKey: 'inStockOnly' as keyof FilterState }]
      : []),
    ...(filters.priceRange[0] > 0 || filters.priceRange[1] < 20000
      ? [
          {
            label: `${formatINR(filters.priceRange[0])} – ${formatINR(filters.priceRange[1])}`,
            filterKey: 'priceRange' as keyof FilterState,
          },
        ]
      : []),
  ]

  if (chips.length === 0) return null

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1" role="list">
      {chips.map((chip, i) => (
        <button
          key={i}
          role="listitem"
          onClick={() => removeFilter(chip.filterKey, chip.value)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-full whitespace-nowrap transition-colors group flex-shrink-0"
          aria-label={`Remove ${chip.label} filter`}
        >
          <span>{chip.label}</span>
          <X size={11} className="text-gray-400 group-hover:text-gray-700 flex-shrink-0" />
        </button>
      ))}

      <button
        onClick={clearFilters}
        className="ml-1 flex-shrink-0 text-xs font-semibold text-brand-red hover:underline whitespace-nowrap"
      >
        Clear All
      </button>
    </div>
  )
}
