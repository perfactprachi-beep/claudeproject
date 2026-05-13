import { useState, useCallback } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

let id = 0

export function useAdminToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const toastId = ++id
    setToasts(t => [...t, { id: toastId, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== toastId)), 3500)
  }, [])

  return { toasts, show }
}

interface AdminToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: number) => void
}

export function AdminToastContainer({ toasts, onDismiss }: AdminToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white animate-fade-in ${t.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {t.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
          <span>{t.message}</span>
          <button onClick={() => onDismiss(t.id)} className="ml-2 opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
