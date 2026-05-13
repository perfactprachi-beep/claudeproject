import { Router } from 'express'
import * as ctrl from '../controllers/fc.controller'
import { verifyToken, requireUser, verifyAdminToken, requireRole } from '../middleware/auth'

const router = Router()

router.get('/account', verifyToken, requireUser, ctrl.getAccount)
router.get('/transactions', verifyToken, requireUser, ctrl.getTransactions)

export const adminFcRouter = Router()
adminFcRouter.post('/adjust-points', verifyAdminToken, requireRole('super_admin'), ctrl.adminAdjustPoints)
adminFcRouter.post('/bulk-award', verifyAdminToken, requireRole('super_admin'), ctrl.adminBulkAward)
adminFcRouter.patch('/tier-rules', verifyAdminToken, requireRole('super_admin'), ctrl.updateTierRules)

export default router
