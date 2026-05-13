import { Router } from 'express'
import * as ctrl from '../controllers/cms.controller'
import { verifyAdminToken, requireRole } from '../middleware/auth'

const router = Router()

router.get('/banners', ctrl.getActiveBanners)

export const adminCmsRouter = Router()
adminCmsRouter.get('/banners', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.adminListBanners)
adminCmsRouter.post('/banners', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.adminCreateBanner)
adminCmsRouter.put('/banners/:id', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.adminUpdateBanner)
adminCmsRouter.delete('/banners/:id', verifyAdminToken, requireRole('super_admin', 'catalogue_mgr'), ctrl.adminDeleteBanner)

export default router
