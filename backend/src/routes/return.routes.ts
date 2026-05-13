import { Router } from 'express'
import * as ctrl from '../controllers/return.controller'
import { verifyToken, requireUser, verifyAdminToken, requireRole } from '../middleware/auth'

const router = Router()

router.post('/', verifyToken, requireUser, ctrl.submitReturn)
router.get('/', verifyToken, requireUser, ctrl.getUserReturns)

export const adminReturnRouter = Router()
adminReturnRouter.get('/', verifyAdminToken, requireRole('super_admin', 'order_mgr', 'support_agent'), ctrl.adminGetReturns)
adminReturnRouter.patch('/:id', verifyAdminToken, requireRole('super_admin', 'order_mgr'), ctrl.updateReturnStatus)

export default router
