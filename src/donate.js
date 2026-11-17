const form = document.querySelector('[data-donation-form]')

if (form) {
  const summary = form.querySelector('[data-donation-summary]')
  const custom = form.elements.namedItem('custom-amount')
  const amountOptions = Array.from(form.querySelectorAll('input[name="amount"]'))
  const frequencyOptions = Array.from(form.querySelectorAll('input[name="frequency"]'))
  const selection = form.querySelector('[data-donation-selection]')
  const review = form.querySelector('[data-donation-review]')
  const reviewSummary = form.querySelector('[data-donation-review-summary]')
  const error = form.querySelector('[data-donation-error]')
  const stepLabel = form.querySelector('[data-donation-step-label]')
  const stepTitle = form.querySelector('[data-donation-step-title]')
  const stepDescription = form.querySelector('[data-donation-step-description]')
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

  function updateSummary() {
    const amount = custom.value.trim() ? Number(custom.value) : Number(amountOptions.find((option) => option.checked)?.value)
    const frequency = frequencyOptions.find((option) => option.checked)?.value === 'monthly' ? 'monthly' : 'one time'
    summary.textContent = Number.isFinite(amount) && amount >= 1 ? `${money.format(amount)} ${frequency}` : `Choose an amount ${frequency}`
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
    if (!Number.isFinite(amount) || amount < 1 || (custom.value.trim() && !custom.checkValidity())) {
      error.hidden = false
      custom.focus()
      return
    }
    error.hidden = true
    reviewSummary.textContent = summary.textContent
    selection.hidden = true
    review.hidden = false
    stepLabel.textContent = '02 / Review'
    stepTitle.textContent = 'Review your gift'
    stepDescription.textContent = 'Payment setup is still in progress.'
    stepTitle.focus()
  })

  form.querySelector('[data-donation-back]').addEventListener('click', () => {
    review.hidden = true
    selection.hidden = false
    stepLabel.textContent = '01 / Your gift'
    stepTitle.textContent = 'Set your donation'
    stepDescription.textContent = 'Select a frequency and amount to preview your gift.'
    form.querySelector('[data-donation-review-button]').focus()
  })

  form.addEventListener('submit', (event) => event.preventDefault())
}
