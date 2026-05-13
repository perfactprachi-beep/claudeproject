import { NavLink } from 'react-router-dom'
import {
  Package,
  Heart,
  MapPin,
  CreditCard,
  Star,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@store/useAuthStore'
import { cn } from '@utils/cn'

const NAV_ITEMS = [
  { to: '/account/orders',          label: 'My Orders',        icon: Package },
  { to: '/account/wishlist',        label: 'Wishlist',         icon: Heart },
  { to: '/account/addresses',       label: 'Addresses',        icon: MapPin },
  { to: '/account/payment-methods', label: 'Payment Methods',  icon: CreditCard },
  { to: '/account/first-citizen',   label: 'First Citizen',    icon: Star },
  { to: '/account/profile',         label: 'Settings & Profile', icon: Settings },
]

export const AccountSidebar = () => {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const initials = user?.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '?'

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-2">
      {/* Profile summary */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0">
          <span className="text-brand-red font-bold font-sans text-sm">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{user?.fullName}</p>
          <p className="text-xs text-gray-400 truncate">{user?.mobile}</p>
          {user?.firstCitizenId && (
            <p className="text-[11px] text-brand-red font-medium mt-0.5">
              {user.firstCitizenId}
            </p>
          )}
        </div>
      </div>

      {/* Nav links */}
      <nav className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden" aria-label="Account navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }, idx) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors group',
                idx < NAV_ITEMS.length - 1 && 'border-b border-[#F5F5F5]',
                isActive
                  ? 'bg-brand-red/5 text-brand-red'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-brand-red',
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-red transition-colors" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-gray-500 hover:text-danger hover:bg-red-50 rounded-2xl border border-[#EBEBEB] bg-white transition-colors"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </aside>
  )
}
