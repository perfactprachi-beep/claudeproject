# ✅ SHOPPERS STOP MVP — TODO TRACKER

> **Sprint:** 1 of 5 · **Updated:** 2026-05-12  
> **Legend:** `[ ]` Todo · `[~]` In Progress · `[x]` Done · `[!]` Blocked · `[-]` Deferred

---

## SPRINT OVERVIEW

| Sprint | Weeks | Focus | Status |
|--------|-------|-------|--------|
| S1 | W1–W2 | Foundation + Design System + Homepage | 🟡 Active |
| S2 | W3–W4 | PLP + PDP + Search | ⚪ Upcoming |
| S3 | W5–W6 | Cart + Checkout + Payments | ⚪ Upcoming |
| S4 | W7–W8 | Auth + Account + First Citizen | ⚪ Upcoming |
| S5 | W9–W10 | QA + Performance + Launch Prep | ⚪ Upcoming |

---

---

## 🏗️ SPRINT 1 — Foundation & Homepage

### Project Setup
- [ ] Initialise React 18 + TypeScript + Vite project
- [ ] Configure Tailwind CSS with custom theme (brand colours, fonts, spacing)
- [ ] Set up React Router v6 with all route definitions
- [ ] Set up Zustand stores: `useCartStore`, `useAuthStore`, `useWishlistStore`
- [ ] Configure ESLint + Prettier + Husky pre-commit hooks
- [ ] Set up path aliases (`@components`, `@hooks`, `@pages`, `@types`, `@data`, `@utils`)
- [ ] Create `.env.example` with all required keys documented
- [ ] Set up Vercel project + preview deployments from PR branches
- [ ] Configure Google Analytics 4 + gtag base install
- [ ] Add Google Fonts: Playfair Display + DM Sans + JetBrains Mono

### Design System / Component Library
- [ ] `Button` — primary, secondary, ghost, icon-only; all sizes (sm/md/lg); loading state
- [ ] `Input` — text, password, OTP, search; label, error, helper text states
- [ ] `ProductCard` — image, brand, name, price block, wishlist toggle, size chips
- [ ] `PriceBlock` — MRP, selling price, discount badge, FC points line
- [ ] `SizeChip` — available, unavailable, selected states
- [ ] `ColourSwatch` — circle, selected ring, tooltip
- [ ] `StarRating` — display-only and interactive variants
- [ ] `Breadcrumb` — with schema.org JSON-LD
- [ ] `Toast` / `Snackbar` — success, error, info, warning
- [ ] `Modal` — backdrop, close on Esc + outside click, focus trap
- [ ] `Badge` — discount %, "NEW", "OUT OF STOCK", FC tier labels
- [ ] `Skeleton` loaders for ProductCard, PDP, Cart
- [ ] `EmptyState` — illustration + message + CTA (for cart, wishlist, orders, search)
- [ ] `Spinner` / `LoadingDots` component

### Homepage
- [ ] `AnnouncementBar` — dismissible, stores dismiss state in sessionStorage
- [ ] `Header` — logo, primary nav, icon row; sticky + scroll-shrink behaviour
- [ ] `MegaMenu` — hover-triggered, keyboard-navigable dropdown per category
- [ ] `HeroBanner` — full-width carousel, auto-rotate 4s, dot + arrow controls, pause on hover
- [ ] `CategoryTiles` — 6-up grid desktop / horizontal scroll mobile; hover zoom
- [ ] `BrandMarquee` — infinite scroll animation (CSS only), pause on hover
- [ ] `TrendingNow` — 4-product row; reuse `ProductCard` component
- [ ] `StyleHubTeaser` — 2-column editorial grid
- [ ] `FirstCitizenBanner` — gradient CTA banner
- [ ] `Footer` — 4-column links + social + app download + payment icons
- [ ] Wire up GA4 events: `hero_banner_click`, `category_tile_click`, `product_impression`
- [ ] Responsive QA: 320px / 390px / 768px / 1024px / 1440px / 2560px

---

## 📋 SPRINT 2 — PLP + PDP + Search

### Product Listing Page
- [ ] Page scaffold + route `/category/:categorySlug`
- [ ] `FilterPanel` — collapsible sections: Brand, Price, Size, Colour, Discount, Availability
- [ ] `RangeSlider` — dual-handle price range (₹0–₹20,000)
- [ ] `ActiveFilterChips` — strip with individual remove + "Clear All"
- [ ] `SortDropdown` — 6 sort options
- [ ] `ProductGrid` — 4/3/2 column responsive layout
- [ ] Hover second-image swap on `ProductCard`
- [ ] Wishlist toggle with optimistic UI update
- [ ] "Add to Bag" on hover (desktop)
- [ ] Out-of-stock overlay + "Notify Me" modal
- [ ] "Load More" pagination + product count
- [ ] URL state sync for filters (for SEO + shareable links)
- [ ] Scroll position restore on back-navigation
- [ ] Mock data: 12 Women's Ethnic Wear products (sarees, kurtis, suits)
- [ ] Wire up GA4: `filter_applied`, `sort_changed`, `product_click`, `add_to_wishlist`

### Product Detail Page
- [ ] Page scaffold + route `/product/:productId/:slug`
- [ ] `ImageGallery` — thumbnail strip desktop / horizontal scroll mobile, zoom on click
- [ ] Size selector with `SizeGuideModal` (measurement table)
- [ ] Colour swatch selector
- [ ] Quantity stepper (min 1, max 5)
- [ ] "Add to Bag" + "Buy Now" CTAs with loading states
- [ ] `DeliveryEstimator` — pincode input + check + result display
- [ ] `OffersAccordion` — coupon code list
- [ ] `ProductDetailsAccordion` — material, care, origin, codes
- [ ] Return policy strip
- [ ] FC Points earnable display (logged-in users only)
- [ ] `ReviewsSection` — rating breakdown chart + review cards + "Write a Review"
- [ ] "You May Also Like" carousel (horizontal scroll, 6 cards)
- [ ] "Complete the Look" — 3-product bundle
- [ ] Sticky bottom bar on mobile (name + price + CTA)
- [ ] Breadcrumb with JSON-LD schema
- [ ] `<head>` SEO: title, description, OG tags, product structured data
- [ ] Wire up GA4: `view_item`, `add_to_cart`, `add_to_wishlist`

### Search
- [ ] `SearchBar` — expandable in header, full-width on mobile
- [ ] `SearchDropdown` — sections: suggestions, brands, categories, recent, trending
- [ ] Debounced API call (300ms) on input
- [ ] Results page `/search?q=` — reuse PLP grid + filters
- [ ] Spell-correction banner ("Showing results for…")
- [ ] "Did you mean?" suggestion
- [ ] Zero-results state with trending products row
- [ ] Wire up GA4: `search`, `view_search_results`

---

## 🛒 SPRINT 3 — Cart + Checkout + Payments

### Cart
- [ ] Cart page `/cart` scaffold
- [ ] `CartItemRow` — thumbnail, details, quantity stepper, remove, move-to-wishlist
- [ ] `OrderSummary` — sticky right panel, live recalculation
- [ ] Coupon code input + validation (FC10, NEWUSER100, SALE20)
- [ ] FC Points redemption toggle
- [ ] Out-of-stock item warning banner
- [ ] Empty cart state
- [ ] Persistent cart via localStorage (survives page refresh)
- [ ] Sync cart to server on login (merge guest + account cart)

### Checkout — Step 1: Address
- [ ] Route `/checkout/address`
- [ ] Progress bar component (3-step)
- [ ] Saved address cards with radio selection
- [ ] Add New Address form + validation
- [ ] Guest checkout flow (email/mobile only)
- [ ] "Deliver Here" CTA → advance to step 2

### Checkout — Step 2: Payment
- [ ] Route `/checkout/payment`
- [ ] UPI: ID input + "Pay" + QR code tab
- [ ] Cards: Razorpay card fields (number, expiry, CVV, name)
- [ ] Net Banking: bank dropdown (top 5 + Others)
- [ ] EMI: plan selection with no-cost badge
- [ ] BNPL: Simpl / LazyPay options
- [ ] Cash on Delivery (conditional: orders < ₹10,000 + ₹40 fee)
- [ ] Gift Card / Voucher field
- [ ] 3D Secure flow handling
- [ ] Payment failure handling → error state + retry UI

### Checkout — Step 3: Confirmation
- [ ] Route `/checkout/confirmation`
- [ ] Success animation (CSS keyframes)
- [ ] Order summary + order ID + ETA
- [ ] FC Points earned notification
- [ ] "Track Order" + "Continue Shopping" CTAs
- [ ] Wire up GA4 `purchase` event with full items array

---

## 👤 SPRINT 4 — Auth + Account + First Citizen

### Auth
- [ ] Login/Register modal (tab-toggled)
- [ ] Mobile OTP flow — Firebase Auth (send OTP, verify, resend timer)
- [ ] Google OAuth login
- [ ] Email + Password login + "Forgot Password"
- [ ] Registration form with FC card link field
- [ ] Auth state persistence + auto-refresh token
- [ ] Protected route HOC for account pages

### Account Dashboard
- [ ] Dashboard layout `/account` — sidebar nav desktop / tab bar mobile
- [ ] `MyOrders` — filter tabs, order cards, order detail page
- [ ] Order detail: tracking timeline stepper, invoice download
- [ ] `Wishlist` page — grid view, "Move to Bag", "Remove"
- [ ] `Addresses` page — CRUD with default address setting
- [ ] `PaymentMethods` page — saved cards + UPI IDs (Razorpay tokenisation)
- [ ] `Profile` page — edit name, email, mobile (OTP verify), password change
- [ ] Communication preferences toggles
- [ ] Account deletion flow (DPDP Act compliance)

### First Citizen Loyalty
- [ ] Route `/account/first-citizen`
- [ ] Tier status hero card (colour per tier: Classic / Silver / Platinum / Black)
- [ ] Points balance + INR equivalent display
- [ ] Annual spend + tier progress bar
- [ ] Points activity table (tabs: All / Earned / Redeemed / Expired)
- [ ] Tier benefits comparison table
- [ ] Redeem points panel (input + live ₹ calculation)
- [ ] Partner brands horizontal scroll section
- [ ] Membership renewal banner (60-day expiry trigger)

---

## 🚀 SPRINT 5 — QA, Performance & Launch Prep

### Testing
- [ ] Unit tests for all utility functions (`formatPrice`, `calcFCPoints`, `validatePincode`)
- [ ] Unit tests for Zustand stores (`useCartStore`, `useAuthStore`)
- [ ] Component tests for `ProductCard`, `CartItemRow`, `PriceBlock`, `Button`
- [ ] Integration test: add-to-cart → checkout → order confirmation
- [ ] E2E (Playwright): Guest purchase journey
- [ ] E2E (Playwright): FC Member points redemption journey
- [ ] E2E (Playwright): Search → filter → PDP → add to cart
- [ ] Accessibility audit with axe-core (target: 0 critical violations)
- [ ] Cross-browser QA: Chrome, Safari, Firefox, Edge

### Performance
- [ ] Lighthouse CI baseline (target: Perf ≥85, A11y ≥90, SEO ≥90)
- [ ] LCP optimisation: preload hero image, priority hints
- [ ] Code splitting: lazy-load all page components
- [ ] Image optimisation: WebP conversion, responsive sizes
- [ ] Bundle analysis: `vite-bundle-analyzer` — target < 250KB gzipped initial JS
- [ ] Font display: `font-display: swap` for all custom fonts

### SEO & Metadata
- [ ] `sitemap.xml` generation
- [ ] `robots.txt`
- [ ] Canonical URLs on all pages
- [ ] Product structured data (JSON-LD: Product, BreadcrumbList)
- [ ] OG + Twitter card meta tags on all pages
- [ ] Hreflang (English only at MVP)

### Security & Compliance
- [ ] HTTPS enforced, HSTS header set
- [ ] CSP (Content Security Policy) headers configured
- [ ] Cookie consent banner (DPDP Act)
- [ ] Privacy Policy page linked from footer
- [ ] Terms & Conditions page linked from footer
- [ ] Input sanitisation on all form fields
- [ ] Rate limiting on OTP send endpoint

### Launch Readiness
- [ ] Production environment variables set in Vercel
- [ ] Error monitoring: Sentry or New Relic configured
- [ ] Uptime monitoring configured (target: 99.9% SLA)
- [ ] GA4 + Enhanced eCommerce verified in GTM preview mode
- [ ] Load test: 50,000 concurrent users simulation (k6 or Artillery)
- [ ] Rollback plan documented
- [ ] Stakeholder demo + sign-off
- [ ] Soft launch: 5% traffic canary deploy
- [ ] 🚀 **FULL LAUNCH**

---

## 📊 PROGRESS SUMMARY

| Module | Total Tasks | Done | In Progress | Blocked |
|--------|------------|------|-------------|---------|
| Foundation / Design System | 27 | 0 | 0 | 0 |
| Homepage | 17 | 0 | 0 | 0 |
| PLP | 15 | 0 | 0 | 0 |
| PDP | 17 | 0 | 0 | 0 |
| Search | 8 | 0 | 0 | 0 |
| Cart | 9 | 0 | 0 | 0 |
| Checkout | 14 | 0 | 0 | 0 |
| Auth | 7 | 0 | 0 | 0 |
| Account | 10 | 0 | 0 | 0 |
| First Citizen | 9 | 0 | 0 | 0 |
| QA & Launch | 24 | 0 | 0 | 0 |
| **TOTAL** | **157** | **0** | **0** | **0** |

---

*Update this file daily. Run `grep -c "\[x\]" TODO.md` to count completed tasks.*
