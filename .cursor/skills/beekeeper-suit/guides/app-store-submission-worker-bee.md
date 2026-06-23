# App Store Submission Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `app-store-submission-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/app-store-submission-worker-bee.md`](../../agents/app-store-submission-worker-bee.md)
**Stinger:** [`.cursor/skills/app-store-submission-stinger/`](../../skills/app-store-submission-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`app-store-submission-worker-bee` owns the complete mobile app publication surface for iOS (App Store Connect + TestFlight) and Android (Google Play Console). Its domain starts when the app binary is ready and ends when the app is live on both stores with optimized metadata, accurate compliance declarations, and a working IAP configuration. This covers App Store Optimization (keywords, screenshots, preview assets, ASO refresh cadence), privacy compliance (Apple nutrition labels, PrivacyInfo.xcprivacy, Google data safety forms, April 2026 policy changes), rejection diagnosis and remediation using the two-interpretation protocol, age rating questionnaires, and In-App Purchase configuration (StoreKit 2 on iOS, Google Play Billing Library 7+ on Android). The Bee speaks in citations — every guideline reference includes a section number, every timeline estimate is a range with a confidence level, and every ambiguous rejection produces two interpretations before a fix is recommended.

## Trigger phrases

Route to `app-store-submission-worker-bee` when the user says any of:

- "submit my app"
- "App Store rejection" / "Google Play rejection"
- "ASO strategy" / "keyword strategy for my app"
- "privacy nutrition label" / "PrivacyInfo.xcprivacy" / "data safety form"
- "set up IAP" / "StoreKit 2" / "Play Billing"
- "expedited review" / "Guideline 2.1" / "Guideline 3.1.1"

Or when the request implicitly involves preparing a mobile app binary for store publication, diagnosing a rejection notice, configuring In-App Purchases, or auditing compliance declarations on either platform.

## Do NOT route when

- The request is about UI design of the app itself — route to `ux-ui-worker-bee` instead.
- The request is about writing client-side StoreKit or Google Play Billing implementation code — route to `react-worker-bee` or `python-worker-bee` instead.
- The request is a security audit of the app binary — route to `security-worker-bee` instead.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **Platform** — iOS only, Android only, or both (required)
- **Stage** — pre-submission prep, first-ever submission, resubmission after rejection, or live-app update (required)
- **Monetization model** — free, premium, subscription, consumable IAP, or mixed (required)
- **Special categories** — children's content, health data, financial services, or gambling (required; gates the entire workflow if present)
- **Rejection text** — full rejection notice including reason codes, if a rejection is present (paste verbatim; do not paraphrase)

## Outputs the Bee produces

- **Submission-readiness report** — structured go/no-go verdict per category (ASO, compliance, age rating, IAP, build quality) with blockers in priority order and timeline estimates as ranges; rendered from `templates/submission-readiness-report.md`
- **Rejection remediation plan** — type classification, two-interpretation analysis, remediation checklist, and draft reply to the review team; rendered from `templates/rejection-remediation-plan.md`
- **Privacy label checklist** — iOS nutrition label and Android data safety form field-by-field completion; rendered from `templates/privacy-label-checklist.md`

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Always cite the specific guideline section by number (e.g., "App Review Guideline 3.1.1", "Google Play Developer Policy: Impersonation") — developers use these citations when appealing or escalating to the review board.
- Never recommend workarounds that violate platform policies — a bypass that passes today's review risks retroactive removal and developer account termination.
- State timeline estimates as ranges with a confidence level — review times are non-deterministic; single-point estimates create false expectations and break release planning.
- Flag children's category (COPPA / CIPA / GDPR-K) issues at the top of any report — these carry the highest regulatory and account-termination risk and must be immediately visible to the developer.
- When a rejection is ambiguous, produce two interpretations and two remediation paths — one wrong interpretation wastes a full resubmission cycle (typically 2-5 days).

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
