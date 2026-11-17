# 20/20 Vision campaign operations

**Status:** Local review branch. The public campaign page is a preview, not a live fundraising ledger or payment flow.

## Two audiences and two cash streams

- **Community donors:** $25, $50, $100, $250, $500, or a custom amount toward a $20,000 community cash goal. The `/2020/` campaign page and existing Donate page both preview one-time and monthly selections. The homepage donation action leads to the campaign form; choosing and reviewing an amount stays on that page. Stripe checkout remains disabled until account setup, server validation, webhook verification, and receipts are tested.
- **Founding sponsor:** One proposed $20,000 matching commitment with a private partnership inquiry path and a proposed 12-month recognition package. An inquiry is not an agreement, and a signed commitment is not cash received.
- **Founder services:** If documented and approved, the founder's professional-services pledge belongs in a separate in-kind record. It is never included in community cash, sponsor cash, or the thermometer.

The potential $40,000 outcome is $20,000 in community cash plus $20,000 in sponsor cash **if** the agreement is signed, eligible gifts are defined, the commitment is fulfilled, and the money is received. The public match status is **Seeking Sponsor** until a signed agreement records the commitment, eligibility and deadline. It becomes **Secured** only after that; **Fulfilled** requires verified sponsor receipts of $20,000. Sponsor receipts never increase the community thermometer.

## Verified-only public snapshot

`content/campaign-2020-public.json` is the published, non-private snapshot consumed by `/2020/`. Its community total is currently **$10,000**, based on the user's direct confirmation on 2026-11-16 that VWB received the founding gift. The receipt and campaign ledger have not been reviewed in this environment; reconcile them before production release. Do not substitute a form submission, success-page visit, pledge, or Stripe Checkout Session creation for confirmed cash. Reconcile refunds, disputes, and recurring payments before publishing subsequent totals. Record the `as_of` date with each approved update. The static file has no live payment sync.

The founding contribution is represented as an **anonymous** $10,000 gift. The user confirmed it was received and directed that the donor remain anonymous. The public JSON therefore has no donor name and `recognition_consent` is false; the page displays “Anonymous founding gift.” Keep the donor identity and logo off all public pages and assets. The receipt and campaign restrictions have not been reviewed here, so confirm the ledger and eligibility before production release.

The public sponsor snapshot must be derived from the **private** agreement and cash records. `agreement_status: signed` (or `completed` after fulfillment), `signed_at`, `match_eligibility: true`, a deadline, and the $20,000 commitment are all required before a secured status appears. A fulfilled status also requires $20,000 in verified sponsor receipts. The public JSON must never contain private inquiry content, a sponsor name, or a logo without separate recognition approval.

## Private recognition record and expiration

`content/sponsor-recognition.schema.json` defines the private sponsor record independently of donor transactions. It includes `sponsor_name`, `sponsor_logo`, `recognition_consent`, `sponsorship_agreement_status`, `commitment_amount`, `match_eligibility`, `match_deadline`, `recognition_start`, `recognition_end`, and `anonymity_preference`, plus signed/receipt/reminder fields. **Do not place completed records in this public repository or served `/content/` directory.** Keep them in an access-controlled administrative system.

On agreement, set an agreed `recognition_start`. `src/sponsor-recognition.mjs` computes an exclusive `recognition_end` 12 calendar months later and `reminder_due` 30 calendar days before that. For a February 29 start, the end is February 28 in the following year. Public recognition requires a signed agreement, written consent, public anonymity preference, and a date within that period. A daily admin job should create an owner-visible reminder on `reminder_due` and record `reminder_sent_at` to prevent duplicates. **Reminder delivery is not connected yet:** VWB must choose the private record store, owner, and notification channel before a sponsor is signed. The due-date and eligibility logic is covered by a Node test.

## Inquiry and payment follow-through

The single `sponsor-inquiry` Netlify form serves founding sponsor and other partnership inquiries. Its required `partnership-interest` field distinguishes the two; it also collects organization, contact name, email, optional partnership details, and contact consent. It does not collect payment, create an agreement, or publish recognition. VWB chose Netlify form email notifications for inquiries on 2026-11-16. Before launch, deploy the approved branch so Netlify discovers the updated form, configure its private notification recipient under **Forms → Submission notifications**, confirm the recipient if Netlify requires it, and test both the deployed submission and email delivery. The former `founding-sponsor-inquiry` form is no longer displayed; retire its notification only after the unified form notification works. Netlify form notifications are triggered by submissions; they do not deliver the time-based recognition expiration reminder.

For community gifts, use the selected Stripe Checkout Sessions design in `DONATION_CHECKOUT_PLAN.md`. Validate campaign ID, amount, currency and frequency server-side. Count completed donations only from verified, idempotently processed provider webhooks. Keep donation and sponsor ledgers separate; reconcile actual receipts and refunds. Confirm tax wording and nonprofit status before enabling checkout.

## Analytics and release checks

Use `/2020/#community-giving` for the homepage campaign donation action. The standalone Donate preview still accepts `campaign=2020` for direct links. When GA4 is approved and configured, track campaign page visits and `donate_click` with consent-aware attribution; preserve UTM parameters to the checkout session server-side. Measure completed donations and dollars from verified payment records, not analytics events. Track sponsor inquiries separately. No analytics account, webhook, or GA4 event has been connected yet.

Before release: reconcile the anonymous founding gift against the receipt and campaign ledger, preserve donor anonymity, approve founder copy, sign any sponsor agreement before advertising a match, test sponsor form delivery privately, finish Stripe test checkout and webhook reconciliation, run mobile/keyboard/contrast checks, and approve the published campaign figures and copy. No production deployment has been made from this branch.
