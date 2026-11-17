import { test, expect } from '@playwright/test'

test('home to campaign donation review and test Checkout handoff', async ({ page }) => {
  await page.route('**/.netlify/functions/donation-checkout', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: { enabled: true, mode: 'test' } })
      return
    }
    expect(route.request().postDataJSON()).toEqual({ amountCents: 7500, frequency: 'monthly', campaign: '2020' })
    await route.fulfill({ json: { url: 'https://checkout.stripe.com/c/pay/cs_test_mock' } })
  })
  await page.route('https://checkout.stripe.com/**', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<h1>Stripe test checkout handoff</h1>',
  }))

  await page.goto('/?skipIntro=1')
  await page.locator('.home-campaign-actions').getByRole('link', { name: 'Make a Donation' }).click()
  await expect(page).toHaveURL(/\/2020\/#community-giving$/)
  const form = page.locator('[data-donation-form]')
  await form.getByRole('radio', { name: 'Monthly' }).check()
  await form.getByPlaceholder('Other amount').fill('75')
  await expect(form.locator('[data-donation-summary]')).toHaveText('75')
  await form.getByRole('button', { name: 'Review your gift' }).click()
  await expect(form.locator('[data-donation-review-summary]')).toHaveText('75')
  await expect(form.locator('[data-donation-review-frequency]')).toContainText('Monthly')
  await expect(form.locator('[data-donation-checkout]')).toBeEnabled()
  await form.locator('[data-donation-checkout]').click()
  await expect(page).toHaveURL(/^https:\/\/checkout\.stripe\.com\//)
  await expect(page.getByRole('heading', { name: 'Stripe test checkout handoff' })).toBeVisible()
})

test('invalid custom amount stays on campaign and cannot be reviewed', async ({ page }) => {
  await page.goto('/2020/#community-giving')
  const form = page.locator('[data-donation-form]')
  await form.getByPlaceholder('Other amount').fill('0')
  await expect(form.locator('[data-donation-summary]')).toHaveText('0')
  await form.getByRole('button', { name: 'Review your gift' }).click()
  await expect(form.locator('[data-donation-error]')).toBeVisible()
  await expect(form.locator('[data-donation-review]')).toBeHidden()
})

test('standalone Donate page keeps checkout disabled without test configuration', async ({ page }) => {
  await page.route('**/.netlify/functions/donation-checkout', (route) => route.fulfill({ json: { enabled: false, mode: 'test' } }))
  await page.goto('/donate/')
  const form = page.locator('[data-donation-form]')
  await form.getByRole('button', { name: 'Review your gift' }).click()
  await expect(form.locator('[data-donation-checkout]')).toBeDisabled()
  await expect(form.locator('[data-donation-checkout-note]')).toContainText('cannot take a payment')
})

test('success page reports payment only after server verification', async ({ page }) => {
  await page.route('**/.netlify/functions/donation-status?*', (route) => route.fulfill({
    json: { paid: true, amountCents: 7500, frequency: 'monthly' },
  }))
  await page.goto('/donate/success/?session_id=cs_test_mock')
  await expect(page.getByRole('heading', { name: 'Stripe confirmed the test payment.' })).toBeVisible()
  await expect(page.locator('[data-test-status]')).toContainText('$75.00 monthly test gift')
})

test('cancelled test checkout returns to the campaign with a clear status', async ({ page }) => {
  await page.goto('/2020/?test_checkout=cancelled#community-giving')
  await expect(page.locator('[data-donation-cancelled]')).toBeVisible()
  await expect(page.locator('[data-donation-cancelled]')).toContainText('No payment was made')
})

test('optional real Stripe test-mode handoff', async ({ page }) => {
  test.skip(process.env.VWB_RUN_STRIPE_HANDOFF !== '1', 'Requires an explicitly enabled local Stripe test server')
  await page.goto('/2020/#community-giving')
  const form = page.locator('[data-donation-form]')
  await expect(form.locator('[data-donation-checkout]')).toBeEnabled()
  await form.getByRole('button', { name: 'Review your gift' }).click()
  await form.locator('[data-donation-checkout]').click()
  await expect(page).toHaveURL(/^https:\/\/checkout\.stripe\.com\//, { timeout: 30_000 })
})
