import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App'

const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID
if (GA_ID) {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
  window.dataLayer = window.dataLayer ?? []
  const dl = window.dataLayer
  window.gtag = function gtag() { dl.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
