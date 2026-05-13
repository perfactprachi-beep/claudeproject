import { useState } from 'react'
import { Award, TrendingUp, Users, Gift } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { KPICard } from '../components/ui/KPICard'
import { useAdminToast, AdminToastContainer } from '../components/ui/AdminToast'
import { MOCK_FC_MEMBERS, TIER_DISTRIBUTION } from '../data/mockData'
import type { FCMember } from '../types/admin'

const EXPIRY_MEMBERS = [
  { name: 'Priya Sharma', tier: 'Platinum', points: 4280, expiry: '2025-03-15', days: 30 },
  { name: 'Rahul Verma', tier: 'Silver Edge', points: 1520, expiry: '2025-03-28', days: 43 },
  { name: 'Anjali Patel', tier: 'Classic', points: 310, expiry: '2025-04-10', days: 56 },
]

const TIER_RULES = [
  { tier: 'Classic', minSpend: 0, earnRate: 1, birthdayBonus: 100 },
  { tier: 'Silver Edge', minSpend: 10000, earnRate: 2, birthdayBonus: 200 },
  { tier: 'Platinum', minSpend: 25000, earnRate: 3, birthdayBonus: 500 },
  { tier: 'Black', minSpend: 75000, earnRate: 5, birthdayBonus: 1000 },
]

export function LoyaltyPage() {
  const { toasts, show } = useAdminToast()
  const [members] = useState<FCMember[]>(MOCK_FC_MEMBERS)
  const [pointsSearch, setPointsSearch] = useState('')
  const [pointsAmount, setPointsAmount] = useState('')
  const [pointsReason, setPointsReason] = useState('')
  const [tierRules, setTierRules] = useState(TIER_RULES)
  const [activeTab, setActiveTab] = useState<'overview' | 'points' | 'expiry' | 'rules'>('overview')

  const totalMembers = 8000
  const pointsIssuedMTD = members.reduce((s, m) => s + m.pointsIssuedMTD, 0)
  const pointsRedeemedMTD = members.reduce((s, m) => s + m.pointsRedeemedMTD, 0)
  const avgPoints = Math.round(members.reduce((s, m) => s + m.pointsBalance, 0) / members.length)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">First Citizen Loyalty</h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total FC Members" value={totalMembers.toLocaleString()} iconBg="bg-violet-50" icon={<Users size={20} className="text-violet-600" />} />
        <KPICard title="Points Issued MTD" value={pointsIssuedMTD.toLocaleString()} iconBg="bg-blue-50" icon={<TrendingUp size={20} className="text-blue-600" />} />
        <KPICard title="Points Redeemed MTD" value={pointsRedeemedMTD.toLocaleString()} iconBg="bg-red-50" icon={<Gift size={20} className="text-[#C0001D]" />} />
        <KPICard title="Avg Points/Member" value={avgPoints.toLocaleString()} iconBg="bg-amber-50" icon={<Award size={20} className="text-amber-600" />} />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {(['overview', 'points', 'expiry', 'rules'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-[#C0001D] text-[#C0001D]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab === 'points' ? 'Points Operations' : tab === 'expiry' ? 'Expiry Management' : tab === 'rules' ? 'Tier Rules' : 'Overview'}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Tier Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={TIER_DISTRIBUTION} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {TIER_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Members by Tier</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={TIER_DISTRIBUTION} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {TIER_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="lg:col-span-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Members Approaching Tier Upgrade</h3>
                <div className="space-y-2">
                  {members.slice(0, 3).map(m => {
                    const nextTierSpend = TIER_RULES.find(r => r.tier === m.tier)?.minSpend ?? 0
                    const remaining = Math.max(0, nextTierSpend - m.annualSpend + 5000)
                    return (
                      <div key={m.uid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{m.name}</p>
                          <p className="text-xs text-gray-500">{m.tier} · ₹{m.annualSpend.toLocaleString('en-IN')} spent</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">₹{remaining.toLocaleString('en-IN')} to next tier</p>
                          <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-[#C0001D] rounded-full" style={{ width: `${Math.min(95, (m.annualSpend / (m.annualSpend + remaining)) * 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'points' && (
            <div className="max-w-md space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Manual Points Operation</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Search Member</label>
                    <input value={pointsSearch} onChange={e => setPointsSearch(e.target.value)} placeholder="Name, email or card number"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]" />
                    {pointsSearch && (
                      <div className="mt-1 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        {members.filter(m => m.name.toLowerCase().includes(pointsSearch.toLowerCase())).map(m => (
                          <button key={m.uid} onClick={() => setPointsSearch(m.name)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50 text-left border-b border-gray-50 last:border-0">
                            <div className="w-7 h-7 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white text-xs">{m.name[0]}</div>
                            <div><p className="font-medium text-gray-900">{m.name}</p><p className="text-xs text-gray-400">{m.tier} · {m.pointsBalance.toLocaleString()} pts</p></div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Points</label>
                    <input type="number" value={pointsAmount} onChange={e => setPointsAmount(e.target.value)} placeholder="e.g. 500"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Reason</label>
                    <input value={pointsReason} onChange={e => setPointsReason(e.target.value)} placeholder="e.g. Campaign bonus"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { show(`${pointsAmount} points credited to ${pointsSearch || 'member'}`, 'success'); setPointsAmount(''); setPointsReason('') }}
                      className="flex-1 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">Credit Points</button>
                    <button onClick={() => { show(`${pointsAmount} points debited from ${pointsSearch || 'member'}`, 'success'); setPointsAmount(''); setPointsReason('') }}
                      className="flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Debit Points</button>
                  </div>
                </div>
              </div>
              <div className="pt-5 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Bulk Points Campaign</h3>
                <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-2">Upload CSV with member IDs and points to award</p>
                  <button className="px-4 py-2 text-sm font-medium text-[#C0001D] border border-[#C0001D] rounded-lg hover:bg-red-50">
                    Upload CSV
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'expiry' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                {['30 Days', '60 Days', '90 Days'].map(d => (
                  <span key={d} className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">{d}</span>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Member', 'Tier', 'Points Expiring', 'Expiry Date', 'Days Left', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {EXPIRY_MEMBERS.map((m, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                        <td className="px-4 py-3 text-gray-600">{m.tier}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{m.points.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-600">{m.expiry}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.days <= 30 ? 'bg-red-100 text-red-700' : m.days <= 60 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                            {m.days}d
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => show(`Reminder sent to ${m.name}`, 'success')} className="text-xs font-medium text-[#C0001D] hover:underline mr-3">Send Reminder</button>
                          <button onClick={() => show('Expiry extended by 30 days', 'success')} className="text-xs font-medium text-blue-600 hover:underline">Extend</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Configure spend thresholds and earn rates per tier.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Tier', 'Min Annual Spend (₹)', 'Earn Rate (pts/₹100)', 'Birthday Bonus (pts)'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tierRules.map((rule, i) => (
                      <tr key={rule.tier}>
                        <td className="px-4 py-3 font-medium text-gray-900">{rule.tier}</td>
                        <td className="px-4 py-3">
                          <input type="number" value={rule.minSpend} onChange={e => setTierRules(rs => rs.map((r, j) => i === j ? { ...r, minSpend: +e.target.value } : r))}
                            className="w-28 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="number" value={rule.earnRate} onChange={e => setTierRules(rs => rs.map((r, j) => i === j ? { ...r, earnRate: +e.target.value } : r))}
                            className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="number" value={rule.birthdayBonus} onChange={e => setTierRules(rs => rs.map((r, j) => i === j ? { ...r, birthdayBonus: +e.target.value } : r))}
                            className="w-24 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => show('Tier rules saved', 'success')} className="px-5 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">Save Rules</button>
            </div>
          )}
        </div>
      </div>
      <AdminToastContainer toasts={toasts} onDismiss={() => {}} />
    </div>
  )
}
