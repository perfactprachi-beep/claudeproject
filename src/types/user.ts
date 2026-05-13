export interface User {
  id: string
  fullName: string
  email: string
  mobile: string
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say'
  birthday?: string
  avatarUrl?: string
  firstCitizenId?: string
  createdAt: string
}

export interface Address {
  id: string
  label: 'Home' | 'Work' | 'Other'
  fullName: string
  mobile: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export interface SavedCard {
  id: string
  last4: string
  expiry: string
  network: 'Visa' | 'Mastercard' | 'Amex' | 'RuPay'
  holderName: string
}

export interface UPIId {
  id: string
  vpa: string
  isDefault: boolean
}

export interface CommunicationPrefs {
  emailOffers: boolean
  smsAlerts: boolean
  pushNotifications: boolean
}
