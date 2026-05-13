import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { heroSlides } from '@data/categories'
import { Button } from '@components/ui/Button'
import { trackHeroBannerClick } from '@utils/analytics'
import { cn } from '@utils/cn'

export const HeroBanner = () => {
  const [current, setCurrent] = useState(0)
  const [busy, setBusy] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (busy) return
      setBusy(true)
      setCurrent(index)
      setTimeout(() => setBusy(false), 700)
    },
    [busy],
  )

  const next = useCallback(
    () => goTo((current + 1) % heroSlides.length),
    [current, goTo],
  )

  const prev = useCallback(
    () => goTo((current - 1 + heroSlides.length) % heroSlides.length),
    [current, goTo],
  )

  useEffect(() => {
    const id = setInterval(next, 4000)
    return () => clearInterval(id)
  }, [next])

  return (
    <section
      aria-label="Featured promotions carousel"
      className="relative w-full overflow-hidden bg-gray-900 select-none"
      style={{ height: 'clamp(340px, 55vw, 680px)' }}
    >
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          aria-hidden={index !== current}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0',
          )}
        >
          {/* Background */}
          <img
            src={slide.image}
            alt=""
            role="presentation"
            className="w-full h-full object-cover object-center"
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'low'}
          />

          {/* Overlay — different for light vs dark text */}
          <div
            className={cn(
              'absolute inset-0',
              slide.theme === 'dark'
                ? 'bg-gradient-to-r from-black/65 via-black/30 to-transparent'
                : 'bg-gradient-to-r from-white/70 via-white/40 to-transparent',
            )}
          />

          {/* Copy */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 xl:px-16">
              <div
                className={cn(
                  'max-w-lg transition-all duration-600',
                  index === current
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0',
                )}
              >
                <h2
                  className={cn(
                    'font-serif font-bold leading-[1.1] mb-3',
                    'text-[clamp(2rem,5vw,3.75rem)]',
                    slide.theme === 'dark' ? 'text-white' : 'text-brand-navy',
                  )}
                >
                  {slide.headline}
                </h2>
                <p
                  className={cn(
                    'text-sm md:text-base mb-7 leading-relaxed font-sans',
                    slide.theme === 'dark' ? 'text-gray-200' : 'text-gray-700',
                  )}
                >
                  {slide.subHeadline}
                </p>
                <Button
                  size="lg"
                  className="tracking-widest uppercase text-sm"
                  onClick={() => {
                    trackHeroBannerClick(index, slide.ctaLabel)
                    window.location.href = slide.ctaLink
                  }}
                >
                  {slide.ctaLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Prev arrow */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className={cn(
          'absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20',
          'w-9 h-9 md:w-11 md:h-11 rounded-full',
          'bg-white/80 hover:bg-white backdrop-blur-sm',
          'flex items-center justify-center shadow-card',
          'transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
        )}
      >
        <ChevronLeft size={20} className="text-gray-800" />
      </button>

      {/* Next arrow */}
      <button
        onClick={next}
        aria-label="Next slide"
        className={cn(
          'absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20',
          'w-9 h-9 md:w-11 md:h-11 rounded-full',
          'bg-white/80 hover:bg-white backdrop-blur-sm',
          'flex items-center justify-center shadow-card',
          'transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
        )}
      >
        <ChevronRight size={20} className="text-gray-800" />
      </button>

      {/* Dots */}
      <div
        role="tablist"
        aria-label="Carousel slide navigation"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
      >
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            role="tab"
            aria-selected={index === current}
            aria-label={`Slide ${index + 1}: ${slide.headline}`}
            onClick={() => goTo(index)}
            className={cn(
              'rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              index === current
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80',
            )}
          />
        ))}
      </div>

      {/* Screen-reader live region */}
      <p
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        Slide {current + 1} of {heroSlides.length}: {heroSlides[current].headline}
      </p>
    </section>
  )
}
