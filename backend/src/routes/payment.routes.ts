import { Router } from 'express'
import * as ctrl from '../controllers/payment.controller'
import { verifyToken, requireUser, verifyAdminToken, requireRole } from '../middleware/auth'
import { paymentLimiter } from '../middleware/rateLimit'
import express from 'express'

const router = Router()

router.post('/create-order', verifyToken, requireUser, paymentLimiter, ctrl.createOrder)
router.post('/verify', verifyToken, requireUser, ctrl.verifyPayment)

// Raw body needed for Razorpay signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), ctrl.webhook)

export const adminPaymentRouter = Router()
adminPaymentRouter.post('/refund', verifyAdminToken, requireRole('super_admin', 'order_mgr'), ctrl.adminRefund)

export default router
