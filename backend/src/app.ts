import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/env'
import { defaultLimiter } from './middleware/rateLimit'
import { errorHandler, notFound } from './middleware/errorHandler'
import { logger } from './utils/logger'
import { openApiSpec } from './docs/openapi'

// Routes
import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import categoryRoutes from './routes/category.routes'
import brandRoutes from './routes/brand.routes'
import inventoryRoutes from './routes/inventory.routes'
import cartRoutes from './routes/cart.routes'
import orderRoutes, { adminOrderRouter } from './routes/order.routes'
import paymentRoutes, { adminPaymentRouter } from './routes/payment.routes'
import returnRoutes, { adminReturnRouter } from './routes/return.routes'
import userRoutes from './routes/user.routes'
import fcRoutes, { adminFcRouter } from './routes/fc.routes'
import searchRoutes, { adminSearchRouter } from './routes/search.routes'
import couponRoutes, { adminCouponRouter } from './routes/coupon.routes'
import cmsRoutes, { adminCmsRouter } from './routes/cms.routes'
import deliveryRoutes, { adminDeliveryRouter } from './routes/delivery.routes'
import analyticsRoutes from './routes/analytics.routes'
import staffRoutes, { adminCustomerRouter } from './routes/staff.routes'
import uploadRoutes from './routes/upload.routes'

const app = express()

// Security & parsing
app.use(helmet())
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
app.use(compression())
app.use(morgan(env.isDev ? 'dev' : 'combined', { stream: { write: (msg) => logger.info(msg.trim()) } }))

// JSON body — skip for Razorpay webhook (needs raw body)
app.use((req, res, next) => {
  if (req.path === '/api/payments/webhook') return next()
  express.json({ limit: '10mb' })(req, res, next)
})
app.use(express.urlencoded({ extended: true }))

// Global rate limiter
app.use(defaultLimiter)

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

// Swagger UI — http://localhost:4000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customSiteTitle: 'Shoppers Stop API Docs',
  customCss: '.swagger-ui .topbar { background-color: #C0001D; } .swagger-ui .topbar-wrapper img { display: none; } .swagger-ui .topbar-wrapper::before { content: "Shoppers Stop API"; color: white; font-size: 1.2rem; font-weight: bold; }',
  swaggerOptions: { persistAuthorization: true, displayRequestDuration: true, filter: true },
}))

// ── Public / User API ──────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/products',  productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/brands',    brandRoutes)
app.use('/api/cart',      cartRoutes)
app.use('/api/orders',    orderRoutes)
app.use('/api/payments',  paymentRoutes)
app.use('/api/returns',   returnRoutes)
app.use('/api/user',      userRoutes)
app.use('/api/fc',        fcRoutes)
app.use('/api/search',    searchRoutes)
app.use('/api/coupons',   couponRoutes)
app.use('/api/cms',       cmsRoutes)
app.use('/api/delivery',  deliveryRoutes)

// ── Admin API ─────────────────────────────────────────────────────────────
app.use('/api/admin/products',   productRoutes)
app.use('/api/admin/categories', categoryRoutes)
app.use('/api/admin/brands',     brandRoutes)
app.use('/api/admin/inventory',  inventoryRoutes)
app.use('/api/admin/orders',     adminOrderRouter)
app.use('/api/admin/payments',   adminPaymentRouter)
app.use('/api/admin/returns',    adminReturnRouter)
app.use('/api/admin/fc',         adminFcRouter)
app.use('/api/admin/search',     adminSearchRouter)
app.use('/api/admin/coupons',    adminCouponRouter)
app.use('/api/admin/cms',        adminCmsRouter)
app.use('/api/admin/delivery',   adminDeliveryRouter)
app.use('/api/admin/analytics',  analyticsRoutes)
app.use('/api/admin/staff',      staffRoutes)
app.use('/api/admin/customers',  adminCustomerRouter)
app.use('/api/admin/upload',     uploadRoutes)

// 404 & error handlers
app.use(notFound)
app.use(errorHandler)

export default app
