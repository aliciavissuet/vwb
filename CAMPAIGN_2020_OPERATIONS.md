# 20/20 Vision campaign operations

**Status:** Local review branch. The public campaign page is a preview, not a live fundraising ledger or payment flow.

## Two audiences and two cash streams

- **Community donors:** $25, $50, $100, $250, $500, or a custom amount toward a $20,000 community cash goal. The existing Donate page previews one-time and monthly selections; Stripe checkout remains disabled until account setup, server validation, webhook verification, and receipts are tested.
- **Founding sponsor:** One proposed $20,000 matching commitment with a separate private inquiry form and a proposed 12-month recognition package. An inquiry is not an agreement, and a signed commitment is not cash received.
- **Founder services:** If documented and approved, the founder's professional-services pledge belongs in a separate in-kind record. It is never included in community cash, sponsor cash, or the thermometer.

The potential $40,000 outcome is $20,000 in community cash plus $20,000 in sponsor cash **if** the agreement is signed, eligible gifts are defined, the commitment is fulfilled, and the money is received. The public match status is **Seeking Sponsor** until a signed agreement records the commitment, eligibility and deadline. It becomes **Secured** only after that; **Fulfilled** requires verified sponsor receipts of $20,000. Sponsor receipts never increase the community thermometer.

## Verified-only public snapshot

`content/campaign-2020-public.json` is the published, non-private snapshot consumed by `/2020/`. Its community total is currently **$0** because no verified campaign cash ledger was supplied. Do not substitute a form submission, success-page visit, pledge, or Stripe Checkout Session creation for confirmed cash. Reconcile refunds, disputes, and recurring payments before publishing an updated total. Record the `as_of` date with each approved update. The static file has no live payment sync.

The proposed WHH Foundation $10,000 initial gift remains excluded. Before showing its amount or name, VWB must confirm the receipt, amount, any restrictions, eligibility for this campaign, and donor recognition permission. Only then set `verified`, `campaign_eligible`, and `recognition_consent` to true, provide the exact amount in cents, and include that amount in `verified_community_cash_cents`. The page hides WHH's name and amount until all conditions are met. No WHH logo should be added without an approved asset and usage rights.

The public sponsor snapshot must be derived from the **private** agreement and cash records. `agreement_status: signed`, `signed_at`, `match_eligibility: true`, a deadline, and the $20,000 commitment are all required before a secured status appears. A fulfilled status also requires $20,000 in verified sponsor receipts. The public JSON must never contain private inquiry content, a sponsor name, or a logo without separate recognition approval.

## Private recognition record and expiration

`content/sponsor-recognition.schema.json` defines the private sponsor record independently of donor transactions. It includes `sponsor_name`, `sponsor_logo`, `recognition_consent`, `sponsorship_agreement_status`, `commitment_amount`, `match_eligibility`, `match_deadline`, `recognition_start`, `recognition_end`, and `anonymity_preference`, plus signed/receipt/reminder fields. **Do not place completed records in this public repository or served `/content/` directory.** Keep them in an access-controlled administrative system.

On agreement, set an agreed `recognition_start`. `src/sponsor-recognition.mjs` computes an exclusive `recognition_end` 12 calendar months later and `reminder_due` 30 calendar days before that. For a February 29 start, the end is February 28 in the following year. Public recognition requires a signed agreement, written consent, public anonymity preference, and a date within that period. A daily admin job should create an owner-visible reminder on `reminder_due` and record `reminder_sent_at` to prevent duplicates. **Reminder delivery is not connected yet:** VWB must choose the private record store, owner, and notification channel before a sponsor is signed. The due-date and eligibility logic is covered by a Node test.

## Inquiry and payment follow-through

The separate `founding-sponsor-inquiry` Netlify form collects organization, contact name, email, optional message, and contact consent. It does not collect payment, create an agreement, or publish recognition. Before launch, configure its private notification recipient, spam controls, retention/access policy, and a test submission in the deployed Netlify environment. The existing general sponsorship form remains separate.

For community gifts, use the selected Stripe Checkout Sessions design in `DONATION_CHECKOUT_PLAN.md`. Validate campaign ID, amount, currency and frequency server-side. Count completed donations only from verified, idempotently processed provider webhooks. Keep donation and sponsor ledgers separate; reconcile actual receipts and refunds. Confirm tax wording and nonprofit status before enabling checkout.

## Analytics and release checks

Use the `campaign=2020` query parameter for the preview's donation path. When GA4 is approved and configured, track campaign page visits and `donate_click` with consent-aware attribution; preserve UTM parameters to the checkout session server-side. Measure completed donations and dollars from verified payment records, not analytics events. Track sponsor inquiries separately. No analytics account, webhook, or GA4 event has been connected yet.

Before release: verify WHH documentation and donor consent, approve founder copy, sign any sponsor agreement before advertising a match, test sponsor form delivery privately, finish Stripe test checkout and webhook reconciliation, run mobile/keyboard/contrast checks, and approve the published campaign figures and copy. No production deployment has been made from this branch.
