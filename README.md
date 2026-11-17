# Vision Without Borders

Static launch-page skeleton for Vision Without Borders.

## Local Preview

From this folder:

```sh
python3 -m http.server 5176
```

Then open `http://127.0.0.1:5176/`.

### Local Stripe test checkout

Install dependencies with `npm ci`, then run `npm run dev:stripe-test`. The script prompts for a Stripe **test** secret key without displaying or saving it. Open `http://127.0.0.1:8888/2020/` or `http://127.0.0.1:8888/donate/`. Select an amount, review it, and continue to Stripe's hosted test checkout. The static Python preview on port 5176/5178 cannot run the checkout functions. Use Stripe's test card `4242 4242 4242 4242`, any future expiration and any three-digit CVC. The return page checks the Checkout session with Stripe and labels it as a test; it does not record a donation in the public campaign total.

Run `npm test` for server-side checks and `npm run test:e2e` for browser tests. The standard browser tests mock Stripe responses. To run the optional real test-mode handoff check, leave `npm run dev:stripe-test` running in one terminal and run `VWB_RUN_STRIPE_HANDOFF=1 npm run test:e2e` in another. That check confirms redirection to Stripe but does not submit a test card. The test checkout requires both `VWB_ENABLE_TEST_CHECKOUT=1` and an `sk_test_` key. A live key is refused. Do not commit or paste a key into the repository. Production checkout, webhook verification, receipts, and donation ledger reconciliation remain separate work.

## Notes

- `index.html` is the basic homepage with the animated wordmark identity.
- `src/styles.css` contains the page and wordmark animation styles.

## Netlify form email notifications

The `contact` and `sponsor-inquiry` forms are handled by Netlify Forms. The one partnership form has an interest field for the 20/20 founding sponsor or another partnership. After an approved deploy, add an email notification for each form in the Netlify site dashboard:

1. Open **Forms** and select **Enable form detection** if it is not already enabled.
2. Redeploy the site so Netlify discovers both forms and the updated partnership fields.
3. Open **Forms → Submission notifications**.
4. Choose **Add notification → Email notification**.
5. Select the form, enter the destination email address, and save.
6. Repeat for the other form. The partnership form has an `email` field so a notification can use the submitter's address as Reply-to. Review the `partnership-interest` field to distinguish founding sponsor inquiries. The former `founding-sponsor-inquiry` form is no longer displayed; retire any notification tied only to that form after confirming the new `sponsor-inquiry` notification works.

Netlify only discovers form changes during a deploy. Notification recipients must be active Netlify team members or, if the team supports it, outside addresses that confirm receipt. Test each form on the deployed site and confirm both the submission in Netlify and the notification email. Check the recipient's spam folder during the first test. Form submission notifications do not schedule the 12-month sponsor recognition reminder; that requires the separate private record and scheduled notification described in `CAMPAIGN_2020_OPERATIONS.md`.
