import { algoliasearch } from 'algoliasearch'

const APP_ID     = import.meta.env.VITE_ALGOLIA_APP_ID     ?? ''
const SEARCH_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_KEY ?? ''
const INDEX_NAME = import.meta.env.VITE_ALGOLIA_INDEX_NAME ?? 'shoppersstop_products_prod'

const client = APP_ID ? algoliasearch(APP_ID, SEARCH_KEY) : null

export interface AlgoliaHit {
  objectID: string
  name: string
  brand: string
  category: string
  mrp: number
  sellingPrice: number
  discountPercent: number
  thumbnailUrl: string | null
  tags: string[]
  sizes: string[]
  colours: string[]
  inStock: boolean
  rating: { average: number }
}

export interface SearchResult {
  hits: AlgoliaHit[]
  nbHits: number
  page: number
  nbPages: number
  query: string
}

export async function searchProducts(
  query: string,
  options: {
    filters?: string
    facetFilters?: string[][]
    page?: number
    hitsPerPage?: number
  } = {},
): Promise<SearchResult> {
  if (!client) return { hits: [], nbHits: 0, page: 0, nbPages: 0, query }
  const result = await client.searchSingleIndex({
    indexName: INDEX_NAME,
    searchParams: { query, hitsPerPage: 24, page: 0, ...options },
  })
  return result as unknown as SearchResult
}

export async function getAutocompleteSuggestions(query: string): Promise<string[]> {
  if (!client || query.length < 2) return []
  const result = await client.searchSingleIndex({
    indexName: INDEX_NAME,
    searchParams: { query, hitsPerPage: 5, attributesToRetrieve: ['name', 'brand', 'category'] },
  }) as { hits: { name: string }[] }
  return result.hits.map((h) => h.name)
}
