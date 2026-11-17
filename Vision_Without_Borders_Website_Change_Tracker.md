# Vision Without Borders — Website Change Tracker

**Prepared:** 2026-11-16

**Current release:** Review branch only; not deployed

**Branch:** `codex/vwb-website-changes`
**Companion specification:** `Vision_Without_Borders_Website_Change_Spec.md`

## Status legend

`Not started` · `Blocked / awaiting input` · `In progress` · `Ready for review` · `Approved` · `Deployed` · `Verified`

| ID | Area | Requested change | Priority | Status | What remains |
| --- | --- | --- | --- | --- | --- |
| VWB-01 | Home | Preserve current home page | Low | Ready for review | Desktop/mobile home views inspected; navigation label changed under VWB-07 |
| VWB-02 | Mission | Exact quote and reordered model/photos | High | Ready for review | Editorial visual approval |
| VWB-03 | About | Bio, ORCID, publication, 2026 work | High | Blocked / awaiting input | Current CV and final bio/title approval; confirm ORCID with Blake |
| VWB-04 | About | Officers & Leadership; Alicia and Kat profiles | High | Blocked / awaiting input | Alicia and Kat cards use user-supplied portraits and subject-area labels; approve profile copy and confirm formal VWB roles before using titles |
| VWB-05 | About | WHH Foundation donor recognition | High | Blocked / awaiting input | Legal name, mission, donation attribution, official logo and permission, donor approval |
| VWB-06 | Timeline | Default timeline, milestones, no repeated photos | High | Blocked / awaiting input | Verify consulting milestone copy; replacement images and image permissions |
| VWB-07 | Donate | Partnerships navigation and hosted donation page | High | Blocked / awaiting input | Processor selection, eligibility, bank payout, nonprofit/tax wording, sandbox checkout; Partnerships label done |
| VWB-08 | Partnerships | Inquiry routing, lead tracking, alerts | High | Blocked / awaiting input | Confirm Jaime/Jamie address, notification settings, tracking platform and SLA; form remains on Netlify Forms |
| VWB-09 | Contact | Approximately 2× sketch speed | Medium | Ready for review | Reduced-motion and wider device review |
| VWB-10 | Release | QA, changelog, rollback, approval | High | In progress | Full QA, approvals and production deployment |

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
Description of implementation: Board of Directors preserved. Added a Leadership Team card for Katherine (Kat) Leviste using professional details from her personal site, KATRX (https://katrx.com/), then replaced the initial KATRX team photo with the standalone portrait supplied by the user. Added Alicia Otto's card with a subject-area label and limited website/technology description from the specification. Cropped the user-supplied group photo to Alicia on the right, excluding every other person. The final website asset is a pixel-preserving crop of the original photo, not the generated edit. No formal officer title is asserted for Alicia or Kat.
Files / routes modified: about/index.html, src/styles.css (prior Kat card), assets/kat-leviste-headshot.png, assets/alicia-otto-portrait.webp; /about/
Before screenshot or URL: Git parent 412ab95 (Kat card), da06f05 (before Alicia card); /about/
After screenshot or preview URL: http://127.0.0.1:5178/about/
Commit / PR link: 983adcd (Kat profile), 3b9d4f1 (Kat headshot), 9ad636c (Alicia portrait and card); no PR
Automated tests: Local Alicia image loaded at its natural 600 × 850 px dimensions; 390 px mobile viewport had no horizontal overflow; git diff whitespace check passed.
Manual desktop test: Local browser preview shows both leadership cards. Alicia's crop was visually checked against the 2048 × 1536 px user upload; no other person remains in frame, and the face and clothing retain the source pixels.
Manual mobile test: 390 px browser preview shows the Alicia card in one column, with image and copy visible.
Accessibility test: Named Leadership Team section and descriptive Alicia/Kat image alt text checked in the browser accessibility tree; full keyboard/contrast audit pending.
Approvals / outstanding questions: User selected the group photo for Alicia and requested this crop. Confirm Alicia's formal appointment/title and approve the concise website/technology description before release. Confirm Katherine's VWB appointment/title and approve her biography. Kat's supplied source portrait is 600 × 600 px, so assess sharpness on large displays.
Date deployed: —
Production verification: —
Rollback commit / instructions: Revert 9ad636c to remove Alicia's card and cropped asset. Revert 3b9d4f1 to restore Kat's prior team photo, or revert both 3b9d4f1 and 983adcd to remove Kat's card.
```

```yaml
Change ID: VWB-05
Owner: VWB / WHH Foundation
Status: Blocked / awaiting input
Date started: —
Description of implementation: No donor page or logo published.
Files / routes modified: None.
Before screenshot or URL: —
After screenshot or preview URL: —
Commit / PR link: —
Automated tests: —
Manual desktop test: —
Manual mobile test: —
Accessibility test: —
Approvals / outstanding questions: Confirm legal name, website, mission, donation relationship, official logo rights and donor-approved acknowledgement.
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
Description of implementation: Changed Sponsor navigation label to Partnerships while preserving /sponsor/ and sponsorship content. No Donate link or checkout is exposed until a usable hosted processor exists.
Files / routes modified: Navigation in index.html, about/index.html, mission/index.html, timeline/index.html, news/index.html, sponsor/index.html, contact/index.html.
Before screenshot or URL: Git parent cd9fe81; /sponsor/
After screenshot or preview URL: http://127.0.0.1:5176/sponsor/
Commit / PR link: 7b3e1dd; no PR
Automated tests: HTML IDs/local image paths pass.
Manual desktop test: Partnerships navigation reaches existing sponsorship page.
Manual mobile test: Pending.
Accessibility test: Navigation link names checked in browser accessibility tree.
Approvals / outstanding questions: Select Zeffy or Stripe after checking current eligibility, fees, recurring gifts, receipts, tax language and bank payout. A Donate link would lead to an incomplete flow now.
Date deployed: —
Production verification: —
Rollback commit / instructions: Revert 7b3e1dd.
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
Description of implementation: Review branch and change log created; no production deployment.
Files / routes modified: This tracker and companion specification; code files listed above.
Before screenshot or URL: Git parent cd9fe81.
After screenshot or preview URL: http://127.0.0.1:5176/ (local preview only)
Commit / PR link: This tracker/specification commit plus 771e016, bd0cd7b, 2d454c8, 7b3e1dd, 412ab95 and 97c01be; no PR
Automated tests: JS syntax, timeline JSON parse, HTML duplicate IDs/local image paths and git diff whitespace checks pass. No package.json, build, lint or type command exists.
Manual desktop test: Home, Mission, About, News and Timeline inspected in local browser; full page and form audit pending.
Manual mobile test: Home, Mission, Timeline and Contact inspected at 390 px; other routes pending.
Accessibility test: Partial browser accessibility-tree checks; keyboard, contrast, reduced-motion and full alt text review pending.
Approvals / outstanding questions: Editorial copy, assets, payments, form routing, integration and release approvals. No sandbox checkout or live form test possible before configuration.
Date deployed: —
Production verification: —
Rollback commit / instructions: Before deployment, reset the review branch to cd9fe81 or revert selected change commits. After deployment, redeploy the prior known-good Netlify commit; verify forms and redirects.
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

**Provisional choice:** Zeffy fits the requested preset/custom and recurring donation flow if VWB has an EIN, an organization bank account, and accepts the donor contribution prompt. Selection, onboarding, tax wording, checkout design, and activation remain pending VWB approval. No payment account or live Donate route was created.

| Decision | Current proposal | Final decision | Approver / date |
| --- | --- | --- | --- |
| Formal Blake title | Founder & President (already on Board listing) | Pending | — |
| Alicia title | CTO, subject to appointment | Pending | — |
| Kat title | Director of Clinical Innovation | Pending | — |
| Donor page URL | `/about/donors/` | Pending | — |
| Donation processor | Evaluate Zeffy; fallback Stripe | Pending | — |
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
| Alicia portrait crop | User-supplied 2048 × 1536 px group photo; crop saved at `assets/alicia-otto-portrait.webp` (600 × 850 px) | Leadership profile draft | No VWB reuse found | User selected source and requested removal of other people; approve profile copy and formal role before release |
| WHH Foundation logo | Not supplied | Donor page | — | Official SVG or high-resolution transparent PNG; usage permission |

Other repeated headshots and logos are intentional identity/attribution elements pending editorial review. Raw `IMG_` and screenshot files require crop, context and consent review before use.

## Release history

### Selective promotion to main

Each implemented website change has its own commit. Cherry-pick only the approved IDs, then run the checks and update this tracker for the selected release. VWB-01 is a regression check; VWB-05 has no code yet. VWB-04 has separate commits for Kat's draft profile, Kat's supplied headshot, and Alicia's card with her supplied, cropped portrait; neither card uses an unapproved formal title. VWB-07 only changes the existing Sponsor navigation label to Partnerships; it does not add a Donate page. VWB-08 only removes the unapproved response-time promise; form delivery and alerts remain blocked. The shared `src/wordmark.js` file has separate, non-overlapping edits in VWB-06 and VWB-09.

| Change | Commit | Scope |
| --- | --- | --- |
| VWB-02 | `771e016` | Mission content and mission CSS cache version |
| VWB-03 | `bd0cd7b` | About bio, ORCID, and News research citation |
| VWB-04 | `983adcd` + `3b9d4f1` + `9ad636c` | Kat leadership card and supplied headshot; Alicia technology card and supplied photo cropped to her alone |
| VWB-06 | `2d454c8` | Timeline content, default view, and CMS fields |
| VWB-07 | `7b3e1dd` | Partnerships navigation label |
| VWB-08 | `412ab95` | Sponsor response wording |
| VWB-09 | `97c01be` | Contact sketch speed and shared script revalidation |

The VWB-10 documentation commit records the full review branch, so update its status and evidence when promoting a subset.


| Release date | Version | Change IDs | PR / commit | Preview | QA result | Approved by | Rollback |
| --- | --- | --- | --- | --- | --- | --- | --- |
| — | Draft | 01–10 | `codex/vwb-website-changes` (`3b9d4f1` latest code) | Local `http://127.0.0.1:5178/` | Partial; see evidence log | — | `cd9fe81` |

## Notes

This tracker records review-branch work, not live-site changes. Do not store bank details, payment credentials, email secrets or private form submissions here. The local preview is available only while a server runs in the VWB repository; start one with `python3 -m http.server 5178` if needed.
