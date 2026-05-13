import { create } from 'zustand'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastState {
  toasts: ToastItem[]
  show: (message: string, variant?: ToastVariant) => void
  dismiss: (id: string) => void
}

let _counter = 0

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  show: (message, variant = 'info') => {
    const id = `toast-${++_counter}`
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 4000)
  },

  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

// Singleton helpers — safe to call outside React components
export const toast = {
  success: (msg: string) => useToastStore.getState().show(msg, 'success'),
  error:   (msg: string) => useToastStore.getState().show(msg, 'error'),
  info:    (msg: string) => useToastStore.getState().show(msg, 'info'),
  warning: (msg: string) => useToastStore.getState().show(msg, 'warning'),
}
