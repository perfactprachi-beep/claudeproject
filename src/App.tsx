import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@components/layout/Layout'
import { HomePage } from '@pages/HomePage'
import { ProductListingPage } from '@pages/ProductListingPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/category/:categorySlug" element={<ProductListingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
