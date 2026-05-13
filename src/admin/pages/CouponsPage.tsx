import { useState } from 'react'
import { Plus, Edit2, Trash2, Copy } from 'lucide-react'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { useAdminToast, AdminToastContainer } from '../components/ui/AdminToast'
import { MOCK_COUPONS } from '../data/mockData'
import { useAdminStore } from '../store/useAdminStore'
import { canEdit } from '../types/admin'
import type { Coupon } from '../types/admin'

export function CouponsPage() {
  const { adminUser } = useAdminStore()
  const editable = canEdit(adminUser!.role, 'coupons')
  const { toasts, show } = useAdminToast()
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS)
  const [showForm, setShowForm] = useState(false)
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const typeLabel: Record<string, string> = { percent: '% Discount', flat: 'Flat Discount', free_delivery: 'Free Delivery', buy_x_get_y: 'Buy X Get Y' }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Coupons</h2>
          <p className="text-sm text-gray-500">{coupons.length} coupons</p>
        </div>
        {editable && (
          <button onClick={() => { setEditCoupon(null); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-[#C0001D] text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">
            <Plus size={16} /> Create Coupon
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Code', 'Type', 'Value', 'Min Order', 'Usage', 'For', 'Expiry', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-gray-900 text-xs bg-gray-100 px-2 py-0.5 rounded">{c.code}</span>
                      <button onClick={() => { navigator.clipboard.writeText(c.code); show('Copied!', 'success') }}>
                        <Copy size={12} className="text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{typeLabel[c.type]}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {c.type === 'percent' ? `${c.value}%` : c.type === 'flat' ? `₹${c.value}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">₹{c.minOrderValue.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{c.usageCount}/{c.usageLimit}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs capitalize">{c.applicableTo.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.expiry}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => {
                      setCoupons(cs => cs.map(x => x.id === c.id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x))
                    }}>
                      <StatusBadge status={c.status} size="sm" />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {editable && (
                        <button onClick={() => { setEditCoupon(c); setShowForm(true) }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 size={14} />
                        </button>
                      )}
                      {editable && (
                        <button onClick={() => setDeleteTarget(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <CouponFormModal
          coupon={editCoupon}
          onClose={() => setShowForm(false)}
          onSave={(c) => {
            if (editCoupon) {
              setCoupons(cs => cs.map(x => x.id === c.id ? c : x))
              show('Coupon updated', 'success')
            } else {
              setCoupons(cs => [...cs, { ...c, id: `CPN-${Date.now()}`, usageCount: 0 }])
              show('Coupon created', 'success')
            }
            setShowForm(false)
          }}
        />
      )}

      <ConfirmModal open={deleteTarget !== null} title="Delete Coupon" message="This coupon will be permanently deleted."
        confirmLabel="Delete" onConfirm={() => { setCoupons(cs => cs.filter(c => c.id !== deleteTarget)); show('Coupon deleted', 'success') }}
        onCancel={() => setDeleteTarget(null)} />
      <AdminToastContainer toasts={toasts} onDismiss={() => {}} />
    </div>
  )
}

function CouponFormModal({ coupon, onClose, onSave }: { coupon: Coupon | null; onClose: () => void; onSave: (c: Coupon) => void }) {
  const [form, setForm] = useState<Partial<Coupon>>(coupon ?? {
    code: '', type: 'percent', value: 0, minOrderValue: 0, usageLimit: 100, userLimit: 1,
    expiry: '', startDate: '', applicableTo: 'all', status: 'active'
  })

  const autoCode = () => setForm(f => ({ ...f, code: `SALE${Math.random().toString(36).slice(2,7).toUpperCase()}` }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">{coupon ? 'Edit Coupon' : 'Create Coupon'}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Coupon Code</label>
            <div className="flex gap-2">
              <input value={form.code ?? ''} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]" placeholder="SUMMER20" />
              <button onClick={autoCode} className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Auto</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select value={form.type ?? 'percent'} onChange={e => setForm(f => ({ ...f, type: e.target.value as Coupon['type'] }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                <option value="percent">% Discount</option>
                <option value="flat">Flat Discount</option>
                <option value="free_delivery">Free Delivery</option>
                <option value="buy_x_get_y">Buy X Get Y</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Value ({form.type === 'percent' ? '%' : '₹'})</label>
              <input type="number" value={form.value ?? ''} onChange={e => setForm(f => ({ ...f, value: +e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Min Order (₹)</label>
              <input type="number" value={form.minOrderValue ?? ''} onChange={e => setForm(f => ({ ...f, minOrderValue: +e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Total Usage Limit</label>
              <input type="number" value={form.usageLimit ?? ''} onChange={e => setForm(f => ({ ...f, usageLimit: +e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
              <input type="date" value={form.startDate ?? ''} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
              <input type="date" value={form.expiry ?? ''} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Applicable To</label>
            <select value={form.applicableTo ?? 'all'} onChange={e => setForm(f => ({ ...f, applicableTo: e.target.value as Coupon['applicableTo'] }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
              <option value="all">All Users</option>
              <option value="first_citizens">First Citizens Only</option>
              <option value="new_users">New Users Only</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.status === 'active'} onChange={e => setForm(f => ({ ...f, status: e.target.checked ? 'active' : 'inactive' }))} className="rounded" />
            <span className="text-sm text-gray-700">Active</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form as Coupon)} className="flex-1 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">Save</button>
        </div>
      </div>
    </div>
  )
}
