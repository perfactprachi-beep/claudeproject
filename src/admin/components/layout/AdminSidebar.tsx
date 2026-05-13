import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, Layers, Boxes, Tag, ShoppingBag,
  RotateCcw, Ticket, Users, Award, Image, Search, BarChart3,
  UserCog, Settings, ChevronLeft, ChevronRight, Store
} from 'lucide-react'
import { useAdminStore } from '../../store/useAdminStore'
import { canAccess } from '../../types/admin'
import type { AdminRole } from '../../types/admin'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  module: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',       path: '/admin',            icon: <LayoutDashboard size={18} />, module: 'dashboard' },
  { label: 'Products',        path: '/admin/products',   icon: <Package size={18} />,          module: 'products' },
  { label: 'Categories',      path: '/admin/categories', icon: <Layers size={18} />,           module: 'categories' },
  { label: 'Brands',          path: '/admin/brands',     icon: <Tag size={18} />,              module: 'brands' },
  { label: 'Inventory',       path: '/admin/inventory',  icon: <Boxes size={18} />,            module: 'inventory' },
  { label: 'Orders',          path: '/admin/orders',     icon: <ShoppingBag size={18} />,      module: 'orders' },
  { label: 'Returns',         path: '/admin/returns',    icon: <RotateCcw size={18} />,        module: 'returns' },
  { label: 'Coupons',         path: '/admin/coupons',    icon: <Ticket size={18} />,           module: 'coupons' },
  { label: 'Customers',       path: '/admin/customers',  icon: <Users size={18} />,            module: 'customers' },
  { label: 'First Citizen',   path: '/admin/loyalty',    icon: <Award size={18} />,            module: 'loyalty' },
  { label: 'Banners & CMS',   path: '/admin/banners',    icon: <Image size={18} />,            module: 'banners' },
  { label: 'Search Config',   path: '/admin/search',     icon: <Search size={18} />,           module: 'search' },
  { label: 'Analytics',       path: '/admin/analytics',  icon: <BarChart3 size={18} />,        module: 'analytics' },
  { label: 'Staff & Roles',   path: '/admin/staff',      icon: <UserCog size={18} />,          module: 'staff' },
  { label: 'Settings',        path: '/admin/settings',   icon: <Settings size={18} />,         module: 'settings' },
]

export function AdminSidebar() {
  const { adminUser, sidebarCollapsed, toggleSidebar } = useAdminStore()
  const role = adminUser?.role as AdminRole

  return (
    <aside
      className={`flex flex-col bg-[#1A1A2E] text-white transition-all duration-300 shrink-0 ${sidebarCollapsed ? 'w-16' : 'w-[220px]'}`}
      style={{ minHeight: '100vh' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-[#C0001D] rounded-lg flex items-center justify-center shrink-0">
          <Store size={16} className="text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="font-bold text-sm tracking-wide truncate">Shoppers Stop</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.filter(item => canAccess(role, item.module)).map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-[#C0001D] text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center h-10 border-t border-white/10 text-white/50 hover:text-white transition-colors"
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  )
}
