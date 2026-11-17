# Vision Without Borders — Website Change Tracker

**Prepared:** 2026-11-16

**Current release:** Local Stripe test checkout branch; not deployed

**Branch:** `codex/stripe-test-checkout` (based on `main` at `63dad20`)
**Companion specification:** `Vision_Without_Borders_Website_Change_Spec.md`

## Status legend

`Not started` · `Blocked / awaiting input` · `In progress` · `Ready for review` · `Approved` · `Deployed` · `Verified` · `Superseded`

| ID | Area | Requested change | Priority | Status | What remains |
| --- | --- | --- | --- | --- | --- |
| VWB-01 | Home | Preserve current home page | Low | Ready for review | Desktop/mobile home views inspected; navigation label changed under VWB-07 |
| VWB-02 | Mission | Exact quote and reordered model/photos | High | Ready for review | Editorial visual approval |
| VWB-03 | About | Bio, ORCID, publication, 2026 work | High | Blocked / awaiting input | Current CV and final bio/title approval; confirm ORCID with Blake |
| VWB-04 | About | Officers & Leadership; Alicia and Kat profiles | High | Blocked / awaiting input | Alicia and Kat cards use user-supplied portraits and subject-area labels; approve profile copy and confirm formal VWB roles before using titles |
| VWB-05 | About | Donor recognition | High | Superseded | Donor remains anonymous; no donor page, name or logo to publish |
| VWB-06 | Timeline | Default timeline, milestones, no repeated photos | High | Blocked / awaiting input | Verify consulting milestone copy; replacement images and image permissions |
| VWB-07 | Donate | Partnerships navigation and hosted donation page | High | In progress | Local test-only Checkout function and E2E tests added; real Stripe test-key run, webhooks, ledger, receipts, and live activation pending |
| VWB-08 | Partnerships | Inquiry routing, lead tracking, alerts | High | Blocked / awaiting input | Confirm Jaime/Jamie address, notification settings, tracking platform and SLA; form remains on Netlify Forms |
| VWB-09 | Contact | Approximately 2× sketch speed | Medium | Ready for review | Reduced-motion and wider device review |
| VWB-10 | Release | QA, changelog, rollback, approval | High | In progress | Full QA, approvals and production deployment |
| VWB-11 | Home | 20/20 Vision feature and two audience CTAs | High | Ready for review | Editorial approval; mobile and keyboard review |
| VWB-12 | /2020 and Donate | Community goal, six giving choices, sponsor status | High | Blocked / awaiting input | Local Stripe test handoff added; reconcile founding gift receipt/ledger, test real Stripe checkout, and approve founder copy before release |
| VWB-13 | Partnerships | Founding sponsor package and private inquiry | High | Blocked / awaiting input | One unified form; Netlify notifications selected; deploy, configure recipient and test delivery; approve benefit terms |
| VWB-14 | Operations | Independent recognition model and 12-month reminder rule | High | Blocked / awaiting input | Private record store and timed reminder delivery; Netlify form alerts cover inquiries only |

## Implementation evidence log

```yaml
Change ID: VWB-01
Owner: Codex / VWB reviewer
Status: Ready for review
Date started: 2026-11-16
Description of implementation: Home layout and interactions retained; Sponsor navigation label changed to Partnerships under VWB-07.
Files / routes modified: index.html (navigation label only); /
Before screenshot or URL: Git parent cd9fe81; /
After screenshot or preview URL: http://127.0.0.1:5176/
Commit / PR link: 7b3e1dd; no PR
Automated tests: HTML IDs/local image paths pass; JS syntax, JSON syntax and git diff whitespace checks pass.
Manual desktop test: Home route loaded with ?skipIntro=1; screenshot inspected. Full interaction regression pending.
Manual mobile test: 390 px screenshot inspected.
Accessibility test: Navigation names checked; full keyboard/contrast audit pending.
Approvals / outstanding questions: Confirm home appearance after navigation label change.
Date deployed: —
Production verification: —
Rollback commit / instructions: Revert 7b3e1dd for navigation; see release section.
```

```yaml
Change ID: VWB-02
Owner: Codex / VWB reviewer
Status: Ready for review
Date started: 2026-11-16
Description of implementation: Exact heading and quote at top; both existing mission photos follow; model follows photos; existing sight story moved below model.
Files / routes modified: mission/index.html, src/styles.css; /mission/
Before screenshot or URL: Git parent cd9fe81; /mission/
After screenshot or preview URL: http://127.0.0.1:5176/mission/
Commit / PR link: 771e016; no PR
Automated tests: HTML IDs/local image paths pass; git diff whitespace check passes.
Manual desktop test: Local browser confirmed exact heading/quote and DOM order; desktop screenshot inspected.
Manual mobile test: 390 px browser screenshot inspected; heading and photographs render in one column.
Accessibility test: Heading order and alt text checked in browser accessibility tree; keyboard/contrast audit pending.
Approvals / outstanding questions: Editorial visual approval.
Date deployed: —
Production verification: —
Rollback commit / instructions: Revert 771e016.
```

```yaml
Change ID: VWB-03
Owner: Codex / VWB reviewer
Status: Blocked / awaiting input
Date started: 2026-11-16
Description of implementation: Drafted founder copy from the supplied specification and prior user statements; made Stanford role past tense; removed fixed publication count; added supplied ORCID link and publisher-verified Dove Press paper.
Files / routes modified: about/index.html; /about/ and news/index.html; /news/
Before screenshot or URL: Git parent cd9fe81; /about/
After screenshot or preview URL: http://127.0.0.1:5176/about/
Commit / PR link: bd0cd7b; no PR
Automated tests: HTML IDs/local image paths pass.
Manual desktop test: Browser accessibility tree confirms new copy, no fixed count, and the publisher-verified paper on About and News.
Manual mobile test: Route loads at 390 px; detailed visual review pending.
Accessibility test: ORCID link is named; full audit pending.
Approvals / outstanding questions: The repository CV was last updated in March 2024 and its text does not cover 2026 roles. Approve copy and formal title; confirm ORCID ownership. Dove Press verifies the paper title, Blake M Snyder as coauthor, publication on November 11, 2026, and the supplied ORCID link. Personal ORCID confirmation with Blake remains pending.
Date deployed: —
Production verification: —
Rollback commit / instructions: Revert bd0cd7b before release if copy is not approved.
```

```yaml
Change ID: VWB-04
Owner: Codex / VWB leadership
Status: Blocked / awaiting input
Date started: 2026-11-16
Description of implementation: Board of Directors preserved. Added a Leadership Team card for Katherine (Kat) Leviste using professional details from her personal site, KATRX (https://katrx.com/), then replaced the initial KATRX team photo with the standalone portrait supplied by the user. Added Alicia Otto's card with a subject-area label and limited website/technology description from the specification. Alicia's initial group-photo crop was superseded by the user's balcony photo with her dog. The current 1100 × 1200 px asset is a direct crop of the 1536 × 2048 px source, ending above her bare legs; the generated preview was discarded because it changed photo details. No formal officer title is asserted for Alicia or Kat. Kat’s card now appears before Alicia’s at the user’s request.
Files / routes modified: about/index.html, src/styles.css (prior Kat card), assets/kat-leviste-headshot.png, assets/alicia-otto-portrait.webp; /about/
Before screenshot or URL: Git parent 412ab95 (Kat card), da06f05 (before Alicia card); /about/
After screenshot or preview URL: http://127.0.0.1:5178/about/
Commit / PR link: 983adcd (Kat profile), 3b9d4f1 (Kat headshot), 9ad636c (Alicia card and initial portrait), cf08d39 (replacement balcony crop), 5977c0e (Kat-first order); no PR
Automated tests: Current Alicia asset identified as 1100 × 1200 px WebP; the original card was checked at a 390 px mobile viewport with no horizontal overflow; git diff whitespace check passed.
Manual desktop test: Local browser accessibility tree at `/about/?preview=kat-first` shows Kat’s portrait, heading and bio before Alicia’s. The replacement crop was visually checked against the 1536 × 2048 px user upload; Alicia and her dog retain the source pixels, and no bare leg appears. Desktop layout recheck of the replacement is pending.
Manual mobile test: Local browser preview shows the replacement Alicia photo in the one-column card with face, dog, and copy visible; no bare leg appears.
Accessibility test: Named Leadership Team section and descriptive Alicia/Kat image alt text checked in the browser accessibility tree; full keyboard/contrast audit pending.
Approvals / outstanding questions: User selected the balcony photo as the replacement and requested the leg-free crop. Confirm Alicia's formal appointment/title and approve the concise website/technology description before release. Confirm Katherine's VWB appointment/title and approve her biography. Kat's supplied source portrait is 600 × 600 px, so assess sharpness on large displays.
Date deployed: —
Production verification: —
Rollback commit / instructions: Revert 5977c0e to restore Alicia-first order. Revert cf08d39 to restore Alicia's initial group-photo crop, or revert 9ad636c too to remove her card and asset. Revert 3b9d4f1 to restore Kat's prior team photo, or revert both 3b9d4f1 and 983adcd to remove Kat's card.
```

```yaml
Change ID: VWB-05
Owner: VWB
Status: Superseded
Date started: —
Description of implementation: No donor page or logo published. The user's anonymity instruction supersedes the earlier recognition request.
Files / routes modified: Vision_Without_Borders_Website_Change_Spec.md; no website route.
Before screenshot or URL: —
After screenshot or preview URL: —
Commit / PR link: d27feab; no PR
Automated tests: —
Manual desktop test: —
Manual mobile test: —
Accessibility test: —
Approvals / outstanding questions: On 2026-11-16 the user directed that the founding donor remain anonymous. Do not publish a donor page, name, logo or identifying profile for this gift. The earlier named-recognition request is superseded.
Date deployed: —
Production verification: —
Rollback commit / instructions: No change to roll back.
```

```yaml
Change ID: VWB-06
Owner: Codex / VWB reviewer
Status: Blocked / awaiting input
Date started: 2026-11-16
Description of implementation: Timeline is default; photo board remains selectable. June fellowship completion and separate 2026 consulting milestone drafted. Publisher-verified November 11, 2026 publication added. Image reuse audited.
Files / routes modified: timeline/index.html, content/timeline.json, src/wordmark.js, admin/config.yml; /timeline/
Before screenshot or URL: Git parent cd9fe81; /timeline/
After screenshot or preview URL: http://127.0.0.1:5176/timeline/
Commit / PR link: 2d454c8; no PR
Automated tests: Timeline JSON parses; JS syntax and HTML IDs/local image paths pass.
Manual desktop test: Local browser shows timeline selected on load and photo board selectable.
Manual mobile test: 390 px timeline card screenshot inspected.
Accessibility test: Toggle pressed states verified in browser accessibility tree; full audit pending.
Approvals / outstanding questions: Confirm consulting copy. Dove Press source confirms the DOI title, date and author list. Image replacements need approved assets and consent. Exact consulting month is unknown and is not asserted on the page.
Date deployed: —
Production verification: —
Rollback commit / instructions: Revert 2d454c8 for timeline changes.
```

```yaml
Change ID: VWB-07
Owner: Codex / VWB finance
Status: Blocked / awaiting input
Date started: 2026-11-16
Description of implementation: Changed Sponsor navigation label to Partnerships while preserving /sponsor/ and sponsorship content. Added a top-level Donate link and a local `/donate/` preview with one-time/monthly choices, five preset amounts ($25–$500), a custom USD amount, a gift review step, invalid-amount feedback, and a disabled hosted-checkout button. No payment data is collected. Added a provider/API decision plan in `DONATION_CHECKOUT_PLAN.md`. On 2026-11-16 the user selected Stripe Checkout Sessions for the custom selector; the plan now records the organization signup path and pending-status tax language. Replaced the Donate hero's custom artwork with VWB's existing full logo. The selection and review steps now show a separate numeric amount and currency/frequency label; the amount shows `-` when empty and `0` when zero is entered. VWB-12 adds a $500 preset and optional campaign query preselection. No checkout API code or account credentials are present yet.
Files / routes modified: Navigation/footer in index.html, about/index.html, mission/index.html, timeline/index.html, news/index.html, sponsor/index.html, contact/index.html; shared CSS cache references in those and existing thanks pages; donate/index.html, src/donate.js, src/styles.css, netlify.toml, DONATION_CHECKOUT_PLAN.md; /donate/.
Before screenshot or URL: Git parent cd9fe81; /sponsor/
After screenshot or preview URL: http://127.0.0.1:5178/donate/
Commit / PR link: 7b3e1dd (Partnerships label), 8170d01 (Donate UI and API plan), 1656b98 (Stripe selection and signup guidance), c36ccbe (logo and numeric amount display); no PR
Automated tests: `node --check src/donate.js` and `git diff --check` passed after the design update; parsed all HTML and checked Donate navigation on all eight main pages and disabled checkout in the Donate page previously.
Manual desktop test: Local browser shows the Donate hero with the existing full VWB logo and the selector. The selected $50 preset reads `50`; custom `0` reads `0`; clearing the custom amount reads `-`; custom `75.25` reads `75.25`. One-time preset selection and custom monthly $75 review displayed correctly previously; returning to edit worked. Zero amount displayed an error and stayed on selection. Checkout remained disabled. Partnerships navigation was checked previously.
Manual mobile test: Pending narrow-viewport browser inspection.
Accessibility test: Browser accessibility tree exposes named navigation, radio groups, custom amount, review button, error, and disabled checkout. Full keyboard and contrast review pending.
Approvals / outstanding questions: Stripe Checkout Sessions is selected. VWB must create/activate its own Stripe account, complete organization and bank payout verification, and provide test integration access through secure environment configuration. Confirm state incorporation and current IRS status; approve amount limits, receipt/tax wording, and nonprofit status language. Run sandbox checkout, success/cancel, webhook, and mobile tests before enabling payments or releasing the Donate link to production.
Date deployed: —
Production verification: —
Rollback commit / instructions: Revert 8170d01 to remove the Donate UI and link; revert 7b3e1dd separately to restore the Sponsor label if desired.
```

**VWB-07 / VWB-12 local test checkout update (2026-11-16):** On `codex/stripe-test-checkout`, added test-key-only Netlify Checkout Session creation and status verification functions, an enabled review button when the local test configuration is present, a test return page, and a clear cancelled-checkout message. The server checks amount, frequency, campaign, origin, and JSON before contacting Stripe. A live key cannot enable this flow. The browser never receives a secret key. The $1–$20,000 limit is a local test policy awaiting approval for production. The public campaign total remains independent of test transactions.

```yaml
Change ID: VWB-07 / VWB-12 local test checkout
Owner: Codex / VWB finance reviewer
Status: In progress; local test path ready, live payments blocked
Date started: 2026-11-16
Description of implementation: Built a server-side Stripe test Checkout handoff for one-time and monthly donations on /donate/ and /2020/. Added server-side test Session verification for the return page, cancellation message, and a private key prompt in the local start script. No live checkout, webhook ledger, or receipt workflow is enabled.
Files / routes modified: donate/index.html, donate/success/index.html, 2020/index.html, src/donate.js, src/donation-success.js, src/styles.css, netlify/functions/donation-checkout.mjs, netlify/functions/donation-status.mjs, tests/donation-checkout.test.mjs, e2e/donation.spec.mjs, playwright.config.mjs, scripts/start-stripe-test.zsh, package.json, package-lock.json, .gitignore, README.md, DONATION_CHECKOUT_PLAN.md
Before screenshot or URL: http://127.0.0.1:5178/donate/ (disabled static preview)
After screenshot or preview URL: http://127.0.0.1:8888/2020/ and /donate/ when npm run dev:stripe-test is running with a private sk_test_ key
Commit / PR link: d380b4c on codex/stripe-test-checkout; no PR or deployment
Automated tests: npm test passed 9/9; npm run test:e2e passed 5/5 in Chrome against local Netlify Dev (Stripe responses mocked; optional real handoff skipped); local Netlify endpoint returned enabled test configuration and rejected an invalid amount with HTTP 400.
Manual desktop test: Local Netlify Dev served /2020/ and the test endpoint. Real hosted Stripe checkout awaits a privately supplied test key.
Manual mobile test: Pending real-key test and narrow-viewport review.
Accessibility test: Browser tests exercised named amount/frequency controls and visible review/cancellation status; full keyboard and screen-reader review pending.
Approvals / outstanding questions: Enter test key only through local prompt, run real Stripe test-card checkout, verify success/cancel and subscription behavior; approve amount cap. Implement signed webhooks, idempotent ledger, receipts, refund handling, tax copy, and production release controls before live payments.
Date deployed: —
Production verification: —
Rollback commit / instructions: Revert d380b4c; existing static donation preview remains on main.
```

```yaml
Change ID: VWB-08
Owner: VWB operations
Status: Blocked / awaiting input
Date started: 2026-11-16
Description of implementation: Confirmed sponsor-inquiry uses Netlify Forms with honeypot and durable submissions expected in Netlify. Removed the existing unapproved 1–2 business-day response promise. No recipients, Trello sync or alerts configured.
Files / routes modified: sponsor/index.html, sponsor/thanks/index.html; /sponsor/
Before screenshot or URL: Git parent cd9fe81; /sponsor/
After screenshot or preview URL: http://127.0.0.1:5176/sponsor/
Commit / PR link: 412ab95; no PR
Automated tests: Form HTML inspected; HTML IDs/local image paths pass.
Manual desktop test: Form structure inspected; live submission not sent.
Manual mobile test: Pending.
Accessibility test: Existing field labels and status region inspected; end-to-end audit pending.
Approvals / outstanding questions: Confirm exact Jaime/Jamie email, Blake recipient, Netlify notification access, tracking tool and follow-up SLA. Test delivery, duplicate/failure handling and alerts after integration is approved.
Date deployed: —
Production verification: —
Rollback commit / instructions: Revert 412ab95.
```

```yaml
Change ID: VWB-09
Owner: Codex / VWB reviewer
Status: Ready for review
Date started: 2026-11-16
Description of implementation: Contact marker draw duration reduced from 4000 ms to 2000 ms; existing reduced-motion completion path retained. The shared script now revalidates so this change can deploy without editing the Contact page.
Files / routes modified: src/wordmark.js and netlify.toml script revalidation header; /contact/
Before screenshot or URL: Git parent cd9fe81; /contact/
After screenshot or preview URL: http://127.0.0.1:5176/contact/
Commit / PR link: 97c01be; no PR
Automated tests: JS syntax check passes.
Manual desktop test: Pending.
Manual mobile test: 390 px browser screenshots show sketch and form after animation.
Accessibility test: Reduced-motion code path reviewed; emulated reduced-motion run pending.
Approvals / outstanding questions: Confirm perceived speed and form appearance on devices.
Date deployed: —
Production verification: —
Rollback commit / instructions: Revert 97c01be, including its script revalidation header.
```

```yaml
Change ID: VWB-10
Owner: Codex / VWB release approver
Status: In progress
Date started: 2026-11-16
Description of implementation: Review branch and change log created; added separate 20/20 campaign change IDs and implementation evidence. On 2026-11-16, fast-forwarded local `main` to include all review-branch commits while preserving their separate history. `origin/main` was not pushed and no production deployment occurred. Stripe is still a disabled UI preview, with no Checkout Session endpoint or webhook handler.
Files / routes modified: This tracker and companion specification; code files listed above.
Before screenshot or URL: Git parent cd9fe81.
After screenshot or preview URL: http://127.0.0.1:5178/2020/ (local preview only)
Commit / PR link: This tracker/specification commit and change commits listed below; no PR
Automated tests: JS syntax, campaign public JSON and recognition schema parse, 4 campaign/recognition unit tests, new-route HTML duplicate IDs/local asset paths, and git diff whitespace checks pass. Before local-main promotion, all four tests passed and key HTML pages had unique IDs. No package.json, build, lint or type command exists.
Manual desktop test: Home, Mission, About, News and Timeline inspected previously; 20/20, Sponsor and Donate campaign path inspected in local browser. Full page and form delivery audit pending.
Manual mobile test: Home, Mission, Timeline and Contact inspected at 390 px; other routes pending.
Accessibility test: Partial browser accessibility-tree checks; keyboard, contrast, reduced-motion and full alt text review pending.
Approvals / outstanding questions: Editorial copy, assets, anonymous gift reconciliation, Stripe Checkout Session and webhook implementation, sandbox payments, Netlify form notification delivery, private reminder integration and production release. No sandbox checkout or live form test is possible with the current disabled UI.
Date deployed: —
Production verification: —
Rollback commit / instructions: Local `main` can return to cd9fe81 before remote publication, or individual commits can be reverted. After deployment, redeploy the prior known-good Netlify commit; verify forms and redirects.
```

```yaml
Change ID: VWB-11
Owner: Codex / VWB reviewer
Status: Ready for review
Date started: 2026-11-16
Description of implementation: Added a 20/20 Vision homepage feature below the existing hero with the requested goal/opportunity line, two distinct CTAs, and a link to /2020/. Following user review, styled the donation link as a filled teal button with a heart icon and the sponsor link as an underlined action with an arrow. The donation action now goes to the in-page giving form at `/2020/#community-giving`. Replaced the card's two zeroes with brand-colored eye marks that blink at staggered intervals, then reshaped them as tall oval zeroes after a second visual review. Raised the eye zeroes slightly to align with the adjacent numerals; animation is disabled for reduced motion.
Files / routes modified: index.html, src/styles.css; /
Before screenshot or URL: Local home page before c671d0a.
After screenshot or preview URL: http://127.0.0.1:5178/?skipIntro=1
Commit / PR link: c671d0a, 6dd130f, 71ba53b (actions), f5edff7 (eye card), 1197041 (zero shape), 876eb80 (campaign form link), 0c51586 (eye alignment); no PR
Automated tests: HTML parse confirms both eye marks and the three campaign links; four campaign/recognition tests and git diff whitespace check pass.
Manual desktop test: Home page accessibility tree confirms both CTAs and the /2020/ link; local screenshots confirm distinct action treatments, zero-shaped eye marks and card fit. After 0c51586, a local screenshot at `/?skipIntro=1&preview=eyes-raised` shows open eye outlines aligned with the adjacent 2s.
Manual mobile test: Pending narrow-viewport check.
Accessibility test: Heading and CTA names exposed in browser accessibility tree; decorative eye marks are hidden from assistive technology and the card retains its accessible link name. Reduced-motion CSS disables blinking; keyboard and contrast review pending.
Approvals / outstanding questions: Approve homepage placement and copy.
Date deployed: —
Production verification: —
Rollback commit / instructions: Revert 0c51586 for the prior eye placement. Revert 1197041 for the original eye shape, then f5edff7 to restore numeric card; revert 71ba53b to restore prior CTAs. Revert 6dd130f and c671d0a together to remove the campaign feature.
```

```yaml
Change ID: VWB-12
Owner: Codex / VWB finance and editorial reviewers
Status: Blocked / awaiting input
Date started: 2026-11-16
Description of implementation: Built /2020/ with a $20,000 community thermometer, six suggested/custom giving choices, a separately labeled $20,000 founding sponsor proposal, potential $40,000 outcome, match status, and founder story. The public snapshot now includes the $10,000 founding gift confirmed by the user, with no donor identity or recognition consent in public data. No match is signed. Added a $500 Donate preset. The two hero actions now use distinct donation and sponsor treatments, with the unintended sponsor border removed. The campaign page now contains its own amount/frequency form and review step; selecting or reviewing a gift does not navigate to Donate. The old static hero poster is replaced by an animated VWB eye and progress ring driven by the same approved public cash snapshot as the thermometer, with reduced-motion support. Match status requires signed terms; fulfilled requires $20,000 verified sponsor receipts.
Files / routes modified: 2020/index.html, content/campaign-2020-public.json, src/campaign.js, src/campaign-status.mjs, src/campaign-status.test.mjs, donate/index.html, src/donate.js, src/styles.css, netlify.toml; /2020/ and /donate/
Before screenshot or URL: No /2020/ route; Donate page before 1e8b3de.
After screenshot or preview URL: http://127.0.0.1:5178/2020/
Commit / PR link: 1e8b3de, 036ffc1, e0244c9, aff0348, 76ddd8a, 1abcb12 (hero actions), 876eb80 (in-page gift flow), 42d85ce (progress visual); no PR
Automated tests: Four match-status and recognition tests pass; campaign JS syntax and git diff whitespace checks pass. Public JSON parse and anonymous snapshot checks passed earlier. Structural HTML check confirmed one donation form, unique IDs and no amount links to Donate.
Manual desktop test: Refreshed /2020/ accessibility tree shows $10,000 in the progress indicator and total, “Anonymous founding gift,” six giving choices, Seeking Sponsor and conditional $40,000 outcome. Local screenshot confirms a filled donation button and underlined sponsor action without the extra border. On `/2020/?preview=flow-v1`, selecting $100 and reviewing the gift kept the campaign URL and displayed 100; checkout remained disabled. On `/2020/?preview=visual-v2`, the hero ring showed 50% and $10,000 of $20,000 from the approved public snapshot, with no poster or sponsor action border.
Manual mobile test: Pending narrow-viewport check.
Accessibility test: Named progress indicator, heading order, and form control names checked in browser accessibility tree; the decorative hero graphic is hidden from assistive technology and respects reduced motion. Keyboard/contrast review pending.
Approvals / outstanding questions: On 2026-11-16 the user confirmed receipt of the $10,000 founding gift and directed anonymity. Reconcile receipt, restrictions and campaign eligibility before release; preserve anonymity in all public materials. Approve founder wording. [Stanford's official profile](https://profiles.stanford.edu/blake-snyder) and [Global Ophthalmology Program](https://med.stanford.edu/ophthalmology/education/fellowships---advanced-training/global-ophthalmology-program.html) support the Clinical Instructor and Cure Blindness Project fellowship-partnership wording. Connect Stripe and an authoritative cash ledger; approve exact match eligibility/deadline only after signed agreement. GA4 and payment reporting are not connected.
Date deployed: —
Production verification: —
Rollback commit / instructions: Revert 42d85ce for the prior hero poster, 876eb80 for amount links to Donate, then 1abcb12 for prior hero actions; revert 76ddd8a, aff0348, e0244c9, 036ffc1 and 1e8b3de for the remaining campaign route. Homepage feature is separate under VWB-11.
```

```yaml
Change ID: VWB-13
Owner: Codex / VWB partnerships reviewer
Status: Blocked / awaiting input
Date started: 2026-11-16
Description of implementation: Added a prominent founding sponsor section to /sponsor/ with proposed 12-month recognition benefits and conditional matching terms. After user review, consolidated the founding and general partnership forms into one private four-step Netlify form with a required interest choice. The inactive submit control is hidden on earlier steps; only “Submit inquiry” appears at the final step. Reduced the wide-layout inquiry heading size and removed its narrow width cap so it stays inside the left column. The user selected Netlify form email notifications. No live notification was configured or sent.
Files / routes modified: sponsor/index.html, src/styles.css, README.md, CAMPAIGN_2020_OPERATIONS.md; /sponsor/
Before screenshot or URL: Sponsor page before 3bc6282.
After screenshot or preview URL: http://127.0.0.1:5178/sponsor/#founding-sponsor
Commit / PR link: 3bc6282, 855f354, 53fd72e (unified form), 35ab4c1 (wide heading fit); no PR
Automated tests: HTML parse confirms exactly one sponsor Netlify form and unique IDs; JS syntax and git diff whitespace checks pass.
Manual desktop test: Screenshot and accessibility tree show sponsor copy, benefits, required interest choice, and one form. Clicked through all four steps with preview data without submitting; the earlier steps expose only Continue, and the final step exposes only Submit inquiry. The former disabled button is not visible or clickable. The `/sponsor/?preview=heading-fit#partnership-inquiry` screenshot shows the heading contained within its left column beside the form.
Manual mobile test: Pending narrow-viewport check.
Accessibility test: Form fields, interest options, and current step action have names in browser accessibility tree; inactive action is absent from the accessible tree. Keyboard/contrast review pending.
Approvals / outstanding questions: Approve proposed benefits and terms. The unified form is not deployed/discovered; configure a recipient for `sponsor-inquiry` under Forms → Submission notifications after approved deployment, confirm recipient if required, and test delivery. Retire any obsolete `founding-sponsor-inquiry` notification after the unified notification is working. No inquiry has been submitted.
Date deployed: —
Production verification: —
Rollback commit / instructions: Revert 35ab4c1 for the prior heading size. Revert 53fd72e to restore two forms, then 855f354 and 3bc6282 to remove the founding sponsor section.
```

```yaml
Change ID: VWB-14
Owner: Codex / VWB sponsor administrator
Status: Blocked / awaiting input
Date started: 2026-11-16
Description of implementation: Defined a private sponsor recognition schema independent from cash donations. Added 12-calendar-month end-date and 30-day reminder-due logic, consent and anonymity gating, plus an operations guide. No private sponsor record, automated notification or public sponsor recognition has been created.
Files / routes modified: content/sponsor-recognition.schema.json, src/sponsor-recognition.mjs, src/sponsor-recognition.test.mjs, CAMPAIGN_2020_OPERATIONS.md.
Before screenshot or URL: No sponsor recognition model.
After screenshot or preview URL: Local files only.
Commit / PR link: bd92b51, bc6d0b4; no PR
Automated tests: Node tests cover 12-month dates, leap-day handling, reminder due, signed agreement, consent, anonymity and expiration.
Manual desktop test: Not applicable to private model.
Manual mobile test: Not applicable to private model.
Accessibility test: Not applicable to private model.
Approvals / outstanding questions: Select private record store, administrator and timed notification channel; connect daily reminder delivery before any signed sponsor receives recognition. Netlify's form-submission email alerts cannot schedule an expiration reminder without a separate job and private record source.
Date deployed: —
Production verification: —
Rollback commit / instructions: Revert bc6d0b4 and bd92b51.
```

## Decisions to record

### Publication source check

The [publisher's article page](https://www.dovepress.com/worksite-vision-screening-for-farmworkers-a-california-bay-area-pilot--peer-reviewed-fulltext-article-OPTH) identifies *Worksite Vision Screening for Farmworkers: A California Bay Area Pilot Study* in *Clinical Ophthalmology*, published November 11, 2026, lists Blake M Snyder among the authors, and links his name to the supplied ORCID iD. This supports the new About, News and Timeline links. It does not replace Blake's approval of his biography or confirm his current employment.

### Donation provider review (2026-11-16)

| Criterion | Zeffy | Stripe Payment Links |
| --- | --- | --- |
| Eligibility and payout | US nonprofits awaiting 501(c)(3) can use it with an EIN and organization-named bank account; payout verification still required. [Zeffy eligibility](https://support.zeffy.com/is-my-organization-eligible-to-use-zeffy-8m24r) | Requires account onboarding and payout setup; nonprofit discount needs registered status and tax documents. [Stripe nonprofit discount](https://support.stripe.com/questions/fee-discount-for-nonprofit-organizations?locale=en-GB) |
| Amounts and recurring | Donation forms support suggested/custom amounts and recurring options. [Zeffy amount options](https://support.zeffy.com/set-suggested-donation-amounts-and-custom-amount-options-3dnzs) | Hosted links support one-time custom amounts or fixed-price recurring gifts; custom amount and recurring are separate link types. [Stripe donation guide](https://support.stripe.com/questions/how-to-accept-donations-through-stripe?locale=en-US) |
| Fees and donor experience | No platform or processing fee to the organization; optional contribution prompt for Zeffy appears at checkout and cannot be removed or defaulted to zero. [Zeffy fee explanation](https://support.zeffy.com/zeffy-really-is-free-no-fees-no-catch-4zjir) | Standard US domestic-card rate is 2.9% + 30¢ unless special pricing applies. [Stripe pricing](https://stripe.com/pricing?locale=en-US) |
| Receipts | Payment confirmations are available, but US tax receipts require confirmed 501(c)(3) status. [Zeffy tax receipts](https://support.zeffy.com/setting-up-your-account-to-generate-receipts-e2fi1) | Hosted payment receipts can be configured; tax-deductibility wording remains VWB's responsibility. |

**Initial provider review:** Zeffy fits the requested preset/custom and recurring donation flow if VWB has an EIN, an organization bank account, and accepts the donor contribution prompt. Selection, onboarding, tax wording, checkout design, and activation remain pending VWB approval. No payment account has been created.

**API/UI update (2026-11-16):** The local Donate preview now uses VWB's own amount and frequency selector. The user selected Stripe's [Checkout Sessions API](https://docs.stripe.com/api/checkout/sessions/create) for that UX; a future server-side function can create a hosted one-time payment or monthly subscription session from validated input. Zeffy's [published API](https://support.zeffy.com/get-started-with-the-zeffy-api-yourg) is read-only for payments, contacts and campaigns; its [hosted/embedded campaign](https://support.zeffy.com/how-to-embed-your-zeffy-campaign-on-your-website-km0gv) remains an alternative if the decision changes. Stripe [Payment Links](https://support.stripe.com/questions/how-to-accept-donations-through-stripe?locale=en-US) allow a donor-chosen amount for one-time gifts only in the documented no-code flow. See `DONATION_CHECKOUT_PLAN.md` for signup requirements. The local route cannot take payment and has not been deployed.

| Decision | Current proposal | Final decision | Approver / date |
| --- | --- | --- | --- |
| Formal Blake title | Founder & President (already on Board listing) | Pending | — |
| Alicia title | CTO, subject to appointment | Pending | — |
| Kat title | Director of Clinical Innovation | Pending | — |
| Donor page URL | `/about/donors/` | Pending | — |
| Donation processor | Stripe Checkout Sessions for the custom VWB selector | Selected for integration; activation pending | User / 2026-11-16 |
| Anonymous initial campaign gift | $10,000 starting gift | User confirms receipt and requests anonymity; included in local preview, receipt/ledger review pending before release | User / 2026-11-16 |
| Sponsor matching terms | One $20,000 commitment | Signed agreement, eligible gifts and deadline pending; status Seeking Sponsor | — |
| Sponsor recognition | Proposed 12 months from agreed start | Benefits and consent pending; timed reminder delivery not connected | — |
| Inquiry notification | Netlify Forms email | Selected; new form must be deployed/discovered and recipient configured/tested | User / 2026-11-16 |
| Founder story | Stanford role in past tense; Cure Blindness Project work attributed to founder only | Blake's wording approval pending | — |
| Sponsor lead tracking | Trello or replacement | Pending | — |
| Follow-up SLA | Two business days | Pending; existing promise removed | — |
| Production release | Explicit approval required | Pending | — |

## Photo reuse audit and requested assets

The current home photo wall is preserved. Several photos therefore also appear on other pages. Replacement requires rights-cleared images with subject and location captions confirmed by VWB. Institution/media marks are excluded from the photo-uniqueness rule.

| Photo / asset | Current location(s) | Proposed location | Reused? | Replacement requested |
| --- | --- | --- | --- | --- |
| `mission-hero-clinical-exam.webp` | Mission; timeline photo board | Mission | Yes | Distinct timeline clinical image, landscape at least 1600 × 1200 px |
| `rwanda-child-eye-exam.webp` | Home, Mission, timeline | Mission | Yes | Distinct Rwanda mission or timeline image, portrait at least 1200 × 1600 px |
| `mission-partnership-fieldwork.webp` | Home, Mission, timeline board | Mission | Yes | Distinct timeline partnership image, landscape at least 1600 × 1200 px |
| `about-paraguay-community.webp` and `about-paraguay-eye-exam.webp` | Home and About | About | Yes | Two distinct Paraguay outreach images, portrait at least 1200 × 1600 px |
| `india-clinical-teaching.webp` | Home and News | News | Yes | Distinct teaching image, portrait at least 1200 × 1600 px |
| `IMG_1788.jpg` | News and Timeline | Timeline | Yes | Distinct Ethiopia research/news image, landscape at least 1600 × 1200 px |
| Kat standalone headshot | User-supplied 600 × 600 px portrait | Leadership profile draft | No VWB reuse found | Visual approval; higher-resolution original if available for large displays |
| Alicia portrait crop | User-supplied 1536 × 2048 px balcony photo; direct crop saved at `assets/alicia-otto-portrait.webp` (1100 × 1200 px) | Leadership profile draft | No VWB reuse found | User selected this replacement and requested no bare leg in frame; approve profile copy and formal role before release |
| Founding donor logo | Not supplied | None; donor anonymity requested | — | No logo to publish |

Other repeated headshots and logos are intentional identity/attribution elements pending editorial review. Raw `IMG_` and screenshot files require crop, context and consent review before use.

## Release history

### Separate commits on local main

Each implemented website change retains its own commit on local `main` after a fast-forward from `codex/vwb-website-changes`. The remote `origin/main` remains at `cd9fe81`. For a later production release, select or revert commits as approved, then run the checks and update this tracker. VWB-01 is a regression check; VWB-05 has no code yet. VWB-04 has separate commits for Kat's draft profile, Kat's supplied headshot, Alicia's card, and Alicia's replacement balcony crop; neither card uses an unapproved formal title. VWB-07 has separate Partnerships-label and Donate-UI commits; the Donate UI commit must not be promoted as a live payment flow until hosted checkout is connected and tested. VWB-08 only removes the unapproved response-time promise; form delivery and alerts remain blocked. VWB-11 through VWB-14 add the campaign in separate homepage, campaign page, sponsor page and operations commits; VWB-12 also updates the Donate selector and requires VWB-07. The shared `src/wordmark.js` file has separate, non-overlapping edits in VWB-06 and VWB-09.

| Change | Commit | Scope |
| --- | --- | --- |
| VWB-02 | `771e016` | Mission content and mission CSS cache version |
| VWB-03 | `bd0cd7b` | About bio, ORCID, and News research citation |
| VWB-04 | `983adcd` + `3b9d4f1` + `9ad636c` + `cf08d39` + `5977c0e` | Kat leadership card and supplied headshot; Alicia technology card and final balcony crop showing no bare leg; Kat displayed first |
| VWB-06 | `2d454c8` | Timeline content, default view, and CMS fields |
| VWB-07 | `7b3e1dd` + `8170d01` + `1656b98` + `c36ccbe` | Partnerships navigation label; Donate UI preview and design refinement; Stripe Checkout selection and signup plan |
| VWB-08 | `412ab95` | Sponsor response wording |
| VWB-09 | `97c01be` | Contact sketch speed and shared script revalidation |
| VWB-11 | `c671d0a` + `6dd130f` + `71ba53b` + `f5edff7` + `1197041` + `876eb80` + `0c51586` | Homepage campaign feature, differentiated action links, blinking eye card, zero-shaped refinement and vertical alignment; design commits can be selected independently in order |
| VWB-05 | `d27feab` | Superseded named donor recognition in publicly served specification; keep donor anonymous |
| VWB-12 | `1e8b3de` + `036ffc1` + `e0244c9` + `aff0348` + `76ddd8a` + `1abcb12` + `876eb80` + `42d85ce` | /2020/, public snapshot, anonymous $10,000 founding gift, in-page community giving and review, signed-match guard, sourced founder story, differentiated hero actions and snapshot-driven progress visual; depends on VWB-07 Donate UI |
| VWB-13 | `3bc6282` + `855f354` + `53fd72e` + `35ab4c1` | Founding sponsor proposal and one private partnership form with an interest choice; notification preparation |
| VWB-14 | `bd92b51` + `bc6d0b4` | Private recognition schema, date/reminder rules and operations guide |

The VWB-10 documentation commits record the local review and promotion history. Moving commits to local `main` is not a production release.


| Release date | Version | Change IDs | PR / commit | Preview | QA result | Approved by | Rollback |
| --- | --- | --- | --- | --- | --- | --- | --- |
| — | Local main draft | 01–14 | `main` through `49681c6` before this tracker update; `origin/main` remains `cd9fe81` | Local `http://127.0.0.1:5178/?skipIntro=1` and `/2020/` | Partial; 4 unit tests pass; Stripe and release checks pending | Local promotion requested by user on 2026-11-16 | `cd9fe81` |
| — | Local Stripe test branch | VWB-07, VWB-12 | `d380b4c` | `http://127.0.0.1:8888/2020/` when started with a private test key | 9 unit checks and 5 mocked-browser checks pass; real Stripe test payment pending | Not approved for production | Revert `d380b4c` |

## Notes

This tracker records local work, not live-site changes. The latest Stripe test checkout work is isolated on `codex/stripe-test-checkout`; `main` and `origin/main` were aligned at `63dad20` when that branch was created. Do not store bank details, payment credentials, email secrets or private form submissions here. For the disabled static preview, start `python3 -m http.server 5178`; for the test checkout, use `npm run dev:stripe-test` and a private Stripe test key.
