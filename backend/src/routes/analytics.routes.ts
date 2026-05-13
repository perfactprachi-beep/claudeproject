import { Router } from 'express'
import * as ctrl from '../controllers/analytics.controller'
import { verifyAdminToken, requireRole } from '../middleware/auth'

const router = Router()

router.use(verifyAdminToken, requireRole('super_admin'))

router.get('/revenue', ctrl.revenueAnalytics)
router.get('/orders', ctrl.orderAnalytics)
router.get('/customers', ctrl.customerAnalytics)
router.get('/products', ctrl.productAnalytics)
router.get('/search', ctrl.searchAnalytics)

export default router
