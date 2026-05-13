import { Router } from 'express'
import * as ctrl from '../controllers/cart.controller'
import { verifyToken } from '../middleware/auth'

const router = Router()

// Cart works for both authenticated and guest (session-based)
router.get('/', verifyToken, ctrl.getCart)
router.post('/items', verifyToken, ctrl.addItem)
router.patch('/items/:itemId', verifyToken, ctrl.updateItem)
router.delete('/items/:itemId', verifyToken, ctrl.removeItem)
router.post('/coupon', verifyToken, ctrl.applyCoupon)
router.delete('/coupon', verifyToken, ctrl.removeCoupon)
router.post('/fc-points', verifyToken, ctrl.toggleFcPoints)

export default router
