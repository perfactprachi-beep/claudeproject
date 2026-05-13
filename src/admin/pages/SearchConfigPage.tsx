import { useState } from 'react'
import { RefreshCw, Plus, Trash2, GripVertical, CheckCircle } from 'lucide-react'
import { useAdminToast, AdminToastContainer } from '../components/ui/AdminToast'

interface Synonym { id: string; term1: string; term2: string; type: 'two_way' | 'one_way' }
interface PromotedResult { id: string; query: string; sku: string; position: number; expiry: string }
interface BlockedTerm { id: string; term: string }
interface TrendingSearch { id: string; term: string; order: number }

const INITIAL_SYNONYMS: Synonym[] = [
  { id: 'S1', term1: 'kurti', term2: 'kurta', type: 'two_way' },
  { id: 'S2', term1: 'saree', term2: 'sari', type: 'two_way' },
  { id: 'S3', term1: 'jeans', term2: 'denim trousers', type: 'one_way' },
  { id: 'S4', term1: 'heels', term2: 'high heels', type: 'two_way' },
]

const INITIAL_PROMOTED: PromotedResult[] = [
  { id: 'P1', query: 'floral kurta', sku: 'BIBA-ANA-001', position: 1, expiry: '2024-04-30' },
  { id: 'P2', query: 'white shirt', sku: 'VH-OXF-004', position: 1, expiry: '2024-05-15' },
]

const INITIAL_BLOCKED: BlockedTerm[] = [
  { id: 'B1', term: 'competitor1' },
  { id: 'B2', term: 'rival brand' },
]

const INITIAL_TRENDING: TrendingSearch[] = [
  { id: 'T1', term: 'sarees', order: 1 },
  { id: 'T2', term: 'kurtas', order: 2 },
  { id: 'T3', term: 'sneakers', order: 3 },
  { id: 'T4', term: 'ethnic wear', order: 4 },
  { id: 'T5', term: 'formal shirts', order: 5 },
]

export function SearchConfigPage() {
  const { toasts, show } = useAdminToast()
  const [activeTab, setActiveTab] = useState<'index' | 'synonyms' | 'promoted' | 'blocked' | 'trending'>('index')
  const [synonyms, setSynonyms] = useState(INITIAL_SYNONYMS)
  const [promoted, setPromoted] = useState(INITIAL_PROMOTED)
  const [blocked, setBlocked] = useState(INITIAL_BLOCKED)
  const [trending, setTrending] = useState(INITIAL_TRENDING)
  const [reindexing, setReindexing] = useState(false)

  const reindex = () => {
    setReindexing(true)
    setTimeout(() => { setReindexing(false); show('Index rebuilt successfully', 'success') }, 2000)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Search Configuration</h2>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {([
            ['index', 'Algolia Index'],
            ['synonyms', 'Synonyms'],
            ['promoted', 'Promoted Results'],
            ['blocked', 'Blocked Terms'],
            ['trending', 'Trending Searches'],
          ] as const).map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === key ? 'border-[#C0001D] text-[#C0001D]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'index' && (
            <div className="max-w-md space-y-4">
              <div className="p-4 bg-green-50 rounded-xl flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Index Healthy</p>
                  <p className="text-xs text-green-600">Last indexed: March 15, 2024 — 16:30 IST · 248 products</p>
                </div>
              </div>
              <button onClick={reindex} disabled={reindexing}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#C0001D] text-white text-sm font-medium rounded-lg hover:bg-red-800 disabled:opacity-50">
                <RefreshCw size={16} className={reindexing ? 'animate-spin' : ''} />
                {reindexing ? 'Re-indexing…' : 'Re-index All Products'}
              </button>
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Total documents: 248</p>
                <p>• Index size: 1.2 MB</p>
                <p>• Searchable attributes: name, brand, category, tags, sku</p>
              </div>
            </div>
          )}

          {activeTab === 'synonyms' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setSynonyms(s => [...s, { id: `S${Date.now()}`, term1: '', term2: '', type: 'two_way' }])}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">
                  <Plus size={14} /> Add Synonym
                </button>
              </div>
              <div className="space-y-2">
                {synonyms.map(syn => (
                  <div key={syn.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input value={syn.term1} onChange={e => setSynonyms(ss => ss.map(s => s.id === syn.id ? { ...s, term1: e.target.value } : s))}
                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none" placeholder="Term 1" />
                    <select value={syn.type} onChange={e => setSynonyms(ss => ss.map(s => s.id === syn.id ? { ...s, type: e.target.value as Synonym['type'] } : s))}
                      className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none">
                      <option value="two_way">⟷ (both ways)</option>
                      <option value="one_way">→ (one way)</option>
                    </select>
                    <input value={syn.term2} onChange={e => setSynonyms(ss => ss.map(s => s.id === syn.id ? { ...s, term2: e.target.value } : s))}
                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none" placeholder="Term 2" />
                    <button onClick={() => setSynonyms(ss => ss.filter(s => s.id !== syn.id))} className="p-1.5 text-gray-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => show('Synonyms saved', 'success')} className="px-5 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">Save Synonyms</button>
            </div>
          )}

          {activeTab === 'promoted' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setPromoted(p => [...p, { id: `P${Date.now()}`, query: '', sku: '', position: 1, expiry: '' }])}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">
                  <Plus size={14} /> Pin Result
                </button>
              </div>
              <div className="space-y-2">
                {promoted.map(p => (
                  <div key={p.id} className="grid grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg items-center">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Query</label>
                      <input value={p.query} onChange={e => setPromoted(ps => ps.map(x => x.id === p.id ? { ...x, query: e.target.value } : x))}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Product SKU</label>
                      <input value={p.sku} onChange={e => setPromoted(ps => ps.map(x => x.id === p.id ? { ...x, sku: e.target.value } : x))}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Position</label>
                      <input type="number" value={p.position} onChange={e => setPromoted(ps => ps.map(x => x.id === p.id ? { ...x, position: +e.target.value } : x))}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-400 mb-1">Expiry</label>
                        <input type="date" value={p.expiry} onChange={e => setPromoted(ps => ps.map(x => x.id === p.id ? { ...x, expiry: e.target.value } : x))}
                          className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                      </div>
                      <button onClick={() => setPromoted(ps => ps.filter(x => x.id !== p.id))} className="p-1.5 text-gray-400 hover:text-red-500 mb-0.5">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => show('Promoted results saved', 'success')} className="px-5 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">Save</button>
            </div>
          )}

          {activeTab === 'blocked' && (
            <div className="space-y-4 max-w-md">
              <div className="flex gap-2">
                <input placeholder="Add blocked term…" id="block-input"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                <button onClick={() => {
                  const input = document.getElementById('block-input') as HTMLInputElement
                  if (input.value.trim()) { setBlocked(bs => [...bs, { id: `B${Date.now()}`, term: input.value.trim() }]); input.value = ''; show('Term blocked', 'success') }
                }} className="px-3 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">Block</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {blocked.map(b => (
                  <div key={b.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-full">
                    <span>{b.term}</span>
                    <button onClick={() => setBlocked(bs => bs.filter(x => x.id !== b.id))} className="text-red-400 hover:text-red-700">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'trending' && (
            <div className="space-y-4 max-w-sm">
              <p className="text-sm text-gray-600">Drag to reorder trending search pills shown on the search dropdown.</p>
              <div className="space-y-2">
                {trending.sort((a, b) => a.order - b.order).map(t => (
                  <div key={t.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <GripVertical size={14} className="text-gray-300 cursor-grab" />
                    <span className="w-6 h-6 bg-gray-200 text-gray-600 text-xs rounded-full flex items-center justify-center font-medium">{t.order}</span>
                    <input value={t.term} onChange={e => setTrending(ts => ts.map(x => x.id === t.id ? { ...x, term: e.target.value } : x))}
                      className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none" />
                    <button onClick={() => setTrending(ts => ts.filter(x => x.id !== t.id))} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setTrending(ts => [...ts, { id: `T${Date.now()}`, term: '', order: ts.length + 1 }])}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Plus size={14} /> Add
                </button>
                <button onClick={() => show('Trending searches saved', 'success')} className="px-5 py-2 text-sm font-medium text-white bg-[#C0001D] rounded-lg hover:bg-red-800">Save</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <AdminToastContainer toasts={toasts} onDismiss={() => {}} />
    </div>
  )
}
