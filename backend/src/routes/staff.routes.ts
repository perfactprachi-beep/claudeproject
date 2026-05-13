import { Router } from 'express'
import * as ctrl from '../controllers/staff.controller'
import { verifyAdminToken, requireRole } from '../middleware/auth'

const router = Router()

router.use(verifyAdminToken, requireRole('super_admin'))

router.get('/', ctrl.getStaff)
router.post('/', ctrl.createStaff)
router.patch('/:id/role', ctrl.changeRole)
router.patch('/:id/status', ctrl.changeStatus)
router.get('/audit-log', ctrl.getAuditLog)

export const adminCustomerRouter = Router()
adminCustomerRouter.get('/', verifyAdminToken, requireRole('super_admin', 'order_mgr', 'support_agent'), ctrl.getCustomers)

export default router
