import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import checkout from '../netlify/functions/donation-checkout.mjs'
import status from '../netlify/functions/donation-status.mjs'

const oldKey = process.env.STRIPE_SECRET_KEY
const oldEnabled = process.env.VWB_ENABLE_TEST_CHECKOUT
const oldFetch = globalThis.fetch
after(() => {
  if (oldKey === undefined) delete process.env.STRIPE_SECRET_KEY
  else process.env.STRIPE_SECRET_KEY = oldKey
  if (oldEnabled === undefined) delete process.env.VWB_ENABLE_TEST_CHECKOUT
  else process.env.VWB_ENABLE_TEST_CHECKOUT = oldEnabled
  globalThis.fetch = oldFetch
})

function request(body, origin = 'http://127.0.0.1:8888') {
  return new Request(`${origin}/.netlify/functions/donation-checkout`, {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

test('checkout is disabled without an explicit test key and flag', async () => {
  process.env.VWB_ENABLE_TEST_CHECKOUT = '1'
  process.env.STRIPE_SECRET_KEY = 'sk_live_fake'
  const config = await checkout(new Request('http://127.0.0.1:8888/.netlify/functions/donation-checkout'))
  assert.equal((await config.json()).enabled, false)
  assert.equal((await checkout(request({ amountCents: 5000, frequency: 'once', campaign: '2020' }))).status, 503)
})

test('server validates gift data and origin before contacting Stripe', async () => {
  process.env.VWB_ENABLE_TEST_CHECKOUT = '1'
  process.env.STRIPE_SECRET_KEY = 'sk_test_fake'
  globalThis.fetch = () => { throw new Error('Stripe must not be called') }
  for (const body of [
    { amountCents: 0, frequency: 'once', campaign: '2020' },
    { amountCents: 100.5, frequency: 'once', campaign: '2020' },
    { amountCents: 2_000_001, frequency: 'once', campaign: '2020' },
    { amountCents: 5000, frequency: 'weekly', campaign: '2020' },
    { amountCents: 5000, frequency: 'once', campaign: 'sponsor' },
  ]) assert.equal((await checkout(request(body))).status, 400)
  const badOrigin = new Request('http://127.0.0.1:8888/.netlify/functions/donation-checkout', {
    method: 'POST', headers: { origin: 'https://evil.example', 'content-type': 'application/json' },
    body: JSON.stringify({ amountCents: 5000, frequency: 'once', campaign: '2020' }),
  })
  assert.equal((await checkout(badOrigin)).status, 403)
})

test('creates a monthly Stripe test session with the chosen cents', async () => {
  process.env.VWB_ENABLE_TEST_CHECKOUT = '1'
  process.env.STRIPE_SECRET_KEY = 'sk_test_fake'
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.stripe.com/v1/checkout/sessions')
    assert.equal(options.headers.authorization, 'Bearer sk_test_fake')
    const form = new URLSearchParams(options.body)
    assert.equal(form.get('mode'), 'subscription')
    assert.equal(form.get('line_items[0][price_data][unit_amount]'), '7500')
    assert.equal(form.get('line_items[0][price_data][recurring][interval]'), 'month')
    assert.equal(form.get('allowed_payment_method_types[0]'), 'card')
    assert.equal(form.get('metadata[campaign]'), '2020')
    return Response.json({ id: 'cs_test_mock', livemode: false, url: 'https://checkout.stripe.com/c/pay/cs_test_mock' })
  }
  const response = await checkout(request({ amountCents: 7500, frequency: 'monthly', campaign: '2020' }))
  assert.equal(response.status, 200)
  assert.equal((await response.json()).url, 'https://checkout.stripe.com/c/pay/cs_test_mock')
})

test('creates a one-time session and rejects a live-mode Stripe response', async () => {
  process.env.VWB_ENABLE_TEST_CHECKOUT = '1'
  process.env.STRIPE_SECRET_KEY = 'sk_test_fake'
  globalThis.fetch = async (_url, options) => {
    const form = new URLSearchParams(options.body)
    assert.equal(form.get('mode'), 'payment')
    assert.equal(form.get('line_items[0][price_data][unit_amount]'), '5000')
    assert.equal(form.has('line_items[0][price_data][recurring][interval]'), false)
    return Response.json({ id: 'cs_live_mock', livemode: true, url: 'https://checkout.stripe.com/c/pay/cs_live_mock' })
  }
  const response = await checkout(request({ amountCents: 5000, frequency: 'once', campaign: 'general' }))
  assert.equal(response.status, 502)
})

test('return status verifies Stripe session rather than trusting the URL', async () => {
  process.env.VWB_ENABLE_TEST_CHECKOUT = '1'
  process.env.STRIPE_SECRET_KEY = 'sk_test_fake'
  globalThis.fetch = async () => Response.json({ livemode: false, payment_status: 'paid', amount_total: 7500, mode: 'subscription', metadata: { campaign: '2020' } })
  const response = await status(new Request('http://127.0.0.1:8888/.netlify/functions/donation-status?session_id=cs_test_mock'))
  assert.deepEqual(await response.json(), { paid: true, amountCents: 7500, frequency: 'monthly' })
  const invalid = await status(new Request('http://127.0.0.1:8888/.netlify/functions/donation-status?session_id=cs_live_fake'))
  assert.equal(invalid.status, 400)
})
