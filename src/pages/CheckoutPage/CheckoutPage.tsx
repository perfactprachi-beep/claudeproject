import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight, MapPin, Shield, Lock, CreditCard,
  Smartphone, Building2, Layers, Banknote, Check,
  Zap, ChevronDown, ShoppingBag, Truck,
} from 'lucide-react'
import { useCartStore } from '@store/useCartStore'
import { useAuthStore } from '@store/useAuthStore'
import { api } from '@services/api'
import { toast } from '@store/useToastStore'
import { trackBeginCheckout, trackAddPaymentInfo, trackPurchase, type GAItem } from '@utils/analytics'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void }
  }
}
import { WOMEN_ETHNIC_WEAR } from '@data/products/womenEthnicWear'
import { formatINR } from '@utils/format'
import { cn } from '@utils/cn'

// ─── Types ─────────────────────────────────────────────────────────────────────

type PaymentTab = 'upi' | 'card' | 'netbanking' | 'emi' | 'cod'

// ─── Constants ─────────────────────────────────────────────────────────────────

const FREE_DELIVERY_THRESHOLD = 999
const DELIVERY_FEE = 99
const COD_FEE = 40
const FC_RATE = 1

const NETBANKS = [
  { id: 'hdfc',   label: 'HDFC Bank',     abbr: 'HDFC', color: '#004C8F', bg: '#EFF6FF' },
  { id: 'sbi',    label: 'State Bank',     abbr: 'SBI',  color: '#22577A', bg: '#F0F9FF' },
  { id: 'icici',  label: 'ICICI Bank',     abbr: 'ICICI',color: '#B5591F', bg: '#FFF7ED' },
  { id: 'axis',   label: 'Axis Bank',      abbr: 'AXIS', color: '#97144D', bg: '#FFF1F2' },
  { id: 'kotak',  label: 'Kotak Bank',     abbr: 'KMB',  color: '#EE3024', bg: '#FEF2F2' },
  { id: 'yes',    label: 'Yes Bank',       abbr: 'YES',  color: '#003580', bg: '#EFF6FF' },
]

const EMI_BANKS = ['HDFC Bank', 'ICICI Bank', 'SBI Card', 'Axis Bank', 'Kotak Bank', 'American Express']
const EMI_TENURES = [3, 6, 9, 12]

const UPI_APPS = [
  { id: 'gpay',    name: 'Google Pay', abbr: 'GPay',   color: '#4285F4', bg: '#EFF6FF' },
  { id: 'phonepe', name: 'PhonePe',    abbr: 'PhPe',   color: '#5F259F', bg: '#F5F3FF' },
  { id: 'paytm',   name: 'Paytm',      abbr: 'PAYTM',  color: '#00BAF2', bg: '#EFF9FF' },
  { id: 'bhim',    name: 'BHIM',        abbr: 'BHIM',   color: '#1A5276', bg: '#EBF5FB' },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getMRP(productId: string, price: number): number {
  return WOMEN_ETHNIC_WEAR.find((p) => p.id === productId)?.mrp ?? price
}

function calcEMI(total: number, months: number): number {
  const rate = 0.015
  return Math.round((total * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1))
}

// ─── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator() {
  const steps = [
    { label: 'Bag',     href: '/cart', done: true  },
    { label: 'Address', href: null,    done: true  },
    { label: 'Payment', href: null,    done: false },
  ]

  return (
    <nav aria-label="Checkout steps" className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-0">
          {/* Step */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
                step.done && i < 2
                  ? 'bg-[#22C55E] text-white'
                  : !step.done
                    ? 'bg-[#C0001D] text-white ring-2 ring-[#C0001D]/20'
                    : 'bg-gray-200 text-gray-500',
              )}
            >
              {step.done && i < 2 ? <Check size={13} strokeWidth={3} /> : i + 1}
            </div>
            {step.href ? (
              <Link
                to={step.href}
                className="text-xs font-semibold text-gray-500 hover:text-[#C0001D] transition-colors hidden sm:block"
              >
                {step.label}
              </Link>
            ) : (
              <span className={cn(
                'text-xs font-semibold hidden sm:block',
                !step.done ? 'text-[#C0001D]' : 'text-[#22C55E]',
              )}>
                {step.label}
              </span>
            )}
          </div>

          {/* Connector */}
          {i < steps.length - 1 && (
            <div className={cn(
              'h-px w-8 sm:w-12 mx-2 shrink-0',
              steps[i + 1].done || i < 1 ? 'bg-[#22C55E]' : 'bg-[#E8E8E8]',
            )} />
          )}
        </div>
      ))}
    </nav>
  )
}

// ─── Address card ──────────────────────────────────────────────────────────────

function DeliveryAddress() {
  const { addresses } = useAuthStore()
  const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0]

  if (!defaultAddr) return null

  return (
    <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FFF5F5] flex items-center justify-center shrink-0 mt-0.5">
            <MapPin size={15} className="text-[#C0001D]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold text-gray-900">{defaultAddr.fullName}</p>
              <span className="px-2 py-0.5 bg-[#F5F5F5] text-gray-500 text-[10px] font-semibold rounded-full uppercase tracking-wider">
                {defaultAddr.label}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {defaultAddr.line1}
              {defaultAddr.line2 ? `, ${defaultAddr.line2}` : ''}
            </p>
            <p className="text-xs text-gray-600">
              {defaultAddr.city}, {defaultAddr.state} — {defaultAddr.pincode}
            </p>
            <p className="text-xs text-gray-400 mt-1">Mobile: {defaultAddr.mobile}</p>
          </div>
        </div>
        <Link
          to="/account/addresses"
          className="shrink-0 text-xs text-[#C0001D] font-semibold hover:underline"
        >
          Change
        </Link>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F5F5F5]">
        <Truck size={13} className="text-[#22C55E] shrink-0" />
        <p className="text-xs text-gray-600">
          Expected delivery:{' '}
          <strong className="text-gray-900">
            {new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', {
              weekday: 'short', day: '2-digit', month: 'short',
            })}
          </strong>
          {' '}· Free for prepaid orders
        </p>
      </div>
    </div>
  )
}

// ─── Payment method tabs ───────────────────────────────────────────────────────

const TABS: { id: PaymentTab; label: string; Icon: typeof CreditCard }[] = [
  { id: 'upi',        label: 'UPI',          Icon: Smartphone  },
  { id: 'card',       label: 'Card',          Icon: CreditCard  },
  { id: 'netbanking', label: 'Net Banking',   Icon: Building2   },
  { id: 'emi',        label: 'EMI',           Icon: Layers      },
  { id: 'cod',        label: 'Cash',          Icon: Banknote    },
]

// ─── UPI panel ────────────────────────────────────────────────────────────────

function UpiPanel({ onSelect }: { onSelect: (label: string) => void }) {
  const { upiIds } = useAuthStore()
  const [selected, setSelected] = useState(upiIds.find((u) => u.isDefault)?.id ?? '')
  const [newVpa, setNewVpa]     = useState('')
  const [showNew, setShowNew]   = useState(false)

  function pick(id: string, label: string) {
    setSelected(id)
    onSelect(label)
  }

  return (
    <div className="space-y-4">
      {/* Saved UPIs */}
      {upiIds.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Saved UPI IDs</p>
          {upiIds.map((u) => (
            <label
              key={u.id}
              className={cn(
                'flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all',
                selected === u.id
                  ? 'border-[#C0001D] bg-[#FFF5F5]'
                  : 'border-[#E8E8E8] bg-white hover:border-gray-300',
              )}
            >
              <input
                type="radio"
                name="upi"
                value={u.id}
                checked={selected === u.id}
                onChange={() => pick(u.id, u.vpa)}
                className="accent-[#C0001D] w-4 h-4 shrink-0"
              />
              <span className="flex-1 text-sm font-mono font-medium text-gray-800">{u.vpa}</span>
              {u.isDefault && (
                <span className="text-[10px] font-bold text-[#C0001D] bg-[#FFF0F0] px-1.5 py-0.5 rounded-full">
                  Default
                </span>
              )}
            </label>
          ))}
        </div>
      )}

      {/* UPI Apps */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pay via UPI App</p>
        <div className="grid grid-cols-4 gap-2">
          {UPI_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => pick(`app-${app.id}`, app.name)}
              className={cn(
                'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all',
                selected === `app-${app.id}`
                  ? 'border-[#C0001D] bg-[#FFF5F5]'
                  : 'border-[#E8E8E8] bg-white hover:border-gray-300',
              )}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: app.bg, color: app.color }}
              >
                {app.abbr}
              </div>
              <span className="text-[10px] text-gray-600 leading-tight text-center">{app.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* New UPI ID */}
      {showNew ? (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Enter UPI ID</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newVpa}
              onChange={(e) => setNewVpa(e.target.value)}
              placeholder="yourname@upi"
              className="flex-1 border border-[#DCDCDC] rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#C0001D] focus:ring-1 focus:ring-[#C0001D]/20"
            />
            <button
              onClick={() => { if (newVpa.includes('@')) { pick('new-upi', newVpa); setShowNew(false) } }}
              className="px-4 py-2.5 bg-[#1A1A2E] text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors shrink-0"
            >
              Verify
            </button>
          </div>
          <button onClick={() => setShowNew(false)} className="text-xs text-gray-400 hover:text-gray-600">
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="text-xs text-[#C0001D] font-semibold hover:underline flex items-center gap-1"
        >
          + Add new UPI ID
        </button>
      )}
    </div>
  )
}

// ─── Card panel ───────────────────────────────────────────────────────────────

function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function CardPanel({ onSelect }: { onSelect: (label: string) => void }) {
  const { savedCards } = useAuthStore()
  const [selected, setSelected] = useState(savedCards[0]?.id ?? 'new')
  const [cardNum, setCardNum]   = useState('')
  const [name, setName]         = useState('')
  const [expiry, setExpiry]     = useState('')
  const [cvv, setCvv]           = useState('')
  const [saveCard, setSaveCard] = useState(true)

  function pick(id: string, label: string) {
    setSelected(id)
    onSelect(label)
  }

  const networkColor: Record<string, string> = {
    Visa: '#1A1F71', Mastercard: '#EB001B', RuPay: '#097338', Amex: '#2E77BC',
  }

  return (
    <div className="space-y-4">
      {/* Saved cards */}
      {savedCards.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Saved Cards</p>
          {savedCards.map((card) => (
            <label
              key={card.id}
              className={cn(
                'flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all',
                selected === card.id
                  ? 'border-[#C0001D] bg-[#FFF5F5]'
                  : 'border-[#E8E8E8] bg-white hover:border-gray-300',
              )}
            >
              <input
                type="radio"
                name="card"
                checked={selected === card.id}
                onChange={() => pick(card.id, `${card.network} ••••${card.last4}`)}
                className="accent-[#C0001D] w-4 h-4 shrink-0"
              />
              <div
                className="w-8 h-5 rounded flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                style={{ backgroundColor: networkColor[card.network] ?? '#666' }}
              >
                {card.network === 'Mastercard' ? 'MC' : card.network.slice(0, 4)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-mono font-medium text-gray-800">
                  •••• •••• •••• {card.last4}
                </p>
                <p className="text-xs text-gray-400">{card.holderName} · Exp {card.expiry}</p>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* New card toggle */}
      <label
        className={cn(
          'flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all',
          selected === 'new'
            ? 'border-[#C0001D] bg-[#FFF5F5]'
            : 'border-[#E8E8E8] bg-white hover:border-gray-300',
        )}
      >
        <input
          type="radio"
          name="card"
          checked={selected === 'new'}
          onChange={() => pick('new', 'New Card')}
          className="accent-[#C0001D] w-4 h-4 shrink-0"
        />
        <span className="text-sm font-semibold text-gray-700">Add new card</span>
        <CreditCard size={15} className="text-gray-400 ml-auto" />
      </label>

      {/* New card form */}
      {selected === 'new' && (
        <div className="space-y-3 p-4 bg-[#FAFAF8] rounded-xl border border-[#EBEBEB]">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Card Number</label>
            <input
              type="text"
              value={cardNum}
              onChange={(e) => setCardNum(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              className="w-full border border-[#DCDCDC] rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#C0001D] focus:ring-1 focus:ring-[#C0001D]/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cardholder Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="As printed on card"
              className="w-full border border-[#DCDCDC] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C0001D] focus:ring-1 focus:ring-[#C0001D]/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Expiry (MM/YY)</label>
              <input
                type="text"
                value={expiry}
                maxLength={5}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                  setExpiry(v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v)
                }}
                placeholder="MM/YY"
                className="w-full border border-[#DCDCDC] rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#C0001D] focus:ring-1 focus:ring-[#C0001D]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">CVV</label>
              <input
                type="password"
                value={cvv}
                maxLength={4}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="•••"
                className="w-full border border-[#DCDCDC] rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#C0001D] focus:ring-1 focus:ring-[#C0001D]/20"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="w-4 h-4 accent-[#C0001D] rounded"
            />
            <span className="text-xs text-gray-600">Save this card for future payments</span>
          </label>
        </div>
      )}
    </div>
  )
}

// ─── Net Banking panel ────────────────────────────────────────────────────────

function NetBankingPanel({ onSelect }: { onSelect: (label: string) => void }) {
  const [selected, setSelected] = useState('')
  const [other, setOther]       = useState(false)

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Popular Banks</p>
      <div className="grid grid-cols-3 gap-2.5">
        {NETBANKS.map((bank) => (
          <button
            key={bank.id}
            onClick={() => { setSelected(bank.id); setOther(false); onSelect(bank.label) }}
            className={cn(
              'flex flex-col items-center gap-2 p-3 border rounded-xl transition-all',
              selected === bank.id
                ? 'border-[#C0001D] bg-[#FFF5F5]'
                : 'border-[#E8E8E8] bg-white hover:border-gray-300',
            )}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: bank.bg, color: bank.color }}
            >
              {bank.abbr}
            </div>
            <span className="text-[10px] text-gray-600 leading-tight text-center">{bank.label}</span>
            {selected === bank.id && (
              <div className="w-4 h-4 rounded-full bg-[#C0001D] flex items-center justify-center">
                <Check size={9} className="text-white" strokeWidth={3} />
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => { setOther((o) => !o); setSelected('') }}
        className="flex items-center justify-between w-full p-3.5 border border-[#E8E8E8] rounded-xl text-sm text-gray-700 hover:border-gray-300 transition-all"
      >
        <span className="font-medium">Other Banks</span>
        <ChevronDown size={14} className={cn('text-gray-400 transition-transform', other && 'rotate-180')} />
      </button>

      {other && (
        <select
          onChange={(e) => { onSelect(e.target.value); setSelected('other') }}
          className="w-full border border-[#DCDCDC] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C0001D] bg-white"
        >
          <option value="">Select your bank</option>
          {['Bank of Baroda', 'Union Bank', 'Punjab National Bank', 'IndusInd Bank', 'Federal Bank',
            'IDFC First Bank', 'Canara Bank', 'RBL Bank'].map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      )}
    </div>
  )
}

// ─── EMI panel ────────────────────────────────────────────────────────────────

function EMIPanel({ total, onSelect }: { total: number; onSelect: (label: string) => void }) {
  const [bank,   setBank]   = useState('')
  const [tenure, setTenure] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Bank / Card</p>
        <select
          value={bank}
          onChange={(e) => { setBank(e.target.value); onSelect(`EMI – ${e.target.value}`) }}
          className="w-full border border-[#DCDCDC] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C0001D] bg-white"
        >
          <option value="">Choose your bank</option>
          {EMI_BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {bank && (
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">EMI Tenure</p>
          <div className="grid grid-cols-4 gap-2">
            {EMI_TENURES.map((m) => {
              const monthly = calcEMI(total, m)
              return (
                <button
                  key={m}
                  onClick={() => setTenure(m)}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 border rounded-xl transition-all',
                    tenure === m
                      ? 'border-[#C0001D] bg-[#FFF5F5]'
                      : 'border-[#E8E8E8] bg-white hover:border-gray-300',
                  )}
                >
                  <span className="text-sm font-bold text-gray-900">{m}</span>
                  <span className="text-[9px] text-gray-500">months</span>
                  <span className="text-xs font-mono font-bold text-[#C0001D]">
                    {formatINR(monthly)}/mo
                  </span>
                </button>
              )
            })}
          </div>
          {tenure && (
            <p className="text-xs text-gray-500 mt-2">
              Total payable:{' '}
              <strong className="font-mono text-gray-800">{formatINR(calcEMI(total, tenure) * tenure)}</strong>
              {' '}(incl. ~1.5% monthly interest)
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── COD panel ────────────────────────────────────────────────────────────────

function CODPanel() {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <Banknote size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-900">Cash on Delivery</p>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            Pay <strong>₹{COD_FEE}</strong> extra as COD handling fee. Keep exact change ready
            at delivery. COD is not available on prepaid discounts.
          </p>
        </div>
      </div>
      <ul className="text-xs text-gray-600 space-y-1.5">
        {[
          'Confirm your order and pay at the door',
          'Order can be cancelled before dispatch',
          'Returns handled via courier pickup',
        ].map((t) => (
          <li key={t} className="flex items-start gap-2">
            <Check size={11} className="text-[#22C55E] shrink-0 mt-0.5" strokeWidth={3} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── FC Points toggle ─────────────────────────────────────────────────────────

function FCPointsToggle({
  enabled,
  balance,
  applied,
  onChange,
}: {
  enabled: boolean
  balance: number
  applied: number
  onChange: (pts: number) => void
}) {
  return (
    <div className="bg-white border border-[#EBEBEB] rounded-2xl px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={15} className="text-[#C0001D]" />
          <p className="text-sm font-semibold text-gray-800">First Citizen Points</p>
          <span className="text-xs text-gray-400">
            ({balance.toLocaleString('en-IN')} pts = {formatINR(balance)})
          </span>
        </div>
        <button
          onClick={() => onChange(enabled ? 0 : Math.min(balance, 500))}
          className={cn(
            'relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0',
            enabled ? 'bg-[#C0001D]' : 'bg-gray-200',
          )}
          role="switch"
          aria-checked={enabled}
        >
          <span
            className={cn(
              'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
              enabled ? 'translate-x-5' : 'translate-x-0.5',
            )}
          />
        </button>
      </div>

      {enabled && (
        <div className="mt-3 flex items-center gap-2 text-xs text-[#22C55E] font-semibold bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <Check size={12} strokeWidth={3} />
          {applied.toLocaleString('en-IN')} points applied → saving {formatINR(applied * FC_RATE)}
        </div>
      )}
    </div>
  )
}

// ─── Order Summary sidebar ─────────────────────────────────────────────────────

interface OrderSummaryProps {
  payTotal: number
  subtotalMRP: number
  productDiscount: number
  deliveryFee: number
  fcDiscount: number
  codFee: number
  payLabel: string
  onConfirm: () => void
  loading: boolean
}

function OrderSummary({
  payTotal, subtotalMRP, productDiscount, deliveryFee,
  fcDiscount, codFee, payLabel, onConfirm, loading,
}: OrderSummaryProps) {
  const { items } = useCartStore()
  const totalSavings = productDiscount + fcDiscount + (deliveryFee === 0 ? DELIVERY_FEE : 0)

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden sticky top-24">
      {/* Items list */}
      <div className="px-5 pt-5 pb-3 border-b border-[#F0F0F0]">
        <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <ShoppingBag size={14} className="text-[#C0001D]" />
          Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} items)
        </h2>
        <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
          {items.map((item) => (
            <div key={item.id} className="flex gap-2.5">
              <div className="w-12 h-[60px] rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://picsum.photos/seed/${item.productId}/100/125`
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.brand}</p>
                <p className="text-xs text-gray-800 font-medium line-clamp-2 leading-snug">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-400">Size: {item.size}</span>
                  <span className="text-[10px] text-gray-400">Qty: {item.quantity}</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-gray-900 shrink-0">
                {formatINR(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="px-5 py-4 space-y-2.5">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Total MRP</span>
          <span className="font-mono">{formatINR(subtotalMRP)}</span>
        </div>
        <div className="flex justify-between text-xs text-[#16A34A]">
          <span>Product Discount</span>
          <span className="font-mono">−{formatINR(productDiscount)}</span>
        </div>
        {fcDiscount > 0 && (
          <div className="flex justify-between text-xs text-[#C0001D]">
            <span className="flex items-center gap-1"><Zap size={10} />FC Points</span>
            <span className="font-mono">−{formatINR(fcDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-gray-600">
          <span>Delivery</span>
          {deliveryFee === 0
            ? <span className="font-semibold text-[#16A34A]">FREE</span>
            : <span className="font-mono">{formatINR(deliveryFee)}</span>
          }
        </div>
        {codFee > 0 && (
          <div className="flex justify-between text-xs text-gray-600">
            <span>COD Fee</span>
            <span className="font-mono">{formatINR(codFee)}</span>
          </div>
        )}
        <div className="border-t border-[#F0F0F0] pt-2.5 flex justify-between font-bold text-gray-900">
          <span className="text-sm">Total</span>
          <span className="font-mono text-base">{formatINR(payTotal)}</span>
        </div>
      </div>

      {totalSavings > 0 && (
        <div className="mx-5 mb-4 bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-center">
          <p className="text-[11px] font-semibold text-green-800">
            You save <span className="font-mono">{formatINR(totalSavings)}</span> on this order
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="px-5 pb-5">
        <button
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            'w-full py-4 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2',
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#C0001D] hover:bg-[#A8001A] active:scale-[0.98]',
          )}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Lock size={14} />
              {payLabel}
            </>
          )}
        </button>
        <p className="text-[10px] text-gray-400 text-center mt-2.5 flex items-center justify-center gap-1">
          <Shield size={10} />
          Secured by 256-bit SSL encryption
        </p>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const { isAuthenticated, user } = useAuthStore()

  const [activeTab, setActiveTab]       = useState<PaymentTab>('upi')
  const [, setPaymentLabel] = useState('')
  const [fcEnabled, setFCEnabled]       = useState(false)
  const [loading, setLoading]           = useState(false)

  const FC_BALANCE = 2840
  const fcApplied  = fcEnabled ? Math.min(FC_BALANCE, 500) : 0

  const totals = useMemo(() => {
    const subtotalSelling = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const subtotalMRP     = items.reduce((s, i) => s + getMRP(i.productId, i.price) * i.quantity, 0)
    const productDiscount = subtotalMRP - subtotalSelling
    const deliveryFee     = subtotalSelling >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
    const codFee          = activeTab === 'cod' ? COD_FEE : 0
    const fcDiscount      = fcApplied * FC_RATE
    const payTotal        = subtotalSelling - fcDiscount + deliveryFee + codFee
    return { subtotalSelling, subtotalMRP, productDiscount, deliveryFee, codFee, fcDiscount, payTotal }
  }, [items, activeTab, fcApplied])

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  async function handleConfirm() {
    setLoading(true)
    try {
      const gaItems: GAItem[] = items.map((i) => ({
        item_id: i.productId,
        item_name: i.name,
        price: i.price,
        quantity: i.quantity,
      }))

      trackBeginCheckout(totals.payTotal, gaItems)
      trackAddPaymentInfo(totals.payTotal, activeTab, gaItems)

      if (activeTab === 'cod') {
        // COD — place order directly without payment gateway
        await api.post('/orders', { paymentMethod: 'cod', amount: totals.payTotal })
        trackPurchase(`cod-${Date.now()}`, totals.payTotal, gaItems)
        clearCart()
        navigate('/account/orders')
        return
      }

      const { orderId, amount, currency, keyId } = await api.post<{
        orderId: string; amount: number; currency: string; keyId: string
      }>('/payments/create-order', { amount: totals.payTotal, receipt: `receipt_${Date.now()}` })

      const rzp = new window.Razorpay({
        key: keyId,
        order_id: orderId,
        amount,
        currency,
        name: 'Shoppers Stop',
        description: 'Fashion & Lifestyle Purchase',
        theme: { color: '#C0001D' },
        prefill: {
          name:    user?.fullName ?? '',
          email:   user?.email ?? '',
          contact: user?.mobile ?? '',
        },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            await api.post('/payments/verify', {
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId,
            })
            trackPurchase(response.razorpay_payment_id, totals.payTotal, gaItems)
            clearCart()
            navigate('/account/orders')
          } catch {
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      })

      rzp.open()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Payment failed. Please try again.'
      toast.error(msg)
      setLoading(false)
    }
  }

  const payLabel =
    activeTab === 'cod'
      ? `Place Order · ${formatINR(totals.payTotal)}`
      : `Pay ${formatINR(totals.payTotal)}`

  return (
    <div className="min-h-screen bg-brand-warm pb-24 lg:pb-0">

      {/* ── Checkout header ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40" style={{ boxShadow: '0 1px 0 #E8E8E8' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-serif text-base font-bold text-[#C0001D] tracking-wide uppercase">
              Shoppers Stop
            </span>
          </Link>
          <StepIndicator />
          <div className="flex items-center gap-1.5 text-xs text-gray-500 shrink-0">
            <Shield size={13} className="text-[#22C55E]" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">

        {/* ── Breadcrumb ────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1 text-xs text-gray-500">
            <li><Link to="/" className="hover:text-[#C0001D] transition-colors">Home</Link></li>
            <li className="flex items-center gap-1">
              <ChevronRight size={11} className="text-gray-300" />
              <Link to="/cart" className="hover:text-[#C0001D] transition-colors">Bag</Link>
            </li>
            <li className="flex items-center gap-1">
              <ChevronRight size={11} className="text-gray-300" />
              <span className="text-gray-700 font-medium">Payment</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          {/* ══ LEFT ═══════════════════════════════════════════════════ */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Delivery address */}
            <DeliveryAddress />

            {/* Payment methods */}
            <div className="bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden">
              {/* Tab bar */}
              <div className="flex border-b border-[#F0F0F0] overflow-x-auto scrollbar-hide">
                {TABS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap shrink-0',
                      activeTab === id
                        ? 'border-[#C0001D] text-[#C0001D]'
                        : 'border-transparent text-gray-500 hover:text-gray-800',
                    )}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Panel content */}
              <div className="p-5">
                {activeTab === 'upi'        && <UpiPanel        onSelect={setPaymentLabel} />}
                {activeTab === 'card'       && <CardPanel       onSelect={setPaymentLabel} />}
                {activeTab === 'netbanking' && <NetBankingPanel onSelect={setPaymentLabel} />}
                {activeTab === 'emi'        && <EMIPanel        total={totals.subtotalSelling} onSelect={setPaymentLabel} />}
                {activeTab === 'cod'        && <CODPanel />}
              </div>
            </div>

            {/* FC Points */}
            <FCPointsToggle
              enabled={fcEnabled}
              balance={FC_BALANCE}
              applied={fcApplied}
              onChange={(pts) => setFCEnabled(pts > 0)}
            />

            {/* Mobile-only CTA */}
            <div className="lg:hidden">
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={cn(
                  'w-full py-4 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2',
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#C0001D] hover:bg-[#A8001A]',
                )}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Processing…
                  </>
                ) : (
                  <><Lock size={14} /> {payLabel}</>
                )}
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                <Shield size={10} />
                Secured by 256-bit SSL
              </p>
            </div>
          </div>

          {/* ══ RIGHT — Order summary ═══════════════════════════════════ */}
          <div className="hidden lg:block w-[340px] shrink-0">
            <OrderSummary
              {...totals}
              payLabel={payLabel}
              onConfirm={handleConfirm}
              loading={loading}
            />
          </div>

        </div>
      </div>

      {/* Sticky bottom bar on mobile */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#EBEBEB] px-4 py-3"
        style={{ boxShadow: '0 -4px 16px rgba(0,0,0,0.08)' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500">Total Amount</span>
          <span className="font-mono font-bold text-gray-900">{formatINR(totals.payTotal)}</span>
        </div>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full py-3.5 bg-[#C0001D] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing…</>
          ) : (
            <><Lock size={14} /> {payLabel}</>
          )}
        </button>
      </div>

    </div>
  )
}
