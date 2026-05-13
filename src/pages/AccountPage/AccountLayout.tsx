import { useEffect } from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { AccountSidebar } from '@components/account/AccountSidebar'
import { AccountTabBar } from '@components/account/AccountTabBar'
import { useAuthStore } from '@store/useAuthStore'

export const AccountLayout = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true })
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Mobile tab bar */}
      <AccountTabBar />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="flex gap-8 items-start">
          {/* Desktop sidebar */}
          <AccountSidebar />

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
