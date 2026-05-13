import { homeCategories } from '@data/categories'
import { trackCategoryTileClick } from '@utils/analytics'

export const CategoryTiles = () => (
  <section aria-labelledby="category-heading" className="py-8 md:py-12 bg-white">
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16">

      <div className="flex items-baseline justify-between mb-5 md:mb-7">
        <h2
          id="category-heading"
          className="font-serif text-2xl md:text-3xl text-brand-navy"
        >
          Shop by Category
        </h2>
        <a
          href="/categories"
          className="text-sm font-semibold font-sans text-brand-red hover:underline underline-offset-2"
        >
          All Categories →
        </a>
      </div>

      {/* Mobile: horizontal scroll   Desktop: 6-col grid */}
      <div
        role="list"
        className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide
                   lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:pb-0"
      >
        {homeCategories.map((cat) => (
          <a
            key={cat.id}
            href={cat.link}
            role="listitem"
            aria-label={`Shop ${cat.name}`}
            onClick={() => trackCategoryTileClick(cat.name)}
            className="flex-shrink-0 w-[130px] sm:w-[148px] lg:w-auto group block"
          >
            {/* Card */}
            <div className="relative overflow-hidden rounded-2xl shadow-card hover:shadow-elevated transition-shadow duration-300">

              {/* Image — aspect 3:4 */}
              <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={cat.image}
                  alt={`${cat.name} fashion`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Permanent gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Label — slides up on hover */}
              <div className="absolute bottom-0 inset-x-0 p-3 flex flex-col items-center">
                <span className="font-sans font-semibold text-sm text-white tracking-wide drop-shadow">
                  {cat.name}
                </span>
                <span
                  className="mt-1.5 text-[10px] font-sans font-semibold text-white/0
                             group-hover:text-white/90 uppercase tracking-widest
                             transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                >
                  Shop Now
                </span>
              </div>

              {/* Red bottom accent bar */}
              <div
                className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-red
                           scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              />
            </div>
          </a>
        ))}
      </div>

    </div>
  </section>
)
