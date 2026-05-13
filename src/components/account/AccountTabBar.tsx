import { NavLink } from 'react-router-dom'
import { Package, Heart, MapPin, CreditCard, Star, Settings } from 'lucide-react'
import { cn } from '@utils/cn'

const TABS = [
  { to: '/account/orders',          label: 'Orders',    icon: Package },
  { to: '/account/wishlist',        label: 'Wishlist',  icon: Heart },
  { to: '/account/addresses',       label: 'Address',   icon: MapPin },
  { to: '/account/payment-methods', label: 'Payments',  icon: CreditCard },
  { to: '/account/first-citizen',   label: 'Loyalty',   icon: Star },
  { to: '/account/profile',         label: 'Profile',   icon: Settings },
]

export const AccountTabBar = () => (
  <nav
    aria-label="Account navigation"
    className="lg:hidden w-full overflow-x-auto flex gap-0 bg-white border-b border-[#EBEBEB] sticky top-14 z-30 scrollbar-none"
  >
    {TABS.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center gap-0.5 px-3 py-2.5 min-w-[72px] text-[10px] font-semibold transition-colors border-b-2',
            isActive
              ? 'border-brand-red text-brand-red'
              : 'border-transparent text-gray-400 hover:text-gray-600',
          )
        }
      >
        {({ isActive }) => (
          <>
            <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
            {label}
          </>
        )}
      </NavLink>
    ))}
  </nav>
)
