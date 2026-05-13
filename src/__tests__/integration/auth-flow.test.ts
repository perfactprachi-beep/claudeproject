/**
 * Integration: Login → profile update → address management → logout
 */
import { act, renderHook } from '@testing-library/react'
import { useAuthStore } from '@store/useAuthStore'
import { useWishlistStore } from '@store/useWishlistStore'
import { useCartStore } from '@store/useCartStore'
import type { User } from '@typedefs/user'

const mockUser: User = {
  id: 'usr-1',
  fullName: 'Priya Sharma',
  email: 'priya@example.com',
  mobile: '9876543210',
  createdAt: '2024-01-01T00:00:00Z',
}

beforeEach(() => {
  useAuthStore.setState({
    user: null, isAuthenticated: false, addresses: [], savedCards: [],
    upiIds: [], communicationPrefs: { emailOffers: true, smsAlerts: true, pushNotifications: false },
  })
  useWishlistStore.setState({ productIds: [] })
  useCartStore.setState({ items: [] })
})

describe('Auth + account flow', () => {
  it('login seeds addresses and cards, then logout clears everything', () => {
    const { result } = renderHook(() => useAuthStore())

    act(() => result.current.login(mockUser))
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.addresses.length).toBeGreaterThan(0)
    expect(result.current.savedCards.length).toBeGreaterThan(0)

    act(() => result.current.logout())
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.addresses).toHaveLength(0)
    expect(result.current.savedCards).toHaveLength(0)
  })

  it('profile update persists all unchanged fields', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.login(mockUser))
    act(() => result.current.updateProfile({ fullName: 'Priya Kapoor', gender: 'Female' }))

    expect(result.current.user?.fullName).toBe('Priya Kapoor')
    expect(result.current.user?.email).toBe('priya@example.com') // unchanged
    expect(result.current.user?.mobile).toBe('9876543210')        // unchanged
  })

  it('setDefaultAddress updates only the targeted address', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.login(mockUser))
    // login seeds 2 addresses; addr-01 is default
    const ids = result.current.addresses.map((a) => a.id)
    const nonDefault = ids.find((id) => id !== 'addr-01')!
    act(() => result.current.setDefaultAddress(nonDefault))

    const defaults = result.current.addresses.filter((a) => a.isDefault)
    expect(defaults).toHaveLength(1)
    expect(defaults[0].id).toBe(nonDefault)
  })

  it('communication prefs can be partially updated', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.login(mockUser))
    act(() => result.current.updateCommunicationPrefs({ pushNotifications: true }))

    expect(result.current.communicationPrefs.pushNotifications).toBe(true)
    expect(result.current.communicationPrefs.emailOffers).toBe(true) // unchanged
  })
})
