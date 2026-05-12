const highlights = [
  {
    id: '1',
    label: 'Ethnic Wear',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=320&h=420&q=80&auto=format&fit=crop',
    link: '/category/women/ethnic-wear',
  },
  {
    id: '2',
    label: 'Festive Sarees',
    image: 'https://images.unsplash.com/photo-1610030463001-3bbb4ecd3aab?w=320&h=420&q=80&auto=format&fit=crop',
    link: '/category/women/sarees',
  },
  {
    id: '3',
    label: 'Fusion Wear',
    image: 'https://images.unsplash.com/photo-1529419412599-7bb870e11810?w=320&h=420&q=80&auto=format&fit=crop',
    link: '/category/women/fusion',
  },
]

export const IndiaMeets = () => (
  <section
    aria-labelledby="india-meets-heading"
    className="py-12 md:py-16 overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #C0001D 40%, #7B1FA2 100%)' }}
  >
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

        {/* Copy */}
        <div className="lg:w-2/5 text-center lg:text-left">
          <p className="text-[11px] font-semibold font-sans uppercase tracking-[0.35em] text-orange-200 mb-3">
            Celebrating Indian Fashion
          </p>
          <h2
            id="india-meets-heading"
            className="font-serif font-bold leading-tight text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
          >
            India Meets<br />Shoppers Stop
          </h2>
          <p className="text-orange-100 font-sans text-base leading-relaxed mb-7 max-w-sm mx-auto lg:mx-0">
            From handcrafted embroideries to contemporary fusion — celebrate your roots in style.
          </p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <a
              href="/category/women/ethnic-wear"
              className="inline-flex items-center justify-center h-11 px-6 bg-white text-brand-red rounded font-semibold font-sans text-sm tracking-wide hover:bg-gray-100 transition-colors"
            >
              Shop Ethnic →
            </a>
            <a
              href="/category/women/sarees"
              className="inline-flex items-center justify-center h-11 px-6 border border-white/60 text-white rounded font-semibold font-sans text-sm tracking-wide hover:bg-white/10 transition-colors"
            >
              Explore Sarees
            </a>
          </div>
        </div>

        {/* Image grid */}
        <div className="lg:w-3/5 flex gap-3 overflow-x-auto lg:overflow-visible scrollbar-hide lg:grid lg:grid-cols-3 lg:gap-4">
          {highlights.map((item) => (
            <a
              key={item.id}
              href={item.link}
              className="flex-shrink-0 w-44 sm:w-52 lg:w-auto group relative rounded-xl overflow-hidden"
              aria-label={item.label}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 inset-x-0 text-center text-white text-sm font-semibold font-sans">
                  {item.label}
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  </section>
)
