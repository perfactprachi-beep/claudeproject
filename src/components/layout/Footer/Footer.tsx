import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

const quickLinks = [
  { label: 'New Arrivals',  href: '/new-arrivals' },
  { label: 'Sale',          href: '/sale' },
  { label: 'Brands',        href: '/brands' },
  { label: 'Gift Cards',    href: '/gift-cards' },
  { label: 'Store Locator', href: '/store-locator' },
]

const customerService = [
  { label: 'Track Your Order',    href: '/track-order' },
  { label: 'Returns & Exchanges', href: '/returns' },
  { label: 'Shipping Policy',     href: '/shipping' },
  { label: 'Size Guide',          href: '/size-guide' },
  { label: 'Contact Us',          href: '/contact' },
  { label: 'FAQs',                href: '/faqs' },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/shoppersstop', Icon: Instagram },
  { label: 'Facebook',  href: 'https://facebook.com/shoppersstop',  Icon: Facebook },
  { label: 'Twitter',   href: 'https://twitter.com/shoppersstop',   Icon: Twitter },
  { label: 'YouTube',   href: 'https://youtube.com/shoppersstop',   Icon: Youtube },
]

const paymentMethods = ['Visa', 'Mastercard', 'UPI', 'RuPay', 'Amex', 'EMI']

export const Footer = () => (
  <footer className="bg-brand-navy text-white">
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16 py-12 md:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">

        {/* Quick Links */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-5">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors font-sans"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-5">
            Customer Service
          </h3>
          <ul className="space-y-3">
            {customerService.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors font-sans"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-5">
            Connect With Us
          </h3>
          <div className="flex gap-3 mb-6">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-300 transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed font-sans">
            Over 10 million First Citizen members earn rewards on every purchase — in-store & online.
          </p>
        </div>

        {/* App Download */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-5">
            Download Our App
          </h3>
          <p className="text-sm text-gray-400 mb-4 font-sans">
            Shop faster. App-exclusive deals every day.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { store: 'Google Play', tagline: 'Get it on' },
              { store: 'App Store',   tagline: 'Download on the' },
            ].map(({ store, tagline }) => (
              <a
                key={store}
                href="#"
                aria-label={`${tagline} ${store}`}
                className="flex items-center gap-3 border border-gray-600 rounded-lg px-3 py-2.5 hover:border-gray-400 transition-colors group"
              >
                <span className="text-xl leading-none" aria-hidden="true">
                  {store === 'Google Play' ? '▶' : ''}
                  {store === 'App Store' ? '' : ''}
                </span>
                <span>
                  <p className="text-[10px] text-gray-400 group-hover:text-gray-300 font-sans">
                    {tagline}
                  </p>
                  <p className="text-sm font-semibold text-white font-sans">{store}</p>
                </span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>

    {/* Bottom strip */}
    <div className="border-t border-gray-700">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500 font-sans">
          © 2026 Shoppers Stop Limited. All rights reserved.
        </p>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {paymentMethods.map((m) => (
            <span
              key={m}
              className="text-[10px] font-semibold bg-gray-700 text-gray-300 px-2 py-0.5 rounded"
            >
              {m}
            </span>
          ))}
        </div>

        <div className="flex gap-5">
          <a href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors font-sans">
            Privacy Policy
          </a>
          <a href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors font-sans">
            Terms of Use
          </a>
        </div>
      </div>
    </div>
  </footer>
)
