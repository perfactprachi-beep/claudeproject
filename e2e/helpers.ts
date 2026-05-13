import { type Page } from '@playwright/test'

/** OTP is hardcoded as 123456 in the mock auth flow */
export const MOCK_OTP = '123456'
export const MOCK_MOBILE = '9876543210'

/** Fills the OTP input boxes (6 separate single-digit inputs) */
export async function fillOTP(page: Page, otp = MOCK_OTP) {
  const boxes = page.locator('input[maxlength="1"]')
  for (let i = 0; i < otp.length; i++) {
    await boxes.nth(i).fill(otp[i])
  }
}

/** Logs in via the mobile OTP flow */
export async function loginWithOTP(page: Page, mobile = MOCK_MOBILE) {
  await page.getByRole('button', { name: /sign in|login/i }).first().click()
  await page.getByPlaceholder(/mobile/i).fill(mobile)
  await page.getByRole('button', { name: /send otp/i }).click()
  await fillOTP(page)
  await page.getByRole('button', { name: /verify|confirm/i }).click()
  // wait for auth modal to close
  await page.waitForSelector('[role="dialog"]', { state: 'hidden' })
}

/** Adds the first product on the current PLP to the cart */
export async function addFirstProductToCart(page: Page) {
  const card = page.locator('[data-testid="product-card"]').first()
  await card.hover()
  await card.getByRole('button', { name: /add to bag|add to cart/i }).click()
}

/** Navigates to PLP for Women's Ethnic Wear */
export async function goToWomenPLP(page: Page) {
  await page.goto('/women/ethnic-wear')
  await page.waitForSelector('[data-testid="product-card"]')
}
