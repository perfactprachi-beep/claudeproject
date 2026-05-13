# 🧠 SHOPPERS STOP MVP — SKILLS & AI PROMPTING GUIDE

> **Purpose:** Document team skills, AI tool usage patterns, and prompting best practices for this project.  
> **Audience:** All team members — engineers, designers, PMs, QA  
> **Updated:** 2026-05-12

---

## PART 1 — TEAM SKILL MATRIX

| Skill Area | Technology | Team Member(s) | Level |
|------------|-----------|----------------|-------|
| Frontend | React 18 + TypeScript | FE Lead, FE Engineer | ★★★★★ |
| Styling | Tailwind CSS | FE Lead, FE Engineer | ★★★★☆ |
| State Management | Zustand | FE Lead | ★★★★☆ |
| Routing | React Router v6 | FE Lead, FE Engineer | ★★★★★ |
| Animations | Framer Motion / CSS | FE Lead | ★★★☆☆ |
| Backend | Node.js + Express / REST | Backend Engineer | ★★★★☆ |
| Database | PostgreSQL / Firebase Firestore | Backend Engineer | ★★★★☆ |
| Auth | Firebase Auth | Backend Engineer | ★★★☆☆ |
| Payments | Razorpay SDK | Backend Engineer | ★★★☆☆ |
| Search | Algolia | FE Lead | ★★★☆☆ |
| CMS | Contentful | FE Engineer | ★★★☆☆ |
| Design | Figma | UX Designer | ★★★★★ |
| Design Tokens | CSS Variables / Tailwind config | UX Designer, FE Lead | ★★★★☆ |
| Testing | Jest + React Testing Library | QA Engineer | ★★★★☆ |
| E2E Testing | Playwright | QA Engineer | ★★★☆☆ |
| Performance | Lighthouse CI / WebPageTest | QA Engineer | ★★★☆☆ |
| DevOps | Vercel + GitHub Actions | FE Lead | ★★★★☆ |
| Analytics | Google Analytics 4 | PM | ★★★☆☆ |
| SEO | Technical SEO (JSON-LD, meta) | FE Lead | ★★★☆☆ |
| Accessibility | WCAG 2.1 AA | QA Engineer, UX | ★★★☆☆ |

### Skill Gaps to Address
- [ ] **Razorpay 3D Secure** — Backend Engineer to complete Razorpay docs for 3DS flow
- [ ] **Playwright advanced patterns** — QA to run Playwright workshop (Week 1)
- [ ] **Contentful content modelling** — FE Engineer to complete Contentful tutorial
- [ ] **Algolia InstantSearch React** — FE Lead to spike in Week 1

---

---

## PART 2 — AI TOOL USAGE GUIDE

### Which AI Tool for What

| Task | Best Tool | How to Use |
|------|-----------|------------|
| Full component builds | **Claude** (this session) | Use master prompt Part 1 → then Feature Prompts |
| Quick UI scaffolds | **v0.dev** | Paste the Design Prompt (Part 3) |
| Boilerplate code | **GitHub Copilot** | In-editor tab completion |
| Complex logic / algorithms | **Claude** | Describe the problem + constraints |
| Figma design generation | **Figma AI** | Use Design System spec from Part 3 |
| Sprint planning / tickets | **Claude** | Use Part 5 — Project Plan Prompt |
| Test generation | **Claude / Copilot** | Use Part 6 — QA Prompt |
| Code review | **Claude** | Paste component + ask for review |
| Debugging | **Claude / Copilot Chat** | Share error + relevant code |
| Copywriting | **Claude** | Provide brand context from Part 1 |

---

### How to Start a Claude Session Correctly

**Always paste Part 1 (System Prompt) first.** This sets the entire context so Claude knows:
- The brand, tech stack, and coding standards
- To use Indian fashion data (not lorem ipsum)
- The currency is ₹ (not $)
- Component state requirements (loading, error, empty)

```
CORRECT session start:
1. Open new Claude conversation
2. Paste entire PART 1 — SYSTEM PROMPT block
3. Say: "Acknowledged. Now build [Feature]"
4. Paste the relevant PART 2 Feature Prompt

WRONG (produces generic, non-branded output):
1. Open new Claude conversation  
2. Jump straight to a feature prompt
```

---

### Prompting Patterns That Work Well

#### Pattern 1 — Build with Constraints
```
Build [component name] following the system prompt context.

Additional constraints:
- Must work with existing [ComponentX] props interface
- Loading state must use the Skeleton component from our design system
- Error state: show inline error, not a modal
- Mobile breakpoint: stack vertically below 768px
```

#### Pattern 2 — Iterative Refinement
```
Here is the current [ComponentName] code:
[paste code]

Issues to fix:
1. The price doesn't format correctly for values above ₹1,000 (needs comma separator)
2. The wishlist heart doesn't animate on click
3. The discount badge is missing for items with 0% discount (should hide entirely)

Keep all other behaviour the same.
```

#### Pattern 3 — Spec Before Build
```
spec [Feature Name]

Before writing any code, give me:
1. Props interface (TypeScript)
2. State variables needed
3. Side effects / useEffect hooks needed
4. Child components needed
5. GA4 events to fire
6. Edge cases to handle

I'll review and then say "build it" when ready.
```

#### Pattern 4 — Data Generation
```
Generate 12 realistic mock products for the Women's Ethnic Wear category.

Requirements:
- TypeScript array matching the Product interface in /types/product.ts
- Indian brands only: Biba, W, AND, Global Desi, Aurelia
- Mix: 4 sarees (₹2,499–₹8,999), 5 kurtis (₹999–₹3,499), 3 suits (₹1,799–₹5,499)
- Discount 10–50%
- 2 items must be out of stock
- Realistic product names (not "Product 1", "Product 2")
- Use Unsplash fashion photo URLs as image placeholders
```

#### Pattern 5 — Review & Critique
```
Review this [ComponentName] component for:
1. Performance issues (unnecessary re-renders, missing memo/callback)
2. Accessibility violations (WCAG 2.1 AA)
3. TypeScript type safety issues
4. Missing edge cases (empty state, error state, loading state)
5. GA4 event coverage gaps

[paste component code]

Provide fixes for each issue found.
```

---

### Prompting Anti-Patterns to Avoid

| ❌ Don't do this | ✅ Do this instead |
|----------------|-----------------|
| "Make a product card" | "Build ProductCard component per master prompt specs" |
| "Fix this bug" (no code) | Paste the broken code + describe expected vs actual behaviour |
| Ask for too much in one prompt | Break large features into subcomponents (one per prompt) |
| Ignore the system prompt | Always start sessions with Part 1 |
| Accept first output without review | Always review for brand alignment, ₹ formatting, Indian context |
| "Write tests for everything" | Specify exactly which functions/components and what scenarios |

---

---

## PART 3 — TECHNOLOGY QUICK REFERENCE

### Zustand Store Pattern (Project Standard)
```typescript
// src/store/useCartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartState {
  items: CartItem[]
  addItem: (product: Product, size: string, colour: string) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  total: number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, size, colour) => set(state => ({
        items: [...state.items, { ...product, size, colour, quantity: 1 }]
      })),
      // ... other actions
      get total() {
        return get().items.reduce((sum, item) => sum + item.price.selling * item.quantity, 0)
      }
    }),
    { name: 'ssl-cart' }  // localStorage key
  )
)
```

### Tailwind Custom Theme Config (tailwind.config.ts)
```typescript
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red:   '#C0001D',
          navy:  '#1A1A2E',
          warm:  '#FAFAF8',
        },
        surface: '#FFFFFF',
        border:  '#E8E8E8',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
}
```

### GA4 Event Firing Pattern
```typescript
// src/utils/analytics.ts
export const trackEvent = (eventName: string, params: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// Usage in component:
trackEvent('add_to_cart', {
  currency: 'INR',
  value: product.price.selling,
  items: [{ item_id: product.id, item_name: product.name, price: product.price.selling }]
})
```

### Price Formatting Utility
```typescript
// src/utils/format.ts
export const formatINR = (amount: number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
    .format(amount)
// Output: ₹1,999
```

### FC Points Calculation
```typescript
// src/utils/loyalty.ts
const EARN_RATES: Record<FCTier, number> = {
  CLASSIC: 1,     // 1 point per ₹100
  SILVER:  2,     // 2 points per ₹100
  PLATINUM: 3,    // 3 points per ₹100
  BLACK:   5,     // 5 points per ₹100
}

export const calcFCPoints = (amount: number, tier: FCTier): number =>
  Math.floor(amount / 100) * EARN_RATES[tier]
```

---

### Environment Variables Reference

Create `.env.local` (never commit):

```bash
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=

# Razorpay (use test keys for development)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx

# Algolia
VITE_ALGOLIA_APP_ID=
VITE_ALGOLIA_SEARCH_KEY=   # Search-only key (safe for frontend)

# Contentful
VITE_CONTENTFUL_SPACE_ID=
VITE_CONTENTFUL_ACCESS_TOKEN=

# GA4
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# App
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_ENV=development
```

---

*This document is a living reference. Update it when new tools, patterns, or skills are added to the project.*
