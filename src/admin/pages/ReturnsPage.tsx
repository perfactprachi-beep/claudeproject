import { useState } from 'react'
import { Eye, Check, X, RotateCcw, IndianRupee } from 'lucide-react'
import { StatusBadge } from '../components/ui/StatusBadge'
import { KPICard } from '../components/ui/KPICard'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { useAdminToast, AdminToastContainer } from '../components/ui/AdminToast'
import { MOCK_RETURNS } from '../data/mockData'
import type { ReturnRequest } from '../types/admin'

export function ReturnsPage() {
  const { toasts, show } = useAdminToast()
  const [returns, setReturns] = useState<ReturnRequest[]>(MOCK_RETURNS)
  const [selected, setSelected] = useState<ReturnRequest | null>(null)
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)
  const [approveTarget, setApproveTarget] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const pending = returns.filter(r => r.status === 'pending').length
  const approved = returns.filter(r => r.status === 'approved').length
  const rejected = returns.filter(r => r.status === 'rejected').length
  const refundsMTD = returns.filter(r => r.status === 'approved').reduce((s, r) => s + r.refundAmount, 0)

  const approve = (id: string) => {
    setReturns(rs => rs.map(r => r.id === id ? { ...r, status: 'approved' } : r))
    show('Return approved — refund initiated', 'success')
  }

  const reject = (id: string) => {
    setReturns(rs => rs.map(r => r.id === id ? { ...r, status: 'rejected' } : r))
    show('Return rejected', 'success')
    setRejectReason('')
  }

  return (
    <div className="space-y-4">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Pending" value={String(pending)} iconBg="bg-amber-50" icon={<RotateCcw size={20} className="text-amber-500" />} />
        <KPICard title="Approved" value={String(approved)} iconBg="bg-green-50" icon={<Check size={20} className="text-green-500" />} />
        <KPICard title="Rejected" value={String(rejected)} iconBg="bg-red-50" icon={<X size={20} className="text-red-500" />} />
        <KPICard title="Refunds Issued MTD" value={`₹${refundsMTD.toLocaleString('en-IN')}`} iconBg="bg-blue-50" icon={<IndianRupee size={20} className="text-blue-500" />} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Return Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Return ID', 'Order ID', 'Customer', 'Product', 'Reason', 'Date', 'Refund Amount', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {returns.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{r.id}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{r.orderId}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.customerName}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{r.product}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{r.reason}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{r.requestedDate}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">₹{r.refundAmount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} size="sm" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(r)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={14} />
                      </button>
                      {r.status === 'pending' && (
                        <>
                          <button onClick={() => setApproveTarget(r.id)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Check size={14} />
                          </button>
                          <button onClick={() => setRejectTarget(r.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <X size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{selected.id} — Return Detail</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Customer Note</p>
                <p className="text-sm text-gray-800">{selected.customerNote}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-gray-400">Product</p><p className="font-medium text-gray-900">{selected.product}</p></div>
                <div><p className="text-xs text-gray-400">Reason</p><p className="font-medium text-gray-900">{selected.reason}</p></div>
                <div><p className="text-xs text-gray-400">Order ID</p><p className="font-mono text-gray-900">{selected.orderId}</p></div>
                <div><p className="text-xs text-gray-400">Refund Amount</p><p className="font-bold text-gray-900">₹{selected.refundAmount.toLocaleString('en-IN')}</p></div>
              </div>
              <div><p className="text-xs text-gray-400 mb-1.5">Refund Method</p>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                  <option value="original">Original Payment Method</option>
                  <option value="store_credit">Store Credit</option>
                  <option value="fc_points">FC Points</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setSelected(null)} className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Close</button>
              {selected.status === 'pending' && (
                <>
                  <button onClick={() => { approve(selected.id); setSelected(null) }} className="flex-1 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">Approve Refund</button>
                  <button onClick={() => { setRejectTarget(selected.id); setSelected(null) }} className="flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Reject</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={approveTarget !== null}
        title="Approve Return"
        message="This will trigger a refund via Razorpay. Are you sure?"
        confirmLabel="Approve & Refund"
        destructive={false}
        onConfirm={() => { if (approveTarget) approve(approveTarget) }}
        onCancel={() => setApproveTarget(null)}
      />
      <ConfirmModal
        open={rejectTarget !== null}
        title="Reject Return"
        message={`Reason for rejection: ${rejectReason || '(none provided)'}`}
        confirmLabel="Reject"
        onConfirm={() => { if (rejectTarget) reject(rejectTarget) }}
        onCancel={() => setRejectTarget(null)}
      />
      <AdminToastContainer toasts={toasts} onDismiss={() => {}} />
    </div>
  )
}
