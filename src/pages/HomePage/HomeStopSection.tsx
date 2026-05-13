import { homeProducts } from '@data/homepage'
import { formatINR } from '@utils/format'

export const HomeStopSection = () => (
  <section
    aria-labelledby="home-collection-heading"
    className="py-10 md:py-14"
    style={{ background: 'linear-gradient(180deg, #FDF6EE 0%, #FAFAF8 100%)' }}
  >
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16">

      {/* Header */}
      <div className="flex items-end justify-between mb-6 md:mb-8 gap-4">
        <div>
          <p className="text-[11px] font-semibold font-sans uppercase tracking-[0.25em] text-gray-400 mb-1">
            HomeStop
          </p>
          <h2
            id="home-collection-heading"
            className="font-serif text-2xl md:text-3xl text-brand-navy"
          >
            The Spring Home Collection
          </h2>
        </div>
        <a
          href="/category/home"
          className="text-sm font-semibold font-sans text-brand-red hover:underline underline-offset-2 whitespace-nowrap"
        >
          View All →
        </a>
      </div>

      {/* Layout: hero banner left + 4 product cards right */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        {/* Hero banner */}
        <a
          href="/category/home"
          className="md:col-span-2 group relative rounded-xl overflow-hidden block"
          aria-label="Shop the Spring Home Collection"
        >
          <div className="aspect-square md:h-full md:aspect-auto overflow-hidden bg-gray-100 min-h-[260px]">
            <img
              src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=600&q=80&auto=format&fit=crop"
              alt="Spring Home Collection"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-5">
              <span className="inline-block bg-brand-red text-white text-[11px] font-bold font-sans uppercase tracking-widest px-2.5 py-1 rounded-sm mb-2">
                Up to 50% OFF
              </span>
              <p className="font-serif text-xl font-bold text-white leading-tight">
                Refresh Your<br />Living Space
              </p>
            </div>
          </div>
        </a>

        {/* 4 product cards */}
        <div className="md:col-span-3 grid grid-cols-2 gap-3 md:gap-4">
          {homeProducts.map((product) => (
            <a
              key={product.id}
              href={`/product/${product.slug}`}
              className="group bg-white rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-brand-navy text-white text-[10px] font-semibold font-sans uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
                    New
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-[11px] font-semibold font-sans uppercase tracking-widest text-gray-400 mb-0.5">
                  {product.brand}
                </p>
                <p className="text-sm font-sans text-gray-800 line-clamp-2 leading-snug mb-2">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-medium text-gray-900">
                    {formatINR(product.sellingPrice)}
                  </span>
                  <span className="font-mono text-xs text-gray-400 line-through">
                    {formatINR(product.mrp)}
                  </span>
                  <span className="text-[11px] font-semibold text-discount bg-green-50 px-1.5 py-0.5 rounded-sm">
                    {product.discountPercent}% OFF
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  </section>
)
