# Affiliate and Referral Program Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `affiliate-referral-program-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/affiliate-referral-program-worker-bee.md`](../../agents/affiliate-referral-program-worker-bee.md)
**Stinger:** [`.cursor/skills/affiliate-referral-program-stinger/`](../../skills/affiliate-referral-program-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`affiliate-referral-program-worker-bee` owns affiliate and referral program selection, configuration, attribution architecture, payout design, and fraud mitigation for SaaS products. It distinguishes between affiliate programs (third-party publishers driving traffic) and referral programs (existing customers recommending to peers), recommends the right platform tier for the product's maturity and budget, and designs the attribution model appropriate for the post-ITP, post-3PC era. It configures payout rules — commission type, hold periods, Stripe Express automation, and tax compliance — and surfaces the fraud-detection controls required before the first commission runs. It does not own general Stripe subscription billing, CI/CD deployment of integration code, database schema for custom tracking tables, or outbound affiliate partner recruitment.

## Trigger phrases

Route to `affiliate-referral-program-worker-bee` when the user says any of:

- "set up an affiliate program"
- "which affiliate platform should I use"
- "Rewardful vs FirstPromoter"
- "my attribution is broken in Safari"
- "referral program fraud"
- "EPC or LTV for our program"
- "20% recurring commission"
- "postback tracking setup"
- "PartnerStack vs FirstPromoter"

Or when the request implicitly involves selecting, configuring, or troubleshooting an affiliate or referral program for a SaaS product.

## Do NOT route when

- The request is about Stripe subscription billing mechanics — route to `payments-worker-bee` instead.
- The request is about API key or secret management — route to `security-worker-bee` instead.
- The request is about designing or building a custom attribution database schema — route to `db-worker-bee` instead.
- The request is about outbound partner or affiliate recruitment campaigns — route to `cold-outreach-worker-bee` instead.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Program type intent (affiliate vs referral, or both) — required to classify before recommending a platform.
- Primary billing system (Stripe, Paddle, Chargebee, Recurly) — required for platform compatibility check.
- Rough monthly affiliate revenue or MRR — required for break-even math (Rewardful vs FirstPromoter crossover at ~$5K/month).
- Target commission rate or structure (percentage, flat, recurring) — optional; Bee will model economics and recommend if absent.
- Geographic scope (US-only vs EU included) — optional; defaults to US-only; EU triggers additional cookie consent and VAT payout obligations.

## Outputs the Bee produces

- A structured Program Configuration Spec (using `templates/program-config-spec.md`) covering program type, platform selection with rationale, attribution model, commission rules, payout schedule, economics model, and fraud controls.
- Dated engagement report saved to `reports/` as an audit trail.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`
- Payout automation handoff — surfaces Stripe Express configuration requirements to `payments-worker-bee` when payout automation is in scope.
- Custom attribution schema handoff — flags `db-worker-bee` + `devops-worker-bee` when the user requests a fully custom attribution system.

## Critical directives the orchestrator should respect

- **Always distinguish affiliate from referral before recommending a platform.** The two program types have fundamentally different economics, participant incentives, and fraud profiles; conflating them leads to platform mismatches that are expensive to migrate away from.
- **Never recommend a cookie-only attribution model without disclosing ITP / Firefox ETP risk.** 30-35% of global traffic is already cookie-blocked; Safari users get 7 days maximum regardless of dashboard settings.
- **Flag self-referral and velocity-spike fraud controls as mandatory, not optional.** Programs without minimum controls are routinely abused within days of launch.
- **Always model EPC and LTV payback before finalising a commission rate.** A rate that looks competitive can be economically destructive if the product's LTV is low or the refund window is long.
- **Do not configure Stripe payout automation without verifying US 1099/W-9 obligations and EU GDPR data obligations.** Paying affiliates above the IRS threshold without a collected W-9 creates tax-filing liability.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
