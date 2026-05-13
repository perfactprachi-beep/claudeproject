export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Shoppers Stop MVP — REST API',
    version: '1.0.0',
    description: `
## Shoppers Stop Backend API

Complete REST API for Shoppers Stop MVP covering storefront and admin operations.

### Authentication
- **Storefront routes** (\`/api/user/*\`, \`/api/orders\`, \`/api/cart\`, \`/api/fc\`, \`/api/returns\`): require \`Authorization: Bearer <firebase-id-token>\`
- **Admin routes** (\`/api/admin/*\`): require \`Authorization: Bearer <firebase-id-token>\` with staff role claim

### Dev Bypass Mode (when Firebase is not configured)
Pass any token: \`Authorization: Bearer devtoken\`
For admin role: add header \`x-dev-role: super_admin\` (or \`catalogue_mgr\`, \`order_mgr\`, \`support_agent\`)

### Standard Response Envelope
\`\`\`json
{ "success": true, "data": { ... }, "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 } }
\`\`\`
### Error Envelope
\`\`\`json
{ "success": false, "error": { "code": "PRODUCT_NOT_FOUND", "message": "...", "statusCode": 404 } }
\`\`\`
    `,
    contact: { name: 'Shoppers Stop Dev Team', email: 'dev@shoppersstop.com' },
  },
  servers: [
    { url: 'http://localhost:4000', description: 'Local Dev' },
    { url: 'https://api.shoppersstop.com', description: 'Production' },
  ],
  tags: [
    { name: 'Health', description: 'Server health check' },
    { name: 'Auth', description: 'Firebase token verification and user registration' },
    { name: 'Products', description: 'Product listing, detail, and admin CRUD' },
    { name: 'Categories', description: 'Category tree management' },
    { name: 'Brands', description: 'Brand management' },
    { name: 'Inventory', description: 'Stock level management (admin)' },
    { name: 'Cart', description: 'Shopping cart operations' },
    { name: 'Orders', description: 'Order placement and history' },
    { name: 'Payments', description: 'Razorpay payment flow' },
    { name: 'Returns', description: 'Return request management' },
    { name: 'User', description: 'Profile, addresses and wishlist' },
    { name: 'First Citizen', description: 'FC loyalty account and points' },
    { name: 'Search', description: 'Product search and autocomplete (Algolia)' },
    { name: 'Coupons', description: 'Coupon validation and admin management' },
    { name: 'Reviews', description: 'Product reviews' },
    { name: 'Banners / CMS', description: 'Banner and CMS management' },
    { name: 'Delivery', description: 'Pincode serviceability and Shiprocket' },
    { name: 'Analytics', description: 'Revenue and business analytics (super_admin only)' },
    { name: 'Staff', description: 'Staff account and role management (super_admin only)' },
    { name: 'Customers', description: 'Customer management (admin)' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'Firebase ID Token' },
      DevRole: { type: 'apiKey', in: 'header', name: 'x-dev-role', description: 'Dev bypass only: super_admin | catalogue_mgr | order_mgr | support_agent' },
    },
    schemas: {
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'integer' }, limit: { type: 'integer' },
              total: { type: 'integer' }, totalPages: { type: 'integer' },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'PRODUCT_NOT_FOUND' },
              message: { type: 'string', example: 'Product does not exist.' },
              statusCode: { type: 'integer', example: 404 },
            },
          },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string' }, name: { type: 'string' }, slug: { type: 'string' },
          description: { type: 'string' }, mrp: { type: 'number' }, sellingPrice: { type: 'number' },
          thumbnailUrl: { type: 'string' }, status: { type: 'string', enum: ['active', 'draft', 'out_of_stock', 'deleted'] },
          brand: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } },
          category: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } },
          variants: { type: 'array', items: { $ref: '#/components/schemas/ProductVariant' } },
        },
      },
      ProductVariant: {
        type: 'object',
        properties: {
          id: { type: 'string' }, sku: { type: 'string' }, size: { type: 'string' },
          colour: { type: 'string' }, stock: { type: 'integer' }, status: { type: 'string' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string' }, status: { type: 'string' }, total: { type: 'number' },
          paymentStatus: { type: 'string' }, createdAt: { type: 'string', format: 'date-time' },
          items: { type: 'array', items: { type: 'object' } },
        },
      },
      Cart: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          items: { type: 'array', items: { type: 'object' } },
          fcPointsApplied: { type: 'integer' },
          coupon: { type: 'object' },
        },
      },
      FCAccount: {
        type: 'object',
        properties: {
          id: { type: 'string' }, cardNumber: { type: 'string' },
          tier: { type: 'string', enum: ['classic', 'silver', 'gold', 'platinum'] },
          pointsBalance: { type: 'integer' }, annualSpend: { type: 'number' },
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
  paths: {
    // ── HEALTH ──────────────────────────────────────────────────
    '/health': {
      get: {
        tags: ['Health'], summary: 'Health check', security: [],
        responses: { 200: { description: 'Server is up', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' }, ts: { type: 'string' } } } } } } },
      },
    },

    // ── AUTH ────────────────────────────────────────────────────
    '/api/auth/verify-token': {
      post: {
        tags: ['Auth'], summary: 'Verify Firebase token and get user profile', security: [],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['token'], properties: { token: { type: 'string' } } } } } },
        responses: { 200: { description: 'User profile with FC data' } },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'], summary: 'Register new user after Firebase signup', security: [],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['firebaseUid', 'name', 'email'], properties: { firebaseUid: { type: 'string' }, name: { type: 'string' }, email: { type: 'string' }, mobile: { type: 'string' }, gender: { type: 'string' }, birthday: { type: 'string', format: 'date' } } } } } },
        responses: { 201: { description: 'User created' } },
      },
    },
    '/api/auth/admin/login': {
      post: {
        tags: ['Auth'], summary: 'Admin login (use Firebase client SDK then pass ID token)', security: [],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } } } },
        responses: { 200: { description: 'Login instructions' } },
      },
    },

    // ── PRODUCTS ────────────────────────────────────────────────
    '/api/products': {
      get: {
        tags: ['Products'], summary: 'List products with filters', security: [],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Category slug' },
          { name: 'brand', in: 'query', schema: { type: 'string' }, description: 'Brand slug' },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'size', in: 'query', schema: { type: 'string' } },
          { name: 'colour', in: 'query', schema: { type: 'string' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['price_asc', 'price_desc', 'newest', 'featured'] } },
          { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search query' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { 200: { description: 'Paginated product list' } },
      },
      post: {
        tags: ['Products'], summary: 'Create product [catalogue_mgr+]',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name', 'brandId', 'categoryId', 'mrp', 'sellingPrice'], properties: { name: { type: 'string' }, brandId: { type: 'string' }, categoryId: { type: 'string' }, mrp: { type: 'number' }, sellingPrice: { type: 'number' }, description: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, variants: { type: 'array', items: { type: 'object', properties: { sku: { type: 'string' }, size: { type: 'string' }, colour: { type: 'string' }, stock: { type: 'integer' } } } } } } } } },
        responses: { 201: { description: 'Product created' } },
      },
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'], summary: 'Product detail with variants and reviews', security: [],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Product detail' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Products'], summary: 'Update product [catalogue_mgr+]',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Products'], summary: 'Soft delete product [catalogue_mgr+]',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },
    '/api/products/bulk': {
      post: {
        tags: ['Products'], summary: 'Bulk CSV import [super_admin]',
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: { description: 'Import result with count' } },
      },
    },
    '/api/products/{id}/reviews': {
      get: {
        tags: ['Reviews'], summary: 'Get product reviews (paginated)', security: [],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }],
        responses: { 200: { description: 'Reviews list' } },
      },
      post: {
        tags: ['Reviews'], summary: 'Submit review (requires verified purchase)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['rating', 'body'], properties: { rating: { type: 'integer', minimum: 1, maximum: 5 }, title: { type: 'string' }, body: { type: 'string' } } } } } },
        responses: { 201: { description: 'Review submitted (pending approval)' } },
      },
    },

    // ── CATEGORIES ──────────────────────────────────────────────
    '/api/categories': {
      get: {
        tags: ['Categories'], summary: 'Full category tree', security: [],
        responses: { 200: { description: 'Nested category list' } },
      },
      post: {
        tags: ['Categories'], summary: 'Create category [catalogue_mgr+]',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, parentId: { type: 'string' }, imageUrl: { type: 'string' }, sortOrder: { type: 'integer' } } } } } },
        responses: { 201: { description: 'Category created' } },
      },
    },
    '/api/categories/{id}': {
      put: {
        tags: ['Categories'], summary: 'Update category [catalogue_mgr+]',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Updated' } },
      },
    },

    // ── BRANDS ──────────────────────────────────────────────────
    '/api/brands': {
      get: {
        tags: ['Brands'], summary: 'All brands with product counts', security: [],
        responses: { 200: { description: 'Brand list' } },
      },
      post: {
        tags: ['Brands'], summary: 'Create brand [catalogue_mgr+]',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, logoUrl: { type: 'string' } } } } } },
        responses: { 201: { description: 'Brand created' } },
      },
    },
    '/api/brands/{id}': {
      put: {
        tags: ['Brands'], summary: 'Update brand [catalogue_mgr+]',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Updated' } },
      },
    },

    // ── INVENTORY ────────────────────────────────────────────────
    '/api/admin/inventory': {
      get: {
        tags: ['Inventory'], summary: 'Stock levels with filters [catalogue_mgr+]',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['healthy', 'low', 'out_of_stock'] } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'brand', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'Inventory list' } },
      },
    },
    '/api/admin/inventory/{skuId}': {
      patch: {
        tags: ['Inventory'], summary: 'Update stock for a SKU [catalogue_mgr+]',
        parameters: [{ name: 'skuId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['stock'], properties: { stock: { type: 'integer' }, reorderLevel: { type: 'integer' } } } } } },
        responses: { 200: { description: 'Stock updated' } },
      },
    },
    '/api/admin/inventory/import': {
      post: {
        tags: ['Inventory'], summary: 'Bulk CSV stock update [catalogue_mgr+]',
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: { description: 'Rows updated count' } },
      },
    },

    // ── CART ────────────────────────────────────────────────────
    '/api/cart': {
      get: {
        tags: ['Cart'], summary: 'Get cart with totals',
        responses: { 200: { description: 'Cart object with calculated totals' } },
      },
    },
    '/api/cart/items': {
      post: {
        tags: ['Cart'], summary: 'Add item to cart',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['productId', 'variantId'], properties: { productId: { type: 'string' }, variantId: { type: 'string' }, quantity: { type: 'integer', default: 1 } } } } } },
        responses: { 200: { description: 'Item added' } },
      },
    },
    '/api/cart/items/{itemId}': {
      patch: {
        tags: ['Cart'], summary: 'Update item quantity (0 = remove)',
        parameters: [{ name: 'itemId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['quantity'], properties: { quantity: { type: 'integer' } } } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Cart'], summary: 'Remove item from cart',
        parameters: [{ name: 'itemId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Removed' } },
      },
    },
    '/api/cart/coupon': {
      post: {
        tags: ['Cart'], summary: 'Apply coupon code',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['code'], properties: { code: { type: 'string', example: 'WELCOME200' } } } } } },
        responses: { 200: { description: 'Coupon applied with discount amount' } },
      },
      delete: {
        tags: ['Cart'], summary: 'Remove applied coupon',
        responses: { 200: { description: 'Coupon removed' } },
      },
    },
    '/api/cart/fc-points': {
      post: {
        tags: ['Cart'], summary: 'Toggle FC points redemption',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['apply'], properties: { apply: { type: 'boolean' } } } } } },
        responses: { 200: { description: 'Points applied/removed with discount amount' } },
      },
    },

    // ── ORDERS ──────────────────────────────────────────────────
    '/api/orders': {
      post: {
        tags: ['Orders'], summary: 'Place order (validates stock, deducts inventory, creates Razorpay order)',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['addressId', 'paymentMethod'], properties: { addressId: { type: 'string' }, paymentMethod: { type: 'string', enum: ['razorpay_card', 'razorpay_upi', 'razorpay_netbanking', 'cod'] } } } } } },
        responses: { 201: { description: 'Order created with Razorpay order details' } },
      },
      get: {
        tags: ['Orders'], summary: 'User order history (paginated)',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }],
        responses: { 200: { description: 'Paginated orders' } },
      },
    },
    '/api/orders/{orderId}': {
      get: {
        tags: ['Orders'], summary: 'Order detail',
        parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Order with items and address' } },
      },
    },
    '/api/orders/{orderId}/cancel': {
      post: {
        tags: ['Orders'], summary: 'Cancel order (status must be pending or confirmed)',
        parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Cancelled' }, 409: { description: 'ORDER_NOT_CANCELLABLE' } },
      },
    },
    '/api/admin/orders': {
      get: {
        tags: ['Orders'], summary: 'All orders with filters [order_mgr+]',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Order ID or customer name' },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'Paginated orders' } },
      },
    },
    '/api/admin/orders/{orderId}/status': {
      patch: {
        tags: ['Orders'], summary: 'Update order status [order_mgr+]',
        parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] }, trackingNumber: { type: 'string' }, courier: { type: 'string' } } } } } },
        responses: { 200: { description: 'Updated' } },
      },
    },
    '/api/admin/orders/{orderId}/note': {
      post: {
        tags: ['Orders'], summary: 'Add internal note to order [order_mgr+]',
        parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['note'], properties: { note: { type: 'string' } } } } } },
        responses: { 200: { description: 'Note added' } },
      },
    },

    // ── PAYMENTS ────────────────────────────────────────────────
    '/api/payments/create-order': {
      post: {
        tags: ['Payments'], summary: 'Create Razorpay order',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['amount', 'receipt'], properties: { amount: { type: 'number', description: 'Amount in INR' }, receipt: { type: 'string' } } } } } },
        responses: { 200: { description: 'Razorpay order ID and key' } },
      },
    },
    '/api/payments/verify': {
      post: {
        tags: ['Payments'], summary: 'Verify Razorpay payment signature',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['razorpayOrderId', 'razorpayPaymentId', 'razorpaySignature', 'orderId'], properties: { razorpayOrderId: { type: 'string' }, razorpayPaymentId: { type: 'string' }, razorpaySignature: { type: 'string' }, orderId: { type: 'string' } } } } } },
        responses: { 200: { description: 'Verified' }, 400: { description: 'PAYMENT_VERIFICATION_FAILED' } },
      },
    },
    '/api/payments/webhook': {
      post: {
        tags: ['Payments'], summary: 'Razorpay webhook handler', security: [],
        description: 'Razorpay will POST events here. Requires raw body for signature verification.',
        responses: { 200: { description: 'Received' } },
      },
    },
    '/api/admin/payments/refund': {
      post: {
        tags: ['Payments'], summary: 'Initiate refund [order_mgr+]',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['orderId', 'amount'], properties: { orderId: { type: 'string' }, amount: { type: 'number' } } } } } },
        responses: { 200: { description: 'Refund ID returned' } },
      },
    },

    // ── RETURNS ─────────────────────────────────────────────────
    '/api/returns': {
      post: {
        tags: ['Returns'], summary: 'Submit return request (30-day window)',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['orderId', 'productName', 'reason', 'refundAmount'], properties: { orderId: { type: 'string' }, productName: { type: 'string' }, reason: { type: 'string' }, customerNote: { type: 'string' }, refundAmount: { type: 'number' }, refundMethod: { type: 'string', enum: ['original', 'store_credit', 'fc_points'] } } } } } },
        responses: { 201: { description: 'Return request created' }, 400: { description: 'RETURN_WINDOW_EXPIRED' } },
      },
      get: {
        tags: ['Returns'], summary: 'User return requests',
        responses: { 200: { description: 'Returns list' } },
      },
    },
    '/api/admin/returns': {
      get: {
        tags: ['Returns'], summary: 'All return requests [order_mgr+]',
        parameters: [{ name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'approved', 'rejected'] } }],
        responses: { 200: { description: 'Returns list' } },
      },
    },
    '/api/admin/returns/{id}': {
      patch: {
        tags: ['Returns'], summary: 'Approve or reject return [order_mgr+]',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['approved', 'rejected'] }, rejectionNote: { type: 'string' }, refundMethod: { type: 'string', enum: ['original', 'store_credit', 'fc_points'] } } } } } },
        responses: { 200: { description: 'Updated' } },
      },
    },

    // ── USER ────────────────────────────────────────────────────
    '/api/user/profile': {
      get: { tags: ['User'], summary: 'Get user profile', responses: { 200: { description: 'Profile' } } },
      patch: {
        tags: ['User'], summary: 'Update profile',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, mobile: { type: 'string' }, gender: { type: 'string' }, birthday: { type: 'string', format: 'date' } } } } } },
        responses: { 200: { description: 'Updated profile' } },
      },
    },
    '/api/user/addresses': {
      get: { tags: ['User'], summary: 'List addresses', responses: { 200: { description: 'Address list' } } },
      post: {
        tags: ['User'], summary: 'Add new address',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['fullName', 'mobile', 'line1', 'city', 'state', 'pincode'], properties: { label: { type: 'string' }, fullName: { type: 'string' }, mobile: { type: 'string' }, line1: { type: 'string' }, line2: { type: 'string' }, city: { type: 'string' }, state: { type: 'string' }, pincode: { type: 'string' }, isDefault: { type: 'boolean' } } } } } },
        responses: { 201: { description: 'Address created' } },
      },
    },
    '/api/user/addresses/{id}': {
      patch: {
        tags: ['User'], summary: 'Update address',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['User'], summary: 'Delete address',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },
    '/api/user/wishlist': {
      get: { tags: ['User'], summary: 'Get wishlist', responses: { 200: { description: 'Wishlist with product details' } } },
    },
    '/api/user/wishlist/{productId}': {
      post: {
        tags: ['User'], summary: 'Add product to wishlist',
        parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Added' } },
      },
      delete: {
        tags: ['User'], summary: 'Remove from wishlist',
        parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Removed' } },
      },
    },

    // ── FIRST CITIZEN ────────────────────────────────────────────
    '/api/fc/account': {
      get: { tags: ['First Citizen'], summary: 'FC account summary (tier, points, card number)', responses: { 200: { description: 'FC account' } } },
    },
    '/api/fc/transactions': {
      get: {
        tags: ['First Citizen'], summary: 'Points transaction history (paginated)',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }],
        responses: { 200: { description: 'Transactions' } },
      },
    },
    '/api/admin/fc/adjust-points': {
      post: {
        tags: ['First Citizen'], summary: 'Manual credit / debit points [super_admin]',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['userId', 'points', 'type', 'description'], properties: { userId: { type: 'string' }, points: { type: 'integer' }, type: { type: 'string', enum: ['adjusted_credit', 'adjusted_debit'] }, description: { type: 'string' } } } } } },
        responses: { 200: { description: 'Adjusted' } },
      },
    },
    '/api/admin/fc/bulk-award': {
      post: {
        tags: ['First Citizen'], summary: 'Bulk award points to multiple users [super_admin]',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['userIds', 'points', 'description'], properties: { userIds: { type: 'array', items: { type: 'string' } }, points: { type: 'integer' }, description: { type: 'string' } } } } } },
        responses: { 200: { description: 'Number of users awarded' } },
      },
    },
    '/api/admin/fc/tier-rules': {
      patch: {
        tags: ['First Citizen'], summary: 'Update FC tier spend thresholds [super_admin]',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { rules: { type: 'array', items: { type: 'object', properties: { tier: { type: 'string' }, minSpend: { type: 'number' }, pointsRate: { type: 'number' } } } } } } } } },
        responses: { 200: { description: 'Updated' } },
      },
    },

    // ── SEARCH ──────────────────────────────────────────────────
    '/api/search': {
      get: {
        tags: ['Search'], summary: 'Search products via Algolia (falls back to DB in dev)', security: [],
        parameters: [{ name: 'q', in: 'query', required: true, schema: { type: 'string', example: 'kurti' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'hitsPerPage', in: 'query', schema: { type: 'integer' } }],
        responses: { 200: { description: 'Search results with facets' } },
      },
    },
    '/api/search/suggestions': {
      get: {
        tags: ['Search'], summary: 'Autocomplete suggestions', security: [],
        parameters: [{ name: 'q', in: 'query', required: true, schema: { type: 'string', example: 'ku' } }],
        responses: { 200: { description: 'Array of suggestion strings' } },
      },
    },
    '/api/admin/search/synonyms': {
      get: { tags: ['Search'], summary: 'Get search synonyms [catalogue_mgr+]', responses: { 200: { description: 'Synonyms' } } },
      post: {
        tags: ['Search'], summary: 'Create/update synonym [catalogue_mgr+]',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['objectId', 'synonyms'], properties: { objectId: { type: 'string' }, synonyms: { type: 'array', items: { type: 'string' } } } } } } },
        responses: { 201: { description: 'Synonym saved' } },
      },
    },
    '/api/admin/search/reindex': {
      post: { tags: ['Search'], summary: 'Full product re-index to Algolia [super_admin]', responses: { 200: { description: 'Reindex started' } } },
    },

    // ── COUPONS ─────────────────────────────────────────────────
    '/api/coupons/validate': {
      post: {
        tags: ['Coupons'], summary: 'Validate coupon code and get discount', security: [],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['code', 'subtotal'], properties: { code: { type: 'string', example: 'WELCOME200' }, subtotal: { type: 'number', example: 1500 } } } } } },
        responses: { 200: { description: 'Coupon valid with discount amount' }, 400: { description: 'COUPON_INVALID | COUPON_EXPIRED | COUPON_MIN_ORDER_NOT_MET' } },
      },
    },
    '/api/admin/coupons': {
      get: { tags: ['Coupons'], summary: 'All coupons [catalogue_mgr+]', responses: { 200: { description: 'Coupon list' } } },
      post: {
        tags: ['Coupons'], summary: 'Create coupon [catalogue_mgr+]',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['code', 'type', 'value', 'usageLimit', 'startDate', 'expiry'], properties: { code: { type: 'string' }, type: { type: 'string', enum: ['percent', 'flat', 'free_delivery', 'buy_x_get_y'] }, value: { type: 'number' }, minOrderValue: { type: 'number' }, usageLimit: { type: 'integer' }, userLimit: { type: 'integer' }, startDate: { type: 'string', format: 'date-time' }, expiry: { type: 'string', format: 'date-time' }, applicableTo: { type: 'string', enum: ['all', 'first_citizens', 'new_users'] } } } } } },
        responses: { 201: { description: 'Coupon created' } },
      },
    },
    '/api/admin/coupons/{id}': {
      put: {
        tags: ['Coupons'], summary: 'Update coupon [catalogue_mgr+]',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Updated' } },
      },
    },
    '/api/admin/coupons/{id}/toggle': {
      patch: {
        tags: ['Coupons'], summary: 'Enable / disable coupon [catalogue_mgr+]',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Toggled' } },
      },
    },

    // ── REVIEWS (admin) ─────────────────────────────────────────
    '/api/admin/reviews/{id}/approve': {
      post: {
        tags: ['Reviews'], summary: 'Approve review [catalogue_mgr+]',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Approved' } },
      },
    },
    '/api/admin/reviews/{id}': {
      delete: {
        tags: ['Reviews'], summary: 'Delete review [catalogue_mgr+]',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },

    // ── BANNERS / CMS ────────────────────────────────────────────
    '/api/cms/banners': {
      get: {
        tags: ['Banners / CMS'], summary: 'Active banners for storefront', security: [],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'string', enum: ['homepage', 'plp', 'pdp', 'cart', 'all'] } },
          { name: 'position', in: 'query', schema: { type: 'string', enum: ['hero_carousel', 'announcement_bar', 'section_banner', 'popup'] } },
        ],
        responses: { 200: { description: 'Active banners' } },
      },
    },
    '/api/admin/cms/banners': {
      get: { tags: ['Banners / CMS'], summary: 'All banners [catalogue_mgr+]', responses: { 200: { description: 'Banner list' } } },
      post: {
        tags: ['Banners / CMS'], summary: 'Create banner [catalogue_mgr+]',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name', 'page', 'position', 'desktopImage', 'mobileImage', 'startDate'], properties: { name: { type: 'string' }, page: { type: 'string' }, position: { type: 'string' }, desktopImage: { type: 'string' }, mobileImage: { type: 'string' }, headline: { type: 'string' }, ctaLabel: { type: 'string' }, ctaUrl: { type: 'string' }, startDate: { type: 'string', format: 'date-time' }, endDate: { type: 'string', format: 'date-time' }, evergreen: { type: 'boolean' }, priority: { type: 'integer' } } } } } },
        responses: { 201: { description: 'Banner created' } },
      },
    },
    '/api/admin/cms/banners/{id}': {
      put: {
        tags: ['Banners / CMS'], summary: 'Update banner [catalogue_mgr+]',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Banners / CMS'], summary: 'Delete banner [catalogue_mgr+]',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },

    // ── DELIVERY ─────────────────────────────────────────────────
    '/api/delivery/check-pincode': {
      post: {
        tags: ['Delivery'], summary: 'Check pincode serviceability and ETA via Shiprocket', security: [],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['pincode'], properties: { pincode: { type: 'string', example: '400001' } } } } } },
        responses: { 200: { description: 'Serviceability info with COD and ETA' } },
      },
    },
    '/api/admin/delivery/manifest': {
      post: {
        tags: ['Delivery'], summary: 'Create Shiprocket shipment manifest [order_mgr+]',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['orderId'], properties: { orderId: { type: 'string' } } } } } },
        responses: { 200: { description: 'Shipment ID and tracking number' } },
      },
    },

    // ── ANALYTICS ────────────────────────────────────────────────
    '/api/admin/analytics/revenue': {
      get: {
        tags: ['Analytics'], summary: 'Revenue analytics by date range [super_admin]',
        parameters: [{ name: 'from', in: 'query', schema: { type: 'string', format: 'date' } }, { name: 'to', in: 'query', schema: { type: 'string', format: 'date' } }],
        responses: { 200: { description: 'Revenue totals and daily breakdown' } },
      },
    },
    '/api/admin/analytics/orders': {
      get: { tags: ['Analytics'], summary: 'Order metrics by status [super_admin]', responses: { 200: { description: 'Order counts by status' } } },
    },
    '/api/admin/analytics/customers': {
      get: { tags: ['Analytics'], summary: 'Customer metrics and FC tier breakdown [super_admin]', responses: { 200: { description: 'Customer stats' } } },
    },
    '/api/admin/analytics/products': {
      get: { tags: ['Analytics'], summary: 'Top 10 products by units sold [super_admin]', responses: { 200: { description: 'Product performance' } } },
    },
    '/api/admin/analytics/search': {
      get: { tags: ['Analytics'], summary: 'Search analytics from Algolia [super_admin]', responses: { 200: { description: 'Search analytics' } } },
    },

    // ── STAFF ────────────────────────────────────────────────────
    '/api/admin/staff': {
      get: { tags: ['Staff'], summary: 'All staff accounts [super_admin]', responses: { 200: { description: 'Staff list' } } },
      post: {
        tags: ['Staff'], summary: 'Create staff member + set Firebase custom claims [super_admin]',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name', 'email', 'role'], properties: { name: { type: 'string' }, email: { type: 'string' }, role: { type: 'string', enum: ['super_admin', 'catalogue_mgr', 'order_mgr', 'support_agent'] }, sendInvite: { type: 'boolean' } } } } } },
        responses: { 201: { description: 'Staff created' } },
      },
    },
    '/api/admin/staff/{id}/role': {
      patch: {
        tags: ['Staff'], summary: 'Change staff role [super_admin]',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['role'], properties: { role: { type: 'string', enum: ['super_admin', 'catalogue_mgr', 'order_mgr', 'support_agent'] } } } } } },
        responses: { 200: { description: 'Role updated' } },
      },
    },
    '/api/admin/staff/{id}/status': {
      patch: {
        tags: ['Staff'], summary: 'Suspend / activate staff [super_admin]',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['active', 'suspended'] } } } } } },
        responses: { 200: { description: 'Status updated' } },
      },
    },
    '/api/admin/staff/audit-log': {
      get: {
        tags: ['Staff'], summary: 'Admin activity audit log [super_admin]',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }],
        responses: { 200: { description: 'Audit log entries' } },
      },
    },

    // ── CUSTOMERS ────────────────────────────────────────────────
    '/api/admin/customers': {
      get: {
        tags: ['Customers'], summary: 'Customer list with FC and order data [order_mgr+]',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Name, email or mobile' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'blocked'] } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'Paginated customer list with FC tier and order count' } },
      },
    },
  },
}
