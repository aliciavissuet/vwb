# Donation checkout plan

**Reviewed:** 2026-11-16  
**Status:** UI preview built; Stripe Checkout Sessions selected; account onboarding and live payments pending

## Provider finding

The current VWB page lets a donor choose a one-time or monthly gift and a preset or custom amount before checkout. **VWB selected Stripe Checkout Sessions for this flow on 2026-11-16.** A server-side endpoint can validate the amount and frequency, create a hosted Checkout Session in `payment` or `subscription` mode, and return the hosted checkout URL. Stripe's hosted page collects card details. Its API supports success and cancel URLs and a donation-specific submit label. The browser must never receive a Stripe secret key or raw card details. [Checkout Sessions API](https://docs.stripe.com/api/checkout/sessions/create)

**Zeffy is the lower-fee hosted-form alternative.** Its campaign form already supports suggested/custom amounts and recurring frequencies, and it can be linked or embedded. Its published API provides read access to payments, contacts, and campaigns, plus webhooks; it does not describe an API for creating a payment checkout from VWB's own amount selector. If VWB chooses Zeffy, replace the custom selector with the Zeffy campaign form or link so donors do not make the same selection twice. Zeffy confirmation and any custom redirect need configuration in Zeffy. [Zeffy amount options](https://support.zeffy.com/set-suggested-donation-amounts-and-custom-amount-options-3dnzs) · [Zeffy embed](https://support.zeffy.com/how-to-embed-your-zeffy-campaign-on-your-website-km0gv) · [Zeffy API](https://support.zeffy.com/get-started-with-the-zeffy-api-yourg) · [Zeffy redirect](https://support.zeffy.com/how-to-redirect-donors-to-a-custom-thank-you-page-9mjy3)

Stripe Payment Links are an easier no-code fallback, but Stripe's donation guide says a donor-chosen amount is one-time only in that flow; recurring Payment Links use fixed amounts. That does not fully match VWB's current custom monthly selector. [Stripe donation guide](https://support.stripe.com/questions/how-to-accept-donations-through-stripe?locale=en-US)

## Stripe signup for VWB

Create a normal Stripe account directly for **Vision Without Borders**, with the United States as the account country if that is the organization's actual country of registration. This integration uses Stripe Payments and Checkout Sessions; it does not require Stripe Atlas or a Stripe Connect platform account. During activation, use the organization's exact legal name and EIN. If VWB is incorporated or registered as a nonprofit, choose the nonprofit organization business type when Stripe offers it; choose the entity structure that matches its formation documents. Stripe may request formation documents and details of an authorized representative. Link an organization-owned bank account for payouts in Stripe's dashboard. [Stripe getting started](https://support.stripe.com/topics/getting-started) · [Business type guidance](https://support.stripe.com/questions/how-to-determine-your-business-type-and-structure) · [US nonprofit tax information](https://support.stripe.com/questions/tax-information-to-submit-when-signing-up-for-stripe-as-a-us-based-nonprofit-or-tax-exempt-organization) · [Entity verification](https://support.stripe.com/questions/legal-entity-documentation-requirement)

State nonprofit incorporation and federal 501(c)(3) recognition are different facts. If IRS recognition is still pending, do not claim it has been granted or promise tax deductibility. The IRS says donors have no advance assurance of deductibility while an application is pending. Stripe's nonprofit processing discount requires valid documentation confirming registered nonprofit status and other eligibility conditions; request it only when VWB can document eligibility. [IRS pending-application guidance](https://www.irs.gov/charities-non-profits/charitable-organizations/exempt-organizations-general-issues-deductibility-of-contributions-while-application-pending) · [Stripe nonprofit discount](https://support.stripe.com/questions/fee-discount-for-nonprofit-organizations?locale=en-GB)

Do not send an EIN, representative ID, bank details, or Stripe secret keys in chat or commit them to Git. Enter identity and payout information directly in Stripe. The developer integration will later need a test-mode secret key and webhook signing secret stored in Netlify environment variables, followed by live-mode equivalents only after sandbox checkout and copy are approved.

## Proposed Stripe integration boundary

1. Add a server-side Netlify Function such as `POST /.netlify/functions/create-donation-checkout`. Accept only `{ amountCents, frequency }` from the page. Validate currency, minimum/maximum policy, integer cents, and the allowed frequencies on the server. Do not trust the displayed amount.
2. Create one hosted Checkout Session with `mode=payment` for one-time gifts or `mode=subscription` with a monthly recurring Price for monthly gifts. Use the approved organization name and donation copy. Return only the Checkout URL. Redirect the browser there.
3. Configure cancel and success routes. A success-page visit alone does **not** prove payment. Verify signed provider webhooks, handle retries idempotently, and use confirmed payment/subscription events for donor records and any receipt or acknowledgement workflow. [Stripe fulfillment guidance](https://docs.stripe.com/checkout/fulfillment)
4. Keep `STRIPE_SECRET_KEY` and webhook signing secret in deployment environment variables. Do not put keys, bank data, or donor card fields in this repository.
5. Test one-time, custom, monthly, cancellation, failed payment, duplicate webhook, receipt, and mobile checkout in provider test mode before enabling the button or promoting the Donate link to production.

## Decisions before activation

- Stripe Checkout Sessions is selected. Confirm that VWB's Stripe account is eligible and activated for this charitable purpose. Stripe requires donations to be tied to a specific charitable purpose and used for it. [Stripe donation requirements](https://support.stripe.com/embedded-connect/questions/requirements-for-accepting-tips-or-donations?locale=en-GB)
- Complete organization account and bank payout onboarding securely in the provider dashboard.
- Approve gift amount limits, suggested amounts, receipt text, and any tax-deductibility language after verifying current organization status.
- Decide how donor records, refunds, recurring gift changes, and support inquiries will be handled.

The local `/donate/` route is a reviewable UI preview. Its final checkout button is disabled, so it cannot collect a payment.
