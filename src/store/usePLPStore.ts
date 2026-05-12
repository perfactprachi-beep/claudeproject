import { create } from 'zustand'
import type { FilterState, SortOption, ProductSize } from '@typedefs/product'

const DEFAULT_FILTERS: FilterState = {
  brands: [],
  priceRange: [0, 20000],
  sizes: [],
  colours: [],
  minDiscount: null,
  inStockOnly: false,
}

interface PLPStore {
  filters: FilterState
  sortBy: SortOption
  toggleBrand: (brand: string) => void
  setPriceRange: (range: [number, number]) => void
  toggleSize: (size: ProductSize) => void
  toggleColour: (colour: string) => void
  setMinDiscount: (discount: number | null) => void
  setInStockOnly: (value: boolean) => void
  removeFilter: (key: keyof FilterState, value?: string) => void
  clearFilters: () => void
  setSortBy: (sort: SortOption) => void
}

export const usePLPStore = create<PLPStore>((set) => ({
  filters: { ...DEFAULT_FILTERS },
  sortBy: 'relevance',

  toggleBrand: (brand) =>
    set((s) => ({
      filters: {
        ...s.filters,
        brands: s.filters.brands.includes(brand)
          ? s.filters.brands.filter((b) => b !== brand)
          : [...s.filters.brands, brand],
      },
    })),

  setPriceRange: (range) =>
    set((s) => ({ filters: { ...s.filters, priceRange: range } })),

  toggleSize: (size) =>
    set((s) => ({
      filters: {
        ...s.filters,
        sizes: s.filters.sizes.includes(size)
          ? s.filters.sizes.filter((sz) => sz !== size)
          : [...s.filters.sizes, size],
      },
    })),

  toggleColour: (colour) =>
    set((s) => ({
      filters: {
        ...s.filters,
        colours: s.filters.colours.includes(colour)
          ? s.filters.colours.filter((c) => c !== colour)
          : [...s.filters.colours, colour],
      },
    })),

  setMinDiscount: (discount) =>
    set((s) => ({ filters: { ...s.filters, minDiscount: discount } })),

  setInStockOnly: (value) =>
    set((s) => ({ filters: { ...s.filters, inStockOnly: value } })),

  removeFilter: (key, value) =>
    set((s) => {
      const f = { ...s.filters }
      if (key === 'brands' && value) f.brands = f.brands.filter((b) => b !== value)
      else if (key === 'sizes' && value) f.sizes = f.sizes.filter((sz) => sz !== value)
      else if (key === 'colours' && value) f.colours = f.colours.filter((c) => c !== value)
      else if (key === 'minDiscount') f.minDiscount = null
      else if (key === 'inStockOnly') f.inStockOnly = false
      else if (key === 'priceRange') f.priceRange = [0, 20000]
      return { filters: f }
    }),

  clearFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

  setSortBy: (sort) => set({ sortBy: sort }),
}))
