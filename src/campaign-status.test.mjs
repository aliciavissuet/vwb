import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { foundingMatchStatus } from './campaign-status.mjs'

const proposed = { commitment_cents: 2000000, agreement_status: 'none', signed_at: null, match_eligibility: false, match_deadline: null, verified_received_cents: 0 }

test('a proposal or unsigned match remains Seeking Sponsor', () => {
  assert.equal(foundingMatchStatus(proposed), 'Seeking Sponsor')
  assert.equal(foundingMatchStatus({ ...proposed, agreement_status: 'signed', signed_at: '2026-11-16', match_eligibility: true }), 'Seeking Sponsor')
})

test('signed eligible commitment and verified receipts determine public status', () => {
  const signed = { ...proposed, agreement_status: 'signed', signed_at: '2026-11-16', match_eligibility: true, match_deadline: '2027-01-31' }
  assert.equal(foundingMatchStatus(signed), 'Secured')
  assert.equal(foundingMatchStatus({ ...signed, verified_received_cents: 1999999 }), 'Secured')
  assert.equal(foundingMatchStatus({ ...signed, verified_received_cents: 2000000 }), 'Fulfilled')
})
