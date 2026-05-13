import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchStore {
  recentSearches: string[]
  addRecentSearch: (query: string) => void
  removeRecentSearch: (query: string) => void
  clearAll: () => void
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      recentSearches: [],

      addRecentSearch: (query) =>
        set((s) => ({
          recentSearches: [
            query.trim(),
            ...s.recentSearches.filter((q) => q !== query.trim()),
          ].slice(0, 8),
        })),

      removeRecentSearch: (query) =>
        set((s) => ({ recentSearches: s.recentSearches.filter((q) => q !== query) })),

      clearAll: () => set({ recentSearches: [] }),
    }),
    { name: 'ss-recent-searches' },
  ),
)
