import { algoliasearch } from 'algoliasearch'
import { env } from './env'

export const algoliaClient = algoliasearch(env.ALGOLIA_APP_ID, env.ALGOLIA_ADMIN_KEY)
export const PRODUCTS_INDEX = env.ALGOLIA_INDEX_NAME
