import { useState, useMemo } from 'react'
import { Crown, Star, Gift, AlertTriangle, Check } from 'lucide-react'
import { useAuthStore } from '@store/useAuthStore'
import { FCTier } from '@typedefs/enums'
import { cn } from '@utils/cn'

// ─── Types ────────────────────────────────────────────────────────────────────

type TxType = 'earned' | 'redeemed' | 'expired'
type TabFilter = 'all' | TxType

interface Transaction {
  id: string
  date: string
  description: string
  points: number
  balance: number
  type: TxType
}

interface FCMember {
  tier: FCTier
  memberName: string
  cardLastFour: string
  points: number
  annualSpend: number
  expiryDate: string
  renewalCost: number
}

interface TierConfig {
  gradientStyle: React.CSSProperties
  isDarkText: boolean
  badgeClass: string
  next?: FCTier
  spendCap: number
  earnRate: number
  birthdayBonus: number
  benefits: {
    earlyAccess: boolean
    freeAlterations: boolean
    personalShopper: boolean
    priorityBilling: boolean
  }
}

interface BenefitRow {
  label: string
  getValue: (t: FCTier) => string | boolean
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_MEMBER: FCMember = {
  tier: FCTier.SILVER_EDGE,
  memberName: 'Priya Sharma',
  cardLastFour: '4521',
  points: 2840,
  annualSpend: 38200,
  expiryDate: '2026-06-30',
  renewalCost: 4500,
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', date: '08 May 2025', description: 'Purchase #SSL20240508',    points:  120, balance: 2840, type: 'earned'   },
  { id: 'tx2', date: '02 May 2025', description: 'Birthday Bonus',           points:  500, balance: 2720, type: 'earned'   },
  { id: 'tx3', date: '28 Apr 2025', description: 'Redeemed at checkout',     points: -200, balance: 2220, type: 'redeemed' },
  { id: 'tx4', date: '15 Apr 2025', description: 'Purchase #SSL20240415',    points:   85, balance: 2420, type: 'earned'   },
  { id: 'tx5', date: '01 Apr 2025', description: 'Redemption – April order', points: -150, balance: 2335, type: 'redeemed' },
  { id: 'tx6', date: '15 Mar 2025', description: 'Purchase #SSL20240315',    points:   60, balance: 2485, type: 'earned'   },
  { id: 'tx7', date: '28 Feb 2025', description: 'Bonus points expired',     points: -100, balance: 2425, type: 'expired'  },
]

const PARTNER_BRANDS = [
  { name: "McDonald's",      abbr: 'MCD', color: '#DA291C', bg: '#FEF2F2' },
  { name: 'Pizza Hut',       abbr: 'PH',  color: '#D71920', bg: '#FEF2F2' },
  { name: 'Mad Over Donuts', abbr: 'MOD', color: '#C2185B', bg: '#FFF1F2' },
  { name: 'Himalaya',        abbr: 'HIM', color: '#166534', bg: '#F0FDF4' },
  { name: 'Truefitt & Hill', abbr: 'T&H', color: '#1E3A5F', bg: '#EFF6FF' },
]

// ─── Tier Configuration ───────────────────────────────────────────────────────

const TIER_CONFIG: Record<FCTier, TierConfig> = {
  [FCTier.CLASSIC]: {
    gradientStyle: { background: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 45%, #4B5563 100%)' },
    isDarkText: false,
    badgeClass: 'bg-white/20 text-white',
    next: FCTier.SILVER_EDGE,
    spendCap: 15000,
    earnRate: 1,
    birthdayBonus: 100,
    benefits: { earlyAccess: false, freeAlterations: false, personalShopper: false, priorityBilling: false },
  },
  [FCTier.SILVER_EDGE]: {
    gradientStyle: { background: 'linear-gradient(135deg, #60A5FA 0%, #475569 45%, #2563EB 100%)' },
    isDarkText: false,
    badgeClass: 'bg-white/20 text-white',
    next: FCTier.PLATINUM,
    spendCap: 40000,
    earnRate: 2,
    birthdayBonus: 250,
    benefits: { earlyAccess: true, freeAlterations: false, personalShopper: false, priorityBilling: true },
  },
  [FCTier.PLATINUM]: {
    gradientStyle: { background: 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 40%, #CBD5E1 70%, #94A3B8 100%)' },
    isDarkText: true,
    badgeClass: 'bg-slate-700/20 text-slate-800',
    next: FCTier.BLACK,
    spendCap: 150000,
    earnRate: 3,
    birthdayBonus: 500,
    benefits: { earlyAccess: true, freeAlterations: true, personalShopper: false, priorityBilling: true },
  },
  [FCTier.BLACK]: {
    gradientStyle: { background: 'linear-gradient(135deg, #1F2937 0%, #0F172A 60%, #111827 100%)' },
    isDarkText: false,
    badgeClass: 'bg-amber-400/20 text-amber-400',
    next: undefined,
    spendCap: 150000,
    earnRate: 5,
    birthdayBonus: 1000,
    benefits: { earlyAccess: true, freeAlterations: true, personalShopper: true, priorityBilling: true },
  },
}

const ALL_TIERS: FCTier[] = [FCTier.CLASSIC, FCTier.SILVER_EDGE, FCTier.PLATINUM, FCTier.BLACK]

const BENEFIT_ROWS: BenefitRow[] = [
  { label: 'Earn rate (pts / ₹100)', getValue: (t) => `${TIER_CONFIG[t].earnRate} pt${TIER_CONFIG[t].earnRate > 1 ? 's' : ''}` },
  { label: 'Birthday bonus',          getValue: (t) => `${TIER_CONFIG[t].birthdayBonus} pts` },
  { label: 'Early sale access',       getValue: (t) => TIER_CONFIG[t].benefits.earlyAccess },
  { label: 'Free alterations',        getValue: (t) => TIER_CONFIG[t].benefits.freeAlterations },
  { label: 'Personal shopper',        getValue: (t) => TIER_CONFIG[t].benefits.personalShopper },
  { label: 'Priority billing',        getValue: (t) => TIER_CONFIG[t].benefits.priorityBilling },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatINR(v: number) {
  return `₹${v.toLocaleString('en-IN')}`
}

function daysUntil(isoDate: string): number {
  const target = new Date(isoDate)
  const today = new Date()
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000)
}

// ─── Tier Status Card ─────────────────────────────────────────────────────────

function TierStatusCard({ member, userName }: { member: FCMember; userName: string }) {
  const cfg = TIER_CONFIG[member.tier]
  const progress = Math.min((member.annualSpend / cfg.spendCap) * 100, 100)
  const gap = cfg.spendCap - member.annualSpend

  const base   = cfg.isDarkText ? 'text-slate-800'      : 'text-white'
  const muted  = cfg.isDarkText ? 'text-slate-600'      : 'text-white/70'
  const track  = cfg.isDarkText ? 'bg-slate-400/25'     : 'bg-white/20'
  const fill   = cfg.isDarkText ? 'bg-slate-700'        : 'bg-white'

  return (
    <div className="rounded-2xl p-6 relative overflow-hidden shadow-lg" style={cfg.gradientStyle}>
      {/* Decorative rings */}
      <div className="absolute -top-14 -right-14 w-52 h-52 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className={cn('text-[10px] font-bold uppercase tracking-[0.15em]', muted)}>First Citizen</p>
            <p className={cn('text-2xl font-bold font-serif mt-0.5', base)}>{member.tier} Member</p>
          </div>
          <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold', cfg.badgeClass)}>
            <Crown size={12} />
            {member.tier}
          </div>
        </div>

        {/* Member info + points */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className={cn('text-[10px]', muted)}>Member Name</p>
            <p className={cn('font-semibold text-sm mt-0.5', base)}>{userName}</p>
            <p className={cn('font-mono text-xs mt-1 tracking-wider', muted)}>
              XXXX XXXX XXXX {member.cardLastFour}
            </p>
          </div>
          <div className="text-right">
            <p className={cn('text-[10px]', muted)}>Points Balance</p>
            <p className={cn('font-mono font-bold text-3xl leading-none mt-0.5', base)}>
              {member.points.toLocaleString('en-IN')}
            </p>
            <p className={cn('text-sm font-semibold mt-0.5', muted)}>FC Points</p>
            <p className={cn('text-xs', muted)}>Worth {formatINR(member.points)}</p>
          </div>
        </div>

        {/* Annual spend + progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className={cn('text-xs', muted)}>Annual Spend</p>
            <p className={cn('text-xs font-semibold', base)}>{formatINR(member.annualSpend)} spent this year</p>
          </div>
          {cfg.next ? (
            <>
              <div className={cn('h-2.5 rounded-full overflow-hidden', track)}>
                <div
                  className={cn('h-full rounded-full transition-all duration-700', fill)}
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={member.annualSpend}
                  aria-valuemax={cfg.spendCap}
                  aria-label={`${Math.round(progress)}% toward ${cfg.next}`}
                />
              </div>
              <p className={cn('text-xs mt-1.5', muted)}>
                Spend <strong className={base}>{formatINR(gap)}</strong> more to reach{' '}
                <strong className={base}>{cfg.next}</strong> — {Math.round(progress)}% there
              </p>
            </>
          ) : (
            <p className={cn('text-xs mt-1', muted)}>You are at the highest First Citizen tier</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Points Activity Table ────────────────────────────────────────────────────

const TABS: { key: TabFilter; label: string }[] = [
  { key: 'all',      label: 'All' },
  { key: 'earned',   label: 'Earned' },
  { key: 'redeemed', label: 'Redeemed' },
  { key: 'expired',  label: 'Expired' },
]

function PointsActivityTable({ transactions }: { transactions: Transaction[] }) {
  const [activeTab, setActiveTab] = useState<TabFilter>('all')

  const filtered = useMemo(
    () => activeTab === 'all' ? transactions : transactions.filter((t) => t.type === activeTab),
    [transactions, activeTab],
  )

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
      <div className="px-5 pt-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Points Activity</h2>
        <div className="flex gap-0 border-b border-[#EBEBEB]">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors',
                activeTab === key
                  ? 'border-[#C0001D] text-[#C0001D]'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-5">
          <Star size={24} className="text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">No {activeTab} transactions yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="bg-[#F8F8F8] border-y border-[#EBEBEB]">
                {[
                  { col: 'Date',        align: 'text-left'  },
                  { col: 'Transaction', align: 'text-left'  },
                  { col: 'Points',      align: 'text-right' },
                  { col: 'Balance',     align: 'text-right' },
                ].map(({ col, align }) => (
                  <th
                    key={col}
                    className={cn('px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-500', align)}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">{tx.date}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-800">{tx.description}</td>
                  <td
                    className={cn(
                      'px-5 py-3.5 text-sm font-mono font-bold text-right whitespace-nowrap',
                      tx.points > 0   ? 'text-green-600'
                      : tx.type === 'expired' ? 'text-gray-400'
                      : 'text-red-500',
                    )}
                  >
                    {tx.points > 0 ? `+${tx.points}` : tx.points}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-mono text-gray-700 text-right">
                    {tx.balance.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Tier Benefits Comparison ─────────────────────────────────────────────────

function BenefitCell({ value, highlight }: { value: string | boolean; highlight: boolean }) {
  const bg = highlight ? 'bg-[#C0001D]/5' : ''
  if (typeof value === 'boolean') {
    return (
      <td className={cn('px-3 py-3.5 text-center', bg)}>
        {value ? (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
            <Check size={11} className="text-green-600" strokeWidth={3} />
          </span>
        ) : (
          <span className="text-gray-300 font-bold">–</span>
        )}
      </td>
    )
  }
  return (
    <td className={cn('px-3 py-3.5 text-center text-xs font-semibold text-gray-700', bg)}>
      {value}
    </td>
  )
}

function TierBenefitsComparison({ currentTier }: { currentTier: FCTier }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F0F0F0]">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Crown size={14} className="text-[#C0001D]" />
          Tier Benefits
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Compare benefits across all First Citizen tiers</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="bg-[#F8F8F8] border-b border-[#EBEBEB]">
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-[170px]">
                Benefit
              </th>
              {ALL_TIERS.map((tier) => (
                <th
                  key={tier}
                  className={cn(
                    'px-3 py-3 text-center text-xs font-bold uppercase tracking-wider',
                    tier === currentTier ? 'text-[#C0001D] bg-[#C0001D]/5' : 'text-gray-500',
                  )}
                >
                  {tier}
                  {tier === currentTier && (
                    <span className="block text-[9px] normal-case tracking-normal font-semibold text-[#C0001D] mt-0.5">
                      Your tier
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F5]">
            {BENEFIT_ROWS.map((row) => (
              <tr key={row.label} className="hover:bg-[#FAFAFA] transition-colors">
                <td className="px-5 py-3.5 text-xs text-gray-700">{row.label}</td>
                {ALL_TIERS.map((tier) => (
                  <BenefitCell
                    key={tier}
                    value={row.getValue(tier)}
                    highlight={tier === currentTier}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Redeem Points Panel ──────────────────────────────────────────────────────

function RedeemPointsPanel({ maxPoints }: { maxPoints: number }) {
  const [rawPoints, setRawPoints] = useState(200)
  const [applied, setApplied] = useState(false)

  const isValid   = rawPoints >= 200 && rawPoints <= maxPoints
  const discount  = isValid ? rawPoints : 0
  const errorMsg  =
    rawPoints < 200         ? 'Minimum 200 points required'
    : rawPoints > maxPoints ? `Maximum ${maxPoints.toLocaleString('en-IN')} points available`
    : ''

  const step = (delta: number) =>
    setRawPoints((p) => Math.max(200, Math.min(maxPoints, p + delta)))

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
      <h2 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
        <Gift size={14} className="text-[#C0001D]" />
        Redeem Points
      </h2>
      <p className="text-xs text-gray-500 mb-5">1 point = ₹1 discount at checkout</p>

      {applied ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <Check size={16} className="text-green-600" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-green-800">
              {rawPoints.toLocaleString('en-IN')} points applied!
            </p>
            <p className="text-xs text-green-700 mt-0.5">
              {formatINR(discount)} will be deducted at your next checkout
            </p>
          </div>
          <button
            onClick={() => setApplied(false)}
            className="shrink-0 text-xs text-gray-500 underline hover:text-gray-700 transition-colors"
          >
            Change
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-3 mb-2">
            {/* Points input */}
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1.5">Points to redeem</label>
              <div className="relative">
                <input
                  type="number"
                  value={rawPoints}
                  min={200}
                  max={maxPoints}
                  onChange={(e) => setRawPoints(Number(e.target.value))}
                  className={cn(
                    'w-full border rounded-xl px-4 py-3 pr-16 text-sm font-mono font-bold text-gray-900 focus:outline-none focus:ring-1 transition-colors appearance-none',
                    isValid
                      ? 'border-[#DCDCDC] focus:border-[#C0001D] focus:ring-[#C0001D]/20'
                      : 'border-red-300 focus:border-red-400 focus:ring-red-200',
                  )}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <button
                    onClick={() => step(-100)}
                    aria-label="Decrease by 100"
                    className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold transition-colors"
                  >
                    –
                  </button>
                  <button
                    onClick={() => step(100)}
                    aria-label="Increase by 100"
                    className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              {errorMsg && (
                <p className="text-[11px] text-red-500 mt-1">{errorMsg}</p>
              )}
            </div>

            {/* Discount preview */}
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1.5">Discount value</p>
              <div className="border border-[#EBEBEB] bg-[#FAFAFA] rounded-xl px-4 py-3 h-[48px] flex items-center gap-1">
                <span className="text-sm font-bold text-gray-900">{isValid ? formatINR(discount) : '—'}</span>
                {isValid && <span className="text-xs text-gray-400">off</span>}
              </div>
            </div>
          </div>

          {/* Min/max + use all */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-500">
              Min <strong className="text-gray-700">200</strong> · Max{' '}
              <strong className="text-gray-700">{maxPoints.toLocaleString('en-IN')}</strong> pts
            </p>
            <button
              onClick={() => setRawPoints(maxPoints)}
              className="text-xs text-[#C0001D] font-semibold hover:underline transition-colors"
            >
              Use all
            </button>
          </div>

          {/* Live calc callout */}
          <div className="bg-[#F8F8F8] rounded-lg px-3 py-2.5 mb-4 text-xs text-gray-600">
            {isValid
              ? <><strong>{rawPoints.toLocaleString('en-IN')} points</strong> = <strong>{formatINR(discount)} discount</strong> on your next purchase</>
              : 'Enter a valid points amount to see your discount'}
          </div>

          <button
            onClick={() => setApplied(true)}
            disabled={!isValid}
            className="w-full bg-[#C0001D] text-white rounded-xl py-3 text-sm font-bold hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Apply to Next Purchase
          </button>
        </>
      )}
    </div>
  )
}

// ─── Partner Brands ───────────────────────────────────────────────────────────

function PartnerBrandsSection() {
  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
      <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Star size={14} className="text-[#C0001D]" />
        Earn Points at Partner Brands
      </h2>
      <div
        className="flex gap-4 overflow-x-auto pb-1 -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {PARTNER_BRANDS.map((brand) => (
          <div key={brand.name} className="flex flex-col items-center gap-2 shrink-0">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-[11px] font-bold border border-[#EBEBEB] select-none"
              style={{ backgroundColor: brand.bg, color: brand.color }}
            >
              {brand.abbr}
            </div>
            <p className="text-[10px] text-gray-600 text-center leading-tight max-w-[70px]">{brand.name}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4 leading-relaxed">
        Earn points when you pay with your linked debit/credit card at partner outlets
      </p>
    </div>
  )
}

// ─── Renewal Banner ───────────────────────────────────────────────────────────

function RenewalBanner({ expiryDate, renewalCost }: { expiryDate: string; renewalCost: number }) {
  const days = daysUntil(expiryDate)
  if (days > 60) return null

  const expiryDisplay = new Date(expiryDate).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
        <AlertTriangle size={16} className="text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-amber-900">Membership expiring soon</p>
        <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
          Your membership expires on{' '}
          <strong>{expiryDisplay}</strong>. Renew for{' '}
          <strong>{formatINR(renewalCost)}</strong> and keep your tier status.
        </p>
      </div>
      <button className="shrink-0 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors whitespace-nowrap">
        Renew Now
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const FirstCitizenPage = () => {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold font-serif text-gray-900">First Citizen Loyalty</h1>

      <RenewalBanner
        expiryDate={MOCK_MEMBER.expiryDate}
        renewalCost={MOCK_MEMBER.renewalCost}
      />

      <TierStatusCard
        member={MOCK_MEMBER}
        userName={user?.fullName ?? MOCK_MEMBER.memberName}
      />

      <PointsActivityTable transactions={MOCK_TRANSACTIONS} />

      <TierBenefitsComparison currentTier={MOCK_MEMBER.tier} />

      <RedeemPointsPanel maxPoints={MOCK_MEMBER.points} />

      <PartnerBrandsSection />
    </div>
  )
}
