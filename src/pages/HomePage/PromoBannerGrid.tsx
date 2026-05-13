import { promoBanners } from '@data/homepage'
import { cn } from '@utils/cn'

export const PromoBannerGrid = () => (
  <section aria-label="Promotional offers" className="py-6 md:py-8 bg-[#F5F3F0]">
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16">

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {promoBanners.map((banner, i) => (
          <a
            key={banner.id}
            href={banner.ctaLink}
            aria-label={`${banner.title.replace('\n', ' ')} — ${banner.offerText}`}
            className="group relative rounded-2xl overflow-hidden block shadow-card hover:shadow-elevated transition-shadow duration-300"
            style={{ background: `linear-gradient(135deg, ${banner.bgFrom}, ${banner.bgTo})` }}
          >
            <div className="flex h-44 sm:h-48 md:h-52">

              {/* ── Copy ── */}
              <div className="relative z-10 flex flex-col justify-between p-5 flex-1 min-w-0">
                {/* Top: brand badge */}
                <span
                  className={cn(
                    'inline-block self-start text-[10px] font-bold font-sans uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm',
                    banner.dark
                      ? 'bg-white/20 text-white'
                      : 'bg-black/8 text-gray-700',
                  )}
                >
                  {i === 0 ? 'Featured' : i === 1 ? 'Beauty' : 'Watches'}
                </span>

                {/* Middle: title + subtitle */}
                <div>
                  <p
                    className={cn(
                      'font-serif font-bold leading-tight text-lg md:text-xl whitespace-pre-line mb-1',
                      banner.dark ? 'text-white' : 'text-brand-navy',
                    )}
                  >
                    {banner.title}
                  </p>
                  <p
                    className={cn(
                      'text-xs font-sans leading-snug',
                      banner.dark ? 'text-white/70' : 'text-gray-500',
                    )}
                  >
                    {banner.subtitle}
                  </p>
                </div>

                {/* Bottom: offer + CTA */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      'text-sm font-bold font-sans',
                      banner.dark ? 'text-yellow-300' : 'text-brand-red',
                    )}
                  >
                    {banner.offerText}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center text-[11px] font-semibold font-sans px-2.5 py-1 rounded transition-transform duration-200 group-hover:scale-105',
                      banner.dark
                        ? 'bg-white text-gray-900'
                        : 'bg-brand-navy text-white',
                    )}
                  >
                    {banner.ctaLabel} →
                  </span>
                </div>
              </div>

              {/* ── Image ── */}
              <div className="relative w-[44%] flex-shrink-0 overflow-hidden">
                <img
                  src={banner.image}
                  alt=""
                  role="presentation"
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                {/* left fade into bg colour */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, ${banner.bgFrom} 0%, transparent 40%)`,
                  }}
                />
              </div>

            </div>
          </a>
        ))}
      </div>

    </div>
  </section>
)
