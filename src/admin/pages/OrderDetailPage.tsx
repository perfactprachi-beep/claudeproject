import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, Package, CheckCircle, Clock } from 'lucide-react'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useAdminToast, AdminToastContainer } from '../components/ui/AdminToast'
import { MOCK_ADMIN_ORDERS } from '../data/mockData'
import type { AdminOrder } from '../types/admin'

const TIMELINE_STEPS = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered']

function stepIndex(status: AdminOrder['status']): number {
  const map: Record<string, number> = { pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4, cancelled: -1, returned: -1 }
  return map[status] ?? 0
}

export function OrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { toasts, show } = useAdminToast()

  const found = MOCK_ADMIN_ORDERS.find(o => o.id === orderId)
  const [order, setOrder] = useState<AdminOrder | null>(found ?? null)
  const [newStatus, setNewStatus] = useState(order?.status ?? 'pending')
  const [tracking, setTracking] = useState(order?.trackingNumber ?? '')
  const [courier, setCourier] = useState(order?.courier ?? '')
  const [note, setNote] = useState(order?.internalNote ?? '')

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Package size={40} className="mb-3" />
        <p className="text-lg font-medium text-gray-700">Order not found</p>
        <button onClick={() => navigate('/admin/orders')} className="mt-4 text-sm text-[#C0001D] hover:underline">Back to Orders</button>
      </div>
    )
  }

  const currentStep = stepIndex(order.status)

  const handleSave = () => {
    setOrder(o => o ? { ...o, status: newStatus, trackingNumber: tracking, courier, internalNote: note } : o)
    show('Order updated successfully', 'success')
  }

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin/orders')} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">{order.id}</h2>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-gray-500">{order.date}</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Printer size={14} /> Print Invoice
        </button>
      </div>

      {/* Timeline */}
      {order.status !== 'cancelled' && order.status !== 'returned' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-5">Order Timeline</h3>
          <div className="flex items-center">
            {TIMELINE_STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= currentStep ? 'bg-[#C0001D] text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {i < currentStep ? <CheckCircle size={16} /> : i === currentStep ? <Clock size={16} /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                  </div>
                  <p className={`text-xs mt-1.5 font-medium ${i <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>{step}</p>
                </div>
                {i < TIMELINE_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i < currentStep ? 'bg-[#C0001D]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Order items */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <img src={item.image} alt={item.productName} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Size: {item.size} · Colour: {item.colour} · Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">₹{order.amount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Admin actions */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Admin Actions</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Update Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value as AdminOrder['status'])}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]">
                  {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'].map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tracking Number</label>
                  <input value={tracking} onChange={e => setTracking(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" placeholder="e.g. SHR123456" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Courier Partner</label>
                  <select value={courier} onChange={e => setCourier(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                    <option value="">Select courier</option>
                    <option>Shiprocket</option>
                    <option>Delhivery</option>
                    <option>Blue Dart</option>
                    <option>Ekart</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Internal Note (not visible to customer)</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" placeholder="Add a note…" />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} className="px-5 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">
                  Save Changes
                </button>
                <button className="px-5 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
                  Initiate Refund
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <InfoCard title="Customer">
            <InfoRow label="Name" value={order.customerName} />
            <InfoRow label="Mobile" value={order.customerMobile} />
            <InfoRow label="FC Tier" value={order.customerFCTier} />
          </InfoCard>
          <InfoCard title="Delivery Address">
            <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
          </InfoCard>
          <InfoCard title="Payment">
            <InfoRow label="Method" value={order.paymentMethod} />
            <InfoRow label="Transaction ID" value={order.transactionId} />
            <InfoRow label="Amount" value={`₹${order.amount.toLocaleString('en-IN')}`} />
          </InfoCard>
        </div>
      </div>
      <AdminToastContainer toasts={toasts} onDismiss={() => {}} />
    </div>
  )
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 text-right">{value}</span>
    </div>
  )
}
