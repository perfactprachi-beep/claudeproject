import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'
import { sendSuccess } from '../utils/response'
import { searchProducts, getAutocompleteSuggestions, fullReindex } from '../services/search.service'

export async function search(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { q = '', page, hitsPerPage, ...filters } = req.query as Record<string, string>
    const result = await searchProducts(q, { page: parseInt(page ?? '0', 10), hitsPerPage: parseInt(hitsPerPage ?? '20', 10), ...filters })
    sendSuccess(res, result)
  } catch (err) {
    next(err)
  }
}

export async function suggestions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { q = '' } = req.query as { q: string }
    const results = await getAutocompleteSuggestions(q)
    sendSuccess(res, results)
  } catch (err) {
    next(err)
  }
}

export async function getSynonyms(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const synonyms = await prisma.searchSynonym.findMany()
    sendSuccess(res, synonyms)
  } catch (err) {
    next(err)
  }
}

export async function createSynonym(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { objectId, synonyms } = req.body as { objectId: string; synonyms: string[] }
    const synonym = await prisma.searchSynonym.upsert({
      where: { objectId },
      create: { objectId, synonyms },
      update: { synonyms },
    })
    sendSuccess(res, synonym, 201)
  } catch (err) {
    next(err)
  }
}

export async function reindex(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await fullReindex()
    sendSuccess(res, { reindexed: true })
  } catch (err) {
    next(err)
  }
}
