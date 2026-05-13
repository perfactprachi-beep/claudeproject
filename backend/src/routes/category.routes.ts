import { Router } from 'express'
import * as ctrl from '../controllers/category.controller'
import { verifyAdminToken, requireRole } from '../middleware/auth'

const router = Router()

router.get('/', ctrl.getCategories)
router.post('/', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.createCategory)
router.put('/:id', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.updateCategory)

export default router
