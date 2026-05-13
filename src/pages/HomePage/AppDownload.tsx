const benefits = [
  'Exclusive app-only deals daily',
  'Track orders in real time',
  'One-tap wishlist & reorder',
  'Early access to sales & new arrivals',
]

export const AppDownload = () => (
  <section
    aria-labelledby="app-download-heading"
    className="py-12 md:py-16 bg-white border-t border-[#E8E8E8]"
  >
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">

        {/* Phone mockup placeholder */}
        <div
          className="relative flex-shrink-0 w-48 h-48 md:w-56 md:h-56 rounded-3xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #C0001D, #1A1A2E)' }}
          aria-hidden="true"
        >
          <div className="text-center text-white">
            <p className="font-serif text-3xl font-bold">SS</p>
            <p className="text-xs font-sans mt-1 opacity-80">App</p>
          </div>
          {/* Decorative rings */}
          <div className="absolute inset-0 rounded-3xl border-4 border-white/10" />
          <div className="absolute -inset-3 rounded-3xl border-2 border-brand-red/20" />
        </div>

        {/* Copy */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-[11px] font-semibold font-sans uppercase tracking-[0.3em] text-brand-red mb-3">
            Shop Smarter
          </p>
          <h2
            id="app-download-heading"
            className="font-serif text-2xl md:text-4xl font-bold text-brand-navy mb-4 leading-tight"
          >
            Download the<br className="hidden md:block" /> Shoppers Stop App
          </h2>

          <ul className="space-y-2 mb-7 max-w-xs mx-auto md:mx-0">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm font-sans text-gray-600">
                <span className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-discount" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                {b}
              </li>
            ))}
          </ul>

          {/* Store badges */}
          <div className="flex gap-3 justify-center md:justify-start flex-wrap">
            {[
              { store: 'Google Play', sub: 'Get it on', href: 'https://play.google.com/store/apps/details?id=com.shoppersstop.android' },
              { store: 'App Store',   sub: 'Download on the', href: 'https://apps.apple.com/in/app/shoppers-stop/id587541063' },
            ].map(({ store, sub, href }) => (
              <a
                key={store}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${sub} ${store}`}
                className="flex items-center gap-2.5 bg-brand-navy text-white px-4 py-2.5 rounded-lg hover:bg-[#2A2A3E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
              >
                <span className="text-2xl leading-none" aria-hidden="true">
                  {store === 'App Store' ? '' : '▶'}
                </span>
                <span>
                  <p className="text-[10px] text-white/60 font-sans">{sub}</p>
                  <p className="text-sm font-semibold font-sans leading-tight">{store}</p>
                </span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  </section>
)
