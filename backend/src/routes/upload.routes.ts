import { Router } from 'express'
import { verifyAdminToken } from '../middleware/auth'
import { getPresignedUploadUrl } from '../controllers/upload.controller'

const router = Router()

router.post('/presigned-url', verifyAdminToken, getPresignedUploadUrl)

export default router
