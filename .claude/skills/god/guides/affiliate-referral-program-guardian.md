# Affiliate and Referral Program Guardian — God's Guide

The God routing skill's record of when to invoke `affiliate-referral-program-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/affiliate-referral-program-guardian.md`](../../agents/affiliate-referral-program-guardian.md)
**Weapon:** [`ai-tools/skills/affiliate-referral-program-weapon/`](../../skills/affiliate-referral-program-weapon/)
**Command Brief:** [`ai-tools/command-briefs/affiliate-referral-program-guardian-command-brief.md`](../../../command-briefs/affiliate-referral-program-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`affiliate-referral-program-guardian` owns affiliate and referral program selection, configuration, attribution architecture, payout design, and fraud mitigation for SaaS products. It distinguishes between affiliate programs (third-party publishers driving traffic, EPC-driven) and referral programs (existing customers recommending to peers), selects the right platform from Rewardful, FirstPromoter, Tolt, PartnerStack, Impact, and Refersion based on the product's maturity and budget, designs the attribution model (including post-ITP, post-3PC deprecation server-side approaches), configures payout structures, and surfaces the fraud controls that must be in place before the first commission runs. It models program economics (EPC, LTV payback, break-even commission rate) before finalising any commission rate.

## Trigger phrases

Route to `affiliate-referral-program-guardian` when the user says any of:

- "set up an affiliate program"
- "which affiliate platform should I use"
- "Rewardful vs FirstPromoter" / "Tolt vs Rewardful"
- "my Safari users aren't being attributed"
- "referral program fraud" / "self-referral detection"
- "EPC for our program" / "what commission rate should we offer"
- "20% recurring commission" / "should we do one-time or recurring"
- "postback tracking setup" / "S2S attribution"
- "PartnerStack vs FirstPromoter" / "Impact vs PartnerStack"
- "cookie stuffing" / "velocity fraud"
- "affiliate program economics" / "LTV payback for affiliate"
- "how do I pay affiliates through Stripe"
- "referral program launch checklist"

Or when the request implicitly involves setting up, auditing, or improving a partner acquisition channel via third-party publishers or customer referrals.

## Do NOT route when

- The request is about Stripe subscription billing mechanics or Stripe Connect account setup -- that is `payments-guardian`.
- The request is about storing API keys or secrets for affiliate platforms -- that is `security-guardian`.
- The request is about designing a custom database schema for tracking attributions in-house -- that is `db-guardian`.
- The request is about running outbound email campaigns to recruit affiliate partners -- that is `cold-outreach-guardian`.
- The request is about CI/CD deployment of the affiliate tracking integration code -- that is `devops-guardian`.

If a request straddles affiliate attribution and Stripe payout mechanics, prefer `affiliate-referral-program-guardian` for the program design decision, then hand off to `payments-guardian` for Stripe Express account configuration.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The product's current growth motion (inbound SaaS, PLG, agency-channel, enterprise partner).
- The desired program type: affiliate, referral, or both.
- The payment stack in use (Stripe, Paddle, Chargebee, etc.) -- required for platform selection.
- Team size / budget signal (bootstrapped vs funded) -- required for the SMB vs enterprise tier decision.
- Existing attribution setup and cookie consent posture (if EU market).

Optional (Angel defaults to industry benchmarks if absent):
- A target payout structure or competitive benchmark.
- Prior fraud incidents or known abuse patterns.
- Current MRR and affiliate revenue volume.

## Outputs the Angel produces

- A structured markdown report with platform recommendation (decision matrix table), attribution architecture plan, commission configuration spec (filled `templates/program-config-spec.md`), fraud control checklist, and economics model (EPC/LTV/CAC table).
- Optionally: a step-by-step integration guide scoped to the chosen platform and payment stack.
- Named handoffs to `payments-guardian` (Stripe Express), `security-guardian` (API key handling), `db-guardian` (custom schema), and `cold-outreach-guardian` (partner recruitment).

## Multi-Angel sequences this Angel participates in

- **Affiliate program launch sequence:** `affiliate-referral-program-guardian` (program design) → `payments-guardian` (Stripe Express payout wiring) → `security-guardian` (API key management for platform credentials) → `db-guardian` (custom attribution table if required).

## Critical directives the orchestrator should respect

- Always distinguish affiliate from referral before recommending a platform -- the economics and fraud profiles differ fundamentally.
- Never accept a cookie-only attribution recommendation without surfacing ITP/Firefox ETP risk -- 30-35% of global traffic is already cookie-blocked.
- Fraud controls are mandatory before launch, not optional.
- Always model EPC and LTV payback before finalising a commission rate -- intuition is unreliable.
- Do not wire Stripe payouts without verifying US 1099/W-9 obligations.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
