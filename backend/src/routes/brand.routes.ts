import { Router } from 'express'
import * as ctrl from '../controllers/brand.controller'
import { verifyAdminToken, requireRole } from '../middleware/auth'

const router = Router()

router.get('/', ctrl.getBrands)
router.post('/', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.createBrand)
router.put('/:id', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.updateBrand)

export default router
