import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminRole, AdminUser } from '../types/admin'

interface AdminState {
  adminUser: AdminUser | null
  isAuthenticated: boolean
  sidebarCollapsed: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  toggleSidebar: () => void
}

const MOCK_ADMIN_USERS: (AdminUser & { password: string })[] = [
  { uid: 'S001', name: 'Prachi Danak', email: 'admin@shoppersstop.com', role: 'super_admin', password: 'Admin@123', lastActive: new Date().toISOString(), status: 'active' },
  { uid: 'S002', name: 'Kavya Reddy', email: 'catalogue@shoppersstop.com', role: 'catalogue_mgr', password: 'Cat@123', lastActive: new Date().toISOString(), status: 'active' },
  { uid: 'S003', name: 'Suresh Kumar', email: 'orders@shoppersstop.com', role: 'order_mgr', password: 'Order@123', lastActive: new Date().toISOString(), status: 'active' },
  { uid: 'S004', name: 'Deepa Thomas', email: 'support@shoppersstop.com', role: 'support_agent', password: 'Support@123', lastActive: new Date().toISOString(), status: 'active' },
]

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      adminUser: null,
      isAuthenticated: false,
      sidebarCollapsed: false,

      login: async (email, password) => {
        const user = MOCK_ADMIN_USERS.find(u => u.email === email && u.password === password)
        if (!user) return false
        const { password: _, ...adminUser } = user
        set({ adminUser, isAuthenticated: true })
        return true
      },

      logout: () => set({ adminUser: null, isAuthenticated: false }),

      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    { name: 'admin-auth', partialize: (s) => ({ adminUser: s.adminUser, isAuthenticated: s.isAuthenticated }) }
  )
)

export function roleLabel(role: AdminRole): string {
  const labels: Record<AdminRole, string> = {
    super_admin: 'Super Admin',
    catalogue_mgr: 'Catalogue Manager',
    order_mgr: 'Order Manager',
    support_agent: 'Support Agent',
  }
  return labels[role]
}
