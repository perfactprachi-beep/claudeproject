import { Star, Gift, ChevronRight, Crown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@store/useAuthStore'
import { FCTier } from '@typedefs/enums'
import { cn } from '@utils/cn'

const TIER_CONFIG: Record<FCTier, { color: string; bg: string; next?: FCTier; threshold: number; cap: number }> = {
  [FCTier.CLASSIC]:     { color: 'text-gray-600',    bg: 'from-gray-400 to-gray-600',     next: FCTier.SILVER_EDGE, threshold: 0,      cap: 15000 },
  [FCTier.SILVER_EDGE]: { color: 'text-slate-600',   bg: 'from-slate-400 to-slate-600',   next: FCTier.PLATINUM,    threshold: 15000,  cap: 50000 },
  [FCTier.PLATINUM]:    { color: 'text-blue-700',    bg: 'from-blue-400 to-indigo-600',   next: FCTier.BLACK,       threshold: 50000,  cap: 150000 },
  [FCTier.BLACK]:       { color: 'text-gray-900',    bg: 'from-gray-700 to-gray-900',     next: undefined,          threshold: 150000, cap: 150000 },
}

const MOCK_FC = {
  tier: FCTier.SILVER_EDGE,
  points: 4820,
  pointsValue: 482,
  annualSpend: 38500,
  memberId: 'FC-9876543',
  renewalDate: 'March 31, 2026',
  benefits: [
    'Earn 1 point per ₹100 spent',
    'Free shipping on all orders',
    'Priority customer service',
    'Exclusive member-only sale access',
    'Birthday & anniversary bonus points',
  ],
  recentTransactions: [
    { date: '15 Jan 2025', description: 'Purchase – SS-2025-001247', points: '+186' },
    { date: '08 Jan 2025', description: 'Redemption – SS-2025-000891', points: '-500' },
    { date: '22 Dec 2024', description: 'Purchase – SS-2024-008831', points: '+150' },
    { date: '28 Nov 2024', description: 'Birthday Bonus', points: '+200' },
  ],
}

export const FirstCitizenPage = () => {
  const user = useAuthStore((s) => s.user)
  const config = TIER_CONFIG[MOCK_FC.tier]
  const nextTierGap = config.cap - MOCK_FC.annualSpend
  const progress = Math.min((MOCK_FC.annualSpend / config.cap) * 100, 100)

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold font-serif text-gray-900">First Citizen Loyalty</h1>

      {/* Membership card */}
      <div
        className={cn(
          'rounded-2xl p-6 bg-gradient-to-br text-white relative overflow-hidden',
          config.bg,
        )}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />

        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">First Citizen</p>
              <p className="text-2xl font-bold font-serif mt-0.5">{MOCK_FC.tier}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
              <Crown size={13} />
              <span className="text-xs font-bold">{MOCK_FC.tier}</span>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/70 text-xs">Member ID</p>
              <p className="font-mono font-bold text-sm">{user?.firstCitizenId ?? MOCK_FC.memberId}</p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs">Points Balance</p>
              <p className="font-mono font-bold text-2xl">{MOCK_FC.points.toLocaleString('en-IN')}</p>
              <p className="text-white/70 text-xs">≈ ₹{MOCK_FC.pointsValue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tier progress */}
      {config.next && (
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-900">Progress to {config.next}</p>
            <p className="text-xs text-gray-500 font-mono">
              ₹{MOCK_FC.annualSpend.toLocaleString('en-IN')} / ₹{config.cap.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="h-2 rounded-full bg-[#F0F0F0] overflow-hidden">
            <div
              className="h-full bg-brand-red rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={MOCK_FC.annualSpend}
              aria-valuemax={config.cap}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Spend <strong className="text-gray-900">₹{nextTierGap.toLocaleString('en-IN')}</strong> more to unlock {config.next}
          </p>
        </div>
      )}

      {/* Points summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Points Balance', value: MOCK_FC.points.toLocaleString('en-IN'), sub: `≈ ₹${MOCK_FC.pointsValue}` },
          { label: 'Annual Spend', value: `₹${(MOCK_FC.annualSpend / 1000).toFixed(1)}K`, sub: `FY 2024–25` },
          { label: 'Valid Till', value: 'Mar 2026', sub: MOCK_FC.renewalDate },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-xl border border-[#EBEBEB] p-3 text-center">
            <p className="font-bold font-mono text-gray-900 text-lg leading-none">{value}</p>
            <p className="text-[10px] text-gray-500 mt-1 leading-tight">{label}</p>
            <p className="text-[10px] text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Redeem CTA */}
      <div className="bg-brand-red/5 border border-brand-red/20 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center shrink-0">
          <Gift size={20} className="text-brand-red" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">Redeem Your Points</p>
          <p className="text-xs text-gray-500 mt-0.5">
            You have <strong>{MOCK_FC.points.toLocaleString('en-IN')}</strong> points worth <strong>₹{MOCK_FC.pointsValue}</strong> to redeem
          </p>
        </div>
        <Link
          to="/"
          className="shrink-0 flex items-center gap-1 text-xs font-bold text-brand-red hover:underline"
        >
          Shop Now <ChevronRight size={13} />
        </Link>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Star size={14} className="text-brand-red" /> {MOCK_FC.tier} Benefits
        </h2>
        <ul className="flex flex-col gap-2.5">
          {MOCK_FC.benefits.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-gray-700">
              <span className="mt-1 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <span className="text-green-600 text-[10px] font-bold">✓</span>
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="flex flex-col divide-y divide-[#F5F5F5]">
          {MOCK_FC.recentTransactions.map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm text-gray-800">{tx.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">{tx.date}</p>
              </div>
              <span className={cn(
                'font-mono font-bold text-sm',
                tx.points.startsWith('+') ? 'text-green-600' : 'text-danger',
              )}>
                {tx.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
