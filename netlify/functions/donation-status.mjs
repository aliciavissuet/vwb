const jsonHeaders = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }

export default async function handler(request) {
  if (request.method !== 'GET') return new Response(null, { status: 405, headers: jsonHeaders })
  if (process.env.VWB_ENABLE_TEST_CHECKOUT !== '1' || !/^sk_test_[A-Za-z0-9]+$/.test(process.env.STRIPE_SECRET_KEY || '')) {
    return Response.json({ error: 'Test checkout is not configured.' }, { status: 503, headers: jsonHeaders })
  }
  const id = new URL(request.url).searchParams.get('session_id') || ''
  if (!/^cs_test_[A-Za-z0-9_]+$/.test(id)) return Response.json({ error: 'Invalid test session.' }, { status: 400, headers: jsonHeaders })
  try {
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(id)}`, {
      headers: { authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
    })
    if (!response.ok) return Response.json({ error: 'Could not verify the test session.' }, { status: 502, headers: jsonHeaders })
    const session = await response.json()
    if (session.livemode !== false || !['2020', 'general'].includes(session.metadata?.campaign)) {
      return Response.json({ error: 'This is not a VWB test donation.' }, { status: 400, headers: jsonHeaders })
    }
    return Response.json({ paid: session.payment_status === 'paid', amountCents: session.amount_total, frequency: session.mode === 'subscription' ? 'monthly' : 'once' }, { headers: jsonHeaders })
  } catch {
    return Response.json({ error: 'Could not verify the test session.' }, { status: 502, headers: jsonHeaders })
  }
}
