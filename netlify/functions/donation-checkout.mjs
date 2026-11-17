const stripeEndpoint = 'https://api.stripe.com/v1/checkout/sessions'
const jsonHeaders = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }

function reply(status, data) {
  return new Response(JSON.stringify(data), { status, headers: jsonHeaders })
}

function testCheckoutReady() {
  return process.env.VWB_ENABLE_TEST_CHECKOUT === '1' && /^sk_test_[A-Za-z0-9]+$/.test(process.env.STRIPE_SECRET_KEY || '')
}

export default async function handler(request) {
  if (request.method === 'GET') return reply(200, { enabled: testCheckoutReady(), mode: 'test' })
  if (request.method !== 'POST') return reply(405, { error: 'Method not allowed' })
  if (!testCheckoutReady()) return reply(503, { error: 'Test checkout is not configured.' })

  const origin = new URL(request.url).origin
  if (request.headers.get('origin') !== origin) return reply(403, { error: 'Request origin is not allowed.' })
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415, { error: 'Use JSON.' })

  let input
  try { input = await request.json() } catch { return reply(400, { error: 'Invalid JSON.' }) }
  const { amountCents, frequency, campaign } = input || {}
  if (!Number.isSafeInteger(amountCents) || amountCents < 100 || amountCents > 2_000_000) {
    return reply(400, { error: 'Choose an amount from $1 to $20,000.' })
  }
  if (!['once', 'monthly'].includes(frequency) || !['2020', 'general'].includes(campaign)) {
    return reply(400, { error: 'Invalid gift selection.' })
  }

  const form = new URLSearchParams({
    mode: frequency === 'monthly' ? 'subscription' : 'payment',
    success_url: `${origin}/donate/success/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}${campaign === '2020' ? '/2020/?test_checkout=cancelled#community-giving' : '/donate/?test_checkout=cancelled#donation-options'}`,
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': String(amountCents),
    'line_items[0][price_data][product_data][name]': campaign === '2020' ? '20/20 Vision community donation' : 'Vision Without Borders donation',
    'line_items[0][quantity]': '1',
    'allowed_payment_method_types[0]': 'card',
    'metadata[campaign]': campaign,
    'metadata[frequency]': frequency,
  })
  if (frequency === 'monthly') form.set('line_items[0][price_data][recurring][interval]', 'month')

  try {
    const response = await fetch(stripeEndpoint, {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, 'content-type': 'application/x-www-form-urlencoded' },
      body: form,
    })
    const session = await response.json()
    if (!response.ok) {
      const stripeError = session?.error || {}
      const code = String(stripeError.code || stripeError.type || 'unknown_error').replace(/[^a-z0-9_]/gi, '').slice(0, 80)
      const parameter = String(stripeError.param || '').replace(/[^a-z0-9_\[\].]/gi, '').slice(0, 100)
      console.error('Stripe test checkout rejected', { status: response.status, code, parameter, requestId: response.headers.get('request-id') })
      return reply(502, { error: `Stripe rejected the test checkout (HTTP ${response.status}, ${code}${parameter ? `, ${parameter}` : ''}).` })
    }
    const checkout = new URL(session.url)
    if (session.livemode !== false || !session.id?.startsWith('cs_test_') || checkout.protocol !== 'https:' || checkout.hostname !== 'checkout.stripe.com') {
      return reply(502, { error: 'Stripe did not return a test checkout session.' })
    }
    return reply(200, { url: checkout.href })
  } catch (failure) {
    const code = String(failure?.cause?.code || failure?.code || failure?.name || 'unknown_error').replace(/[^a-z0-9_]/gi, '').slice(0, 80)
    console.error('Stripe test checkout connection failed', { code })
    return reply(502, { error: `Stripe test checkout could not be reached (${code}).` })
  }
}
