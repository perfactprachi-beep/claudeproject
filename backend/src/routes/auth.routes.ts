import { Router } from 'express'
import * as ctrl from '../controllers/auth.controller'
import { authLimiter } from '../middleware/rateLimit'

const router = Router()

router.post('/verify-token', authLimiter, ctrl.verifyToken)
router.post('/register', authLimiter, ctrl.register)
router.post('/admin/login', authLimiter, ctrl.adminLogin)

export default router
