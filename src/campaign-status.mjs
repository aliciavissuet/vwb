export function foundingMatchStatus(sponsor) {
  const signed = sponsor?.agreement_status === 'signed' && Boolean(sponsor.signed_at) && sponsor.match_eligibility === true && Boolean(sponsor.match_deadline) && sponsor.commitment_cents === 2000000
  if (!signed) return 'Seeking Sponsor'
  const received = Number.isSafeInteger(sponsor.verified_received_cents) && sponsor.verified_received_cents >= 0 ? sponsor.verified_received_cents : 0
  return received >= 2000000 ? 'Fulfilled' : 'Secured'
}
