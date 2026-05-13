import { useState } from 'react'
import { Search, Eye, Shield, ArrowLeft } from 'lucide-react'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { useAdminToast, AdminToastContainer } from '../components/ui/AdminToast'
import { MOCK_CUSTOMERS, MOCK_ADMIN_ORDERS } from '../data/mockData'
import type { AdminCustomer } from '../types/admin'

const TIER_COLORS: Record<string, string> = {
  Classic: 'bg-gray-100 text-gray-700',
  'Silver Edge': 'bg-slate-100 text-slate-700',
  Platinum: 'bg-violet-100 text-violet-700',
  Black: 'bg-gray-900 text-white',
}

export function CustomersPage() {
  const { toasts, show } = useAdminToast()
  const [customers, setCustomers] = useState<AdminCustomer[]>(MOCK_CUSTOMERS)
  const [search, setSearch] = useState('')
  const [filterTier, setFilterTier] = useState('all')
  const [blockTarget, setBlockTarget] = useState<AdminCustomer | null>(null)
  const [selected, setSelected] = useState<AdminCustomer | null>(null)

  const filtered = customers
    .filter(c => {
      const q = search.toLowerCase()
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.mobile.includes(q)
    })
    .filter(c => filterTier === 'all' || c.fcTier === filterTier)

  const tiers = [...new Set(MOCK_CUSTOMERS.map(c => c.fcTier))]

  if (selected) {
    return <CustomerDetailView customer={selected} onBack={() => setSelected(null)} onUpdate={(c) => {
      setCustomers(cs => cs.map(x => x.uid === c.uid ? c : x))
      setSelected(c)
      show('Customer updated', 'success')
    }} />
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Customers</h2>
        <p className="text-sm text-gray-500">{filtered.length} customers</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or mobile…"
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]" />
        </div>
        <div className="flex gap-1">
          <button onClick={() => setFilterTier('all')}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${filterTier === 'all' ? 'bg-[#1A1A2E] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            All Tiers
          </button>
          {tiers.map(t => (
            <button key={t} onClick={() => setFilterTier(t)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${filterTier === t ? 'bg-[#1A1A2E] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Customer', 'Email', 'Mobile', 'Joined', 'Orders', 'LTV', 'FC Tier', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.uid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{c.email}</td>
                  <td className="px-4 py-3 text-gray-600">{c.mobile}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.joined}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.orders}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">₹{c.ltv.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${TIER_COLORS[c.fcTier] ?? 'bg-gray-100 text-gray-600'}`}>
                      {c.fcTier}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} size="sm" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(c)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => setBlockTarget(c)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Shield size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={blockTarget !== null}
        title={blockTarget?.status === 'blocked' ? 'Unblock Account' : 'Block Account'}
        message={`Are you sure you want to ${blockTarget?.status === 'blocked' ? 'unblock' : 'block'} ${blockTarget?.name}?`}
        confirmLabel={blockTarget?.status === 'blocked' ? 'Unblock' : 'Block'}
        onConfirm={() => {
          if (blockTarget) {
            const newStatus = blockTarget.status === 'blocked' ? 'active' : 'blocked'
            setCustomers(cs => cs.map(c => c.uid === blockTarget.uid ? { ...c, status: newStatus } : c))
            show(`Account ${newStatus === 'blocked' ? 'blocked' : 'unblocked'}`, 'success')
          }
        }}
        onCancel={() => setBlockTarget(null)}
      />
      <AdminToastContainer toasts={toasts} onDismiss={() => {}} />
    </div>
  )
}

function CustomerDetailView({ customer, onBack, onUpdate }: { customer: AdminCustomer; onBack: () => void; onUpdate: (c: AdminCustomer) => void }) {
  const { toasts, show } = useAdminToast()
  const [pointsAdjust, setPointsAdjust] = useState('')
  const [pointsReason, setPointsReason] = useState('')
  const [note, setNote] = useState('')
  const orders = MOCK_ADMIN_ORDERS.filter(o => o.customerId === customer.uid)

  const handleAdjustPoints = (type: 'credit' | 'debit') => {
    const pts = parseInt(pointsAdjust)
    if (isNaN(pts) || pts <= 0) { show('Enter valid points', 'error'); return }
    onUpdate({ ...customer, fcPoints: customer.fcPoints + (type === 'credit' ? pts : -pts) })
    setPointsAdjust(''); setPointsReason('')
    show(`${pts} points ${type}ed`, 'success')
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{customer.name}</h2>
          <StatusBadge status={customer.status} size="sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {/* Profile */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Email', customer.email], ['Mobile', customer.mobile],
                ['Gender', customer.gender], ['Birthday', customer.birthday],
                ['Joined', customer.joined], ['Orders', String(customer.orders)],
              ].map(([label, value]) => (
                <div key={label}><p className="text-xs text-gray-400">{label}</p><p className="font-medium text-gray-900">{value}</p></div>
              ))}
            </div>
          </div>

          {/* Order history */}
          {orders.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Order History</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Order ID', 'Date', 'Amount', 'Status'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{o.date}</td>
                      <td className="px-4 py-3 font-medium">₹{o.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3"><StatusBadge status={o.status} size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* FC info */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">First Citizen</h4>
            <div className="space-y-2 text-sm">
              <div><p className="text-xs text-gray-400">Tier</p><p className="font-bold text-gray-900">{customer.fcTier}</p></div>
              <div><p className="text-xs text-gray-400">Card Number</p><p className="font-mono text-xs text-gray-700">{customer.fcCardNumber}</p></div>
              <div><p className="text-xs text-gray-400">Points Balance</p><p className="font-bold text-lg text-gray-900">{customer.fcPoints.toLocaleString()}</p></div>
              <div><p className="text-xs text-gray-400">Annual Spend</p><p className="font-medium text-gray-900">₹{customer.annualSpend.toLocaleString('en-IN')}</p></div>
            </div>

            {/* Points adjustment */}
            <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
              <p className="text-xs font-medium text-gray-600">Adjust Points</p>
              <input type="number" value={pointsAdjust} onChange={e => setPointsAdjust(e.target.value)}
                placeholder="Points" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
              <input value={pointsReason} onChange={e => setPointsReason(e.target.value)}
                placeholder="Reason" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
              <div className="flex gap-2">
                <button onClick={() => handleAdjustPoints('credit')} className="flex-1 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100">+ Credit</button>
                <button onClick={() => handleAdjustPoints('debit')} className="flex-1 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100">- Debit</button>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Internal Note</h4>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
              placeholder="Add an internal note…" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" />
            <button onClick={() => show('Note saved', 'success')} className="mt-2 w-full py-2 text-xs font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">Save Note</button>
          </div>
        </div>
      </div>
      <AdminToastContainer toasts={toasts} onDismiss={() => {}} />
    </div>
  )
}
