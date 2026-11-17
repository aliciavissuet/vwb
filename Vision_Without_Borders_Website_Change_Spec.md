Vision Without Borders — Codex Implementation Specification
Version: 1.1 · Prepared: 2026-11-16 · Status: Amended by user; see tracker for implementation
Campaign donor amendment (2026-11-16): The founding donor is anonymous. The earlier VWB-05 named-recognition request is superseded. Show the user-confirmed $10,000 contribution in the local 20/20 preview without publishing the donor's name, logo, or identifying profile. Reconcile the receipt and campaign ledger before release.
Instructions to Codex
1. Inspect the existing repository, routing, hosting configuration, forms, assets, and tests before modifying code. Do not overwrite working content or deploy automatically.
2. Work on a new branch, commit changes in logical groups using the change IDs below, and provide a preview URL or screenshots for review.
3. Preserve all existing functionality and responsive behavior. Avoid duplicate photographs across pages. Do not fabricate credentials, donation information, publication counts, nonprofit status, affiliations, or partner logos.
4. Maintain Vision_Without_Borders_Website_Change_Tracker.md as work proceeds: mark status, affected files, commit IDs, testing evidence, and decisions. Do not mark anything complete until verified.
5. Keep all secrets in deployment environment variables. Never commit bank information, private keys, form credentials, or email API secrets.
VWB-01 — Home page
Action: No change requested. Preserve current appearance and functionality. Regression-test after other edits.
VWB-02 — Mission page
Priority: High
- At the top of the Mission page, display heading Our bi-directional model.
- Directly below it display this exact, unedited mission statement:
A bi-directional help me help you model. Let's get it done and make it fun.

- Do not paraphrase, change punctuation, capitalization, or wording.
- Retain the two existing photos, then position the existing bi-directional model illustration/section immediately beneath the photos.
- Move the existing “Sight Should Not Be Limited Where Life Begins” section below the model, preserving its established content unless layout requires minimal changes.
- Verify desktop and mobile order and spacing.
VWB-03 — About: founder biography and research
Priority: High
- Update Blake Snyder, MD's biography using the current CV as the authoritative reference when available in the Codex workspace. Do not invent or infer CV details.
- Recommended formal title: Founder & President; describe as founder in prose. Founder/CEO/President status must be confirmed against organization records before adopting a different formal title.
- Refer to Stanford appointment in the past tense: “served at the Byers Eye Institute as a Clinical Instructor.” Record completion of the Stanford Global Ophthalmology Fellowship in June 2026.
- Describe current work as a comprehensive ophthalmologist practicing domestically and abroad, contributing to clinical care, training, and access to eye care; verify exact scope against CV/approved copy.
- Mention 2026 consulting work for Orbis International and the Ophthalmology Foundation, including development of uveitis curriculum. Avoid implying the organizations are the same entity or that the specific deliverable belonged to both unless verified.
- Remove any fixed peer-reviewed publication count. Link to ORCID: https://orcid.org/0000-0002-0049-3111 (confirm account ownership before launch).
- Include the recent Dove Press publication after verifying its citation and author list: https://doi.org/10.2147/OPTH.S640548 . Prefer a dynamic or curated publications section linked to ORCID rather than a hard-coded total.
- Proposed bio copy for editorial approval:
  “Blake Snyder, MD, is a comprehensive ophthalmologist and founder of Vision Without Borders. He completed fellowship training in uveitis and ocular inflammation at UCSF and completed a Global Ophthalmology Fellowship at Stanford University in June 2026, where he served at the Byers Eye Institute as a Clinical Instructor. Dr. Snyder now practices comprehensive ophthalmology domestically and abroad, combining clinical care with efforts to expand access to eye care, training, and research. In 2026, he also served as a consultant to Orbis International and the Ophthalmology Foundation, contributing to uveitis education and curriculum development.”
  Editorial note: Check this wording against the actual CV and approve before publishing.
VWB-04 — About: leadership / officers
Priority: High
- Preserve the existing Board of Directors section.
- Add a separate section titled Officers & Leadership (or Leadership Team, if officer appointments are not formally documented).
- Alicia Otto: Proposed title Chief Technology Officer (CTO). Describe leadership of website architecture, development, digital infrastructure, integrations, and technology operations. Confirm that the organization authorizes this formal officer title; otherwise use Head of Technology pending approval.
- Katherine (Kat) Leviste: Proposed title Director of Clinical Innovation (subject to approval). Draft her biography using her official website https://katrx.com and an approved headshot. Verify spelling, qualifications, and role before publishing.
- The headshot reportedly appeared in a Superhuman email attachment titled “Katherine Headshot”; the actual image must be provided or securely retrieved in the implementation workspace. Do not use an unverified placeholder as final.
- Use accessible image alt text, consistent crop and responsive cards.
VWB-05 — Donor recognition page (superseded)
Priority: High
- Do not publish a donor page, name, logo, or identifying profile for the founding contribution while anonymity is requested.
- The $10,000 amount may appear in the community goal, as directed by the user; verify the underlying record before production release.
VWB-06 — Timeline
Priority: High
- Make the timeline view the default instead of photo/gallery view; preserve optional photo view if already implemented.
- Add verified milestones: Stanford Global Ophthalmology Fellowship completed June 2026; 2026 consulting with Orbis International and Ophthalmology Foundation; new Dove Press publication (use actual publication date).
- Review existing milestones for factual consistency.
- Audit all site imagery and avoid repeating a photo on multiple pages. Produce a requested-assets list with ideal subjects, orientation, resolution, and target page if more images are needed.
VWB-07 — Navigation and Donate
Priority: High
- Replace or broaden top navigation label Sponsor with Partnerships, keeping sponsorship content and existing links accessible.
- Add a separate, prominent top-level Donate link leading to a dedicated page.
- Dedicated page should explain impact, offer accessible preset/custom donation amounts, optional recurring giving, and a secure card checkout. Include clear success/cancel states and receipts.
- Preferred option to evaluate: Zeffy, especially if VWB is eligible and wants reduced platform fees. Fallback: Stripe Checkout / Payment Links. Verify current eligibility, fees, donor tipping, recurring donation support, payout setup, tax receipt behavior, and user experience before selection.
- Do not accept raw card data directly in VWB application code, publish bank account numbers, or implement unprotected direct-deposit instructions. Use hosted payment processing with bank payout once the nonprofit bank account is configured.
- Verify 501(c)(3) claims and tax-deductibility language against current documentation before publication.
VWB-08 — Sponsorship inquiry routing and follow-up
Priority: High
- Confirm the current Sponsor/Partnerships form action, email provider, and submission storage.
- Route each submission to blakesnydermd@gmail.com and Jamie.vision woborders@gmail.com only after confirming the exact spelling of the second address. Never silently guess or correct the supplied address.
- Prefer server-side form handling with durable submission records, spam protection, validation, and delivery-failure logging. Avoid exposing API secrets client-side.
- Create a Trello card or equivalent tracked lead for each valid inquiry, but only after verifying that the intended Trello board/integration is still active and approved. The prior Trello shutdown/read-only plan makes this a decision required item.
- Add an escalation reminder when a submission has no recorded response after two business days, subject to approval of the response SLA. Do not assume an AI assistant can directly receive submissions or send notifications without a supported, authorized integration.
- Test both recipient deliveries, duplicate submission handling, failed delivery, and follow-up alerts.
VWB-09 — Contact animation
Priority: Medium
- Retain existing background and sketch animation.
- Target approximately 2× faster sketch/draw-in completion (halve duration), while respecting reduced-motion settings and avoiding jank on mobile.
- Confirm legibility, perceived loading speed, and no layout shift.
VWB-10 — Release quality, rollback, and documentation
Priority: High
- Run build/lint/type checks and existing tests. Manually verify desktop/mobile, keyboard navigation, contrast, alt text, forms, donation sandbox checkout, redirects, and analytics (if already configured).
- Keep a changelog with ID, summary, files changed, screenshots/preview links, commit hash, QA results, release date, and rollback steps.
- Obtain approval before any production deployment, publication of partner branding, or activation of payments/automations.
Inputs and approvals required
- Current Blake Snyder CV in the Codex workspace; confirm founder biography wording and formal title.
- Katherine Leviste approved headshot, bio facts, and role/title approval.
- Founding gift receipt and campaign ledger reconciliation; preserve donor anonymity.
- Confirmed sponsor email for Jaime/Jamie, and selected tracking platform (Trello or replacement).
- Donation platform selection, bank payout onboarding, nonprofit verification, tax receipt wording.
- Repository access, existing assets, domain, staging/deployment details.
Definition of done
All requested changes implemented in a reviewable branch; exact mission quote preserved; no unsupported claims; all required approvals collected; automated and manual QA passed; change tracker populated with evidence; production deployment performed only with explicit authorization.
