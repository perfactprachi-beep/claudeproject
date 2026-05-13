import { useState } from 'react'
import { Plus, MapPin } from 'lucide-react'
import { AddressCard } from '@components/account/AddressCard'
import { AddressForm } from '@components/account/AddressForm'
import { useAuthStore } from '@store/useAuthStore'
import type { Address } from '@typedefs/user'

export const AddressesPage = () => {
  const addresses = useAuthStore((s) => s.addresses)
  const addAddress = useAuthStore((s) => s.addAddress)
  const updateAddress = useAuthStore((s) => s.updateAddress)
  const deleteAddress = useAuthStore((s) => s.deleteAddress)
  const setDefaultAddress = useAuthStore((s) => s.setDefaultAddress)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Address | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const handleSave = (data: Omit<Address, 'id'>) => {
    if (editing) {
      updateAddress(editing.id, data)
      setEditing(null)
    } else {
      addAddress({ ...data, id: `addr-${Date.now()}` })
      setShowForm(false)
    }
  }

  const handleDelete = (id: string) => {
    deleteAddress(id)
    setConfirmDelete(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold font-serif text-gray-900">Saved Addresses</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:bg-brand-red/5 px-3 py-1.5 rounded-lg transition-colors border border-brand-red/20"
        >
          <Plus size={15} /> Add New
        </button>
      </div>

      {addresses.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={(a) => setEditing(a)}
              onDelete={(id) => setConfirmDelete(id)}
              onSetDefault={setDefaultAddress}
            />
          ))}
        </div>
      ) : (
        <EmptyAddresses onAdd={() => setShowForm(true)} />
      )}

      {/* Add / Edit form modal */}
      {(showForm || editing) && (
        <AddressForm
          initial={editing ?? undefined}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <DeleteConfirm
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete)}
        />
      )}
    </div>
  )
}

function EmptyAddresses({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-white rounded-2xl border border-[#EBEBEB]">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <MapPin size={28} className="text-gray-300" />
      </div>
      <div>
        <p className="font-semibold text-gray-700">No saved addresses</p>
        <p className="text-sm text-gray-400 mt-1">Add a delivery address to speed up checkout</p>
      </div>
      <button
        onClick={onAdd}
        className="mt-2 px-6 py-2.5 bg-brand-red text-white text-sm font-semibold rounded-lg hover:bg-[#A8001A] transition-colors"
      >
        Add Address
      </button>
    </div>
  )
}

function DeleteConfirm({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} aria-hidden="true" />
      <div className="relative z-10 bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="font-bold text-gray-900 mb-2">Delete Address?</h3>
        <p className="text-sm text-gray-500 mb-5">This address will be permanently removed from your account.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-lg border border-[#E0E0E0] text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-lg bg-danger text-white text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
