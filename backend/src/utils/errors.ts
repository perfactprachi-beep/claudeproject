export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export const Errors = {
  PRODUCT_NOT_FOUND: (id?: string) =>
    new AppError('PRODUCT_NOT_FOUND', `Product${id ? ` with ID ${id}` : ''} does not exist.`, 404),

  OUT_OF_STOCK: (sku?: string) =>
    new AppError('OUT_OF_STOCK', `Item${sku ? ` (${sku})` : ''} is out of stock.`, 409),

  INVALID_SIZE: () =>
    new AppError('INVALID_SIZE', 'The requested size is not available for this product.', 400),

  COUPON_EXPIRED: () =>
    new AppError('COUPON_EXPIRED', 'This coupon has expired.', 400),

  COUPON_INVALID: () =>
    new AppError('COUPON_INVALID', 'This coupon code is invalid or does not exist.', 400),

  COUPON_MIN_ORDER_NOT_MET: (min: number) =>
    new AppError('COUPON_MIN_ORDER_NOT_MET', `Minimum order value of ₹${min} is required for this coupon.`, 400),

  PAYMENT_FAILED: () =>
    new AppError('PAYMENT_FAILED', 'Payment could not be processed. Please try again.', 402),

  PAYMENT_VERIFICATION_FAILED: () =>
    new AppError('PAYMENT_VERIFICATION_FAILED', 'Payment signature verification failed.', 400),

  ORDER_NOT_CANCELLABLE: () =>
    new AppError('ORDER_NOT_CANCELLABLE', 'This order cannot be cancelled at its current status.', 409),

  RETURN_WINDOW_EXPIRED: () =>
    new AppError('RETURN_WINDOW_EXPIRED', 'The return window for this order has expired.', 400),

  INSUFFICIENT_FC_POINTS: () =>
    new AppError('INSUFFICIENT_FC_POINTS', 'You do not have enough FC Points for this redemption.', 400),

  TOKEN_EXPIRED: () =>
    new AppError('TOKEN_EXPIRED', 'Your session has expired. Please log in again.', 401),

  INSUFFICIENT_PERMISSIONS: () =>
    new AppError('INSUFFICIENT_PERMISSIONS', 'You do not have permission to perform this action.', 403),

  VALIDATION_ERROR: (msg: string) =>
    new AppError('VALIDATION_ERROR', msg, 422),

  RATE_LIMIT_EXCEEDED: () =>
    new AppError('RATE_LIMIT_EXCEEDED', 'Too many requests. Please slow down.', 429),

  NOT_FOUND: (resource = 'Resource') =>
    new AppError('NOT_FOUND', `${resource} not found.`, 404),

  CONFLICT: (msg: string) =>
    new AppError('CONFLICT', msg, 409),

  UNAUTHORIZED: () =>
    new AppError('UNAUTHORIZED', 'Authentication required.', 401),
}
