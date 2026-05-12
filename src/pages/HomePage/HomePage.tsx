import { HeroBanner }      from './HeroBanner'
import { CategoryTiles }   from './CategoryTiles'
import { PromoBannerGrid } from './PromoBannerGrid'
import { TrendingNow }     from './TrendingNow'
import { BrandSpotlight }  from './BrandSpotlight'
import { AllEyesBrands }   from './AllEyesBrands'
import { DealsSection }    from './DealsSection'
import { LuxeSection }     from './LuxeSection'
import { IndiaMeets }      from './IndiaMeets'
import { StyleHubTeaser }  from './StyleHubTeaser'
import { FCClubSection }   from './FCClubSection'
import { HomeStopSection } from './HomeStopSection'

export const HomePage = () => (
  <>
    {/* ── 1. Hero carousel ─────────────────────────────── */}
    <HeroBanner />

    {/* ── 2. Shop by Category ──────────────────────────── */}
    <CategoryTiles />

    {/* ── 3. Seasonal promo banners (3-col) ────────────── */}
    <PromoBannerGrid />

    {/* ── 4. Trending Now ──────────────────────────────── */}
    <TrendingNow />

    {/* ── 5. Full-width brand spotlight ────────────────── */}
    <BrandSpotlight />

    {/* ── 6. All Eyes On These Brands (auto-slider) ────── */}
    <AllEyesBrands />

    {/* ── 7. Deals Too Good to Miss ────────────────────── */}
    <DealsSection />

    {/* ── 8. LUXE — premium brands ─────────────────────── */}
    <LuxeSection />

    {/* ── 9. India Meets Shoppers Stop ─────────────────── */}
    <IndiaMeets />

    {/* ── 10. First Citizen Club ───────────────────────── */}
    <FCClubSection />

    {/* ── 11. HomeStop spring collection ───────────────── */}
    <HomeStopSection />

    {/* ── 12. Style Hub editorial ──────────────────────── */}
    <StyleHubTeaser />
  </>
)
