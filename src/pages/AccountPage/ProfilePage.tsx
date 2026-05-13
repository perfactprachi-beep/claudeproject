import { useState } from 'react'
import { Eye, EyeOff, Bell, Mail, MessageSquare, AlertTriangle } from 'lucide-react'
import { Button } from '@components/ui/Button/Button'
import { useAuthStore } from '@store/useAuthStore'
import { isValidName, isValidEmail, isValidPassword } from '@utils/validation'
import { cn } from '@utils/cn'

export const ProfilePage = () => {
  const user = useAuthStore((s) => s.user)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const communicationPrefs = useAuthStore((s) => s.communicationPrefs)
  const updateCommunicationPrefs = useAuthStore((s) => s.updateCommunicationPrefs)
  const logout = useAuthStore((s) => s.logout)
  const requestDeleteAccount = useAuthStore((s) => s.requestDeleteAccount)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!user) return null

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold font-serif text-gray-900">Settings & Profile</h1>

      <ProfileForm
        user={user}
        onSave={(patch) => updateProfile(patch)}
      />

      <PasswordChangeForm />

      <CommunicationPrefs
        prefs={communicationPrefs}
        onChange={updateCommunicationPrefs}
      />

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Account Actions</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" onClick={logout} className="w-full sm:w-auto">
            Sign Out
          </Button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm font-semibold text-danger hover:underline self-center sm:ml-4"
          >
            Delete Account
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteAccountModal
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={requestDeleteAccount}
        />
      )}
    </div>
  )
}

function ProfileForm({ user, onSave }: {
  user: ReturnType<typeof useAuthStore.getState>['user'] & object
  onSave: (patch: Record<string, string>) => void
}) {
  const [form, setForm] = useState({
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    gender: user?.gender ?? '',
    birthday: user?.birthday ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!isValidName(form.fullName)) e.fullName = 'Enter a valid name'
    if (!isValidEmail(form.email)) e.email = 'Enter a valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    onSave(form)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">Personal Information</h2>
        {saved && <span className="text-xs text-green-600 font-semibold">✓ Saved</span>}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Full Name" error={errors.fullName} required>
          <input
            value={form.fullName}
            onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
            className={inputClass(!!errors.fullName)}
          />
        </Field>
        <Field label="Email" error={errors.email} required>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className={inputClass(!!errors.email)}
          />
        </Field>
        <Field label="Gender">
          <select
            value={form.gender}
            onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
            className={cn(inputClass(false), 'text-gray-700')}
          >
            <option value="">Prefer not to say</option>
            {['Male', 'Female', 'Other'].map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Birthday">
          <input
            type="date"
            value={form.birthday}
            onChange={(e) => setForm((p) => ({ ...p, birthday: e.target.value }))}
            className={inputClass(false)}
          />
        </Field>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={loading} size="md">
          Save Changes
        </Button>
      </div>
    </div>
  )
}

function PasswordChangeForm() {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' })
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!form.current) { setError('Enter your current password'); return }
    if (!isValidPassword(form.newPass)) { setError('New password must be at least 8 characters'); return }
    if (form.newPass !== form.confirm) { setError('Passwords do not match'); return }
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setLoading(false)
    setForm({ current: '', newPass: '', confirm: '' })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">Change Password</h2>
        {saved && <span className="text-xs text-green-600 font-semibold">✓ Updated</span>}
      </div>

      {(['current', 'newPass', 'confirm'] as const).map((f) => (
        <Field
          key={f}
          label={f === 'current' ? 'Current Password' : f === 'newPass' ? 'New Password' : 'Confirm New Password'}
        >
          <div className="relative">
            <input
              type={show[f] ? 'text' : 'password'}
              value={form[f]}
              onChange={(e) => { setForm((p) => ({ ...p, [f]: e.target.value })); setError('') }}
              className={cn(inputClass(false), 'pr-10')}
              placeholder={f === 'current' ? 'Current password' : f === 'newPass' ? 'Min. 8 characters' : 'Repeat new password'}
            />
            <button
              type="button"
              onClick={() => setShow((p) => ({ ...p, [f]: !p[f] }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {show[f] ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>
      ))}

      {error && <p className="text-xs text-danger">{error}</p>}

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={loading} size="md">
          Update Password
        </Button>
      </div>
    </div>
  )
}

function CommunicationPrefs({
  prefs,
  onChange,
}: {
  prefs: { emailOffers: boolean; smsAlerts: boolean; pushNotifications: boolean }
  onChange: (p: Partial<typeof prefs>) => void
}) {
  const items = [
    {
      key: 'emailOffers' as const,
      label: 'Email offers & updates',
      icon: Mail,
      description: 'Get personalised deals, new arrivals, and editorial picks',
    },
    {
      key: 'smsAlerts' as const,
      label: 'SMS alerts',
      icon: MessageSquare,
      description: 'Order updates and exclusive SMS-only offers',
    },
    {
      key: 'pushNotifications' as const,
      label: 'Push notifications',
      icon: Bell,
      description: 'Browser or app notifications for flash sales and order status',
    },
  ]

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 flex flex-col gap-4">
      <h2 className="text-sm font-bold text-gray-900">Communication Preferences</h2>
      <div className="flex flex-col divide-y divide-[#F5F5F5]">
        {items.map(({ key, label, icon: Icon, description }) => (
          <label key={key} className="flex items-start gap-4 py-3.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
              <Icon size={15} className="text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{description}</p>
            </div>
            <div className="shrink-0 mt-1">
              <button
                role="switch"
                aria-checked={prefs[key]}
                onClick={() => onChange({ [key]: !prefs[key] })}
                className={cn(
                  'relative w-10 h-5.5 rounded-full transition-colors duration-200',
                  'h-[22px] focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-1',
                  prefs[key] ? 'bg-brand-red' : 'bg-[#D1D5DB]',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200',
                    prefs[key] ? 'translate-x-[18px]' : 'translate-x-0',
                  )}
                />
              </button>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

function DeleteAccountModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative z-10 bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={18} className="text-danger" />
          </div>
          <h3 className="font-bold text-gray-900">Delete Account?</h3>
        </div>
        <p className="text-sm text-gray-500 mb-3 leading-relaxed">
          This will permanently delete your account, orders history, wishlist, and First Citizen points.
          <strong className="text-gray-700"> This action cannot be undone.</strong>
        </p>
        <label className="flex items-start gap-2.5 cursor-pointer mb-5">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-brand-red"
          />
          <span className="text-xs text-gray-600">I understand and want to permanently delete my account</span>
        </label>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-lg border border-[#E0E0E0] text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Keep Account
          </button>
          <button
            onClick={onConfirm}
            disabled={!confirmed}
            className="flex-1 h-10 rounded-lg bg-danger text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, required, children }: {
  label: string; error?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-700">
        {label}{required && <span className="text-brand-red ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full h-10 px-3 border rounded-lg text-sm font-sans transition-all',
    'focus:outline-none focus:ring-2 focus:ring-brand-red/20',
    hasError
      ? 'border-danger focus:border-danger bg-red-50'
      : 'border-[#E0E0E0] focus:border-brand-red',
  )
}
