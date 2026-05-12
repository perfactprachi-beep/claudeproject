import { Outlet, useLocation } from 'react-router-dom'
import { AnnouncementBar } from '@components/layout/AnnouncementBar'
import { Header } from '@components/layout/Header'
import { Footer } from '@components/layout/Footer'

export const Layout = () => {
  const { pathname } = useLocation()
  const isCheckout = pathname.startsWith('/checkout')

  return (
    <div className="flex flex-col min-h-screen">
      {!isCheckout && <AnnouncementBar />}
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      {!isCheckout && <Footer />}
    </div>
  )
}
