import { useState } from 'react'
import { Download } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { REVENUE_DATA, MOCK_CUSTOMERS, MOCK_ADMIN_PRODUCTS, TIER_DISTRIBUTION } from '../data/mockData'

type Preset = 'today' | '7d' | '30d' | '90d'

const TOP_PRODUCTS = MOCK_ADMIN_PRODUCTS.slice(0, 5).map((p, i) => ({
  name: p.name.length > 20 ? p.name.slice(0, 20) + '…' : p.name,
  revenue: Math.floor(50000 - i * 8000),
  units: Math.floor(80 - i * 12),
}))

const SEARCH_QUERIES = [
  { query: 'kurta', searches: 4820, ctr: 68 },
  { query: 'saree', searches: 3910, ctr: 72 },
  { query: 'sneakers', searches: 2340, ctr: 55 },
  { query: 'formal shirt', searches: 1980, ctr: 61 },
  { query: 'lehenga', searches: 1560, ctr: 78 },
  { query: 'jeans', searches: 1200, ctr: 48 },
  { query: 'face cream', searches: 980, ctr: 52 },
]

const ZERO_RESULT_QUERIES = [
  { query: 'blue sapphire watch', date: '2024-03-15' },
  { query: 'cashmere coat', date: '2024-03-14' },
  { query: 'bamboo fiber tshirt', date: '2024-03-13' },
]

export function AnalyticsPage() {
  const [preset, setPreset] = useState<Preset>('30d')
  const [activeReport, setActiveReport] = useState<'revenue' | 'orders' | 'customers' | 'products' | 'search'>('revenue')

  const presetData = preset === 'today' ? REVENUE_DATA.slice(-1) : preset === '7d' ? REVENUE_DATA.slice(-7) : REVENUE_DATA

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {(['today', '7d', '30d', '90d'] as Preset[]).map(p => (
              <button key={p} onClick={() => setPreset(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors uppercase ${preset === p ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Report tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {(['revenue', 'orders', 'customers', 'products', 'search'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveReport(tab)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors capitalize ${activeReport === tab ? 'border-[#C0001D] text-[#C0001D]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab === 'search' ? 'Search' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-6">
          {activeReport === 'revenue' && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Daily Revenue</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={presetData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#C0001D" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Breakdown by Category</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Category', 'Revenue', 'Orders', 'Avg. Order Value', 'Share'].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[
                        { cat: 'Women', revenue: 582400, orders: 248, share: 42 },
                        { cat: 'Men', revenue: 341200, orders: 189, share: 25 },
                        { cat: 'Footwear', revenue: 198600, orders: 87, share: 14 },
                        { cat: 'Beauty', revenue: 156800, orders: 156, share: 11 },
                        { cat: 'Home', revenue: 109400, orders: 62, share: 8 },
                      ].map(row => (
                        <tr key={row.cat} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{row.cat}</td>
                          <td className="px-4 py-3 text-gray-700">₹{row.revenue.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 text-gray-700">{row.orders}</td>
                          <td className="px-4 py-3 text-gray-700">₹{Math.round(row.revenue / row.orders).toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#C0001D] rounded-full" style={{ width: `${row.share}%` }} />
                              </div>
                              <span className="text-xs text-gray-500 w-8 text-right">{row.share}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeReport === 'orders' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Orders', value: '567' },
                  { label: 'AOV', value: '₹2,134' },
                  { label: 'Items/Order', value: '2.4' },
                  { label: 'Return Rate', value: '4.2%' },
                ].map(m => (
                  <div key={m.label} className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">{m.label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{m.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Orders by Day</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={presetData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#1A1A2E" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeReport === 'customers' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">New vs Returning</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={[{ name: 'New', value: 234 }, { name: 'Returning', value: 333 }]} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      <Cell fill="#C0001D" />
                      <Cell fill="#1A1A2E" />
                    </Pie>
                    <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Top 5 Customers by LTV</h3>
                <div className="space-y-2">
                  {MOCK_CUSTOMERS.sort((a, b) => b.ltv - a.ltv).slice(0, 5).map((c, i) => (
                    <div key={c.uid} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-400 w-4">{i + 1}</span>
                      <div className="w-7 h-7 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white text-xs font-bold">{c.name[0]}</div>
                      <span className="flex-1 text-sm font-medium text-gray-900">{c.name}</span>
                      <span className="text-sm font-bold text-gray-900">₹{c.ltv.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">FC Tier Acquisition</h3>
                <ResponsiveContainer width="100%" height={180}>
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
            </div>
          )}

          {activeReport === 'products' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Top 5 Best-Selling Products</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['#', 'Product', 'Revenue', 'Units Sold'].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {TOP_PRODUCTS.map((p, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-500 font-medium">{i + 1}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                          <td className="px-4 py-3 text-gray-700">₹{p.revenue.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 text-gray-700">{p.units}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeReport === 'search' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Search Queries</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['#', 'Query', 'Searches', 'Click-through Rate', 'Trend'].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {SEARCH_QUERIES.map((q, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{q.query}</td>
                          <td className="px-4 py-3 text-gray-700">{q.searches.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${q.ctr}%` }} />
                              </div>
                              <span className="text-xs text-gray-600">{q.ctr}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-16 h-6">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[{ v: 40 }, { v: 55 }, { v: 45 }, { v: 70 }, { v: q.ctr }]}>
                                  <Line type="monotone" dataKey="v" stroke="#C0001D" strokeWidth={1.5} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Queries with Zero Results</h3>
                <div className="space-y-2">
                  {ZERO_RESULT_QUERIES.map((q, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">"{q.query}"</span>
                      <span className="text-xs text-gray-500">{q.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
