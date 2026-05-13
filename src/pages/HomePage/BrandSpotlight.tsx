interface BrandSpotlightProps {
  title?: string
  subtitle?: string
  offer?: string
  ctaLabel?: string
  ctaLink?: string
  imageUrl?: string
}

export const BrandSpotlight = ({
  title = 'House of\nShoppers Stop',
  subtitle = "India's finest ethnic & fusion wear — all in one place",
  offer = 'Up to 70% OFF',
  ctaLabel = 'Shop the Edit',
  ctaLink = '/brands/house-of-shoppers-stop',
  imageUrl = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1440&h=520&q=80&auto=format&fit=crop',
}: BrandSpotlightProps) => (
  <section
    aria-labelledby="spotlight-heading"
    className="relative w-full overflow-hidden"
    style={{ height: 'clamp(240px, 36vw, 520px)' }}
  >
    {/* Background */}
    <img
      src={imageUrl}
      alt=""
      role="presentation"
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover object-center"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

    {/* Content */}
    <div className="relative z-10 h-full flex items-center">
      <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 xl:px-16">
        <div className="max-w-md">
          {/* Offer pill */}
          <span className="inline-block bg-brand-red text-white text-xs font-bold font-sans uppercase tracking-widest px-3 py-1 rounded-sm mb-4">
            {offer}
          </span>

          <h2
            id="spotlight-heading"
            className="font-serif font-bold text-white leading-tight mb-3 whitespace-pre-line"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
          >
            {title}
          </h2>
          <p className="text-gray-200 font-sans text-sm md:text-base mb-6 leading-relaxed">
            {subtitle}
          </p>

          <a
            href={ctaLink}
            className="inline-flex items-center justify-center h-11 px-7 bg-white text-brand-navy rounded font-semibold font-sans text-sm tracking-wide hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </div>
  </section>
)
