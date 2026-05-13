import { Bell, LogOut, ChevronDown } from 'lucide-react'
import { useAdminStore, roleLabel } from '../../store/useAdminStore'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/categories': 'Categories',
  '/admin/brands': 'Brands',
  '/admin/inventory': 'Inventory',
  '/admin/orders': 'Orders',
  '/admin/returns': 'Returns & Refunds',
  '/admin/coupons': 'Coupons',
  '/admin/customers': 'Customers',
  '/admin/loyalty': 'First Citizen Loyalty',
  '/admin/banners': 'Banners & CMS',
  '/admin/search': 'Search Configuration',
  '/admin/analytics': 'Analytics',
  '/admin/staff': 'Staff & Roles',
  '/admin/settings': 'Platform Settings',
}

export function AdminTopBar() {
  const { adminUser, logout } = useAdminStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const title = Object.entries(PAGE_TITLES).find(([path]) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path)
  )?.[1] ?? 'Admin'

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-400">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#C0001D] rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white text-xs font-bold">
              {adminUser?.name.charAt(0) ?? 'A'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-gray-900 leading-tight">{adminUser?.name}</p>
              <p className="text-xs text-gray-500">{adminUser ? roleLabel(adminUser.role) : ''}</p>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{adminUser?.name}</p>
                <p className="text-xs text-gray-500">{adminUser?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
