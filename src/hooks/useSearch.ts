import { useState, useEffect, useMemo } from 'react'
import {
  getSuggestions,
  getCategoryShortcuts,
  SPELL_CORRECTIONS,
  DID_YOU_MEAN,
  type CategoryShortcut,
} from '@data/search'

interface UseSearchResult {
  debouncedQuery: string
  suggestions: string[]
  categoryShortcuts: CategoryShortcut[]
  spellCorrection: string | null
  didYouMean: string | null
}

export function useSearch(query: string, debounceMs = 200): UseSearchResult {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), debounceMs)
    return () => clearTimeout(t)
  }, [query, debounceMs])

  const lower          = debouncedQuery.toLowerCase().trim()
  const spellCorrection = useMemo(() => SPELL_CORRECTIONS[lower] ?? null, [lower])
  const didYouMean      = useMemo(() => DID_YOU_MEAN[lower] ?? null, [lower])
  const suggestions     = useMemo(() => getSuggestions(debouncedQuery), [debouncedQuery])
  const categoryShortcuts = useMemo(() => getCategoryShortcuts(debouncedQuery), [debouncedQuery])

  return { debouncedQuery, suggestions, categoryShortcuts, spellCorrection, didYouMean }
}
