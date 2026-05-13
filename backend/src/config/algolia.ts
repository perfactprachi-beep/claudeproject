import { env } from './env'

export const PRODUCTS_INDEX = env.ALGOLIA_INDEX_NAME

export function getAlgoliaClient() {
  if (!env.ALGOLIA_APP_ID || !env.ALGOLIA_ADMIN_KEY) return null
  const { algoliasearch } = require('algoliasearch')
  return algoliasearch(env.ALGOLIA_APP_ID, env.ALGOLIA_ADMIN_KEY)
}
