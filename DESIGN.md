# 🎨 SHOPPERS STOP MVP — DESIGN SYSTEM

> **Version:** 1.0 | **Figma File:** [Link TBD] | **Updated:** 2026-05-12  
> **Owner:** UX Designer  
> **Audience:** Designers, Frontend Engineers

---

## 1. BRAND IDENTITY

### Brand Personality
| Dimension | Description |
|-----------|-------------|
| **Voice** | Sophisticated, warm, aspirational — never cold or corporate |
| **Feel** | Fashion-editorial: generous space, beautiful type, intentional imagery |
| **Trust** | Premium but approachable — like a knowledgeable personal shopper |
| **Indian Context** | ₹ currency, Indian fashion brands, Indian sizing conventions |

### Tagline
> **"Start Something New"** — used in hero banners and campaign touchpoints

---

---

## 2. COLOUR PALETTE

### Primary Colours
```
Brand Red    #C0001D   ██████  CTAs, badges, accents, loyalty highlights
Deep Navy    #1A1A2E   ██████  Header, footer, premium section backgrounds
```

### Neutral Colours
```
Warm White   #FAFAF8   ██████  Page background (warm, not sterile)
Surface      #FFFFFF   ██████  Cards, modals, inputs
Border       #E8E8E8   ██████  Dividers, card borders, input borders
Text 1°      #1A1A1A   ██████  Primary text, headings
Text 2°      #666666   ██████  Secondary text, labels, metadata
Text 3°      #999999   ██████  Placeholder text, disabled states
```

### Semantic Colours
```
Success      #22C55E   ██████  Order confirmed, stock available, payment success
Warning      #F59E0B   ██████  Low stock, expiry alerts
Error        #EF4444   ██████  Form errors, payment failure, out of stock
Discount     #16A34A   ██████  Savings amount, discount percentages (green)
```

### First Citizen Tier Colours
```
Classic      #9CA3AF → #6B7280   Silver-grey gradient
Silver Edge  #93C5FD → #3B82F6   Blue-silver gradient  
Platinum     #E5E7EB → #C0C0C0   Platinum shimmer gradient
Black        #1A1A2E → #000000   Near-black with gold (#D4AF37) accent
```

### Tailwind Config (extend.colors)
```typescript
brand: {
  red:     '#C0001D',
  navy:    '#1A1A2E',
  warm:    '#FAFAF8',
},
surface:   '#FFFFFF',
border:    '#E8E8E8',
success:   '#22C55E',
warning:   '#F59E0B',
danger:    '#EF4444',
discount:  '#16A34A',
```

### Accessibility
- All text/background combinations must meet WCAG AA contrast ratios:
  - Normal text: ≥ 4.5:1
  - Large text (18px+ bold or 24px+): ≥ 3:1
  - Brand Red on White: **4.6:1** ✅ (just passes — use bold weight for small text)
  - White on Deep Navy: **15.3:1** ✅
  - Text 1° on Warm White: **16.5:1** ✅

---

---

## 3. TYPOGRAPHY

### Font Stack
| Role | Font | Weight | Use |
|------|------|--------|-----|
| Display | Playfair Display | 400, 700 | Hero headlines, section headings, editorial titles |
| Body | DM Sans | 400, 500, 600, 700 | All UI text, labels, CTAs, body copy |
| Mono | JetBrains Mono | 400, 500 | Prices, order IDs, codes, tracking numbers |

### Google Fonts Import
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type Scale
| Name | Font | Size | Weight | Line Height | Use |
|------|------|------|--------|-------------|-----|
| `display-xl` | Playfair Display | 56px | 700 | 1.1 | Hero headlines (desktop) |
| `display-lg` | Playfair Display | 40px | 700 | 1.15 | Section heroes, major headings |
| `display-md` | Playfair Display | 32px | 400/700 | 1.2 | Editorial titles, PDP product name |
| `display-sm` | Playfair Display | 24px | 400 | 1.3 | Sub-headings, featured labels |
| `h1` | DM Sans | 28px | 700 | 1.3 | Page titles |
| `h2` | DM Sans | 22px | 700 | 1.35 | Section titles |
| `h3` | DM Sans | 18px | 600 | 1.4 | Card titles, accordion headers |
| `h4` | DM Sans | 16px | 600 | 1.4 | Sub-section labels |
| `body-lg` | DM Sans | 16px | 400 | 1.6 | Product descriptions, long-form |
| `body-md` | DM Sans | 14px | 400 | 1.6 | Default UI text, labels |
| `body-sm` | DM Sans | 12px | 400 | 1.5 | Metadata, captions, fine print |
| `label` | DM Sans | 11px | 600 | 1.4 | UPPERCASE brand names on product cards |
| `price-lg` | JetBrains Mono | 22px | 500 | 1.2 | Cart totals, checkout total |
| `price-md` | JetBrains Mono | 18px | 500 | 1.2 | PDP selling price |
| `price-sm` | JetBrains Mono | 14px | 400 | 1.2 | PLP card price |
| `code` | JetBrains Mono | 13px | 400 | 1.5 | Order IDs, coupon codes, SKUs |

---

---

## 4. SPACING SYSTEM

Base unit: **4px**

| Token | Value | Tailwind | Use |
|-------|-------|----------|-----|
| `space-1` | 4px | `p-1` | Micro spacing, icon padding |
| `space-2` | 8px | `p-2` | Tight spacing, chip padding |
| `space-3` | 12px | `p-3` | Button padding vertical |
| `space-4` | 16px | `p-4` | Standard component padding |
| `space-6` | 24px | `p-6` | Card padding, section gaps |
| `space-8` | 32px | `p-8` | Section padding (mobile) |
| `space-12` | 48px | `p-12` | Section padding (desktop) |
| `space-16` | 64px | `p-16` | Large section breaks |
| `space-24` | 96px | `p-24` | Hero section vertical padding |

---

---

## 5. BORDER RADIUS

| Token | Value | Use |
|-------|-------|-----|
| `rounded-sm` | 2px | Tags, very small badges |
| `rounded` | 4px | Buttons, inputs |
| `rounded-md` | 6px | Product cards |
| `rounded-lg` | 8px | Main content cards |
| `rounded-xl` | 12px | Modals, drawers |
| `rounded-2xl` | 16px | Hero cards (editorial) |
| `rounded-full` | 999px | Chips, avatar circles, colour swatches |

---

---

## 6. SHADOWS

```css
/* Card — default resting state */
--shadow-card:     0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);

/* Card hover — elevated state */
--shadow-elevated: 0 4px 16px rgba(0, 0, 0, 0.12);

/* Modal / Drawer */
--shadow-modal:    0 20px 60px rgba(0, 0, 0, 0.20);

/* Sticky header */
--shadow-header:   0 1px 0 #E8E8E8, 0 4px 12px rgba(0, 0, 0, 0.06);

/* Dropdown / Popover */
--shadow-dropdown: 0 8px 24px rgba(0, 0, 0, 0.12);
```

---

---

## 7. COMPONENT SPECIFICATIONS

### 7.1 Button

| Variant | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| Primary | `#C0001D` | White | None | `#A8001A` (darken 10%) |
| Secondary | White | `#C0001D` | `#C0001D` 1.5px | `#FFF0F2` bg |
| Ghost | Transparent | `#1A1A1A` | `#E8E8E8` 1px | `#F5F5F5` bg |
| Danger | `#EF4444` | White | None | `#DC2626` |
| Disabled | `#E8E8E8` | `#999999` | None | No change |

Sizes:
- `sm`: h-8, px-3, text-sm (12px)
- `md`: h-10, px-4, text-sm (14px) — **default**
- `lg`: h-12, px-6, text-base (16px)
- `xl`: h-14, px-8, text-lg (18px) — for hero CTAs

Loading state: Replace text with `<Spinner />` (3 dots), maintain button width.

### 7.2 ProductCard

```
┌─────────────────────────────┐
│  [❤ Wishlist]               │  ← absolute top-right, visible on hover
│                             │
│    Product Image            │  ← aspect-ratio: 3/4, object-fit: cover
│    (hover: second image)    │
│                             │
├─────────────────────────────┤
│ BRAND NAME                  │  ← label style, grey, uppercase, 11px
│ Product Name (2-line clamp) │  ← body-md
│ ₹1,999  ~~₹3,499~~  43%OFF │  ← mono font; MRP struck through
│ S  M  [L]  XL               │  ← size chips (L = unavailable, greyed)
│                             │
│ [   Add to Bag   ] ←hover   │  ← primary button, slide up on hover
└─────────────────────────────┘
```

States: Default · Hover · Out of Stock (greyed overlay + "Notify Me") · Loading (skeleton)

### 7.3 Price Block
```
₹1,999        ← Selling price (JetBrains Mono, 22px, #1A1A1A, bold)
~~₹3,499~~    ← MRP struck through (14px, #999999)
43% OFF       ← Discount badge (DM Sans 600, 11px, #16A34A background #DCFCE7, px-2 py-0.5 rounded)
```
Do not show MRP if MRP === selling price. Do not show discount badge if discount < 1%.

### 7.4 Size Chip
- Default: white bg, `#E8E8E8` border, `#1A1A1A` text
- Selected: `#C0001D` border (2px), `#FFF0F2` bg, `#C0001D` text
- Unavailable: `#F5F5F5` bg, `#CCCCCC` text, strikethrough, `cursor: not-allowed`
- Size: h-8, min-w-[2rem], px-2, rounded, text-sm

### 7.5 Star Rating
- Filled star: `#F59E0B`
- Half star: left half `#F59E0B`, right half `#E8E8E8`
- Empty star: `#E8E8E8`
- Count label: `(128 reviews)` — body-sm, text-secondary, underline on hover

### 7.6 Toast / Snackbar

| Type | Icon | Background | Text Colour | Duration |
|------|------|-----------|-------------|----------|
| Success | ✓ | `#DCFCE7` | `#166534` | 3s |
| Error | ✗ | `#FEE2E2` | `#991B1B` | 5s |
| Info | ℹ | `#DBEAFE` | `#1E40AF` | 3s |
| Warning | ⚠ | `#FEF9C3` | `#854D0E` | 4s |

Position: bottom-right (desktop), bottom-centre (mobile). Slide-up animation on enter, fade on exit.

### 7.7 First Citizen Tier Badges

| Tier | Badge BG | Badge Text | Card Gradient |
|------|----------|-----------|--------------|
| Classic | `#F3F4F6` | `#6B7280` | `#9CA3AF` → `#6B7280` |
| Silver Edge | `#DBEAFE` | `#1D4ED8` | `#93C5FD` → `#3B82F6` |
| Platinum | `#F3F4F6` | `#4B5563` | `#E5E7EB` → `#C0C0C0` |
| Black | `#1A1A2E` | `#D4AF37` | `#1A1A2E` → `#000000` |

---

---

## 8. LAYOUT & GRID

### Breakpoints
```
xs:   320px   (smallest mobile)
sm:   390px   (iPhone 14, standard mobile)
md:   768px   (tablet portrait)
lg:   1024px  (tablet landscape / small desktop)
xl:   1440px  (standard desktop)
2xl:  1920px  (large desktop)
```

### Page Max Width
- Content container: `max-w-[1440px] mx-auto px-4 md:px-8 xl:px-16`
- Full-bleed sections (hero, banners): `w-full`

### Product Grid Columns
| Breakpoint | Columns |
|-----------|---------|
| Mobile (< 768px) | 2 |
| Tablet (768–1023px) | 3 |
| Desktop (≥ 1024px) | 4 |

Column gap: 16px (mobile) / 20px (desktop)

---

---

## 9. ANIMATION & MOTION

### Principles
- **Purposeful**: Every animation must serve a UX goal (feedback, orientation, delight)
- **Fast**: UI feedback animations ≤ 200ms. Transitions ≤ 300ms. Avoid > 500ms.
- **Reducible**: Respect `prefers-reduced-motion` — all animations have a static fallback

### Standard Easing
```css
--ease-out:     cubic-bezier(0.0, 0.0, 0.2, 1);   /* Enter: elements appearing */
--ease-in:      cubic-bezier(0.4, 0.0, 1, 1);      /* Exit: elements leaving */
--ease-in-out:  cubic-bezier(0.4, 0.0, 0.2, 1);    /* State changes */
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful bounce (use sparingly) */
```

### Key Animations
```css
/* Brand Marquee (infinite horizontal scroll) */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.marquee { animation: marquee 20s linear infinite; }
.marquee:hover { animation-play-state: paused; }

/* Skeleton Shimmer */
@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position: 200% 0; }
}

/* Toast Slide-Up */
@keyframes slide-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Add to Bag Hover Reveal */
.add-to-bag-btn {
  transform: translateY(100%);
  transition: transform 200ms var(--ease-out);
}
.product-card:hover .add-to-bag-btn {
  transform: translateY(0);
}

/* Header Shrink on Scroll */
.header {
  height: 80px;
  transition: height 200ms var(--ease-in-out),
              box-shadow 200ms var(--ease-in-out);
}
.header.scrolled {
  height: 56px;
  box-shadow: var(--shadow-header);
}
```

### Reduced Motion Fallback
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

---

## 10. ICONOGRAPHY

### Icon Library: Lucide React
```bash
npm install lucide-react
```

Standard icon sizes: 16px (inline text), 20px (UI default), 24px (navigation), 32px (feature icons)

### Key Icons Used
| Icon | Lucide Name | Use |
|------|------------|-----|
| 🛒 Cart | `ShoppingBag` | Header cart, "Add to Bag" button |
| ❤ Wishlist | `Heart` / `HeartFill` | Product cards, PDP |
| 🔍 Search | `Search` | Header search trigger |
| 👤 Account | `User` | Header account link |
| ⭐ Rating | `Star` | Product ratings |
| ✓ Tick | `Check` | Order confirmation, success states |
| ← Back | `ChevronLeft` | Navigation, carousel |
| → Next | `ChevronRight` | Navigation, carousel |
| ▽ Dropdown | `ChevronDown` | Accordion, sort dropdown |
| × Close | `X` | Modals, filter chips, toasts |
| 📍 Location | `MapPin` | Store locator, delivery |
| 🎁 Gift | `Gift` | Gift cards, FC member perks |
| 📦 Package | `Package` | Orders, shipping |
| 🔒 Lock | `Lock` | Secure checkout badge |
| ✎ Edit | `Pencil` | Edit address / profile |
| 🗑 Delete | `Trash2` | Remove item / address |

---

---

## 11. IMAGERY GUIDELINES

### Product Images
- Aspect ratio: **3:4** (portrait) — enforced via CSS `aspect-ratio`
- Min resolution: 800×1067px
- Format: WebP (primary), JPEG (fallback)
- Background: White or light studio
- Alt text: `"{Brand} {Product Name} in {Colour}"` (e.g., "Biba Floral Kurti in Blue")

### Hero / Banner Images
- Desktop: 1440×600px minimum
- Mobile: 390×520px minimum
- Overlay: Dark gradient from bottom for text legibility
- Alt text: Describe the fashion/lifestyle scene

### Category Tiles
- Aspect ratio: **1:1** or **4:5**
- Subject: Person wearing the category (Women, Men) or product flat lay (Beauty, Home)

### Placeholder Images (Development)
Use Unsplash with consistent keywords:
```
Fashion female model:  https://source.unsplash.com/featured/800x1067?fashion,indian,woman
Fashion male:          https://source.unsplash.com/featured/800x1067?fashion,indian,man
Beauty product:        https://source.unsplash.com/featured/800x1067?beauty,cosmetics
Home decor:            https://source.unsplash.com/featured/800x1067?home,interior
```

---

---

## 12. RESPONSIVE BEHAVIOUR SUMMARY

| Component | Mobile (< 768px) | Desktop (≥ 1024px) |
|-----------|-----------------|-------------------|
| Header nav | Hamburger menu | Full mega-menu |
| Category tiles | Horizontal scroll | 6-column grid |
| Product grid | 2 columns | 4 columns |
| PLP filters | Bottom drawer | Left sidebar |
| PDP layout | Single column | 2-column (image + info) |
| Cart layout | Single column | 2-column (items + summary) |
| Checkout | Full-screen steps | Split panel |
| Account | Bottom tab bar | Left sidebar nav |
| Footer | Single column stack | 4-column grid |

---

## 13. DESIGN FILE STRUCTURE (Figma)

```
Shoppers Stop MVP
├── 🎨 Design System
│   ├── Colours
│   ├── Typography
│   ├── Spacing & Grid
│   ├── Shadows
│   └── Icons
├── 🧩 Components
│   ├── Buttons & Inputs
│   ├── Product Card
│   ├── Navigation
│   ├── Cart & Checkout
│   ├── Account & Loyalty
│   └── Feedback (Toasts, Modals, Skeletons)
├── 📱 Mobile Screens (390px)
│   ├── Homepage
│   ├── PLP
│   ├── PDP
│   ├── Cart
│   ├── Checkout
│   └── Account
├── 🖥 Desktop Screens (1440px)
│   ├── Homepage
│   ├── PLP (filters open)
│   ├── PDP
│   ├── Cart
│   ├── Checkout — Payment step
│   ├── First Citizen Dashboard
│   └── Search active
└── 🔄 User Flows
    ├── Guest Purchase Journey
    ├── FC Member Redemption Journey
    └── Search → Purchase Journey
```

---

*Maintained by UX Designer. Engineering queries: raise in #design-eng Slack channel.*
