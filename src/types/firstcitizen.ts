import type { FCTier } from './enums'

export type PointTransactionType = 'earned' | 'redeemed' | 'expired' | 'bonus'

/** Single FC points ledger entry */
export interface PointTransaction {
  id: string
  type: PointTransactionType
  description: string
  /** Positive for earned/bonus, negative for redeemed/expired */
  points: number
  /** Running balance after this transaction */
  balance: number
  date: string
  orderId?: string
}

/** Full First Citizen loyalty account */
export interface FirstCitizenAccount {
  memberId: string
  tier: FCTier
  pointsBalance: number
  annualSpend: number
  memberSince: string
  expiryDate: string
  transactions: PointTransaction[]
  /** IDs from User.savedCards that are linked to earn FC points */
  linkedCards: string[]
}
