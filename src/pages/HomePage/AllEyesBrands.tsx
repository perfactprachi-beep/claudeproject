import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@utils/cn'

const brandSlides = [
  {
    id: 'b1',
    name: 'Adidas',
    offer: 'Up to 40% OFF',
    tag: 'Sport & Street',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=480&h=600&q=80&auto=format&fit=crop',
    link: '/brands/adidas',
    bgColor: '#111111',
  },
  {
    id: 'b2',
    name: 'Mango',
    offer: 'Up to 46% OFF',
    tag: "Women's Edit",
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=480&h=600&q=80&auto=format&fit=crop',
    link: '/brands/mango',
    bgColor: '#1A1A2E',
  },
  {
    id: 'b3',
    name: 'U.S. Polo Assn.',
    offer: 'Up to 50% OFF',
    tag: "Men's Collection",
    image:
      'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=480&h=600&q=80&auto=format&fit=crop',
    link: '/brands/us-polo',
    bgColor: '#1B3A5C',
  },
  {
    id: 'b4',
    name: "Levi's",
    offer: 'Flat ₹500 OFF',
    tag: 'Denim & Beyond',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=480&h=600&q=80&auto=format&fit=crop',
    link: '/brands/levis',
    bgColor: '#1C3553',
  },
  {
    id: 'b5',
    name: 'Jack & Jones',
    offer: 'Up to 50% OFF',
    tag: 'Casual Essentials',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&h=600&q=80&auto=format&fit=crop',
    link: '/brands/jack-and-jones',
    bgColor: '#2C2C2C',
  },
  {
    id: 'b6',
    name: 'AND',
    offer: 'Up to 40% OFF',
    tag: 'Contemporary Women',
    image:
      'https://images.unsplash.com/photo-1529419412599-7bb870e11810?w=480&h=600&q=80&auto=format&fit=crop',
    link: '/brands/and',
    bgColor: '#8B2252',
  },
]

const AUTO_INTERVAL = 3000

export const AllEyesBrands = () => {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const total = brandSlides.length

  const scrollToIndex = useCallback((idx: number, instant = false) => {
    const track = trackRef.current
    const card = cardRefs.current[idx]
    if (!track || !card) return

    const trackLeft = track.getBoundingClientRect().left
    const cardLeft  = card.getBoundingClientRect().left
    const target    = track.scrollLeft + (cardLeft - trackLeft)

    track.scrollTo({ left: target, behavior: instant ? 'instant' : 'smooth' })
  }, [])

  const goTo = useCallback(
    (raw: number) => {
      // wrap-around: jump instantly to opposite end, then re-trigger for smooth feel
      if (raw >= total) {
        scrollToIndex(total - 1, true)  // snap to last without animation
        requestAnimationFrame(() => {
          scrollToIndex(0, true)         // instantly back to start
          setCurrent(0)
        })
        return
      }
      if (raw < 0) {
        scrollToIndex(0, true)
        requestAnimationFrame(() => {
          scrollToIndex(total - 1, true)
          setCurrent(total - 1)
        })
        return
      }
      scrollToIndex(raw)
      setCurrent(raw)
    },
    [total, scrollToIndex],
  )

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  // Auto-advance
  useEffect(() => {
    if (paused) return
    const id = setInterval(next, AUTO_INTERVAL)
    return () => clearInterval(id)
  }, [next, paused])

  return (
    <section
      aria-labelledby="all-eyes-heading"
      className="py-10 md:py-14 bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16">

        {/* Header */}
        <div className="flex items-baseline justify-between mb-6 md:mb-8">
          <h2
            id="all-eyes-heading"
            className="font-serif text-2xl md:text-3xl text-brand-navy"
          >
            All Eyes On These Brands
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <button
                onClick={prev}
                aria-label="Previous brand"
                className="w-8 h-8 rounded-full border border-[#E8E8E8] flex items-center justify-center text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                aria-label="Next brand"
                className="w-8 h-8 rounded-full border border-[#E8E8E8] flex items-center justify-center text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <a
              href="/brands"
              className="text-sm font-semibold font-sans text-brand-red hover:underline underline-offset-2 whitespace-nowrap"
            >
              All Brands →
            </a>
          </div>
        </div>

        {/* Slider track */}
        <div
          ref={trackRef}
          className="flex gap-3 md:gap-4 overflow-x-scroll scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {brandSlides.map((brand, idx) => (
            <a
              key={brand.id}
              ref={(el) => { cardRefs.current[idx] = el }}
              href={brand.link}
              aria-label={`${brand.name} — ${brand.offer}`}
              style={{ scrollSnapAlign: 'start', background: brand.bgColor }}
              className="flex-shrink-0 w-52 sm:w-60 md:w-64 lg:w-[calc(25%-12px)] group relative rounded-xl overflow-hidden block"
            >
              <div className="relative" style={{ aspectRatio: '4/5' }}>
                <img
                  src={brand.image}
                  alt={brand.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Offer pill */}
                <span className="absolute top-3 left-3 bg-brand-red text-white text-[10px] font-bold font-sans uppercase tracking-wider px-2 py-1 rounded-sm">
                  {brand.offer}
                </span>

                {/* Brand info */}
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <p className="text-[11px] font-sans text-white/60 uppercase tracking-widest mb-0.5">
                    {brand.tag}
                  </p>
                  <p className="font-serif text-xl font-bold text-white">{brand.name}</p>
                  <span className="inline-flex items-center mt-2 text-xs font-semibold font-sans text-white/70 group-hover:text-white transition-colors">
                    Shop Now <ChevronRight size={12} className="ml-0.5" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Dot indicators */}
        <div
          role="tablist"
          aria-label="Brand slide navigation"
          className="flex justify-center gap-2 mt-5"
        >
          {brandSlides.map((b, idx) => (
            <button
              key={b.id}
              role="tab"
              aria-selected={idx === current}
              aria-label={`Go to ${b.name}`}
              onClick={() => { setCurrent(idx); scrollToIndex(idx) }}
              className={cn(
                'rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red',
                idx === current
                  ? 'w-5 h-2 bg-brand-red'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400',
              )}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
