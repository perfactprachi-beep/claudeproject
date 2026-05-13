import { useState } from 'react'
import { Search, Download, Upload, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { StatusBadge } from '../components/ui/StatusBadge'
import { KPICard } from '../components/ui/KPICard'
import { useAdminToast, AdminToastContainer } from '../components/ui/AdminToast'
import { MOCK_INVENTORY } from '../data/mockData'
import type { InventoryItem } from '../types/admin'

export function InventoryPage() {
  const { toasts, show } = useAdminToast()
  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const filtered = items
    .filter(i => {
      const q = search.toLowerCase()
      return i.product.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)
    })
    .filter(i => filterStatus === 'all' || i.status === filterStatus)
    .filter(i => filterCategory === 'all' || i.category === filterCategory)

  const outCount = items.filter(i => i.status === 'out_of_stock').length
  const lowCount = items.filter(i => i.status === 'low').length
  const healthyCount = items.filter(i => i.status === 'healthy').length
  const categories = [...new Set(items.map(i => i.category))]

  const saveStock = (id: string) => {
    const val = parseInt(editValue)
    if (isNaN(val) || val < 0) { show('Invalid stock value', 'error'); return }
    setItems(is => is.map(i => {
      if (i.id !== id) return i
      const status: InventoryItem['status'] = val === 0 ? 'out_of_stock' : val <= i.reorderLevel ? 'low' : 'healthy'
      return { ...i, currentStock: val, status, lastUpdated: new Date().toISOString().split('T')[0] }
    }))
    setEditingId(null)
    show('Stock updated', 'success')
  }

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard title="Out of Stock" value={String(outCount)} iconBg="bg-red-50" icon={<XCircle size={20} className="text-red-500" />} />
        <KPICard title="Low Stock" value={String(lowCount)} iconBg="bg-amber-50" icon={<AlertTriangle size={20} className="text-amber-500" />} />
        <KPICard title="Healthy Stock" value={String(healthyCount)} iconBg="bg-green-50" icon={<CheckCircle size={20} className="text-green-500" />} />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by product or SKU…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]" />
          </div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <div className="flex gap-1">
            {(['all', 'out_of_stock', 'low', 'healthy'] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${filterStatus === s ? 'bg-[#1A1A2E] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s === 'all' ? 'All' : s === 'out_of_stock' ? 'Out of Stock' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Upload size={14} /> Import CSV
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Product', 'SKU', 'Size', 'Colour', 'Current Stock', 'Reorder Level', 'Status', 'Last Updated', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[160px] truncate">{item.product}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.sku}</td>
                  <td className="px-4 py-3 text-gray-600">{item.size}</td>
                  <td className="px-4 py-3 text-gray-600">{item.colour}</td>
                  <td className="px-4 py-3">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-1">
                        <input autoFocus type="number" value={editValue} onChange={e => setEditValue(e.target.value)}
                          className="w-20 px-2 py-1 border border-[#C0001D] rounded text-sm focus:outline-none"
                          onKeyDown={e => { if (e.key === 'Enter') saveStock(item.id); if (e.key === 'Escape') setEditingId(null) }} />
                        <button onClick={() => saveStock(item.id)} className="text-xs text-green-600 font-medium">✓</button>
                        <button onClick={() => setEditingId(null)} className="text-xs text-gray-400">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingId(item.id); setEditValue(String(item.currentStock)) }}
                        className={`font-semibold hover:underline cursor-pointer ${item.currentStock === 0 ? 'text-red-500' : item.status === 'low' ? 'text-amber-600' : 'text-gray-900'}`}>
                        {item.currentStock}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.reorderLevel}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} size="sm" /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{item.lastUpdated}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { show(`Reorder request created for ${item.sku}`, 'success') }}
                      className="text-xs font-medium text-[#C0001D] hover:underline"
                    >
                      Mark Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AdminToastContainer toasts={toasts} onDismiss={() => {}} />
    </div>
  )
}
