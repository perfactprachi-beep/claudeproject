# 📁 SHOPPERS STOP MVP — FOLDER STRUCTURE

> **Stack:** React 18 + TypeScript + Tailwind CSS + Vite  
> **Convention:** Feature-adjacent organisation — related files live close together  
> **Updated:** 2026-05-12

---

```
shoppersstop-mvp/
│
├── 📄 .env.example                     # Template — commit this (no real values)
├── 📄 .env.local                       # Local secrets — DO NOT COMMIT (in .gitignore)
├── 📄 .eslintrc.cjs                    # ESLint config
├── 📄 .gitignore                       # Git ignore rules
├── 📄 .prettierrc                      # Prettier config
├── 📄 index.html                       # Vite entry HTML
├── 📄 package.json
├── 📄 tailwind.config.ts               # Tailwind theme (brand colours, fonts, spacing)
├── 📄 tsconfig.json
├── 📄 tsconfig.node.json
├── 📄 vite.config.ts                   # Path aliases, plugins, build config
├── 📄 vitest.config.ts                 # Unit test config
├── 📄 playwright.config.ts             # E2E test config
│
├── 📁 docs/                            # Project documentation
│   ├── QUESTIONS.md                    # Open questions & decisions log
│   ├── TODO.md                         # Task tracker
│   ├── SKILLS.md                       # Team skills + AI prompting guide
│   ├── FOLDER_STRUCTURE.md             # This file
│   ├── DESIGN.md                       # Design system reference
│   └── MASTER_PROMPT.md                # AI master prompt (all 6 parts)
│
├── 📁 public/                          # Static assets (served as-is)
│   ├── favicon.ico
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── robots.txt
│   ├── sitemap.xml                     # Generated at build time
│   └── manifest.json                   # PWA manifest
│
└── 📁 src/                             # All application source code
    │
    ├── 📄 main.tsx                     # App entry point (ReactDOM.render)
    ├── 📄 App.tsx                      # Root component + Router setup
    ├── 📄 vite-env.d.ts                # Vite env type declarations
    │
    ├── 📁 types/                       # TypeScript interfaces & enums
    │   ├── product.ts                  # Product, Size, Colour, Review
    │   ├── user.ts                     # User, Address, SavedCard
    │   ├── cart.ts                     # Cart, CartItem
    │   ├── order.ts                    # Order, OrderItem, TrackingEvent
    │   ├── loyalty.ts                  # FirstCitizenAccount, PointTransaction
    │   ├── search.ts                   # SearchResult, SearchSuggestion
    │   └── enums.ts                    # FCTier, OrderStatus, PaymentMethod, etc.
    │
    ├── 📁 data/                        # Mock data & static content
    │   ├── products/
    │   │   ├── women-ethnic-wear.ts    # 12 mock products (PLP seed)
    │   │   ├── trending.ts             # 4 trending products (homepage)
    │   │   └── brands.ts               # Brand directory list
    │   ├── categories.ts               # Category tree with slugs
    │   ├── coupons.ts                  # Valid mock coupon codes
    │   ├── addresses.ts                # Mock saved addresses
    │   └── orders.ts                   # Mock order history
    │
    ├── 📁 store/                       # Zustand state stores
    │   ├── useCartStore.ts             # Cart items, coupon, FC points, totals
    │   ├── useAuthStore.ts             # User session, login/logout
    │   ├── useWishlistStore.ts         # Wishlist product IDs
    │   └── useSearchStore.ts           # Search query, recent searches
    │
    ├── 📁 hooks/                       # Custom React hooks
    │   ├── useCart.ts                  # Cart operations (add, remove, update)
    │   ├── useAuth.ts                  # Auth state + login/logout actions
    │   ├── useWishlist.ts              # Wishlist toggle + state
    │   ├── usePincode.ts               # Delivery estimate by pincode
    │   ├── useProducts.ts              # Fetch products with filters/sort
    │   ├── useSearch.ts                # Search query + autocomplete
    │   ├── useFCPoints.ts              # FC points calculation + redemption
    │   ├── useDebounce.ts              # Generic debounce hook
    │   ├── useLocalStorage.ts          # Type-safe localStorage hook
    │   ├── useScrollDirection.ts       # Header shrink on scroll
    │   └── useMediaQuery.ts            # Responsive breakpoint detection
    │
    ├── 📁 utils/                       # Pure utility functions
    │   ├── format.ts                   # formatINR, formatDate, truncateText
    │   ├── analytics.ts                # GA4 trackEvent wrapper
    │   ├── loyalty.ts                  # calcFCPoints, tierLabel, tierColour
    │   ├── validation.ts               # validatePincode, validateMobile, etc.
    │   ├── seo.ts                      # generateMetaTags, buildProductSchema
    │   └── cn.ts                       # classnames / clsx utility
    │
    ├── 📁 services/                    # API service layer
    │   ├── api.ts                      # Base axios instance + interceptors
    │   ├── productService.ts           # GET products, GET product by ID
    │   ├── orderService.ts             # POST order, GET orders, GET order by ID
    │   ├── authService.ts              # Firebase Auth wrappers
    │   ├── searchService.ts            # Algolia search queries
    │   ├── loyaltyService.ts           # FC points earn/redeem API calls
    │   └── cmsService.ts               # Contentful content fetching
    │
    ├── 📁 components/                  # Reusable UI components
    │   │
    │   ├── 📁 ui/                      # Primitive design system components
    │   │   ├── Button/
    │   │   │   ├── Button.tsx
    │   │   │   ├── Button.test.tsx
    │   │   │   └── index.ts
    │   │   ├── Input/
    │   │   │   ├── Input.tsx
    │   │   │   ├── OTPInput.tsx
    │   │   │   └── index.ts
    │   │   ├── Badge/
    │   │   ├── Modal/
    │   │   ├── Toast/
    │   │   ├── Skeleton/
    │   │   ├── Spinner/
    │   │   ├── Breadcrumb/
    │   │   ├── Accordion/
    │   │   ├── Tabs/
    │   │   ├── RangeSlider/
    │   │   └── EmptyState/
    │   │
    │   ├── 📁 product/                 # Product-domain components
    │   │   ├── ProductCard/
    │   │   │   ├── ProductCard.tsx
    │   │   │   ├── ProductCard.test.tsx
    │   │   │   └── index.ts
    │   │   ├── PriceBlock/
    │   │   ├── SizeSelector/
    │   │   │   ├── SizeSelector.tsx
    │   │   │   └── SizeGuideModal.tsx
    │   │   ├── ColourSelector/
    │   │   ├── ImageGallery/
    │   │   ├── StarRating/
    │   │   ├── ReviewCard/
    │   │   ├── ReviewsSection/
    │   │   ├── DeliveryEstimator/
    │   │   ├── OffersAccordion/
    │   │   └── ProductCarousel/
    │   │
    │   ├── 📁 cart/                    # Cart-domain components
    │   │   ├── CartItemRow/
    │   │   ├── OrderSummary/
    │   │   ├── CouponInput/
    │   │   └── FCPointsToggle/
    │   │
    │   ├── 📁 checkout/                # Checkout-domain components
    │   │   ├── CheckoutProgress/
    │   │   ├── AddressCard/
    │   │   ├── AddressForm/
    │   │   ├── PaymentOptions/
    │   │   │   ├── UPIPanel.tsx
    │   │   │   ├── CardPanel.tsx
    │   │   │   ├── NetBankingPanel.tsx
    │   │   │   ├── EMIPanel.tsx
    │   │   │   └── BNPLPanel.tsx
    │   │   └── OrderConfirmation/
    │   │
    │   ├── 📁 loyalty/                 # First Citizen components
    │   │   ├── TierStatusCard/
    │   │   ├── PointsActivity/
    │   │   ├── TierBenefitsTable/
    │   │   ├── RedeemPointsPanel/
    │   │   └── PartnerBrands/
    │   │
    │   ├── 📁 search/                  # Search components
    │   │   ├── SearchBar/
    │   │   ├── SearchDropdown/
    │   │   └── SearchSuggestion/
    │   │
    │   └── 📁 layout/                  # Page layout components
    │       ├── Header/
    │       │   ├── Header.tsx
    │       │   ├── MegaMenu.tsx
    │       │   ├── NavItem.tsx
    │       │   └── index.ts
    │       ├── Footer/
    │       ├── AnnouncementBar/
    │       ├── PageMeta/             # <head> SEO tags helper
    │       └── Layout/               # Page wrapper (Header + Footer + children)
    │
    ├── 📁 pages/                       # Route-level page components
    │   ├── HomePage/
    │   │   ├── HomePage.tsx
    │   │   ├── HeroBanner.tsx
    │   │   ├── CategoryTiles.tsx
    │   │   ├── BrandMarquee.tsx
    │   │   ├── TrendingNow.tsx
    │   │   ├── StyleHubTeaser.tsx
    │   │   ├── FCBanner.tsx
    │   │   └── index.ts
    │   │
    │   ├── PLPPage/
    │   │   ├── PLPPage.tsx
    │   │   ├── FilterPanel.tsx
    │   │   ├── ActiveFilters.tsx
    │   │   ├── SortBar.tsx
    │   │   ├── ProductGrid.tsx
    │   │   └── index.ts
    │   │
    │   ├── PDPPage/
    │   │   ├── PDPPage.tsx
    │   │   ├── PDPHero.tsx
    │   │   ├── ProductInfo.tsx
    │   │   ├── MobileStickyBar.tsx
    │   │   └── index.ts
    │   │
    │   ├── CartPage/
    │   ├── CheckoutPage/
    │   │   ├── CheckoutPage.tsx
    │   │   ├── AddressStep.tsx
    │   │   ├── PaymentStep.tsx
    │   │   └── ConfirmationStep.tsx
    │   │
    │   ├── SearchPage/
    │   ├── AuthPage/
    │   │   ├── AuthPage.tsx
    │   │   ├── LoginForm.tsx
    │   │   └── RegisterForm.tsx
    │   │
    │   ├── AccountPage/
    │   │   ├── AccountLayout.tsx       # Sidebar nav + <Outlet>
    │   │   ├── OrdersPage.tsx
    │   │   ├── OrderDetailPage.tsx
    │   │   ├── WishlistPage.tsx
    │   │   ├── AddressesPage.tsx
    │   │   ├── PaymentMethodsPage.tsx
    │   │   ├── ProfilePage.tsx
    │   │   └── FirstCitizenPage.tsx
    │   │
    │   └── ErrorPages/
    │       ├── NotFoundPage.tsx        # 404
    │       └── ErrorBoundary.tsx       # Catch-all error UI
    │
    ├── 📁 styles/                      # Global styles
    │   ├── globals.css                 # @tailwind directives + CSS custom properties
    │   ├── animations.css              # Keyframes: marquee, fade, shimmer, etc.
    │   └── fonts.css                   # @font-face declarations
    │
    └── 📁 tests/                       # Test files
        ├── unit/
        │   ├── utils/
        │   │   ├── format.test.ts
        │   │   ├── loyalty.test.ts
        │   │   └── validation.test.ts
        │   ├── store/
        │   │   └── useCartStore.test.ts
        │   └── components/
        │       ├── ProductCard.test.tsx
        │       ├── Button.test.tsx
        │       └── PriceBlock.test.tsx
        ├── integration/
        │   ├── cart-flow.test.tsx
        │   └── checkout-flow.test.tsx
        └── e2e/
            ├── guest-purchase.spec.ts
            ├── fc-redemption.spec.ts
            └── search-to-cart.spec.ts
```

---

## NAMING CONVENTIONS

| What | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase + `use` prefix | `useCartStore.ts` |
| Utilities | camelCase | `formatINR` |
| Types/Interfaces | PascalCase | `Product`, `CartItem` |
| Enums | SCREAMING_SNAKE_CASE values | `FCTier.SILVER_EDGE` |
| CSS classes | Tailwind utilities only | `bg-brand-red text-white` |
| Routes | kebab-case | `/category/women-ethnic-wear` |
| Data files | kebab-case | `women-ethnic-wear.ts` |
| Test files | `ComponentName.test.tsx` or `feature.spec.ts` | |
| Env variables | `VITE_` prefix | `VITE_RAZORPAY_KEY_ID` |

---

## IMPORT PATH ALIASES

Configured in `vite.config.ts` and `tsconfig.json`:

```typescript
'@'           → src/
'@components' → src/components/
'@pages'      → src/pages/
'@hooks'      → src/hooks/
'@store'      → src/store/
'@utils'      → src/utils/
'@services'   → src/services/
'@types'      → src/types/
'@data'       → src/data/
'@styles'     → src/styles/
```

Example usage:
```typescript
import { ProductCard } from '@components/product/ProductCard'
import { formatINR }   from '@utils/format'
import { useCartStore } from '@store/useCartStore'
import type { Product } from '@types/product'
```

---

## COMPONENT FILE ANATOMY

Every component follows this structure:

```typescript
// 1. Imports (external → internal → types → styles)
import { useState } from 'react'
import { useCartStore } from '@store/useCartStore'
import type { Product } from '@types/product'

// 2. Props interface (always named [ComponentName]Props)
interface ProductCardProps {
  product: Product
  position?: number
  listName?: string
  className?: string
}

// 3. Component (named export — no default exports except pages)
export const ProductCard = ({ product, position, listName, className }: ProductCardProps) => {
  // 4. State & hooks
  // 5. Derived values
  // 6. Handlers
  // 7. Early returns (loading, error, empty)
  // 8. Render
  return (...)
}
```

---

*Run `find src -name "*.tsx" | wc -l` to count total component files.*
