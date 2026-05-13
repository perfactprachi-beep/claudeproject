import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LoginForm } from '@components/auth/LoginForm'
import { RegisterForm } from '@components/auth/RegisterForm'
import { useAuthStore } from '@store/useAuthStore'
import { cn } from '@utils/cn'

type Tab = 'login' | 'register'

export const LoginPage = () => {
  const [tab, setTab] = useState<Tab>('login')
  const [showForgot, setShowForgot] = useState(false)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (isAuthenticated) return <Navigate to="/account/orders" replace />

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-brand-navy relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Geometric shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-red/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4" />

        <div className="relative text-center text-white">
          <h1 className="font-serif text-5xl font-bold leading-tight">
            Start Something<br />
            <span className="text-brand-red">New</span>
          </h1>
          <p className="mt-4 text-white/60 text-lg max-w-sm mx-auto leading-relaxed">
            Join 10 million First Citizen members and discover India's finest fashion & lifestyle
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { value: '1000+', label: 'Premium Brands' },
              { value: '10M+', label: 'Members' },
              { value: '100+', label: 'Stores' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold font-mono text-white">{value}</p>
                <p className="text-xs text-white/50 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <a href="/" className="inline-block font-serif text-2xl font-bold text-brand-navy mb-8">
            Shoppers <span className="text-brand-red">Stop</span>
          </a>

          {/* Tabs */}
          {!showForgot && (
            <div className="flex border-b border-[#E8E8E8] mb-6">
              {(['login', 'register'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    'flex-1 pb-3 text-sm font-semibold capitalize transition-all border-b-2',
                    tab === t
                      ? 'border-brand-red text-brand-red'
                      : 'border-transparent text-gray-400 hover:text-gray-600',
                  )}
                >
                  {t === 'login' ? 'Login' : 'Create Account'}
                </button>
              ))}
            </div>
          )}

          {showForgot ? (
            <ForgotPassword onBack={() => setShowForgot(false)} />
          ) : tab === 'login' ? (
            <LoginForm
              onSuccess={() => { window.location.href = '/account/orders' }}
              onForgotPassword={() => setShowForgot(true)}
            />
          ) : (
            <RegisterForm onSuccess={() => { window.location.href = '/account/orders' }} />
          )}

          {!showForgot && (
            <p className="mt-6 text-center text-xs text-gray-400">
              {tab === 'login' ? (
                <>
                  New here?{' '}
                  <button onClick={() => setTab('register')} className="text-brand-red font-semibold hover:underline">
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already a member?{' '}
                  <button onClick={() => setTab('login')} className="text-brand-red font-semibold hover:underline">
                    Login
                  </button>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function ForgotPassword({ onBack }: { onBack: () => void }) {
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
      <div className="text-center flex flex-col items-center gap-4 py-6">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
          <span className="text-3xl">✉️</span>
        </div>
        <div>
          <p className="font-bold text-gray-900">Check your inbox</p>
          <p className="text-sm text-gray-500 mt-1">Reset link sent to <strong>{email}</strong></p>
        </div>
        <button onClick={onBack} className="text-sm text-brand-red font-semibold hover:underline">
          Back to Login
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-bold text-gray-900">Reset Password</h2>
        <p className="text-sm text-gray-500 mt-1">We'll send a reset link to your registered email</p>
      </div>
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
      <button onClick={onBack} className="text-sm text-gray-500 hover:underline">
        ← Back to Login
      </button>
    </div>
  )
}
