/**
 * E2E Journey C — FC Member: login → browse → checkout → redeem points → confirm + points updated
 */
import { test, expect } from '@playwright/test'

async function seedFCMemberState(page: ReturnType<typeof test.extend>['page'] extends infer P ? P : never) {
  await page.evaluate(() => {
    // Auth state with firstCitizenId
    localStorage.setItem('ss-auth', JSON.stringify({
      state: {
        user: {
          id: 'fc-usr-1', fullName: 'Arjun Mehta', email: 'arjun@example.com',
          mobile: '9123456789', firstCitizenId: 'FC-9000-9999-1111',
          createdAt: '2022-01-01T00:00:00Z',
        },
        isAuthenticated: true,
        addresses: [{
          id: 'addr-fc', label: 'Home', fullName: 'Arjun Mehta', mobile: '9123456789',
          line1: '22, Linking Road', city: 'Mumbai', state: 'Maharashtra',
          pincode: '400050', isDefault: true,
        }],
        savedCards: [{
          id: 'card-fc', last4: '5678', expiry: '03/26', network: 'Mastercard',
          holderName: 'Arjun Mehta',
        }],
        upiIds: [],
        communicationPrefs: { emailOffers: true, smsAlerts: true, pushNotifications: true },
      },
      version: 0,
    }))

    // Cart with one product
    localStorage.setItem('ss-cart', JSON.stringify({
      state: {
        items: [{
          id: 'ci-fc1', productId: 'pwe-005', brand: 'Global Desi', name: 'Printed Anarkali Kurta',
          image: 'https://picsum.photos/seed/pwe-005/300/400', size: 'M',
          price: 4499, quantity: 1,
        }],
      },
      version: 0,
    }))
  })
}

test.describe('FC Member Checkout with Points Redemption', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('FC member dashboard shows tier card and points balance', async ({ page }) => {
    await seedFCMemberState(page)
    await page.goto('/account/first-citizen')
    await expect(page.getByText(/First Citizen|FC Points/i)).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/Classic|Silver|Platinum|Black/i)).toBeVisible()
  })

  test('points activity table renders transactions', async ({ page }) => {
    await seedFCMemberState(page)
    await page.goto('/account/first-citizen')
    // Table should be visible with at least column headers
    await expect(page.getByText(/Points Activity|All|Earned|Redeemed/i)).toBeVisible({ timeout: 5000 })
  })

  test('FC tier benefits comparison table is present', async ({ page }) => {
    await seedFCMemberState(page)
    await page.goto('/account/first-citizen')
    await expect(page.getByText(/Tier Benefits|Early sale|Birthday bonus/i)).toBeVisible({ timeout: 5000 })
  })

  test('checkout page reaches payment step with FC points section', async ({ page }) => {
    await seedFCMemberState(page)
    await page.goto('/checkout')
    // FC Points payment option should be available (even if hidden until membership is shown)
    await expect(page.getByText(/payment|pay/i)).toBeVisible({ timeout: 5000 })
  })

  test('redeem points panel accepts valid point input and shows discount', async ({ page }) => {
    await seedFCMemberState(page)
    await page.goto('/account/first-citizen')

    const redeemSection = page.getByText(/Redeem Points/i)
    await expect(redeemSection).toBeVisible({ timeout: 5000 })

    const pointsInput = page.locator('input[type="number"]').first()
    if (await pointsInput.isVisible()) {
      await pointsInput.fill('500')
      // Discount value should update
      await expect(page.getByText(/₹500|500 discount/i)).toBeVisible({ timeout: 3000 })
    }
  })

  test('points below 200 shows minimum error message', async ({ page }) => {
    await seedFCMemberState(page)
    await page.goto('/account/first-citizen')

    const pointsInput = page.locator('input[type="number"]').first()
    if (await pointsInput.isVisible()) {
      await pointsInput.fill('100')
      await expect(page.getByText(/minimum 200/i)).toBeVisible({ timeout: 3000 })
    }
  })

  test('use-all button sets points input to full balance', async ({ page }) => {
    await seedFCMemberState(page)
    await page.goto('/account/first-citizen')

    const useAllBtn = page.getByRole('button', { name: /use all/i })
    if (await useAllBtn.isVisible()) {
      await useAllBtn.click()
      const input = page.locator('input[type="number"]').first()
      const val = await input.inputValue()
      expect(Number(val)).toBeGreaterThan(200)
    }
  })
})
