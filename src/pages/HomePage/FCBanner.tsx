const stats = [
  { value: '10M+', label: 'Members' },
  { value: '100+', label: 'Partner Brands' },
  { value: '91+',  label: 'Stores' },
]

export const FCBanner = () => (
  <section
    aria-labelledby="fc-banner-heading"
    className="py-14 md:py-20 text-center"
    style={{
      background: 'linear-gradient(135deg, #C0001D 0%, #8B0015 45%, #1A1A2E 100%)',
    }}
  >
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16">

      <p className="text-[11px] font-semibold font-sans uppercase tracking-[0.3em] text-red-200 mb-4">
        First Citizen Loyalty Programme
      </p>

      <h2
        id="fc-banner-heading"
        className="font-serif font-bold text-white leading-tight mb-5"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
      >
        Join India's Favourite<br className="hidden sm:block" /> Loyalty Program.
      </h2>

      <p className="text-gray-300 font-sans text-base md:text-lg mb-9 max-w-md mx-auto leading-relaxed">
        Earn points on every purchase, unlock exclusive perks, and celebrate your style with
        India's most rewarding loyalty community.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
        <a
          href="/first-citizen/join"
          className="inline-flex items-center justify-center h-12 px-8 bg-white text-brand-red rounded font-semibold font-sans text-base tracking-wide hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        >
          Become a Member
        </a>
        <a
          href="/first-citizen"
          className="inline-flex items-center justify-center h-12 px-8 border border-white/40 text-white rounded font-semibold font-sans text-base tracking-wide hover:bg-white/10 hover:border-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        >
          Learn More
        </a>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="font-serif text-3xl md:text-4xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-400 font-sans mt-1 tracking-wide uppercase">{label}</p>
          </div>
        ))}
      </div>

    </div>
  </section>
)
