import { useState } from 'react'
import { Eye, EyeOff, Gift } from 'lucide-react'
import { Button } from '@components/ui/Button/Button'
import { useAuthStore } from '@store/useAuthStore'
import { isValidName, isValidMobile, isValidEmail, isValidPassword } from '@utils/validation'
import { cn } from '@utils/cn'

interface RegisterFormProps {
  onSuccess: () => void
}

type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say'

interface FormState {
  fullName: string
  mobile: string
  email: string
  password: string
  gender: Gender | ''
  birthday: string
  firstCitizenId: string
  agreedToTerms: boolean
}

type Errors = Partial<Record<keyof FormState | 'form', string>>

const GENDERS: Gender[] = ['Male', 'Female', 'Other', 'Prefer not to say']

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    gender: '',
    birthday: '',
    firstCitizenId: '',
    agreedToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)

  const login = useAuthStore((s) => s.login)

  const set = (field: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const validate = (): boolean => {
    const e: Errors = {}
    if (!isValidName(form.fullName)) e.fullName = 'Enter your full name'
    if (!isValidMobile(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number'
    if (!isValidEmail(form.email)) e.email = 'Enter a valid email address'
    if (!isValidPassword(form.password)) e.password = 'Password must be at least 8 characters'
    if (!form.agreedToTerms) e.agreedToTerms = 'Please accept the Terms & Privacy Policy'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    login({
      id: `user-${Date.now()}`,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      mobile: form.mobile,
      gender: form.gender || undefined,
      birthday: form.birthday || undefined,
      firstCitizenId: form.firstCitizenId.trim() || undefined,
      createdAt: new Date().toISOString(),
    })
    setLoading(false)
    onSuccess()
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Full Name */}
      <Field label="Full Name" error={errors.fullName} required>
        <input
          type="text"
          placeholder="e.g. Priya Sharma"
          value={form.fullName}
          onChange={(e) => set('fullName', e.target.value)}
          className={inputClass(!!errors.fullName)}
        />
      </Field>

      {/* Mobile */}
      <Field label="Mobile Number" error={errors.mobile} required>
        <input
          type="tel"
          placeholder="10-digit mobile number"
          maxLength={10}
          value={form.mobile}
          onChange={(e) => set('mobile', e.target.value.replace(/\D/g, ''))}
          className={inputClass(!!errors.mobile)}
        />
      </Field>

      {/* Email */}
      <Field label="Email Address" error={errors.email} required>
        <input
          type="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          className={inputClass(!!errors.email)}
        />
      </Field>

      {/* Password */}
      <Field label="Password" error={errors.password} required>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            className={cn(inputClass(!!errors.password), 'pr-10')}
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
      </Field>

      {/* Gender + Birthday row */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Gender" hint="Optional">
          <select
            value={form.gender}
            onChange={(e) => set('gender', e.target.value)}
            className={cn(inputClass(false), 'text-gray-700')}
          >
            <option value="">Select</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </Field>
        <Field label="Birthday" hint="Optional">
          <input
            type="date"
            value={form.birthday}
            onChange={(e) => set('birthday', e.target.value)}
            className={inputClass(false)}
          />
        </Field>
      </div>

      {/* First Citizen ID */}
      <Field label="First Citizen Card Number" hint="Optional">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-red">
            <Gift size={16} />
          </span>
          <input
            type="text"
            placeholder="Link existing membership"
            value={form.firstCitizenId}
            onChange={(e) => set('firstCitizenId', e.target.value)}
            className={cn(inputClass(false), 'pl-9')}
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
          Earn points on past purchases by linking your physical card
        </p>
      </Field>

      {/* Terms checkbox */}
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={form.agreedToTerms}
          onChange={(e) => set('agreedToTerms', e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-red focus:ring-brand-red accent-brand-red"
        />
        <span className="text-xs text-gray-600 leading-relaxed">
          I agree to the{' '}
          <a href="/terms" className="text-brand-red hover:underline">Terms of Use</a>
          {' '}and{' '}
          <a href="/privacy" className="text-brand-red hover:underline">Privacy Policy</a>
        </span>
      </label>
      {errors.agreedToTerms && (
        <p className="text-xs text-danger -mt-2">{errors.agreedToTerms}</p>
      )}

      <Button onClick={handleSubmit} loading={loading} size="lg" className="w-full mt-1">
        Create Account
      </Button>
    </div>
  )
}

function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-700">
        {label}
        {required && <span className="text-brand-red ml-0.5">*</span>}
        {hint && <span className="text-gray-400 font-normal ml-1">({hint})</span>}
      </label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full h-11 px-3 border rounded-lg text-sm font-sans transition-all duration-150',
    'focus:outline-none focus:ring-2 focus:ring-brand-red/20',
    hasError
      ? 'border-danger focus:border-danger bg-red-50'
      : 'border-[#E0E0E0] focus:border-brand-red bg-white',
  )
}
