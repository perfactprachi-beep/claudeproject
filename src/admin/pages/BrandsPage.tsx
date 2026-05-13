import { useState } from 'react'
import { Plus, Edit2, Trash2, Star, GripVertical } from 'lucide-react'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { useAdminToast, AdminToastContainer } from '../components/ui/AdminToast'
import { useAdminStore } from '../store/useAdminStore'
import { canEdit } from '../types/admin'

interface Brand {
  id: string
  name: string
  logo: string
  description: string
  website: string
  productCount: number
  featured: boolean
  order: number
}

const INITIAL_BRANDS: Brand[] = [
  { id: 'B1', name: 'Biba', logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop', description: 'Leading ethnic wear brand', website: 'biba.in', productCount: 124, featured: true, order: 1 },
  { id: 'B2', name: 'Allen Solly', logo: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=80&h=80&fit=crop', description: 'Smart casual workwear', website: 'allensolly.com', productCount: 89, featured: true, order: 2 },
  { id: 'B3', name: 'Van Heusen', logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=80&h=80&fit=crop', description: 'Premium formal wear', website: 'vanheusenindia.com', productCount: 112, featured: true, order: 3 },
  { id: 'B4', name: 'W', logo: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&h=80&fit=crop', description: "Women's contemporary fashion", website: 'wforwoman.com', productCount: 76, featured: false, order: 4 },
  { id: 'B5', name: 'Nike', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop', description: 'Global sportswear leader', website: 'nike.com', productCount: 45, featured: true, order: 5 },
  { id: 'B6', name: 'Fabindia', logo: 'https://images.unsplash.com/photo-1617627143233-36b1e2e38dba?w=80&h=80&fit=crop', description: 'Handcrafted Indian textiles', website: 'fabindia.com', productCount: 198, featured: false, order: 6 },
]

export function BrandsPage() {
  const { adminUser } = useAdminStore()
  const editable = canEdit(adminUser!.role, 'brands')
  const { toasts, show } = useAdminToast()
  const [brands, setBrands] = useState(INITIAL_BRANDS)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editBrand, setEditBrand] = useState<Brand | null>(null)

  const toggleFeatured = (id: string) => {
    setBrands(bs => bs.map(b => b.id === id ? { ...b, featured: !b.featured } : b))
    show('Brand updated', 'success')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Brands</h2>
          <p className="text-sm text-gray-500">{brands.length} brands · {brands.filter(b => b.featured).length} featured on homepage</p>
        </div>
        {editable && (
          <button onClick={() => { setEditBrand(null); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-[#C0001D] text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">
            <Plus size={16} /> Add Brand
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.sort((a, b) => a.order - b.order).map(brand => (
          <div key={brand.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              {editable && <GripVertical size={16} className="text-gray-300 mt-1 cursor-grab shrink-0" />}
              <img src={brand.logo} alt={brand.name} className="w-14 h-14 rounded-xl object-cover border border-gray-100" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                  {brand.featured && <Star size={13} className="text-amber-400 fill-amber-400" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{brand.description}</p>
                <p className="text-xs text-gray-400 mt-1">{brand.productCount} products</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
              <button
                onClick={() => toggleFeatured(brand.id)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${brand.featured ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {brand.featured ? 'Featured' : 'Feature'}
              </button>
              {editable && (
                <>
                  <button onClick={() => { setEditBrand(brand); setShowForm(true) }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(brand.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <BrandFormModal
          brand={editBrand}
          onClose={() => setShowForm(false)}
          onSave={(b) => {
            if (editBrand) {
              setBrands(bs => bs.map(x => x.id === b.id ? b : x))
              show('Brand updated', 'success')
            } else {
              setBrands(bs => [...bs, { ...b, id: `B${Date.now()}`, order: bs.length + 1, productCount: 0 }])
              show('Brand added', 'success')
            }
            setShowForm(false)
          }}
        />
      )}

      <ConfirmModal open={deleteTarget !== null} title="Delete Brand" message="This will remove the brand from all products. Are you sure?"
        confirmLabel="Delete" onConfirm={() => { setBrands(bs => bs.filter(b => b.id !== deleteTarget)); show('Brand deleted', 'success') }} onCancel={() => setDeleteTarget(null)} />
      <AdminToastContainer toasts={toasts} onDismiss={() => {}} />
    </div>
  )
}

function BrandFormModal({ brand, onClose, onSave }: { brand: Brand | null; onClose: () => void; onSave: (b: Brand) => void }) {
  const [form, setForm] = useState<Partial<Brand>>(brand ?? { name: '', logo: '', description: '', website: '', featured: false })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">{brand ? 'Edit Brand' : 'Add Brand'}</h3>
        <div className="space-y-4">
          {[
            { label: 'Brand Name', key: 'name', placeholder: 'e.g. Biba' },
            { label: 'Logo URL', key: 'logo', placeholder: 'https://...' },
            { label: 'Description', key: 'description', placeholder: 'Short brand description' },
            { label: 'Website URL', key: 'website', placeholder: 'brand.com' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input value={(form as Record<string, string>)[key] ?? ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]" />
            </div>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured ?? false} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="rounded" />
            <span className="text-sm text-gray-700">Feature on homepage brand strip</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form as Brand)} className="flex-1 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">Save</button>
        </div>
      </div>
    </div>
  )
}
