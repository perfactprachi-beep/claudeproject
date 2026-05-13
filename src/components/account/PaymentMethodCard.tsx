import { Trash2 } from 'lucide-react'
import type { SavedCard, UPIId } from '@typedefs/user'
import { cn } from '@utils/cn'

const NETWORK_COLORS: Record<string, string> = {
  Visa: 'text-blue-700',
  Mastercard: 'text-red-600',
  Amex: 'text-cyan-700',
  RuPay: 'text-green-700',
}

interface SavedCardCardProps {
  card: SavedCard
  onDelete: (id: string) => void
}

export const SavedCardCard = ({ card, onDelete }: SavedCardCardProps) => (
  <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4 flex items-center gap-4">
    {/* Card visual */}
    <div className="w-12 h-8 rounded-md bg-gradient-to-br from-gray-700 to-gray-900 flex items-end justify-start p-1.5 shrink-0">
      <div className="w-5 h-3.5 rounded-sm bg-yellow-300/80" />
    </div>

    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900">
        •••• •••• •••• {card.last4}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">
        <span className={cn('font-semibold', NETWORK_COLORS[card.network] ?? 'text-gray-500')}>
          {card.network}
        </span>{' '}
        · Expires {card.expiry}
      </p>
      <p className="text-xs text-gray-400">{card.holderName}</p>
    </div>

    <button
      onClick={() => onDelete(card.id)}
      aria-label={`Remove card ending ${card.last4}`}
      className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
    >
      <Trash2 size={15} />
    </button>
  </div>
)

interface UPICardProps {
  upi: UPIId
  onDelete: (id: string) => void
}

export const UPICard = ({ upi, onDelete }: UPICardProps) => (
  <div className="bg-white rounded-2xl border border-[#EBEBEB] p-4 flex items-center gap-4">
    {/* UPI icon */}
    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
      <span className="text-[11px] font-black text-purple-700 leading-none">UPI</span>
    </div>

    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900 truncate">{upi.vpa}</p>
      {upi.isDefault && (
        <span className="text-[10px] font-bold text-brand-red">Default</span>
      )}
    </div>

    <button
      onClick={() => onDelete(upi.id)}
      aria-label={`Remove UPI ID ${upi.vpa}`}
      className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
    >
      <Trash2 size={15} />
    </button>
  </div>
)
