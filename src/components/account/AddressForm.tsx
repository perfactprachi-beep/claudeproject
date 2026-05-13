import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@components/ui/Button/Button'
import type { Address } from '@typedefs/user'
import { isValidName, isValidMobile, isValidPincode } from '@utils/validation'
import { cn } from '@utils/cn'

type AddressLabel = 'Home' | 'Work' | 'Other'

interface AddressFormProps {
  initial?: Address
  onSave: (address: Omit<Address, 'id'>) => void
  onClose: () => void
}

const LABELS: AddressLabel[] = ['Home', 'Work', 'Other']

const STATES = [
  'Andhra Pradesh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
]

type FormData = Omit<Address, 'id'>
type Errors = Partial<Record<keyof FormData, string>>

export const AddressForm = ({ initial, onSave, onClose }: AddressFormProps) => {
  const [form, setForm] = useState<FormData>({
    label: initial?.label ?? 'Home',
    fullName: initial?.fullName ?? '',
    mobile: initial?.mobile ?? '',
    line1: initial?.line1 ?? '',
    line2: initial?.line2 ?? '',
    city: initial?.city ?? '',
    state: initial?.state ?? '',
    pincode: initial?.pincode ?? '',
    isDefault: initial?.isDefault ?? false,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const set = <K extends keyof FormData>(field: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const validate = (): boolean => {
    const e: Errors = {}
    if (!isValidName(form.fullName)) e.fullName = 'Enter a valid name'
    if (!isValidMobile(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number'
    if (!form.line1.trim()) e.line1 = 'Address line 1 is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.state) e.state = 'Select a state'
    if (!isValidPincode(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    onSave(form)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full sm:max-w-lg bg-white sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
          <h2 className="font-semibold text-gray-900">{initial ? 'Edit Address' : 'Add New Address'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 max-h-[75vh] overflow-y-auto flex flex-col gap-4">
          {/* Label selector */}
          <div className="flex gap-2">
            {LABELS.map((l) => (
              <button
                key={l}
                onClick={() => set('label', l)}
                className={cn(
                  'flex-1 py-2 text-sm font-semibold rounded-lg border transition-all',
                  form.label === l
                    ? 'border-brand-red bg-brand-red/5 text-brand-red'
                    : 'border-[#E0E0E0] text-gray-600 hover:border-gray-400',
                )}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name" error={errors.fullName} required className="col-span-2 sm:col-span-1">
              <input
                type="text"
                placeholder="Name on address"
                value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                className={inputClass(!!errors.fullName)}
              />
            </Field>
            <Field label="Mobile" error={errors.mobile} required className="col-span-2 sm:col-span-1">
              <input
                type="tel"
                placeholder="10-digit number"
                maxLength={10}
                value={form.mobile}
                onChange={(e) => set('mobile', e.target.value.replace(/\D/g, ''))}
                className={inputClass(!!errors.mobile)}
              />
            </Field>
          </div>

          <Field label="Address Line 1" error={errors.line1} required>
            <input
              type="text"
              placeholder="House / Flat / Block No., Street"
              value={form.line1}
              onChange={(e) => set('line1', e.target.value)}
              className={inputClass(!!errors.line1)}
            />
          </Field>

          <Field label="Address Line 2">
            <input
              type="text"
              placeholder="Landmark, Area (optional)"
              value={form.line2}
              onChange={(e) => set('line2', e.target.value)}
              className={inputClass(false)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="City" error={errors.city} required>
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                className={inputClass(!!errors.city)}
              />
            </Field>
            <Field label="Pincode" error={errors.pincode} required>
              <input
                type="text"
                placeholder="6-digit pincode"
                maxLength={6}
                value={form.pincode}
                onChange={(e) => set('pincode', e.target.value.replace(/\D/g, ''))}
                className={inputClass(!!errors.pincode)}
              />
            </Field>
          </div>

          <Field label="State" error={errors.state} required>
            <select
              value={form.state}
              onChange={(e) => set('state', e.target.value)}
              className={cn(inputClass(!!errors.state), 'text-gray-700')}
            >
              <option value="">Select state</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => set('isDefault', e.target.checked)}
              className="h-4 w-4 rounded accent-brand-red"
            />
            <span className="text-sm text-gray-700">Set as default delivery address</span>
          </label>
        </div>

        <div className="px-5 py-4 border-t border-[#F0F0F0] flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSave} loading={loading} className="flex-1">
            {initial ? 'Save Changes' : 'Add Address'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function Field({
  label, error, required, className, children,
}: {
  label: string; error?: string; required?: boolean; className?: string; children: React.ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
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
