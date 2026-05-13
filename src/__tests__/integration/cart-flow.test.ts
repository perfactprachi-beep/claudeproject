/**
 * Integration: Cart add → update quantity → remove → clear flow
 * Uses the real Zustand store without mocking.
 */
import { act, renderHook } from '@testing-library/react'
import { useCartStore } from '@store/useCartStore'
import type { CartItem } from '@store/useCartStore'

const makeItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 'ci-1',
  productId: 'prod-1',
  brand: 'W',
  name: 'Cotton Kurta',
  image: '/img.jpg',
  size: 'M',
  price: 3999,
  quantity: 1,
  ...overrides,
})

beforeEach(() => useCartStore.setState({ items: [] }))

describe('Cart full flow', () => {
  it('completes the full add → update → remove cycle', () => {
    const { result } = renderHook(() => useCartStore())

    // 1. Add two distinct items
    act(() => result.current.addItem(makeItem({ id: 'ci-1', productId: 'prod-1', size: 'M' })))
    act(() => result.current.addItem(makeItem({ id: 'ci-2', productId: 'prod-2', size: 'L', price: 5499 })))
    expect(result.current.items).toHaveLength(2)

    // 2. Add the same item again → quantity increments
    act(() => result.current.addItem(makeItem({ id: 'ci-1', productId: 'prod-1', size: 'M' })))
    expect(result.current.items.find((i) => i.id === 'ci-1')?.quantity).toBe(2)

    // 3. Manually update quantity
    act(() => result.current.updateQuantity('ci-2', 3))
    expect(result.current.items.find((i) => i.id === 'ci-2')?.quantity).toBe(3)

    // 4. Remove first item
    act(() => result.current.removeItem('ci-1'))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].id).toBe('ci-2')

    // 5. Clear cart
    act(() => result.current.clearCart())
    expect(result.current.items).toHaveLength(0)
  })

  it('correctly derives total value from items', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.addItem(makeItem({ id: 'ci-1', productId: 'p1', price: 2000, quantity: 1, size: 'S' })))
    act(() => result.current.addItem(makeItem({ id: 'ci-2', productId: 'p2', price: 3000, quantity: 2, size: 'M' })))

    const total = result.current.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    expect(total).toBe(8000) // 2000 + 3000*2
  })
})
