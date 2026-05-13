import { Router } from 'express'
import * as ctrl from '../controllers/product.controller'
import * as reviewCtrl from '../controllers/review.controller'
import { verifyAdminToken, requireRole } from '../middleware/auth'
import { csvUpload } from '../middleware/upload'

const router = Router()

// Public
router.get('/', ctrl.listProducts)
router.get('/:id', ctrl.getProduct)
router.get('/:id/reviews', reviewCtrl.getProductReviews)

// Auth required for review submission
import { verifyToken, requireUser } from '../middleware/auth'
router.post('/:id/reviews', verifyToken, requireUser, reviewCtrl.submitReview)

// Admin
router.post('/', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.createProduct)
router.put('/:id', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.updateProduct)
router.delete('/:id', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.deleteProduct)
router.post('/bulk', verifyAdminToken, requireRole('super_admin'), csvUpload.single('file'), ctrl.bulkImportProducts)
router.post('/:id/reviews/:reviewId/approve', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), reviewCtrl.approveReview)
router.delete('/:id/reviews/:reviewId', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), reviewCtrl.deleteReview)

export default router
