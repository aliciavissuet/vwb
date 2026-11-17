const title = document.querySelector('#test-status-title')
const status = document.querySelector('[data-test-status]')
const id = new URLSearchParams(window.location.search).get('session_id')

if (!id || !/^cs_test_[A-Za-z0-9_]+$/.test(id)) {
  title.textContent = 'No test payment to check.'
  status.textContent = 'Return to the campaign to start a new test checkout.'
} else {
  try {
    const response = await fetch(`/.netlify/functions/donation-status?session_id=${encodeURIComponent(id)}`, { cache: 'no-store' })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Could not verify this test payment.')
    if (result.paid) {
      title.textContent = 'Stripe confirmed the test payment.'
      status.textContent = `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.amountCents / 100)} ${result.frequency === 'monthly' ? 'monthly' : 'one-time'} test gift. No real money was charged.`
    } else {
      title.textContent = 'Test payment is not confirmed yet.'
      status.textContent = 'Check your Stripe test dashboard for the session status.'
    }
  } catch (error) {
    title.textContent = 'Could not verify the test payment.'
    status.textContent = error.message || 'Please check the Stripe test dashboard.'
  }
}
