import { luxuryBrands } from '@data/homepage'

export const LuxeSection = () => (
  <section
    aria-labelledby="luxe-heading"
    className="py-12 md:py-16"
    style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #0D0D1A 100%)' }}
  >
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16">

      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-[11px] font-semibold font-sans uppercase tracking-[0.35em] text-[#D4AF37] mb-2">
          Premium Collection
        </p>
        <h2
          id="luxe-heading"
          className="font-serif text-4xl md:text-6xl font-bold text-white tracking-tight"
          style={{ letterSpacing: '-0.02em' }}
        >
          LUXE
        </h2>
        <p className="text-gray-400 font-sans text-sm mt-2">
          The world's finest labels. Exclusively at Shoppers Stop.
        </p>
      </div>

      {/* Brand tiles */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-8">
        {luxuryBrands.map((brand) => (
          <a
            key={brand.id}
            href={brand.link}
            className="group flex flex-col items-center justify-center py-6 px-3 rounded-lg border border-gray-700 hover:border-[#D4AF37] transition-all duration-300"
            aria-label={`Explore ${brand.name}`}
          >
            <span className="font-serif font-bold text-white text-lg md:text-xl group-hover:text-[#D4AF37] transition-colors duration-300 text-center leading-tight">
              {brand.name}
            </span>
            <span className="text-[11px] font-sans text-gray-500 mt-1 text-center group-hover:text-gray-300 transition-colors duration-300">
              {brand.tagline}
            </span>
          </a>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <a
          href="/luxe"
          className="inline-flex items-center justify-center h-11 px-8 border border-[#D4AF37] text-[#D4AF37] rounded font-semibold font-sans text-sm tracking-widest uppercase hover:bg-[#D4AF37] hover:text-black transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        >
          Explore LUXE Collection
        </a>
      </div>

    </div>
  </section>
)
