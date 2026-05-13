import { useState } from 'react'
import { User, Heart, ShoppingBag, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NavItem } from './NavItem'
import { AuthModal } from '@components/auth/AuthModal'
import { SearchBar } from '@components/search/SearchBar'
import { useCartStore } from '@store/useCartStore'
import { useWishlistStore } from '@store/useWishlistStore'
import { useAuthStore } from '@store/useAuthStore'
import { useScrollDirection } from '@hooks/useScrollDirection'
import { cn } from '@utils/cn'

const NAV_LINKS = [
  { label: 'Women',    href: '/category/women' },
  { label: 'Men',      href: '/category/men' },
  { label: 'Beauty',   href: '/category/beauty' },
  { label: 'Home',     href: '/category/home' },
  { label: 'Brands',   href: '/brands' },
  { label: 'Discover', href: '/discover' },
]

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const scrolled         = useScrollDirection()
  const cartCount        = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0))
  const wishlistCount    = useWishlistStore((s) => s.productIds.length)
  const isAuthenticated  = useAuthStore((s) => s.isAuthenticated)
  const user             = useAuthStore((s) => s.user)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-all duration-200',
        scrolled ? 'h-14' : 'h-20',
      )}
      style={scrolled ? { boxShadow: '0 1px 0 #E8E8E8, 0 4px 12px rgba(0,0,0,0.06)' } : undefined}
    >
      <div className="max-w-[1440px] mx-auto h-full px-4 md:px-8 xl:px-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <a
          href="/"
          aria-label="Shoppers Stop — Home"
          className={cn(
            'flex-shrink-0 font-serif font-bold text-brand-navy tracking-tight transition-all duration-200 select-none',
            scrolled ? 'text-xl' : 'text-2xl',
          )}
        >
          Shoppers <span className="text-brand-red">Stop</span>
        </a>

        {/* Desktop nav */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavItem key={link.href} label={link.label} href={link.href} />
          ))}
        </nav>

        {/* Icon group */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <SearchBar />

          {isAuthenticated ? (
            <Link
              to="/account/orders"
              aria-label="My account"
              title={user?.fullName}
              className="hidden sm:flex items-center gap-1.5 p-2 text-gray-600 hover:text-brand-red transition-colors rounded-full hover:bg-gray-50"
            >
              <div className="w-5 h-5 rounded-full bg-brand-red flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
            </Link>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              aria-label="Login or create account"
              className="hidden sm:flex p-2 text-gray-600 hover:text-brand-red transition-colors rounded-full hover:bg-gray-50"
            >
              <User size={20} />
            </button>
          )}

          <Link
            to="/account/wishlist"
            aria-label={`Wishlist, ${wishlistCount} item${wishlistCount !== 1 ? 's' : ''}`}
            className="hidden sm:flex relative p-2 text-gray-600 hover:text-brand-red transition-colors rounded-full hover:bg-gray-50"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <Badge count={wishlistCount} />
            )}
          </Link>

          <Link
            to="/cart"
            aria-label={`Cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
            className="relative flex p-2 text-gray-600 hover:text-brand-red transition-colors rounded-full hover:bg-gray-50"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <Badge count={cartCount} />
            )}
          </Link>

          {/* Hamburger */}
          <button
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-brand-red transition-colors rounded-full hover:bg-gray-50"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden absolute inset-x-0 top-full bg-white border-t border-[#E8E8E8] animate-fade-in"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
        >
          <div className="max-w-[1440px] mx-auto px-4 py-3 flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3.5 border-b border-[#F0F0F0] text-gray-800 font-medium font-sans hover:text-brand-red transition-colors"
              >
                {link.label}
              </a>
            ))}
            {isAuthenticated ? (
              <Link
                to="/account/orders"
                onClick={() => setMobileOpen(false)}
                className="py-3.5 text-gray-800 font-medium font-sans hover:text-brand-red transition-colors"
              >
                My Account
              </Link>
            ) : (
              <button
                onClick={() => { setMobileOpen(false); setAuthOpen(true) }}
                className="py-3.5 text-left text-gray-800 font-medium font-sans hover:text-brand-red transition-colors"
              >
                Login / Register
              </button>
            )}
          </div>
        </nav>
      )}

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  )
}

function Badge({ count }: { count: number }) {
  return (
    <span className="absolute -top-0.5 -right-0.5 min-w-[1rem] h-4 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
      {count > 9 ? '9+' : count}
    </span>
  )
}
