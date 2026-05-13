import { Router } from 'express'
import * as ctrl from '../controllers/user.controller'
import { verifyToken, requireUser } from '../middleware/auth'

const router = Router()

router.use(verifyToken, requireUser)

router.get('/profile', ctrl.getProfile)
router.patch('/profile', ctrl.updateProfile)
router.get('/addresses', ctrl.getAddresses)
router.post('/addresses', ctrl.addAddress)
router.patch('/addresses/:id', ctrl.updateAddress)
router.delete('/addresses/:id', ctrl.deleteAddress)
router.get('/wishlist', ctrl.getWishlist)
router.post('/wishlist/:productId', ctrl.addToWishlist)
router.delete('/wishlist/:productId', ctrl.removeFromWishlist)

export default router
