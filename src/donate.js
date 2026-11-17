const form = document.querySelector('[data-donation-form]')

if (form) {
  const summary = form.querySelector('[data-donation-summary]')
  const summaryFrequency = form.querySelector('[data-donation-frequency]')
  const custom = form.elements.namedItem('custom-amount')
  const amountOptions = Array.from(form.querySelectorAll('input[name="amount"]'))
  const frequencyOptions = Array.from(form.querySelectorAll('input[name="frequency"]'))
  const selection = form.querySelector('[data-donation-selection]')
  const review = form.querySelector('[data-donation-review]')
  const reviewSummary = form.querySelector('[data-donation-review-summary]')
  const reviewFrequency = form.querySelector('[data-donation-review-frequency]')
  const error = form.querySelector('[data-donation-error]')
  const stepLabel = form.querySelector('[data-donation-step-label]')
  const stepTitle = form.querySelector('[data-donation-step-title]')
  const stepDescription = form.querySelector('[data-donation-step-description]')
  const checkoutButton = form.querySelector('[data-donation-checkout]')
  const checkoutNote = form.querySelector('[data-donation-checkout-note]')
  const checkoutError = form.querySelector('[data-donation-checkout-error]')
  const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
  const params = new URLSearchParams(window.location.search)
  if (params.get('test_checkout') === 'cancelled') {
    const cancelled = form.querySelector('[data-donation-cancelled]')
    if (cancelled) cancelled.hidden = false
  }
  const suggestedAmount = params.get('amount')
  if (params.get('campaign') === '2020') {
    const campaignNote = document.querySelector('[data-campaign-donation-note]')
    if (campaignNote) campaignNote.hidden = false
    const suggestedOption = amountOptions.find((option) => option.value === suggestedAmount)
    if (suggestedOption) {
      suggestedOption.checked = true
    } else if (suggestedAmount === 'custom') {
      amountOptions.forEach((option) => { option.checked = false })
    }
  }

  function updateSummary() {
    const amount = custom.value.trim() ? Number(custom.value) : Number(amountOptions.find((option) => option.checked)?.value)
    const frequency = frequencyOptions.find((option) => option.checked)?.value === 'monthly' ? 'Monthly' : 'One time'
    summary.textContent = Number.isFinite(amount) ? number.format(amount) : '-'
    summaryFrequency.textContent = `USD · ${frequency}`
  }

  for (const option of [...amountOptions, ...frequencyOptions]) {
    option.addEventListener('change', () => {
      if (option.name === 'amount') custom.value = ''
      updateSummary()
    })
  }

  custom.addEventListener('input', () => {
    if (custom.value.trim()) amountOptions.forEach((option) => { option.checked = false })
    error.hidden = true
    updateSummary()
  })

  form.querySelector('[data-donation-review-button]').addEventListener('click', () => {
    const amount = custom.value.trim() ? Number(custom.value) : Number(amountOptions.find((option) => option.checked)?.value)
    if (!Number.isFinite(amount) || amount < 1 || amount > 20_000 || (custom.value.trim() && !custom.checkValidity())) {
      error.hidden = false
      custom.focus()
      return
    }
    error.hidden = true
    reviewSummary.textContent = summary.textContent
    reviewFrequency.textContent = summaryFrequency.textContent
    selection.hidden = true
    review.hidden = false
    stepLabel.textContent = '02 / Review'
    stepTitle.textContent = 'Review your gift'
    stepDescription.textContent = 'Confirm your amount and frequency.'
    stepTitle.focus()
  })

  form.querySelector('[data-donation-back]').addEventListener('click', () => {
    review.hidden = true
    selection.hidden = false
    stepLabel.textContent = '01 / Your gift'
    stepTitle.textContent = 'Set your donation'
    stepDescription.textContent = 'Choose how often and how much you’d like to give.'
    form.querySelector('[data-donation-review-button]').focus()
  })

  async function checkTestCheckout() {
    try {
      const response = await fetch('/.netlify/functions/donation-checkout', { cache: 'no-store' })
      const config = await response.json()
      if (response.ok && config.enabled === true && config.mode === 'test') {
        checkoutButton.disabled = false
        checkoutNote.textContent = 'Stripe test mode is ready. No real money will be charged.'
      }
    } catch { /* The checkout endpoint is unavailable. */ }
  }

  checkoutButton.addEventListener('click', async () => {
    const amount = custom.value.trim() ? Number(custom.value) : Number(amountOptions.find((option) => option.checked)?.value)
    if (!Number.isFinite(amount) || amount < 1 || amount > 20_000 || (custom.value.trim() && !custom.checkValidity())) {
      checkoutError.textContent = 'Choose an amount from $1 to $20,000 with no more than two decimal places.'
      checkoutError.hidden = false
      return
    }
    checkoutButton.disabled = true
    checkoutButton.textContent = 'Opening Stripe test checkout…'
    checkoutError.hidden = true
    try {
      const response = await fetch('/.netlify/functions/donation-checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          amountCents: Math.round(amount * 100),
          frequency: frequencyOptions.find((option) => option.checked)?.value,
          campaign: window.location.pathname.startsWith('/2020') ? '2020' : 'general',
        }),
      })
      const result = await response.json()
      if (!response.ok || !result.url) throw new Error(result.error || 'Could not start test checkout.')
      window.location.assign(result.url)
    } catch (failure) {
      checkoutError.textContent = failure.message || 'Could not start test checkout.'
      checkoutError.hidden = false
      checkoutButton.disabled = false
      checkoutButton.textContent = 'Continue to secure checkout'
    }
  })

  form.addEventListener('submit', (event) => event.preventDefault())
  updateSummary()
  checkTestCheckout()
}
