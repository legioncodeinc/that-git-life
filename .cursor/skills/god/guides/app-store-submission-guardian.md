# App Store Submission Guardian — God's Guide

The God routing skill's record of when to invoke `app-store-submission-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/app-store-submission-guardian.md`](../../agents/app-store-submission-guardian.md)
**Weapon:** [`ai-tools/skills/app-store-submission-weapon/`](../../skills/app-store-submission-weapon/)
**Command Brief:** [`ai-tools/command-briefs/app-store-submission-guardian-command-brief.md`](../../../command-briefs/app-store-submission-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`app-store-submission-guardian` owns the complete mobile app publication surface for iOS (App Store Connect + TestFlight) and Android (Google Play Console). It covers App Store Optimization (keywords, screenshots, preview videos, ASO refresh cadence), submission workflow (version preparation, build upload, metadata completion), review navigation (common 2026 rejection patterns, appeal process, guideline interpretation), privacy compliance (Apple nutrition labels, PrivacyInfo.xcprivacy enforcement, Google data safety forms, April 2026 policy changes with October 28, 2026 deadlines), age rating questionnaires (IARC, Apple questionnaire), In-App Purchase and subscription setup (StoreKit 2 on iOS, Play Billing Library 7+ on Android), and realistic timeline expectations for both platforms. This Angel encodes 2025-2026 intelligence: 104% YoY review volume increase affecting iOS timelines, Google's three April 2026 breaking policy changes, and Apple's ongoing PrivacyInfo.xcprivacy enforcement tightening.

## Trigger phrases

Route to `app-store-submission-guardian` when the user says any of:

- "submit my app to the App Store"
- "App Store rejection" / "my app got rejected"
- "ASO strategy" / "keyword optimization for my app"
- "privacy nutrition label" / "PrivacyInfo.xcprivacy"
- "data safety form" / "Google Play data safety"
- "set up IAP" / "StoreKit 2" / "Play Billing"
- "expedited review"
- "Guideline 2.1" / "Guideline 3.1.1" / "Guideline 4.3" (or any App Review Guideline number)
- "Google Play review process"
- "age rating questionnaire"
- "TestFlight submission"
- "App Store Connect metadata"

Or when the request implicitly involves getting a mobile app through app store review, diagnosing why an app was rejected, or preparing metadata and compliance materials for a store submission.

## Do NOT route when

- The user is asking about UI design of the app itself — route to `ux-ui-guardian`
- The user wants to implement StoreKit 2 or Play Billing client code — route to `react-guardian` (React Native / Expo) or `python-guardian` (Django backend webhooks)
- The user wants a security audit of the app binary (OWASP, DAST, SAST) — route to `security-guardian`
- The user is asking about web app deployment (not mobile) — route to `devops-guardian` or `website-guardian`

If a request straddles submission compliance and IAP implementation code, handle the compliance and policy layer here and hand off the code implementation to the appropriate code Angel.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- Target platform(s): iOS only, Android only, or both
- App category and brief description
- Current stage: pre-submission prep, first submission, resubmission after rejection, update
- Full rejection notice text (if present) — verbatim, including any error codes
- Monetization model: free, premium, subscriptions, consumable IAP, mixed
- Any known special category flags: children's content, health data, financial services, gambling

If a rejection notice is present but the user did not paste the full text, ask for it before attempting diagnosis. Partial rejection notes produce incorrect interpretations.

## Outputs the Angel produces

- **Primary:** Submission-readiness report (go/no-go verdict per category, ordered blockers, timeline estimate)
- **Secondary:** Rejection remediation plan with two-interpretation analysis, review team reply draft
- **Privacy:** Privacy label / data safety form completion checklist
- **IAP:** IAP and subscription configuration review with policy compliance verdict
- Reports optionally written to `docs/app-store/submission-report-<date>.md` if the repo has that folder

## Multi-Angel sequences this Angel participates in

- **Mobile launch sequence:** `security-guardian` (binary security audit) → `app-store-submission-guardian` (submission compliance and review navigation) — security audit before store submission ensures no binary rejections for dangerous APIs or permissions misuse

## Critical directives the orchestrator should respect

- Always produce timeline estimates as ranges (e.g., "2-5 business days") with a stated confidence level — single-point estimates break release planning
- When a rejection notice is ambiguous, always produce two interpretations and two remediation paths before recommending a fix — one wrong interpretation wastes an entire resubmission cycle
- Flag children's category issues (COPPA / CIPA / GDPR-K) at the top of any report — these carry the highest regulatory and account-termination risk
- Always cite guideline section numbers (e.g., "App Review Guideline 3.1.1") — developers use these for appeals

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
