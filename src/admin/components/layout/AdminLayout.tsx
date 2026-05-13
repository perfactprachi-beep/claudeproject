import { Outlet, Navigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useAdminStore } from '../../store/useAdminStore'
import { AdminSidebar } from './AdminSidebar'
import { AdminTopBar } from './AdminTopBar'

const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000 // 2 hours

export function AdminLayout() {
  const { isAuthenticated, logout } = useAdminStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return

    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => { logout() }, INACTIVITY_TIMEOUT)
    }

    reset()
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, reset))
    return () => {
      events.forEach(e => window.removeEventListener(e, reset))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isAuthenticated, logout])

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
