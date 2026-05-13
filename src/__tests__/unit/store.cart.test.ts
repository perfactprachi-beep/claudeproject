import { act, renderHook } from '@testing-library/react'
import { useCartStore, type CartItem } from '@store/useCartStore'

const item1: CartItem = {
  id: 'ci-1',
  productId: 'prod-1',
  brand: 'W',
  name: 'Cotton Kurta',
  image: '/img.jpg',
  size: 'M',
  price: 3999,
  quantity: 1,
}

const item2: CartItem = {
  id: 'ci-2',
  productId: 'prod-2',
  brand: 'Biba',
  name: 'Printed Saree',
  image: '/img2.jpg',
  size: 'Free Size',
  price: 5499,
  quantity: 1,
}

beforeEach(() => {
  // reset store between tests
  useCartStore.setState({ items: [] })
})

describe('useCartStore — addItem', () => {
  it('adds a new item to an empty cart', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.addItem(item1))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0]).toMatchObject({ productId: 'prod-1', quantity: 1 })
  })

  it('increments quantity when adding same product + size', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.addItem(item1))
    act(() => result.current.addItem(item1))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })

  it('adds as separate entry for same product with different size', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.addItem(item1))
    act(() => result.current.addItem({ ...item1, id: 'ci-3', size: 'L' }))
    expect(result.current.items).toHaveLength(2)
  })
})

describe('useCartStore — removeItem', () => {
  it('removes item by id', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.addItem(item1))
    act(() => result.current.addItem(item2))
    act(() => result.current.removeItem('ci-1'))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].id).toBe('ci-2')
  })

  it('no-ops when id does not exist', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.addItem(item1))
    act(() => result.current.removeItem('nonexistent'))
    expect(result.current.items).toHaveLength(1)
  })
})

describe('useCartStore — updateQuantity', () => {
  it('sets quantity to the specified value', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.addItem(item1))
    act(() => result.current.updateQuantity('ci-1', 5))
    expect(result.current.items[0].quantity).toBe(5)
  })
})

describe('useCartStore — clearCart', () => {
  it('empties all items', () => {
    const { result } = renderHook(() => useCartStore())
    act(() => result.current.addItem(item1))
    act(() => result.current.addItem(item2))
    act(() => result.current.clearCart())
    expect(result.current.items).toHaveLength(0)
  })
})
