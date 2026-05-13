import { IndianRupee, ShoppingBag, TrendingUp, Users, AlertTriangle, RotateCcw, Image, Award } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { KPICard } from '../components/ui/KPICard'
import { StatusBadge } from '../components/ui/StatusBadge'
import { MOCK_ADMIN_ORDERS, REVENUE_DATA, ORDER_STATUS_DATA } from '../data/mockData'

export function DashboardPage() {
  const navigate = useNavigate()
  const recentOrders = MOCK_ADMIN_ORDERS.slice(0, 6)

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Revenue Today" value="₹1,24,850" delta={12.4} iconBg="bg-red-50" icon={<IndianRupee size={20} className="text-[#C0001D]" />} />
        <KPICard title="Orders Today" value="67" delta={8.2} iconBg="bg-blue-50" icon={<ShoppingBag size={20} className="text-blue-600" />} />
        <KPICard title="Avg. Order Value" value="₹1,863" delta={-3.1} iconBg="bg-amber-50" icon={<TrendingUp size={20} className="text-amber-600" />} />
        <KPICard title="Active Users Now" value="248" iconBg="bg-green-50" icon={<Users size={20} className="text-green-600" />} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue — Last 14 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={REVENUE_DATA} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#C0001D" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Donut */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={ORDER_STATUS_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
                {ORDER_STATUS_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs text-gray-600">{value}</span>} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Recent Orders</h3>
            <button onClick={() => navigate('/admin/orders')} className="text-xs text-[#C0001D] font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Customer', 'Amount', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{order.id}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{order.customerName}</td>
                    <td className="px-4 py-3 text-gray-700">₹{order.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} size="sm" /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => navigate(`/admin/orders/${order.id}`)} className="text-xs text-[#C0001D] font-medium hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Alerts</h3>
          <AlertItem icon={<AlertTriangle size={16} className="text-amber-500" />} label="Low Stock SKUs" value="12" bg="bg-amber-50" onClick={() => navigate('/admin/inventory')} />
          <AlertItem icon={<RotateCcw size={16} className="text-purple-500" />} label="Pending Returns" value="3" bg="bg-purple-50" onClick={() => navigate('/admin/returns')} />
          <AlertItem icon={<Image size={16} className="text-blue-500" />} label="Banners Going Live Soon" value="2" bg="bg-blue-50" onClick={() => navigate('/admin/banners')} />
          <AlertItem icon={<Award size={16} className="text-green-500" />} label="New FC Signups Today" value="8" bg="bg-green-50" onClick={() => navigate('/admin/loyalty')} />
        </div>
      </div>
    </div>
  )
}

function AlertItem({ icon, label, value, bg, onClick }: { icon: React.ReactNode; label: string; value: string; bg: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
      <span className="flex-1 text-sm text-gray-700">{label}</span>
      <span className="text-sm font-bold text-gray-900">{value}</span>
    </button>
  )
}
