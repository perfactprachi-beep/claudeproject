import { useState, FormEvent } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff, Store, Lock, Mail } from 'lucide-react'
import { useAdminStore } from '../store/useAdminStore'

export function AdminLoginPage() {
  const { isAuthenticated, login } = useAdminStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)

  if (isAuthenticated) return <Navigate to="/admin" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (locked) return
    setLoading(true)
    setError('')
    const success = await login(email, password)
    setLoading(false)
    if (success) {
      navigate('/admin', { replace: true })
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      if (newAttempts >= 5) {
        setLocked(true)
        setError('Too many failed attempts. Account locked for 15 minutes.')
        setTimeout(() => { setLocked(false); setAttempts(0) }, 15 * 60 * 1000)
      } else {
        setError(`Invalid credentials. ${5 - newAttempts} attempts remaining.`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C0001D] rounded-2xl mb-4">
            <Store size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Shoppers Stop</h1>
          <p className="text-white/50 text-sm mt-1">Admin Console</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@shoppersstop.com"
                  required
                  disabled={locked}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/30 focus:border-[#C0001D] disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={locked}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001D]/30 focus:border-[#C0001D] disabled:bg-gray-50 disabled:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || locked}
              className="w-full py-2.5 bg-[#C0001D] text-white font-medium rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 font-medium mb-2">Demo credentials:</p>
            <div className="space-y-0.5 text-xs text-gray-600">
              <p><span className="text-gray-400">Super Admin:</span> admin@shoppersstop.com / Admin@123</p>
              <p><span className="text-gray-400">Catalogue:</span> catalogue@shoppersstop.com / Cat@123</p>
              <p><span className="text-gray-400">Orders:</span> orders@shoppersstop.com / Order@123</p>
              <p><span className="text-gray-400">Support:</span> support@shoppersstop.com / Support@123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
