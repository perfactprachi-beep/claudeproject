import { act, renderHook } from '@testing-library/react'
import { useWishlistStore } from '@store/useWishlistStore'

beforeEach(() => {
  useWishlistStore.setState({ productIds: [] })
})

describe('useWishlistStore — toggle', () => {
  it('adds a product when not in wishlist', () => {
    const { result } = renderHook(() => useWishlistStore())
    act(() => result.current.toggle('prod-1'))
    expect(result.current.productIds).toContain('prod-1')
  })

  it('removes a product when already wishlisted', () => {
    const { result } = renderHook(() => useWishlistStore())
    act(() => result.current.toggle('prod-1'))
    act(() => result.current.toggle('prod-1'))
    expect(result.current.productIds).not.toContain('prod-1')
  })

  it('does not affect other wishlisted products when toggling one', () => {
    const { result } = renderHook(() => useWishlistStore())
    act(() => result.current.toggle('prod-1'))
    act(() => result.current.toggle('prod-2'))
    act(() => result.current.toggle('prod-1'))
    expect(result.current.productIds).toContain('prod-2')
    expect(result.current.productIds).not.toContain('prod-1')
  })
})

describe('useWishlistStore — isWishlisted', () => {
  it('returns true for a wishlisted product', () => {
    const { result } = renderHook(() => useWishlistStore())
    act(() => result.current.toggle('prod-99'))
    expect(result.current.isWishlisted('prod-99')).toBe(true)
  })

  it('returns false for a product not in wishlist', () => {
    const { result } = renderHook(() => useWishlistStore())
    expect(result.current.isWishlisted('prod-99')).toBe(false)
  })
})
