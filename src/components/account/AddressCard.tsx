import { Pencil, Trash2, MapPin } from 'lucide-react'
import type { Address } from '@typedefs/user'
import { cn } from '@utils/cn'

interface AddressCardProps {
  address: Address
  onEdit: (address: Address) => void
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
}

export const AddressCard = ({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) => (
  <div
    className={cn(
      'relative bg-white rounded-2xl border p-5 flex flex-col gap-3 transition-all',
      address.isDefault ? 'border-brand-red/40 shadow-sm' : 'border-[#EBEBEB]',
    )}
  >
    {/* Label + default badge */}
    <div className="flex items-center gap-2">
      <MapPin size={14} className={address.isDefault ? 'text-brand-red' : 'text-gray-400'} />
      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        {address.label}
      </span>
      {address.isDefault && (
        <span className="ml-auto text-[10px] font-bold bg-brand-red text-white px-2 py-0.5 rounded-full">
          Default
        </span>
      )}
    </div>

    {/* Address lines */}
    <div className="text-sm text-gray-700 leading-relaxed">
      <p className="font-semibold">{address.fullName}</p>
      <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
      <p>{address.city}, {address.state} — {address.pincode}</p>
      <p className="text-gray-500 text-xs mt-1">{address.mobile}</p>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-3 pt-1 border-t border-[#F5F5F5]">
      <button
        onClick={() => onEdit(address)}
        aria-label="Edit address"
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-red transition-colors"
      >
        <Pencil size={13} /> Edit
      </button>
      <button
        onClick={() => onDelete(address.id)}
        aria-label="Delete address"
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-danger transition-colors"
      >
        <Trash2 size={13} /> Delete
      </button>
      {!address.isDefault && (
        <button
          onClick={() => onSetDefault(address.id)}
          className="ml-auto text-xs font-semibold text-brand-red hover:underline"
        >
          Set as Default
        </button>
      )}
    </div>
  </div>
)
