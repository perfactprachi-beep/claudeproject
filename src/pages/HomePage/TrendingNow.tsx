import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { trendingProducts } from '@data/products/trending'
import { ProductCard } from '@components/product/ProductCard'

export const TrendingNow = () => {
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef) return
    scrollRef.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' })
  }

  return (
    <section aria-labelledby="trending-heading" className="py-10 md:py-14 bg-brand-warm">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16">

        <div className="flex items-baseline justify-between mb-6 md:mb-8">
          <h2
            id="trending-heading"
            className="font-serif text-2xl md:text-3xl text-brand-navy"
          >
            Trending Now
          </h2>
          <div className="flex items-center gap-3">
            {/* Scroll arrows — desktop */}
            <div className="hidden md:flex gap-1.5">
              <button
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                className="w-8 h-8 rounded-full border border-[#E8E8E8] flex items-center justify-center text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                className="w-8 h-8 rounded-full border border-[#E8E8E8] flex items-center justify-center text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <a
              href="/new-arrivals"
              className="text-sm font-semibold font-sans text-brand-red hover:underline underline-offset-2 whitespace-nowrap"
            >
              View All →
            </a>
          </div>
        </div>

        {/* Desktop: 4-col grid | Mobile: horizontal scroll */}
        <div
          ref={setScrollRef}
          className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:pb-0"
        >
          {trendingProducts.map((product, index) => (
            <div key={product.id} className="flex-shrink-0 w-52 sm:w-60 md:w-auto">
              <ProductCard product={product} position={index} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
