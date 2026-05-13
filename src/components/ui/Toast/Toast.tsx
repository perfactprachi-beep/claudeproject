import { createPortal } from 'react-dom'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useToastStore, type ToastItem, type ToastVariant } from '@store/useToastStore'
import { cn } from '@utils/cn'

// ─── Variant config ────────────────────────────────────────────────────────────

const VARIANT: Record<ToastVariant, {
  Icon: typeof CheckCircle2
  bar: string
  iconClass: string
}> = {
  success: { Icon: CheckCircle2,  bar: 'border-l-[#22C55E]', iconClass: 'text-[#22C55E]' },
  error:   { Icon: AlertCircle,   bar: 'border-l-[#C0001D]', iconClass: 'text-[#C0001D]' },
  warning: { Icon: AlertTriangle, bar: 'border-l-[#F59E0B]', iconClass: 'text-[#F59E0B]' },
  info:    { Icon: Info,          bar: 'border-l-[#3B82F6]', iconClass: 'text-[#3B82F6]' },
}

// ─── Single toast card ─────────────────────────────────────────────────────────

function ToastCard({ toast }: { toast: ToastItem }) {
  const dismiss = useToastStore((s) => s.dismiss)
  const { Icon, bar, iconClass } = VARIANT[toast.variant]

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex items-start gap-3 w-[320px] px-4 py-3.5',
        'bg-white rounded-xl shadow-elevated',
        'border border-[#E8E8E8] border-l-4',
        'animate-slide-in-right',
        bar,
      )}
    >
      <Icon size={18} className={cn('shrink-0 mt-0.5', iconClass)} aria-hidden />
      <p className="flex-1 text-sm font-medium text-gray-800 leading-snug font-sans">
        {toast.message}
      </p>
      <button
        onClick={() => dismiss(toast.id)}
        aria-label="Dismiss"
        className="shrink-0 p-0.5 text-gray-400 hover:text-gray-700 transition-colors rounded"
      >
        <X size={14} />
      </button>
    </div>
  )
}

// ─── Toast container — mounted once in App root via portal ─────────────────────

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  return createPortal(
    <div
      aria-label="Notifications"
      className="fixed bottom-6 right-4 sm:right-6 z-[200] flex flex-col gap-2.5 items-end"
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} />
      ))}
    </div>,
    document.body,
  )
}
