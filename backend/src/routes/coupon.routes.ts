import { Router } from 'express'
import * as ctrl from '../controllers/coupon.controller'
import { verifyAdminToken, requireRole } from '../middleware/auth'

const router = Router()

router.post('/validate', ctrl.validate)

export const adminCouponRouter = Router()
adminCouponRouter.get('/', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr', 'order_mgr'), ctrl.adminListCoupons)
adminCouponRouter.post('/', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.adminCreateCoupon)
adminCouponRouter.put('/:id', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.adminUpdateCoupon)
adminCouponRouter.patch('/:id/toggle', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.adminToggleCoupon)

export default router
