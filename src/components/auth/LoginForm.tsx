import { useState } from 'react'
import { Phone, Mail, Eye, EyeOff, Chrome } from 'lucide-react'
import { Button } from '@components/ui/Button/Button'
import { OTPInput } from './OTPInput'
import { useAuthStore } from '@store/useAuthStore'
import { useOTP } from '@hooks/useOTP'
import { isValidMobile, isValidEmail, isValidOTP, isValidPassword } from '@utils/validation'
import { cn } from '@utils/cn'

type LoginMethod = 'mobile' | 'email'

interface LoginFormProps {
  onSuccess: () => void
  onForgotPassword: () => void
}

const MOCK_OTP = '123456'

export const LoginForm = ({ onSuccess, onForgotPassword }: LoginFormProps) => {
  const [method, setMethod] = useState<LoginMethod>('mobile')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldError, setFieldError] = useState('')

  const login = useAuthStore((s) => s.login)
  const { timer, canResend, startTimer } = useOTP()

  const handleSendOTP = async () => {
    if (!isValidMobile(mobile)) {
      setFieldError('Enter a valid 10-digit mobile number')
      return
    }
    setFieldError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setOtpStep(true)
    startTimer()
  }

  const handleVerifyOTP = async () => {
    if (!isValidOTP(otp)) {
      setOtpError('Enter the 6-digit OTP')
      return
    }
    if (otp !== MOCK_OTP) {
      setOtpError('Incorrect OTP. Use 123456 for demo.')
      return
    }
    setOtpError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    login({
      id: 'user-001',
      fullName: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      mobile,
      firstCitizenId: 'FC-9876543',
      createdAt: '2023-01-15T00:00:00Z',
    })
    setLoading(false)
    onSuccess()
  }

  const handleResendOTP = async () => {
    setOtp('')
    setOtpError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    startTimer()
  }

  const handleEmailLogin = async () => {
    if (!isValidEmail(email)) { setFieldError('Enter a valid email address'); return }
    if (!isValidPassword(password)) { setFieldError('Password must be at least 8 characters'); return }
    setFieldError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    login({
      id: 'user-001',
      fullName: 'Priya Sharma',
      email,
      mobile: '9876543210',
      firstCitizenId: 'FC-9876543',
      createdAt: '2023-01-15T00:00:00Z',
    })
    setLoading(false)
    onSuccess()
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    login({
      id: 'user-001',
      fullName: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      mobile: '9876543210',
      firstCitizenId: 'FC-9876543',
      createdAt: '2023-01-15T00:00:00Z',
    })
    setLoading(false)
    onSuccess()
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Method tabs */}
      <div className="flex rounded-lg bg-[#F5F5F5] p-1 gap-1">
        {(['mobile', 'email'] as LoginMethod[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMethod(m); setFieldError(''); setOtpStep(false); setOtp('') }}
            className={cn(
              'flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-150 capitalize',
              method === m
                ? 'bg-white text-brand-navy shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {m === 'mobile' ? 'Mobile OTP' : 'Email'}
          </button>
        ))}
      </div>

      {/* Mobile OTP flow */}
      {method === 'mobile' && (
        <>
          {!otpStep ? (
            <div className="flex flex-col gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '')); setFieldError('') }}
                  className="w-full pl-9 pr-4 h-11 border border-[#E0E0E0] rounded-lg text-sm font-sans focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all"
                />
              </div>
              {fieldError && <p className="text-xs text-danger">{fieldError}</p>}
              <Button onClick={handleSendOTP} loading={loading} size="lg" className="w-full">
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  OTP sent to <span className="font-semibold text-gray-900">+91 {mobile}</span>
                </p>
                <button
                  onClick={() => { setOtpStep(false); setOtp('') }}
                  className="text-xs text-brand-red hover:underline"
                >
                  Change number
                </button>
              </div>
              <OTPInput value={otp} onChange={setOtp} hasError={!!otpError} disabled={loading} />
              {otpError && <p className="text-xs text-danger">{otpError}</p>}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {canResend ? (
                    <button
                      onClick={handleResendOTP}
                      className="text-brand-red font-semibold hover:underline"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <>Resend in <span className="font-semibold text-gray-700">{timer}s</span></>
                  )}
                </span>
                <span className="text-gray-400">Use 123456 for demo</span>
              </div>
              <Button onClick={handleVerifyOTP} loading={loading} size="lg" className="w-full">
                Verify & Login
              </Button>
            </div>
          )}
        </>
      )}

      {/* Email/password flow */}
      {method === 'email' && (
        <div className="flex flex-col gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail size={16} />
            </span>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldError('') }}
              className="w-full pl-9 pr-4 h-11 border border-[#E0E0E0] rounded-lg text-sm font-sans focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldError('') }}
              className="w-full px-4 pr-10 h-11 border border-[#E0E0E0] rounded-lg text-sm font-sans focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldError && <p className="text-xs text-danger">{fieldError}</p>}
          <button
            onClick={onForgotPassword}
            className="text-xs text-brand-red hover:underline self-end"
          >
            Forgot Password?
          </button>
          <Button onClick={handleEmailLogin} loading={loading} size="lg" className="w-full">
            Login
          </Button>
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3">
        <span className="flex-1 h-px bg-[#E8E8E8]" />
        <span className="text-xs text-gray-400 font-medium">OR</span>
        <span className="flex-1 h-px bg-[#E8E8E8]" />
      </div>

      {/* Google OAuth */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className={cn(
          'flex items-center justify-center gap-3 h-11 w-full rounded-lg border-[1.5px] border-[#E0E0E0]',
          'text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors',
          loading && 'opacity-50 cursor-not-allowed',
        )}
      >
        <Chrome size={18} className="text-blue-500" />
        Continue with Google
      </button>
    </div>
  )
}
