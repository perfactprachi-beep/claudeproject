import { Router } from 'express'
import * as ctrl from '../controllers/search.controller'
import { verifyAdminToken, requireRole } from '../middleware/auth'

const router = Router()

router.get('/', ctrl.search)
router.get('/suggestions', ctrl.suggestions)

export const adminSearchRouter = Router()
adminSearchRouter.get('/synonyms', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.getSynonyms)
adminSearchRouter.post('/synonyms', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.createSynonym)
adminSearchRouter.post('/reindex', verifyAdminToken, requireRole('super_admin'), ctrl.reindex)

export default router
