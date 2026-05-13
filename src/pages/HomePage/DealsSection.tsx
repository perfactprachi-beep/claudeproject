import { dealProducts } from '@data/homepage'
import { ProductCard } from '@components/product/ProductCard'

export const DealsSection = () => (
  <section aria-labelledby="deals-heading" className="py-10 md:py-14 bg-[#F5F3F0]">
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16">

      {/* Heading */}
      <div className="flex items-baseline justify-between mb-6 md:mb-8">
        <div>
          <h2 id="deals-heading" className="font-serif text-2xl md:text-3xl text-brand-navy">
            Deals Too Good to Miss
          </h2>
          <p className="text-sm font-sans text-gray-500 mt-1">
            Handpicked offers across categories — ending soon
          </p>
        </div>
        <a
          href="/sale"
          className="text-sm font-semibold font-sans text-brand-red hover:underline underline-offset-2 whitespace-nowrap"
        >
          See All Deals →
        </a>
      </div>

      {/* Products — 2 col on mobile, 3 on md, 6 on xl */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        {dealProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} position={index + 10} />
        ))}
      </div>

    </div>
  </section>
)
