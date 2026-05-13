import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Address, SavedCard, UPIId, CommunicationPrefs } from '@typedefs/user'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  addresses: Address[]
  savedCards: SavedCard[]
  upiIds: UPIId[]
  communicationPrefs: CommunicationPrefs

  login: (user: User) => void
  logout: () => void
  updateProfile: (partial: Partial<User>) => void

  addAddress: (address: Address) => void
  updateAddress: (id: string, patch: Partial<Address>) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void

  addSavedCard: (card: SavedCard) => void
  deleteSavedCard: (id: string) => void

  addUPIId: (upi: UPIId) => void
  deleteUPIId: (id: string) => void

  updateCommunicationPrefs: (prefs: Partial<CommunicationPrefs>) => void

  requestDeleteAccount: () => void
}

const DEFAULT_PREFS: CommunicationPrefs = {
  emailOffers: true,
  smsAlerts: true,
  pushNotifications: false,
}

const SEED_ADDRESSES: Address[] = [
  {
    id: 'addr-01',
    label: 'Home',
    fullName: 'Priya Sharma',
    mobile: '9876543210',
    line1: '14B, Shastri Nagar',
    line2: 'Near Metro Station',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    isDefault: true,
  },
  {
    id: 'addr-02',
    label: 'Work',
    fullName: 'Priya Sharma',
    mobile: '9876543210',
    line1: 'WeWork, Level 6, Oberoi Commerz II',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400063',
    isDefault: false,
  },
]

const SEED_CARDS: SavedCard[] = [
  {
    id: 'card-01',
    last4: '4242',
    expiry: '09/27',
    network: 'Visa',
    holderName: 'Priya Sharma',
  },
  {
    id: 'card-02',
    last4: '5678',
    expiry: '03/26',
    network: 'Mastercard',
    holderName: 'Priya Sharma',
  },
]

const SEED_UPIS: UPIId[] = [
  { id: 'upi-01', vpa: 'priya.sharma@okaxis', isDefault: true },
  { id: 'upi-02', vpa: '9876543210@paytm', isDefault: false },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      addresses: [],
      savedCards: [],
      upiIds: [],
      communicationPrefs: DEFAULT_PREFS,

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          addresses: SEED_ADDRESSES,
          savedCards: SEED_CARDS,
          upiIds: SEED_UPIS,
          communicationPrefs: DEFAULT_PREFS,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          addresses: [],
          savedCards: [],
          upiIds: [],
          communicationPrefs: DEFAULT_PREFS,
        }),

      updateProfile: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),

      addAddress: (address) =>
        set((state) => {
          const updated = address.isDefault
            ? state.addresses.map((a) => ({ ...a, isDefault: false }))
            : state.addresses
          return { addresses: [...updated, address] }
        }),

      updateAddress: (id, patch) =>
        set((state) => {
          let updated = state.addresses.map((a) =>
            a.id === id ? { ...a, ...patch } : a,
          )
          if (patch.isDefault) {
            updated = updated.map((a) => (a.id === id ? a : { ...a, isDefault: false }))
          }
          return { addresses: updated }
        }),

      deleteAddress: (id) =>
        set((state) => {
          const remaining = state.addresses.filter((a) => a.id !== id)
          if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
            remaining[0] = { ...remaining[0], isDefault: true }
          }
          return { addresses: remaining }
        }),

      setDefaultAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),

      addSavedCard: (card) =>
        set((state) => ({ savedCards: [...state.savedCards, card] })),

      deleteSavedCard: (id) =>
        set((state) => ({ savedCards: state.savedCards.filter((c) => c.id !== id) })),

      addUPIId: (upi) =>
        set((state) => {
          const updated = upi.isDefault
            ? state.upiIds.map((u) => ({ ...u, isDefault: false }))
            : state.upiIds
          return { upiIds: [...updated, upi] }
        }),

      deleteUPIId: (id) =>
        set((state) => ({ upiIds: state.upiIds.filter((u) => u.id !== id) })),

      updateCommunicationPrefs: (prefs) =>
        set((state) => ({
          communicationPrefs: { ...state.communicationPrefs, ...prefs },
        })),

      requestDeleteAccount: () => {
        get().logout()
      },
    }),
    { name: 'ss-auth' },
  ),
)
