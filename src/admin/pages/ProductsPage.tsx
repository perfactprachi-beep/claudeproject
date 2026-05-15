import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, Download, CheckSquare } from 'lucide-react'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { useAdminToast, AdminToastContainer } from '../components/ui/AdminToast'
import { MOCK_ADMIN_PRODUCTS } from '../data/mockData'
import { useAdminStore } from '../store/useAdminStore'
import { canEdit } from '../types/admin'
import type { AdminProduct } from '../types/admin'

type SortField = 'name' | 'sellingPrice' | 'stock' | 'createdAt'

export function ProductsPage() {
  const { adminUser } = useAdminStore()
  const editable = canEdit(adminUser!.role, 'products')
  const { toasts, show } = useAdminToast()

  const [products, setProducts] = useState<AdminProduct[]>(MOCK_ADMIN_PRODUCTS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selected, setSelected] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null)

  const filtered = products
    .filter(p => {
      const q = search.toLowerCase()
      return (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    })
    .filter(p => filterStatus === 'all' || p.status === filterStatus)
    .filter(p => filterCategory === 'all' || p.category === filterCategory)
    .sort((a, b) => {
      const va = a[sortField], vb = b[sortField]
      const cmp = typeof va === 'number' ? va - (vb as number) : String(va).localeCompare(String(vb))
      return sortDir === 'asc' ? cmp : -cmp
    })

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const handleDelete = (id: string) => {
    setProducts(ps => ps.filter(p => p.id !== id))
    show('Product deleted', 'success')
  }

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    if (action === 'delete') {
      setProducts(ps => ps.filter(p => !selected.includes(p.id)))
      show(`${selected.length} products deleted`, 'success')
    } else {
      const status = action === 'activate' ? 'active' : 'draft'
      setProducts(ps => ps.map(p => selected.includes(p.id) ? { ...p, status } : p))
      show(`${selected.length} products ${action}d`, 'success')
    }
    setSelected([])
  }

  const categories = [...new Set(MOCK_ADMIN_PRODUCTS.map(p => p.category))]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">{filtered.length} products</p>
        </div>
        {editable && (
          <button
            onClick={() => { setEditProduct(null); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-[#C0001D] text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors"
          >
            <Plus size={16} />
            Add Product
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, SKU, brand…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]" />
          </div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex gap-1">
            {(['all', 'active', 'draft', 'out_of_stock'] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${filterStatus === s ? 'bg-[#1A1A2E] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s === 'all' ? 'All' : s === 'out_of_stock' ? 'Out of Stock' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download size={14} />
            Export
          </button>
        </div>

        {/* Bulk actions */}
        {selected.length > 0 && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-600"><CheckSquare size={14} className="inline mr-1" />{selected.length} selected</span>
            <button onClick={() => handleBulkAction('activate')} className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100">Activate</button>
            <button onClick={() => handleBulkAction('deactivate')} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Deactivate</button>
            {editable && <button onClick={() => handleBulkAction('delete')} className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100">Delete</button>}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(p => p.id) : [])}
                    checked={selected.length === filtered.length && filtered.length > 0}
                    className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Brand</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                <SortTh label="MRP" field="sellingPrice" current={sortField} dir={sortDir} onSort={toggleSort} />
                <SortTh label="Price" field="sellingPrice" current={sortField} dir={sortDir} onSort={toggleSort} />
                <SortTh label="Stock" field="stock" current={sortField} dir={sortDir} onSort={toggleSort} />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-400 text-sm">No products found</td></tr>
              ) : filtered.map(product => (
                <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${selected.includes(product.id) ? 'bg-red-50/30' : ''}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(product.id)}
                      onChange={e => setSelected(s => e.target.checked ? [...s, product.id] : s.filter(id => id !== product.id))}
                      className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.thumbnail} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-gray-900 max-w-[180px] truncate">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.brand}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{product.sku}</td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3 text-gray-500 line-through text-xs">₹{product.mrp.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">₹{product.sellingPrice.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : product.stock < 5 ? 'text-amber-600' : 'text-gray-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={product.status} size="sm" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {editable && (
                        <button onClick={() => { setEditProduct(product); setShowForm(true) }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                      )}
                      {editable && (
                        <button onClick={() => setDeleteTarget(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

      {/* Product Form Modal */}
      {showForm && (
        <ProductFormModal
          product={editProduct}
          onClose={() => setShowForm(false)}
          onSave={async (p) => {
            if (editProduct) {
              setProducts(ps => ps.map(x => x.id === p.id ? p : x))
              show('Product updated', 'success')
              setShowForm(false)
            } else {
              try {
                const res = await fetch('http://localhost:4000/api/products', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer dev-token',
                    'x-dev-role': 'super_admin',
                  },
                  body: JSON.stringify({
                    name: p.name,
                    brandName: p.brand,
                    categoryName: p.category,
                    sku: p.sku || undefined,
                    mrp: p.mrp,
                    sellingPrice: p.sellingPrice,
                    stock: p.stock,
                    status: p.status,
                    thumbnailUrl: p.thumbnail || undefined,
                    description: '',
                  }),
                })
                const json = await res.json()
                if (!res.ok) throw new Error(json.message || 'Failed to save product')
                const saved = json.data
                const created: AdminProduct = {
                  id: saved.id,
                  name: saved.name,
                  brand: saved.brand?.name ?? p.brand,
                  sku: saved.sku,
                  category: saved.category?.name ?? p.category,
                  subcategory: p.subcategory,
                  mrp: parseFloat(saved.mrp),
                  sellingPrice: parseFloat(saved.sellingPrice),
                  stock: p.stock,
                  status: p.status,
                  thumbnail: p.thumbnail,
                  createdAt: saved.createdAt?.split('T')[0] ?? new Date().toISOString().split('T')[0],
                  tags: [],
                }
                setProducts(ps => [created, ...ps])
                show('Product saved to database ✓', 'success')
                setShowForm(false)
              } catch (err) {
                show(err instanceof Error ? err.message : 'Failed to save product', 'error')
              }
            }
          }}
        />
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Product"
        message="This will permanently remove the product and all its data. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => { if (deleteTarget) handleDelete(deleteTarget) }}
        onCancel={() => setDeleteTarget(null)}
      />
      <AdminToastContainer toasts={toasts} onDismiss={() => {}} />
    </div>
  )
}

function SortTh({ label, field, current, dir, onSort }: { label: string; field: SortField; current: SortField; dir: 'asc' | 'desc'; onSort: (f: SortField) => void }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700 select-none" onClick={() => onSort(field)}>
      {label} {current === field ? (dir === 'asc' ? '↑' : '↓') : ''}
    </th>
  )
}

function ProductFormModal({ product, onClose, onSave }: { product: AdminProduct | null; onClose: () => void; onSave: (p: AdminProduct) => Promise<void> }) {
  const [form, setForm] = useState<Partial<AdminProduct>>(product ?? {
    name: '', brand: '', sku: '', category: 'Women', subcategory: '', mrp: 0, sellingPrice: 0, stock: 0, status: 'draft', thumbnail: '', tags: []
  })
  const [saving, setSaving] = useState(false)

  const discount = form.mrp && form.sellingPrice ? Math.round((1 - form.sellingPrice / form.mrp) * 100) : 0

  const handleSave = async (asDraft: boolean) => {
    setSaving(true)
    try {
      await onSave({ ...form, status: asDraft ? 'draft' : 'active' } as AdminProduct)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{product ? 'Edit Product' : 'Add Product'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-light">×</button>
        </div>
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <section>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Basic Info</h4>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Product Name" className="col-span-2">
                <input value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="e.g. Floral Anarkali Kurta" />
              </FormField>
              <FormField label="Brand">
                <input value={form.brand ?? ''} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} className={inputCls} placeholder="e.g. Biba" />
              </FormField>
              <FormField label="SKU">
                <input value={form.sku ?? ''} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className={inputCls} placeholder="e.g. BIBA-ANA-001" />
              </FormField>
              <FormField label="Category">
                <select value={form.category ?? ''} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
                  {['Women', 'Men', 'Kids', 'Beauty', 'Home', 'Footwear', 'Accessories'].map(c => <option key={c}>{c}</option>)}
                </select>
              </FormField>
              <FormField label="Subcategory">
                <input value={form.subcategory ?? ''} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))} className={inputCls} placeholder="e.g. Ethnic Wear" />
              </FormField>
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Pricing</h4>
            <div className="grid grid-cols-3 gap-4">
              <FormField label="MRP (₹)">
                <input type="number" value={form.mrp ?? ''} onChange={e => setForm(f => ({ ...f, mrp: +e.target.value }))} className={inputCls} />
              </FormField>
              <FormField label="Selling Price (₹)">
                <input type="number" value={form.sellingPrice ?? ''} onChange={e => setForm(f => ({ ...f, sellingPrice: +e.target.value }))} className={inputCls} />
              </FormField>
              <FormField label="Discount %">
                <div className={`${inputCls} bg-gray-50 text-gray-500`}>{discount}%</div>
              </FormField>
            </div>
          </section>

          {/* Stock */}
          <section>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Inventory</h4>
            <FormField label="Total Stock">
              <input type="number" value={form.stock ?? ''} onChange={e => setForm(f => ({ ...f, stock: +e.target.value }))} className={inputCls} />
            </FormField>
          </section>

          {/* Media */}
          <section>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Media</h4>
            <FormField label="Thumbnail URL">
              <input value={form.thumbnail ?? ''} onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))} className={inputCls} placeholder="https://..." />
            </FormField>
            {form.thumbnail && <img src={form.thumbnail} alt="Preview" className="mt-2 w-20 h-20 rounded-lg object-cover border border-gray-200" />}
          </section>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} disabled={saving} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">Cancel</button>
          <button onClick={() => handleSave(true)} disabled={saving} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save as Draft'}
          </button>
          <button onClick={() => handleSave(false)} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800 disabled:opacity-50">
            {saving ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}

function FormField({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]'
