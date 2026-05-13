import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@components/layout/Layout/Layout'
import { HomePage } from '@pages/HomePage'
import { ProductListingPage } from '@pages/ProductListingPage'
import { LoginPage } from '@pages/LoginPage/LoginPage'
import { AccountLayout } from '@pages/AccountPage/AccountLayout'
import { OrdersPage } from '@pages/AccountPage/OrdersPage'
import { OrderDetailPage } from '@pages/AccountPage/OrderDetailPage'
import { WishlistPage } from '@pages/AccountPage/WishlistPage'
import { AddressesPage } from '@pages/AccountPage/AddressesPage'
import { PaymentMethodsPage } from '@pages/AccountPage/PaymentMethodsPage'
import { ProfilePage } from '@pages/AccountPage/ProfilePage'
import { FirstCitizenPage } from '@pages/AccountPage/FirstCitizenPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with header/footer */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/category/:categorySlug" element={<ProductListingPage />} />
        </Route>

        {/* Standalone login page (no layout wrapper) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected account routes */}
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<Navigate to="/account/orders" replace />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderDetailPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="payment-methods" element={<PaymentMethodsPage />} />
          <Route path="first-citizen" element={<FirstCitizenPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
