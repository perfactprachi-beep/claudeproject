import { editorialArticles } from '@data/categories'

export const StyleHubTeaser = () => (
  <section aria-labelledby="style-hub-heading" className="py-10 md:py-14 bg-[#F5F3F0]">
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16">

      <div className="flex items-baseline justify-between mb-6 md:mb-8">
        <h2
          id="style-hub-heading"
          className="font-serif text-2xl md:text-3xl text-brand-navy"
        >
          Style Hub
        </h2>
        <a
          href="/style-hub"
          className="text-sm font-semibold font-sans text-brand-red hover:underline underline-offset-2 transition-colors whitespace-nowrap"
        >
          See All Articles →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {editorialArticles.map((article) => (
          <article
            key={article.id}
            className="group rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-elevated transition-shadow duration-300"
          >
            <a href={article.link} className="block">

              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Category chip */}
                <span className="absolute top-3 left-3 bg-brand-red text-white text-[11px] font-semibold font-sans uppercase tracking-widest px-2.5 py-1 rounded-sm">
                  {article.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 md:p-6">
                <h3 className="font-serif text-xl md:text-2xl text-gray-900 mb-3 leading-snug group-hover:text-brand-red transition-colors duration-200">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-sans">
                    {article.readTime} min read
                  </span>
                  <span className="text-sm font-semibold font-sans text-brand-red group-hover:underline underline-offset-2">
                    Read More →
                  </span>
                </div>
              </div>

            </a>
          </article>
        ))}
      </div>

    </div>
  </section>
)
