import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { cn } from '@utils/cn'

type AuthTab = 'login' | 'register'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: AuthTab
}

export const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) => {
  const [tab, setTab] = useState<AuthTab>(defaultTab)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab)
      setShowForgotPassword(false)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, defaultTab])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={tab === 'login' ? 'Login' : 'Create Account'}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#F0F0F0]">
          <div>
            <span className="font-serif text-xl font-bold text-brand-navy">
              Shoppers <span className="text-brand-red">Stop</span>
            </span>
            {showForgotPassword ? (
              <p className="text-sm text-gray-500 mt-0.5">Reset your password</p>
            ) : (
              <p className="text-sm text-gray-500 mt-0.5">Start Something New</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        {!showForgotPassword && (
          <div className="flex border-b border-[#F0F0F0]">
            {(['login', 'register'] as AuthTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 py-3.5 text-sm font-semibold transition-all duration-150 capitalize',
                  tab === t
                    ? 'text-brand-red border-b-2 border-brand-red'
                    : 'text-gray-500 hover:text-gray-700',
                )}
              >
                {t === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {showForgotPassword ? (
            <ForgotPasswordView onBack={() => setShowForgotPassword(false)} />
          ) : tab === 'login' ? (
            <LoginForm
              onSuccess={onClose}
              onForgotPassword={() => setShowForgotPassword(true)}
            />
          ) : (
            <RegisterForm onSuccess={onClose} />
          )}
        </div>

        {/* Footer */}
        {!showForgotPassword && (
          <div className="px-6 py-4 bg-[#FAFAF8] border-t border-[#F0F0F0] text-center">
            <p className="text-xs text-gray-500">
              {tab === 'login' ? (
                <>
                  New to Shoppers Stop?{' '}
                  <button onClick={() => setTab('register')} className="text-brand-red font-semibold hover:underline">
                    Create Account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button onClick={() => setTab('login')} className="text-brand-red font-semibold hover:underline">
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function ForgotPasswordView({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!email) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center py-4 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
          <span className="text-2xl">✉️</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Check your inbox</p>
          <p className="text-sm text-gray-500 mt-1">
            Password reset link sent to <span className="font-medium">{email}</span>
          </p>
        </div>
        <button onClick={onBack} className="text-sm text-brand-red hover:underline font-semibold">
          Back to Login
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-600">
        Enter your registered email and we'll send you a reset link.
      </p>
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full h-11 px-3 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all"
      />
      <button
        onClick={handleSend}
        disabled={loading || !email}
        className="h-11 w-full bg-brand-red text-white rounded-lg font-semibold text-sm hover:bg-[#A8001A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Sending…' : 'Send Reset Link'}
      </button>
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
        Back to Login
      </button>
    </div>
  )
}
