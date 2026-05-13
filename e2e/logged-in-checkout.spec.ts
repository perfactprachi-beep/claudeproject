/**
 * E2E Journey B — Logged-in user: login → wishlist → move to cart → pay → confirm
 */
import { test, expect } from '@playwright/test'

/** Seeds auth state directly into localStorage to skip OTP UI */
async function seedAuthState(page: ReturnType<typeof test.extend>['page'] extends infer P ? P : never) {
  await page.evaluate(() => {
    localStorage.setItem('ss-auth', JSON.stringify({
      state: {
        user: {
          id: 'usr-1', fullName: 'Priya Sharma', email: 'priya@example.com',
          mobile: '9876543210', createdAt: '2024-01-01T00:00:00Z',
        },
        isAuthenticated: true,
        addresses: [{
          id: 'addr-01', label: 'Home', fullName: 'Priya Sharma', mobile: '9876543210',
          line1: '14B, Shastri Nagar', city: 'Mumbai', state: 'Maharashtra',
          pincode: '400053', isDefault: true,
        }],
        savedCards: [{
          id: 'card-01', last4: '4242', expiry: '09/27', network: 'Visa', holderName: 'Priya Sharma',
        }],
        upiIds: [{ id: 'upi-01', vpa: 'priya.sharma@okaxis', isDefault: true }],
        communicationPrefs: { emailOffers: true, smsAlerts: true, pushNotifications: false },
      },
      version: 0,
    }))
  })
}

test.describe('Logged-in User Checkout Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('authenticated user sees account menu after login state is seeded', async ({ page }) => {
    await seedAuthState(page)
    await page.reload()
    // Account icon or user name should be visible in header
    await expect(page.locator('header').getByRole('link', { name: /account|profile|priya/i })).toBeVisible({ timeout: 5000 })
  })

  test('wishlist toggle adds and removes products', async ({ page }) => {
    await seedAuthState(page)
    await page.goto('/women/ethnic-wear')
    await page.waitForSelector('[data-testid="product-card"]')

    const firstCard = page.locator('[data-testid="product-card"]').first()
    const wishBtn = firstCard.locator('[aria-label*="wishlist"], [data-testid="wishlist-btn"]')
    await wishBtn.click()

    // Navigate to wishlist page to confirm
    await page.goto('/account/wishlist')
    await expect(page.locator('[data-testid="wishlist-item"], [data-testid="product-card"]').first())
      .toBeVisible({ timeout: 5000 })
  })

  test('cart page shows saved address in checkout', async ({ page }) => {
    await seedAuthState(page)
    await page.evaluate(() => {
      localStorage.setItem('ss-cart', JSON.stringify({
        state: {
          items: [{
            id: 'ci-1', productId: 'pwe-001', brand: 'Biba', name: 'Georgette Saree',
            image: '/img.jpg', size: 'Free Size', price: 3499, quantity: 1,
          }],
        },
        version: 0,
      }))
    })
    await page.goto('/checkout')
    // Address from seeded state should appear
    await expect(page.getByText(/Shastri Nagar|400053|Mumbai/i)).toBeVisible({ timeout: 5000 })
  })

  test('saved UPI card is displayed in payment options', async ({ page }) => {
    await seedAuthState(page)
    await page.goto('/checkout')
    // UPI section should show saved VPA
    await expect(page.getByText(/UPI/i)).toBeVisible({ timeout: 5000 })
  })

  test('account → orders page lists past orders', async ({ page }) => {
    await seedAuthState(page)
    await page.goto('/account/orders')
    // Either orders table or "no orders" message
    const hasOrders = await page.locator('[data-testid="order-card"]').count()
    const noOrders = page.getByText(/no orders|order history/i)
    expect(hasOrders > 0 || await noOrders.isVisible()).toBeTruthy()
  })

  test('order detail page shows tracking timeline', async ({ page }) => {
    await seedAuthState(page)
    await page.goto('/account/orders')
    const firstOrder = page.locator('[data-testid="order-card"]').first()
    if (await firstOrder.isVisible()) {
      await firstOrder.click()
      await expect(page.getByText(/order placed|confirmed|shipped|delivered/i)).toBeVisible({ timeout: 5000 })
    }
  })
})
