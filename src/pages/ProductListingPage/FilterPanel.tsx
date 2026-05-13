import { useState } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { PriceRangeSlider } from './PriceRangeSlider'
import { usePLPStore } from '@store/usePLPStore'
import { trackFilterApplied } from '@utils/analytics'
import { WEW_BRANDS, WEW_COLOURS } from '@data/products/womenEthnicWear'
import type { ProductSize } from '@typedefs/product'
import { cn } from '@utils/cn'

const ALL_SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const DISCOUNT_OPTIONS = [10, 20, 30, 50]

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-800 hover:text-brand-red transition-colors"
        aria-expanded={open}
      >
        <span>{title}</span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  )
}

export function FilterPanel() {
  const {
    filters,
    toggleBrand,
    setPriceRange,
    toggleSize,
    toggleColour,
    setMinDiscount,
    setInStockOnly,
  } = usePLPStore()

  const [brandSearch, setBrandSearch] = useState('')
  const [showAllBrands, setShowAllBrands] = useState(false)

  const filteredBrands = WEW_BRANDS.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase()),
  )
  const displayedBrands = showAllBrands ? filteredBrands : filteredBrands.slice(0, 8)
  const hiddenCount = filteredBrands.length - 8

  function handleBrandToggle(brand: string) {
    toggleBrand(brand)
    trackFilterApplied('brand', brand)
  }

  function handleSizeToggle(size: ProductSize) {
    toggleSize(size)
    trackFilterApplied('size', size)
  }

  function handleColourToggle(colour: string) {
    toggleColour(colour)
    trackFilterApplied('colour', colour)
  }

  function handleDiscountChange(discount: number) {
    const next = filters.minDiscount === discount ? null : discount
    setMinDiscount(next)
    if (next !== null) trackFilterApplied('discount', `${discount}%+`)
  }

  function handleAvailabilityToggle() {
    const next = !filters.inStockOnly
    setInStockOnly(next)
    trackFilterApplied('availability', next ? 'in_stock' : 'all')
  }

  return (
    <div className="w-full">
      {/* Brand */}
      <FilterSection title="Brand">
        <div className="relative mb-2.5">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search brands"
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>
        <div className="space-y-2.5">
          {displayedBrands.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className="w-4 h-4 accent-brand-red rounded"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
        {filteredBrands.length > 8 && (
          <button
            onClick={() => setShowAllBrands(!showAllBrands)}
            className="mt-2.5 text-xs font-semibold text-brand-red hover:underline"
          >
            {showAllBrands ? 'View Less ↑' : `+${hiddenCount} More`}
          </button>
        )}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <PriceRangeSlider
          min={0}
          max={20000}
          value={filters.priceRange}
          onChange={(range) => {
            setPriceRange(range)
            trackFilterApplied('price_range', `${range[0]}-${range[1]}`)
          }}
        />
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={cn(
                'min-w-[40px] px-3 py-1.5 text-xs border rounded transition-all font-medium',
                filters.sizes.includes(size)
                  ? 'border-brand-red bg-brand-red text-white'
                  : 'border-gray-200 text-gray-700 hover:border-gray-400',
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Colour */}
      <FilterSection title="Colour">
        <div className="flex flex-wrap gap-3 pt-1">
          {WEW_COLOURS.map((colour) => (
            <div key={colour.name} className="relative group">
              <button
                onClick={() => handleColourToggle(colour.name)}
                aria-label={colour.name}
                className={cn(
                  'w-7 h-7 rounded-full border-2 transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brand-red',
                  filters.colours.includes(colour.name)
                    ? 'border-brand-red ring-2 ring-brand-red ring-offset-1 scale-110'
                    : 'border-white shadow-md',
                )}
                style={{ backgroundColor: colour.hex }}
              />
              {/* Tooltip */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-gray-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {colour.name}
              </span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Discount */}
      <FilterSection title="Discount" defaultOpen={false}>
        <div className="space-y-2.5">
          {DISCOUNT_OPTIONS.map((discount) => (
            <label key={discount} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="discount-filter"
                checked={filters.minDiscount === discount}
                onChange={() => handleDiscountChange(discount)}
                className="w-4 h-4 accent-brand-red"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                {discount}% or more
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" defaultOpen={false}>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-700">In Stock Only</span>
          <button
            role="switch"
            aria-checked={filters.inStockOnly}
            onClick={handleAvailabilityToggle}
            className={cn(
              'relative w-10 h-5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-1',
              filters.inStockOnly ? 'bg-brand-red' : 'bg-gray-200',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                filters.inStockOnly ? 'left-5' : 'left-0.5',
              )}
            />
          </button>
        </label>
      </FilterSection>
    </div>
  )
}
