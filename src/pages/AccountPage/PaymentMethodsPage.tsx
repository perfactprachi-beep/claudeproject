import { useState } from 'react'
import { Plus, CreditCard, Smartphone } from 'lucide-react'
import { SavedCardCard, UPICard } from '@components/account/PaymentMethodCard'
import { useAuthStore } from '@store/useAuthStore'
import { isValidUPI } from '@utils/validation'

export const PaymentMethodsPage = () => {
  const savedCards = useAuthStore((s) => s.savedCards)
  const upiIds = useAuthStore((s) => s.upiIds)
  const deleteSavedCard = useAuthStore((s) => s.deleteSavedCard)
  const addUPIId = useAuthStore((s) => s.addUPIId)
  const deleteUPIId = useAuthStore((s) => s.deleteUPIId)

  const [showAddUPI, setShowAddUPI] = useState(false)
  const [newVPA, setNewVPA] = useState('')
  const [upiError, setUpiError] = useState('')

  const handleAddUPI = () => {
    if (!isValidUPI(newVPA)) {
      setUpiError('Enter a valid UPI ID (e.g. name@bank)')
      return
    }
    addUPIId({ id: `upi-${Date.now()}`, vpa: newVPA.trim(), isDefault: upiIds.length === 0 })
    setNewVPA('')
    setUpiError('')
    setShowAddUPI(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold font-serif text-gray-900">Payment Methods</h1>

      {/* Saved Cards */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-gray-500" />
            <h2 className="text-sm font-bold text-gray-700">Saved Cards</h2>
          </div>
          <button
            className="text-xs font-semibold text-gray-400 hover:text-brand-red transition-colors"
            onClick={() => {/* Card addition flow would be via Razorpay SDK in production */}}
            title="Card addition requires payment gateway integration"
          >
            + Add Card
          </button>
        </div>

        {savedCards.length > 0 ? (
          <div className="flex flex-col gap-2">
            {savedCards.map((card) => (
              <SavedCardCard key={card.id} card={card} onDelete={deleteSavedCard} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<CreditCard size={20} className="text-gray-300" />}
            message="No saved cards"
          />
        )}
      </section>

      {/* UPI IDs */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="text-gray-500" />
            <h2 className="text-sm font-bold text-gray-700">UPI IDs</h2>
          </div>
          <button
            onClick={() => setShowAddUPI(!showAddUPI)}
            className="flex items-center gap-1 text-xs font-semibold text-brand-red hover:underline transition-colors"
          >
            <Plus size={13} /> Add UPI ID
          </button>
        </div>

        {showAddUPI && (
          <div className="bg-white rounded-xl border border-[#EBEBEB] p-4 mb-2 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Enter UPI ID (e.g. name@okaxis)"
              value={newVPA}
              onChange={(e) => { setNewVPA(e.target.value); setUpiError('') }}
              className="w-full h-10 px-3 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all"
            />
            {upiError && <p className="text-xs text-danger">{upiError}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => { setShowAddUPI(false); setNewVPA(''); setUpiError('') }}
                className="flex-1 h-9 rounded-lg border border-[#E0E0E0] text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUPI}
                className="flex-1 h-9 rounded-lg bg-brand-red text-white text-sm font-semibold hover:bg-[#A8001A] transition-colors"
              >
                Save UPI ID
              </button>
            </div>
          </div>
        )}

        {upiIds.length > 0 ? (
          <div className="flex flex-col gap-2">
            {upiIds.map((upi) => (
              <UPICard key={upi.id} upi={upi} onDelete={deleteUPIId} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Smartphone size={20} className="text-gray-300" />}
            message="No UPI IDs saved"
          />
        )}
      </section>

      {/* Info note */}
      <p className="text-xs text-gray-400 leading-relaxed border-t border-[#F0F0F0] pt-4">
        Your payment information is encrypted and securely stored. We never store CVV or full card numbers.
        Card additions are processed via Razorpay's secure vault.
      </p>
    </div>
  )
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#EBEBEB] p-6 flex flex-col items-center gap-2 text-center">
      {icon}
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  )
}
