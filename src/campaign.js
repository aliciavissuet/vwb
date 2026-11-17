const progress = document.querySelector('[data-campaign-progress]')

if (progress) {
  const fill = document.querySelector('[data-campaign-progress-fill]')
  const raised = document.querySelector('[data-campaign-raised]')
  const foundationStatus = document.querySelector('[data-foundation-status]')
  const foundationName = document.querySelector('[data-foundation-name]')
  const matchStatus = document.querySelector('[data-campaign-match-status]')
  const matchDetail = document.querySelector('[data-campaign-match-detail]')
  const sponsorIntro = document.querySelector('[data-campaign-sponsor-intro]')
  const note = document.querySelector('[data-campaign-data-note]')
  const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  fetch('/content/campaign-2020-public.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error('Campaign status unavailable')
      return response.json()
    })
    .then((data) => {
      const goal = data.community_goal_cents === 2000000 ? 2000000 : null
      const cash = Number.isSafeInteger(data.verified_community_cash_cents) && data.verified_community_cash_cents >= 0
        ? data.verified_community_cash_cents : null
      if (goal === null || cash === null) throw new Error('Invalid campaign cash total')

      const amount = cash / 100
      progress.setAttribute('aria-valuenow', String(Math.min(amount, 20000)))
      progress.setAttribute('aria-valuetext', `${dollars.format(amount)} in verified community cash`)
      fill.style.width = `${Math.min((cash / goal) * 100, 100)}%`
      raised.textContent = `${dollars.format(amount)} verified`
      note.textContent = `Verified cash as of ${data.as_of || 'the latest approved update'}. This published snapshot is updated only after donation records are confirmed; live payment syncing is pending.`

      const foundation = data.initial_foundation_contribution
      if (foundation?.verified === true && foundation.campaign_eligible === true && foundation.recognition_consent === true && Number.isSafeInteger(foundation.amount_cents) && foundation.amount_cents > 0 && foundation.amount_cents <= cash) {
        foundationName.textContent = foundation.source || 'Foundation gift'
        foundationStatus.textContent = `${dollars.format(foundation.amount_cents / 100)} verified and included in the community total.`
      }

      const sponsor = data.founding_sponsor_match
      const signed = sponsor?.agreement_status === 'signed' && Boolean(sponsor.signed_at) && sponsor.match_eligibility === true && Boolean(sponsor.match_deadline) && sponsor.commitment_cents === 2000000
      const received = Number.isSafeInteger(sponsor?.verified_received_cents) ? sponsor.verified_received_cents : 0
      matchStatus.textContent = signed ? `Matching status: ${received >= 2000000 ? 'Fulfilled' : 'Secured'}` : 'Matching status: Seeking Sponsor'
      if (signed) {
        sponsorIntro.textContent = 'A $20,000 founding sponsor commitment is documented. Together with the community goal, it offers a potential $40,000 cash outcome under the agreed matching terms.'
        matchDetail.textContent = received >= 2000000
          ? 'The documented sponsor commitment has been fulfilled. Verified sponsor cash is tracked separately from the community thermometer.'
          : `A signed sponsor commitment is documented. Matching eligibility and the ${sponsor.match_deadline} deadline follow the agreement; sponsor cash is tracked separately from the community thermometer.`
      }
    })
    .catch(() => {
      raised.textContent = 'Total unavailable'
      progress.setAttribute('aria-valuetext', 'Verified total unavailable')
      note.textContent = 'Campaign figures are temporarily unavailable. No unverified contributions are shown.'
    })
}
