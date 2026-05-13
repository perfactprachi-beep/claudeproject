import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@components/layout/Layout/Layout'
import { ToastContainer } from '@components/ui/Toast'
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
import { SearchPage } from '@pages/SearchPage'
import { ProductDetailPage } from '@pages/ProductDetailPage'
import { CartPage } from '@pages/CartPage'
import { CheckoutPage } from '@pages/CheckoutPage'

// Admin
import { AdminLayout } from './admin/components/layout/AdminLayout'
import { AdminLoginPage } from './admin/pages/AdminLoginPage'
import { DashboardPage } from './admin/pages/DashboardPage'
import { ProductsPage } from './admin/pages/ProductsPage'
import { CategoriesPage } from './admin/pages/CategoriesPage'
import { BrandsPage } from './admin/pages/BrandsPage'
import { InventoryPage } from './admin/pages/InventoryPage'
import { OrdersPage as AdminOrdersPage } from './admin/pages/OrdersPage'
import { OrderDetailPage as AdminOrderDetailPage } from './admin/pages/OrderDetailPage'
import { ReturnsPage } from './admin/pages/ReturnsPage'
import { CouponsPage } from './admin/pages/CouponsPage'
import { CustomersPage } from './admin/pages/CustomersPage'
import { LoyaltyPage } from './admin/pages/LoyaltyPage'
import { BannersPage } from './admin/pages/BannersPage'
import { SearchConfigPage } from './admin/pages/SearchConfigPage'
import { AnalyticsPage } from './admin/pages/AnalyticsPage'
import { StaffPage } from './admin/pages/StaffPage'
import { SettingsPage } from './admin/pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with header/footer */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/category/:categorySlug" element={<ProductListingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:productId/:productSlug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        {/* Standalone checkout (no site header/footer) */}
        <Route path="/checkout" element={<CheckoutPage />} />

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

        {/* Admin — standalone login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin — protected panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
          <Route path="returns" element={<ReturnsPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="loyalty" element={<LoyaltyPage />} />
          <Route path="banners" element={<BannersPage />} />
          <Route path="search" element={<SearchConfigPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>

      {/* Global toast notifications */}
      <ToastContainer />
    </BrowserRouter>
  )
}
