import { useState } from 'react'
import { Search, Download, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { StatusBadge } from '../components/ui/StatusBadge'
import { MOCK_ADMIN_ORDERS } from '../data/mockData'
import type { AdminOrder } from '../types/admin'

type OrderStatus = AdminOrder['status'] | 'all' | 'returns'

const TABS: { label: string; value: OrderStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Returns', value: 'returned' },
]

export function OrdersPage() {
  const navigate = useNavigate()
  const [orders] = useState<AdminOrder[]>(MOCK_ADMIN_ORDERS)
  const [activeTab, setActiveTab] = useState<OrderStatus>('all')
  const [search, setSearch] = useState('')

  const filtered = orders
    .filter(o => activeTab === 'all' || o.status === activeTab)
    .filter(o => {
      const q = search.toLowerCase()
      return o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerMobile.includes(q)
    })

  const counts = TABS.reduce((acc, tab) => {
    acc[tab.value] = tab.value === 'all' ? orders.length : orders.filter(o => o.status === tab.value).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
          <p className="text-sm text-gray-500">{filtered.length} orders</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {TABS.map(tab => (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.value ? 'border-[#C0001D] text-[#C0001D]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab.label}
              {counts[tab.value] > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${activeTab === tab.value ? 'bg-red-50 text-[#C0001D]' : 'bg-gray-100 text-gray-500'}`}>
                  {counts[tab.value]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID, customer name or mobile…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order ID', 'Customer', 'Date', 'Items', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">No orders found</td></tr>
              ) : filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900">{order.id}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.customerMobile}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{order.date}</td>
                  <td className="px-4 py-3 text-gray-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">₹{order.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{order.paymentMethod}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} size="sm" /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => navigate(`/admin/orders/${order.id}`)}
                      className="flex items-center gap-1 text-xs font-medium text-[#C0001D] hover:underline">
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
