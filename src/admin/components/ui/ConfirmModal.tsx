import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  destructive?: boolean
}

export function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, destructive = true }: ConfirmModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${destructive ? 'bg-red-50' : 'bg-blue-50'}`}>
          <AlertTriangle size={22} className={destructive ? 'text-red-500' : 'text-blue-500'} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onCancel() }}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-[#C0001D] hover:bg-red-800'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
