import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  productIds: string[]
  toggle: (productId: string) => void
  isWishlisted: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      toggle: (productId) => {
        const ids = get().productIds
        set({
          productIds: ids.includes(productId)
            ? ids.filter((id) => id !== productId)
            : [...ids, productId],
        })
      },

      isWishlisted: (productId) => get().productIds.includes(productId),
    }),
    { name: 'ss-wishlist' },
  ),
)
