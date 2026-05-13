import { Router } from 'express'
import * as ctrl from '../controllers/inventory.controller'
import { verifyAdminToken, requireRole } from '../middleware/auth'
import { csvUpload } from '../middleware/upload'

const router = Router()

router.get('/', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr', 'order_mgr'), ctrl.getInventory)
router.patch('/:skuId', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.updateStock)
router.post('/import', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), csvUpload.single('file'), ctrl.bulkImportStock)

export default router
