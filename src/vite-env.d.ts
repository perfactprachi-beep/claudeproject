/// <reference types="vite/client" />

interface Window {
  gtag?: (command: string, event: string, params: Record<string, unknown>) => void
}
