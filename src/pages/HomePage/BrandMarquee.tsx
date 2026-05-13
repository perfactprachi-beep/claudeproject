import { featuredBrands } from '@data/products/brands'

export const BrandMarquee = () => {
  // Duplicate array so the loop appears seamless (animate-marquee shifts -50%)
  const doubled = [...featuredBrands, ...featuredBrands]

  return (
    <section
      aria-label="Featured brands"
      className="py-7 bg-white border-y border-[#E8E8E8] overflow-hidden"
    >
      <div
        className="flex animate-marquee hover:[animation-play-state:paused] items-center"
        aria-hidden="true"
      >
        {doubled.map((brand, idx) => (
          <a
            key={`${brand.id}-${idx}`}
            href={brand.link}
            tabIndex={idx < featuredBrands.length ? 0 : -1}
            aria-label={`Explore ${brand.name}`}
            className="flex-shrink-0 mx-10 md:mx-14 text-gray-300 hover:text-brand-navy transition-colors duration-300"
          >
            <span className="font-serif text-xl md:text-2xl font-semibold whitespace-nowrap tracking-wide">
              {brand.name}
            </span>
          </a>
        ))}
      </div>

      {/* Accessible list for screen readers (hidden visually) */}
      <nav aria-label="Brand directory" className="sr-only">
        <ul>
          {featuredBrands.map((brand) => (
            <li key={brand.id}>
              <a href={brand.link}>{brand.name}</a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}
