import { act, renderHook } from '@testing-library/react'
import { useAuthStore } from '@store/useAuthStore'
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
    user: null,
    isAuthenticated: false,
    addresses: [],
    savedCards: [],
    upiIds: [],
    communicationPrefs: { emailOffers: true, smsAlerts: true, pushNotifications: false },
  })
})

describe('useAuthStore — login / logout', () => {
  it('sets user and isAuthenticated on login', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.login(mockUser))
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user?.fullName).toBe('Priya Sharma')
  })

  it('seeds addresses and cards on login', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.login(mockUser))
    expect(result.current.addresses.length).toBeGreaterThan(0)
    expect(result.current.savedCards.length).toBeGreaterThan(0)
  })

  it('clears all state on logout', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.login(mockUser))
    act(() => result.current.logout())
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.addresses).toHaveLength(0)
  })
})

describe('useAuthStore — updateProfile', () => {
  it('merges partial updates into the user object', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.login(mockUser))
    act(() => result.current.updateProfile({ fullName: 'Priya Kapoor' }))
    expect(result.current.user?.fullName).toBe('Priya Kapoor')
    expect(result.current.user?.email).toBe('priya@example.com')
  })

  it('does nothing when user is null', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.updateProfile({ fullName: 'Ghost' }))
    expect(result.current.user).toBeNull()
  })
})

describe('useAuthStore — address management', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: mockUser, isAuthenticated: true, addresses: [] })
  })

  it('adds a new address', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.addAddress({
      id: 'addr-new', label: 'Home', fullName: 'Priya', mobile: '9876543210',
      line1: '1 Main St', city: 'Mumbai', state: 'MH', pincode: '400001', isDefault: false,
    }))
    expect(result.current.addresses).toHaveLength(1)
  })

  it('marks all others as non-default when adding a default address', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.addAddress({
      id: 'addr-1', label: 'Home', fullName: 'Priya', mobile: '9876543210',
      line1: '1 Main', city: 'Mumbai', state: 'MH', pincode: '400001', isDefault: true,
    }))
    act(() => result.current.addAddress({
      id: 'addr-2', label: 'Work', fullName: 'Priya', mobile: '9876543210',
      line1: '2 Office', city: 'Mumbai', state: 'MH', pincode: '400002', isDefault: true,
    }))
    const defaults = result.current.addresses.filter((a) => a.isDefault)
    expect(defaults).toHaveLength(1)
    expect(defaults[0].id).toBe('addr-2')
  })

  it('deletes an address by id', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.addAddress({
      id: 'addr-del', label: 'Home', fullName: 'Priya', mobile: '9876543210',
      line1: '1 Main', city: 'Mumbai', state: 'MH', pincode: '400001', isDefault: false,
    }))
    act(() => result.current.deleteAddress('addr-del'))
    expect(result.current.addresses).toHaveLength(0)
  })
})
