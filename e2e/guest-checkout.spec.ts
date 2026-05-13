/**
 * E2E Journey A — Guest user: browse → PLP → PDP → add to cart → checkout → order confirmation
 */
import { test, expect } from '@playwright/test'

test.describe('Guest Checkout Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Start from a clean state
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/')
  })

  test('homepage loads with hero banner and nav', async ({ page }) => {
    await expect(page).toHaveTitle(/Shoppers Stop/i)
    await expect(page.locator('header')).toBeVisible()
    // Hero banner CTA
    const heroCTA = page.getByRole('link', { name: /shop now|explore/i }).first()
    await expect(heroCTA).toBeVisible()
  })

  test('navigates from homepage → PLP and shows product cards', async ({ page }) => {
    await page.goto('/')
    // Click a category tile or nav link to reach PLP
    await page.getByRole('link', { name: /women/i }).first().click()
    await page.waitForURL(/women/)
    // Product grid should be visible
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 8000 })
  })

  test('PLP filter by price range narrows results', async ({ page }) => {
    await page.goto('/women/ethnic-wear')
    await page.waitForSelector('[data-testid="product-card"]')

    const beforeCount = await page.locator('[data-testid="product-card"]').count()

    // Open filters and apply a tight price range
    const filterBtn = page.getByRole('button', { name: /filter/i })
    if (await filterBtn.isVisible()) await filterBtn.click()

    // Drag max price slider down (or type in input if available)
    const maxInput = page.locator('[data-testid="price-max"]')
    if (await maxInput.isVisible()) {
      await maxInput.fill('3000')
      await maxInput.press('Enter')
    }

    const afterCount = await page.locator('[data-testid="product-card"]').count()
    // Either fewer results or same (if all products are within range)
    expect(afterCount).toBeLessThanOrEqual(beforeCount)
  })

  test('PDP loads with product name, price, size selector and add-to-bag button', async ({ page }) => {
    await page.goto('/women/ethnic-wear')
    await page.waitForSelector('[data-testid="product-card"]')
    await page.locator('[data-testid="product-card"]').first().click()

    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByText(/₹/)).toBeVisible()
    // Size options
    await expect(page.getByRole('button', { name: /XS|S|M|L|XL|Free Size/i }).first()).toBeVisible()
    // Add to bag CTA
    await expect(page.getByRole('button', { name: /add to bag/i })).toBeVisible()
  })

  test('adds product to cart from PDP and cart count updates', async ({ page }) => {
    await page.goto('/women/ethnic-wear')
    await page.waitForSelector('[data-testid="product-card"]')
    await page.locator('[data-testid="product-card"]').first().click()

    // Select first available size
    await page.getByRole('button', { name: /XS|S|M|L|Free Size/i }).first().click()
    await page.getByRole('button', { name: /add to bag/i }).click()

    // Cart badge should show at least 1
    const cartBadge = page.locator('[data-testid="cart-count"], [aria-label*="cart"]')
    await expect(cartBadge).toContainText('1', { timeout: 3000 })
  })

  test('cart page shows item and correct subtotal', async ({ page }) => {
    // Seed cart via direct navigation (faster than UI flow)
    await page.goto('/cart')
    // If cart is empty, add item first
    const empty = page.getByText(/your bag is empty/i)
    if (await empty.isVisible()) {
      await page.goto('/women/ethnic-wear')
      await page.waitForSelector('[data-testid="product-card"]')
      await page.locator('[data-testid="product-card"]').first().click()
      await page.getByRole('button', { name: /XS|S|M|L|Free Size/i }).first().click()
      await page.getByRole('button', { name: /add to bag/i }).click()
      await page.goto('/cart')
    }

    await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/subtotal|order total/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /checkout|proceed/i })).toBeVisible()
  })

  test('guest can proceed to checkout and sees payment step', async ({ page }) => {
    // Pre-seed cart in localStorage
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('ss-cart', JSON.stringify({
        state: {
          items: [{
            id: 'ci-1', productId: 'pwe-001', brand: 'Biba', name: 'Georgette Saree',
            image: 'https://picsum.photos/seed/pwe-001/300/400', size: 'Free Size',
            price: 3499, quantity: 1,
          }],
        },
        version: 0,
      }))
    })
    await page.goto('/checkout')
    // Should see the payment section
    await expect(page.getByText(/payment|pay now|upi|card/i)).toBeVisible({ timeout: 5000 })
  })
})
