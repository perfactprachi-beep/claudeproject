import { Router } from 'express'
import * as ctrl from '../controllers/order.controller'
import { verifyToken, requireUser, verifyAdminToken, requireRole } from '../middleware/auth'

const router = Router()

// User routes
router.post('/', verifyToken, requireUser, ctrl.placeOrder)
router.get('/', verifyToken, requireUser, ctrl.getUserOrders)
router.get('/:orderId', verifyToken, requireUser, ctrl.getOrder)
router.post('/:orderId/cancel', verifyToken, requireUser, ctrl.cancelOrder)

// Admin routes (mounted separately in app)
export const adminOrderRouter = Router()
adminOrderRouter.get('/', verifyAdminToken, requireRole('super_admin', 'order_mgr', 'support_agent'), ctrl.adminGetOrders)
adminOrderRouter.patch('/:orderId/status', verifyAdminToken, requireRole('super_admin', 'order_mgr'), ctrl.updateOrderStatus)
adminOrderRouter.post('/:orderId/note', verifyAdminToken, requireRole('super_admin', 'order_mgr', 'support_agent'), ctrl.addOrderNote)

export default router
