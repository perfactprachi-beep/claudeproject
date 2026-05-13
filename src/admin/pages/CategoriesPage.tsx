import { useState } from 'react'
import { Plus, ChevronRight, ChevronDown, Edit2, Trash2, GripVertical } from 'lucide-react'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { useAdminToast, AdminToastContainer } from '../components/ui/AdminToast'
import { useAdminStore } from '../store/useAdminStore'
import { canEdit } from '../types/admin'

interface Category {
  id: string
  name: string
  image?: string
  children: Category[]
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 'C1', name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=60&h=60&fit=crop', children: [
    { id: 'C1-1', name: 'Ethnic Wear', children: [
      { id: 'C1-1-1', name: 'Kurtas & Kurtis', children: [] },
      { id: 'C1-1-2', name: 'Sarees', children: [] },
      { id: 'C1-1-3', name: 'Lehengas', children: [] },
    ]},
    { id: 'C1-2', name: 'Western Wear', children: [
      { id: 'C1-2-1', name: 'Dresses', children: [] },
      { id: 'C1-2-2', name: 'Tops', children: [] },
    ]},
  ]},
  { id: 'C2', name: 'Men', image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=60&h=60&fit=crop', children: [
    { id: 'C2-1', name: 'Shirts', children: [] },
    { id: 'C2-2', name: 'Trousers', children: [] },
    { id: 'C2-3', name: 'Blazers', children: [] },
  ]},
  { id: 'C3', name: 'Beauty', children: [
    { id: 'C3-1', name: 'Skincare', children: [] },
    { id: 'C3-2', name: 'Makeup', children: [] },
  ]},
  { id: 'C4', name: 'Footwear', children: [
    { id: 'C4-1', name: 'Heels', children: [] },
    { id: 'C4-2', name: 'Sneakers', children: [] },
    { id: 'C4-3', name: 'Sandals', children: [] },
  ]},
]

export function CategoriesPage() {
  const { adminUser } = useAdminStore()
  const editable = canEdit(adminUser!.role, 'categories')
  const { toasts, show } = useAdminToast()
  const [categories, setCategories] = useState(INITIAL_CATEGORIES)
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['C1', 'C2']))
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const toggleExpand = (id: string) => {
    setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-500">Manage your product category hierarchy</p>
        </div>
        {editable && (
          <button className="flex items-center gap-2 px-4 py-2 bg-[#C0001D] text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors">
            <Plus size={16} /> Add Category
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <div className="grid grid-cols-12 text-xs font-medium text-gray-500">
            <span className="col-span-6">Name</span>
            <span className="col-span-3">Products</span>
            <span className="col-span-3">Actions</span>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {categories.map(cat => (
            <CategoryRow
              key={cat.id}
              category={cat}
              depth={0}
              expanded={expanded}
              editingId={editingId}
              editName={editName}
              editable={editable}
              onToggle={toggleExpand}
              onEdit={(id, name) => { setEditingId(id); setEditName(name) }}
              onEditSave={() => {
                setCategories(cs => updateName(cs, editingId!, editName))
                setEditingId(null)
                show('Category renamed', 'success')
              }}
              onEditCancel={() => setEditingId(null)}
              onEditNameChange={setEditName}
              onDelete={id => setDeleteTarget(id)}
            />
          ))}
        </div>
      </div>

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Category"
        message="Deleting this category will also remove all subcategories. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => { show('Category deleted', 'success') }}
        onCancel={() => setDeleteTarget(null)}
      />
      <AdminToastContainer toasts={toasts} onDismiss={() => {}} />
    </div>
  )
}

function updateName(cats: Category[], id: string, name: string): Category[] {
  return cats.map(c => c.id === id ? { ...c, name } : { ...c, children: updateName(c.children, id, name) })
}

interface RowProps {
  category: Category
  depth: number
  expanded: Set<string>
  editingId: string | null
  editName: string
  editable: boolean
  onToggle: (id: string) => void
  onEdit: (id: string, name: string) => void
  onEditSave: () => void
  onEditCancel: () => void
  onEditNameChange: (name: string) => void
  onDelete: (id: string) => void
}

function CategoryRow({ category, depth, expanded, editingId, editName, editable, onToggle, onEdit, onEditSave, onEditCancel, onEditNameChange, onDelete }: RowProps) {
  const hasChildren = category.children.length > 0
  const isExpanded = expanded.has(category.id)
  const isEditing = editingId === category.id

  return (
    <>
      <div className={`grid grid-cols-12 items-center px-5 py-3 hover:bg-gray-50 transition-colors`} style={{ paddingLeft: `${20 + depth * 24}px` }}>
        <div className="col-span-6 flex items-center gap-2">
          {editable && <GripVertical size={14} className="text-gray-300 cursor-grab shrink-0" />}
          {hasChildren ? (
            <button onClick={() => onToggle(category.id)} className="text-gray-400 hover:text-gray-600 shrink-0">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : <span className="w-4 shrink-0" />}
          {category.image && <img src={category.image} alt={category.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />}
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input autoFocus value={editName} onChange={e => onEditNameChange(e.target.value)}
                className="flex-1 px-2 py-1 border border-[#C0001D] rounded text-sm focus:outline-none" />
              <button onClick={onEditSave} className="text-xs font-medium text-green-600 hover:text-green-800">Save</button>
              <button onClick={onEditCancel} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
            </div>
          ) : (
            <span className={`text-sm ${depth === 0 ? 'font-semibold text-gray-900' : depth === 1 ? 'font-medium text-gray-700' : 'text-gray-600'}`}>
              {category.name}
            </span>
          )}
        </div>
        <div className="col-span-3 text-sm text-gray-500">{Math.floor(Math.random() * 50 + 5)} products</div>
        <div className="col-span-3 flex items-center gap-1">
          {editable && !isEditing && (
            <>
              <button onClick={() => onEdit(category.id, category.name)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Edit2 size={13} />
              </button>
              <button onClick={() => onDelete(category.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={13} />
              </button>
              {depth < 2 && (
                <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Plus size={13} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {hasChildren && isExpanded && category.children.map(child => (
        <CategoryRow key={child.id} category={child} depth={depth + 1} expanded={expanded} editingId={editingId} editName={editName} editable={editable}
          onToggle={onToggle} onEdit={onEdit} onEditSave={onEditSave} onEditCancel={onEditCancel} onEditNameChange={onEditNameChange} onDelete={onDelete} />
      ))}
    </>
  )
}
