import { useState } from 'react'
import { Plus, Edit2, Trash2, Monitor, Smartphone } from 'lucide-react'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { useAdminToast, AdminToastContainer } from '../components/ui/AdminToast'
import { MOCK_BANNERS } from '../data/mockData'
import type { Banner } from '../types/admin'

export function BannersPage() {
  const { toasts, show } = useAdminToast()
  const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS)
  const [showForm, setShowForm] = useState(false)
  const [editBanner, setEditBanner] = useState<Banner | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [filterPage, setFilterPage] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = banners
    .filter(b => filterPage === 'all' || b.page === filterPage)
    .filter(b => filterStatus === 'all' || b.status === filterStatus)

  const pageLabel: Record<string, string> = { homepage: 'Homepage', plp: 'PLP', pdp: 'PDP', cart: 'Cart', all: 'All Pages' }
  const posLabel: Record<string, string> = { hero_carousel: 'Hero Carousel', announcement_bar: 'Announcement Bar', section_banner: 'Section Banner', popup: 'Popup' }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Banners & CMS</h2>
          <p className="text-sm text-gray-500">{banners.filter(b => b.status === 'active').length} active banners</p>
        </div>
        <button onClick={() => { setEditBanner(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-[#C0001D] text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-wrap gap-3">
        <select value={filterPage} onChange={e => setFilterPage(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          <option value="all">All Pages</option>
          {Object.entries(pageLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <div className="flex gap-1">
          {(['all', 'active', 'scheduled', 'expired'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors capitalize ${filterStatus === s ? 'bg-[#1A1A2E] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s}
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
                {['Banner', 'Page', 'Position', 'Schedule', 'Priority', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {b.desktopImage && <img src={b.desktopImage} alt={b.name} className="w-16 h-8 rounded object-cover" />}
                      <div>
                        <p className="font-medium text-gray-900">{b.name}</p>
                        {b.headline && <p className="text-xs text-gray-400 truncate max-w-[200px]">{b.headline}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{pageLabel[b.page] ?? b.page}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{posLabel[b.position] ?? b.position}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {b.evergreen ? 'Evergreen' : `${b.startDate} → ${b.endDate ?? '—'}`}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{b.priority}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} size="sm" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditBanner(b); setShowForm(true) }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(b.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <BannerFormModal
          banner={editBanner}
          onClose={() => setShowForm(false)}
          onSave={(b) => {
            if (editBanner) {
              setBanners(bs => bs.map(x => x.id === b.id ? b : x))
              show('Banner updated', 'success')
            } else {
              setBanners(bs => [...bs, { ...b, id: `BAN-${Date.now()}`, status: 'scheduled' }])
              show('Banner created', 'success')
            }
            setShowForm(false)
          }}
        />
      )}

      <ConfirmModal open={deleteTarget !== null} title="Delete Banner" message="This banner will be permanently removed."
        confirmLabel="Delete" onConfirm={() => { setBanners(bs => bs.filter(b => b.id !== deleteTarget)); show('Banner deleted', 'success') }}
        onCancel={() => setDeleteTarget(null)} />
      <AdminToastContainer toasts={toasts} onDismiss={() => {}} />
    </div>
  )
}

function BannerFormModal({ banner, onClose, onSave }: { banner: Banner | null; onClose: () => void; onSave: (b: Banner) => void }) {
  const [form, setForm] = useState<Partial<Banner>>(banner ?? {
    name: '', page: 'homepage', position: 'hero_carousel', desktopImage: '', mobileImage: '',
    headline: '', ctaLabel: '', ctaUrl: '', startDate: '', evergreen: false, priority: 1, status: 'scheduled'
  })
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{banner ? 'Edit Banner' : 'Add Banner'}</h3>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setPreviewMode('desktop')} className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>
                <Monitor size={12} /> Desktop
              </button>
              <button onClick={() => setPreviewMode('mobile')} className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>
                <Smartphone size={12} /> Mobile
              </button>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Preview */}
          {(form.desktopImage || form.mobileImage) && (
            <div className="rounded-lg overflow-hidden bg-gray-100">
              <img
                src={previewMode === 'desktop' ? form.desktopImage : (form.mobileImage || form.desktopImage)}
                alt="Preview"
                className="w-full object-cover"
                style={{ height: previewMode === 'desktop' ? 120 : 160 }}
              />
              {form.headline && (
                <div className="px-4 py-2 bg-black/50 -mt-10 relative">
                  <p className="text-white font-semibold text-sm">{form.headline}</p>
                  {form.ctaLabel && <button className="mt-1 px-3 py-1 bg-[#C0001D] text-white text-xs rounded">{form.ctaLabel}</button>}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Banner Name (internal)</label>
              <input value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/20 focus:border-[#C0001D]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Page</label>
              <select value={form.page ?? 'homepage'} onChange={e => setForm(f => ({ ...f, page: e.target.value as Banner['page'] }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                <option value="homepage">Homepage</option>
                <option value="plp">PLP</option>
                <option value="pdp">PDP</option>
                <option value="cart">Cart</option>
                <option value="all">All Pages</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Position</label>
              <select value={form.position ?? 'hero_carousel'} onChange={e => setForm(f => ({ ...f, position: e.target.value as Banner['position'] }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                <option value="hero_carousel">Hero Carousel</option>
                <option value="announcement_bar">Announcement Bar</option>
                <option value="section_banner">Section Banner</option>
                <option value="popup">Popup</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Desktop Image URL (1440×560px)</label>
              <input value={form.desktopImage ?? ''} onChange={e => setForm(f => ({ ...f, desktopImage: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Mobile Image URL (390×480px)</label>
              <input value={form.mobileImage ?? ''} onChange={e => setForm(f => ({ ...f, mobileImage: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Headline (optional)</label>
              <input value={form.headline ?? ''} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">CTA Label</label>
              <input value={form.ctaLabel ?? ''} onChange={e => setForm(f => ({ ...f, ctaLabel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" placeholder="Shop Now" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">CTA URL</label>
              <input value={form.ctaUrl ?? ''} onChange={e => setForm(f => ({ ...f, ctaUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" placeholder="/category/women" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
              <input type="datetime-local" value={form.startDate ?? ''} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
              <input type="datetime-local" value={form.endDate ?? ''} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                disabled={form.evergreen} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none disabled:bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
              <input type="number" min={1} value={form.priority ?? 1} onChange={e => setForm(f => ({ ...f, priority: +e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.evergreen ?? false} onChange={e => setForm(f => ({ ...f, evergreen: e.target.checked }))} className="rounded" />
                <span className="text-sm text-gray-700">Evergreen (no end date)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form as Banner)} className="px-4 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">Save Banner</button>
        </div>
      </div>
    </div>
  )
}
