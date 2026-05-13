import { Router } from 'express'
import * as ctrl from '../controllers/delivery.controller'
import { verifyAdminToken, requireRole } from '../middleware/auth'

const router = Router()

router.post('/check-pincode', ctrl.checkPincode)

export const adminDeliveryRouter = Router()
adminDeliveryRouter.post('/manifest', verifyAdminToken, requireRole('super_admin', 'order_mgr'), ctrl.createManifest)

export default router
