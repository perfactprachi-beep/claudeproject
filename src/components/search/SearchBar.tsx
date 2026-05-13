import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Search, X, ArrowLeft, Clock, Flame, Tag, ChevronRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSearchStore } from '@store/useSearchStore'
import { useSearch } from '@hooks/useSearch'
import { SearchHighlight } from './SearchHighlight'
import { POPULAR_BRANDS, TRENDING_SEARCHES } from '@data/search'
import { trackSearch, trackSelectSearchContent } from '@utils/analytics'
import { cn } from '@utils/cn'

export function SearchBar() {
  const [isOpen, setIsOpen]       = useState(false)
  const [query, setQuery]         = useState('')
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef                  = useRef<HTMLInputElement>(null)
  const navigate                  = useNavigate()

  const { recentSearches, addRecentSearch, removeRecentSearch } = useSearchStore()
  const { suggestions, categoryShortcuts } = useSearch(query)

  const showLive = query.length >= 2

  // ── Open / close ────────────────────────────────────────────────────────────

  const open = useCallback(() => {
    setIsOpen(true)
    setQuery('')
    setActiveIdx(-1)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setActiveIdx(-1)
  }, [])

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [close])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── Navigation ───────────────────────────────────────────────────────────────

  const goSearch = useCallback(
    (term: string) => {
      if (!term.trim()) return
      addRecentSearch(term.trim())
      trackSearch(term.trim())
      navigate(`/search?q=${encodeURIComponent(term.trim())}`)
      close()
    },
    [addRecentSearch, navigate, close],
  )

  const handleSuggestionClick = (suggestion: string) => {
    trackSelectSearchContent('search_suggestion', suggestion)
    goSearch(suggestion)
  }

  const handleBrandClick = (brandName: string, href: string) => {
    trackSelectSearchContent('brand', brandName)
    navigate(href)
    close()
  }

  const handleCategoryClick = (label: string, href: string) => {
    trackSelectSearchContent('category', label)
    navigate(href)
    close()
  }

  // ── Keyboard nav on input ────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0 && suggestions[activeIdx]) {
        handleSuggestionClick(suggestions[activeIdx])
      } else {
        goSearch(query)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, -1))
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Trigger button — lives in the header icon row */}
      <button
        onClick={open}
        aria-label="Open search"
        className="p-2 text-gray-600 hover:text-[#C0001D] transition-colors rounded-full hover:bg-gray-50"
      >
        <Search size={20} />
      </button>

      {/* ── Search overlay ──────────────────────────────────────────────────── */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[55] bg-black/30 animate-fade-in"
            onClick={close}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            role="dialog"
            aria-label="Search"
            aria-modal="true"
            className="fixed inset-x-0 top-0 z-[60] bg-white animate-search-slide"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          >
            {/* ── Input row ──────────────────────────────────────────────── */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16 h-16 md:h-20 flex items-center gap-3">
              <button
                onClick={close}
                aria-label="Close search"
                className="p-2 -ml-1 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 shrink-0"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1) }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for products, brands, categories..."
                  autoComplete="off"
                  aria-label="Search"
                  aria-autocomplete="list"
                  aria-expanded={showLive}
                  className="w-full pl-10 pr-10 py-3 border border-[#E0E0E0] rounded-xl bg-[#FAFAFA] text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C0001D] focus:ring-2 focus:ring-[#C0001D]/10 transition-colors"
                />
                {query && (
                  <button
                    onClick={() => { setQuery(''); inputRef.current?.focus() }}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* ── Dropdown ───────────────────────────────────────────────── */}
            <div
              className="border-t border-[#F0F0F0] max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide"
              role="listbox"
            >
              <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16 py-5 flex flex-col gap-6">

                {/* 1. Live suggestions (≥2 chars) */}
                {showLive && suggestions.length > 0 && (
                  <section aria-label="Suggestions">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Suggestions
                    </p>
                    <ul>
                      {suggestions.map((s, i) => (
                        <li key={s}>
                          <button
                            role="option"
                            aria-selected={i === activeIdx}
                            onClick={() => handleSuggestionClick(s)}
                            className={cn(
                              'w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-left text-sm text-gray-700 hover:bg-[#F5F5F5] transition-colors',
                              i === activeIdx && 'bg-[#F5F5F5]',
                            )}
                          >
                            <Search size={14} className="text-gray-400 shrink-0" />
                            <SearchHighlight text={s} query={query} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* 2. Category shortcuts (when query matches a category keyword) */}
                {showLive && categoryShortcuts.length > 0 && (
                  <section aria-label="Categories">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Categories
                    </p>
                    <ul>
                      {categoryShortcuts.map((cat) => (
                        <li key={cat.href}>
                          <button
                            onClick={() => handleCategoryClick(cat.label, cat.href)}
                            className="w-full flex items-center justify-between gap-3 px-2 py-2.5 rounded-lg text-left text-sm text-gray-700 hover:bg-[#F5F5F5] transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <Tag size={14} className="text-gray-400 shrink-0" />
                              {cat.breadcrumb.map((crumb, i) => (
                                <span key={i} className="flex items-center gap-1">
                                  {i > 0 && (
                                    <ChevronRight size={11} className="text-gray-300 shrink-0" />
                                  )}
                                  <span
                                    className={
                                      i === cat.breadcrumb.length - 1
                                        ? 'font-semibold text-gray-900'
                                        : 'text-gray-500'
                                    }
                                  >
                                    {crumb}
                                  </span>
                                </span>
                              ))}
                            </span>
                            <ChevronRight size={13} className="text-gray-400 shrink-0" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* 3. Popular brands */}
                <section aria-label="Popular brands">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Popular Brands
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {POPULAR_BRANDS.map((brand) => (
                      <button
                        key={brand.name}
                        onClick={() => handleBrandClick(brand.name, brand.href)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-[#EBEBEB] hover:border-gray-300 hover:shadow-sm transition-all bg-white"
                      >
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ backgroundColor: brand.bg, color: brand.color }}
                        >
                          {brand.abbr}
                        </span>
                        <span className="text-sm font-medium text-gray-800">{brand.name}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* 4. Recent searches */}
                {recentSearches.length > 0 && (
                  <section aria-label="Recent searches">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Recent Searches
                    </p>
                    <ul>
                      {recentSearches.map((term) => (
                        <li key={term} className="flex items-center gap-1">
                          <button
                            onClick={() => goSearch(term)}
                            className="flex-1 flex items-center gap-3 px-2 py-2.5 rounded-lg text-left text-sm text-gray-700 hover:bg-[#F5F5F5] transition-colors"
                          >
                            <Clock size={14} className="text-gray-400 shrink-0" />
                            {term}
                          </button>
                          <button
                            onClick={() => removeRecentSearch(term)}
                            aria-label={`Remove "${term}" from recent searches`}
                            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-[#F5F5F5] transition-colors"
                          >
                            <X size={13} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* 5. Trending searches */}
                <section aria-label="Trending searches">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Trending
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => goSearch(term)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF5F5] border border-[#FFD7D7] rounded-full text-xs font-medium text-gray-700 hover:bg-[#FFE8E8] transition-colors"
                      >
                        <Flame size={11} className="text-[#C0001D]" />
                        {term}
                      </button>
                    ))}
                  </div>
                </section>

              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
