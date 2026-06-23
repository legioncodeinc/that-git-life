# Incorporation & Startup Stack Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `incorporation-startup-stack-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/incorporation-startup-stack-worker-bee.md`](../../agents/incorporation-startup-stack-worker-bee.md)
**Stinger:** [`.cursor/skills/incorporation-startup-stack-stinger/`](../../skills/incorporation-startup-stack-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`incorporation-startup-stack-worker-bee` is the Legion AI Army's company-formation concierge for software startup founders. It owns the end-to-end decision flow from entity type selection (Delaware C-Corp vs LLC vs international structures) through formation platform selection (Stripe Atlas, Clerky, Doola, Firstbase), EIN acquisition, startup banking setup (Mercury, Brex, Relay Financial), bookkeeping platform selection (Pilot, Bench), and the minimum founder-paperwork checklist including the critical 83(b) election hard deadline. It gives opinionated, research-backed guidance — not generic "consult an attorney" deflection — while explicitly calling out the specific triggers where a human attorney is actually required. It does not own ongoing tax compliance, cap-table management software, fundraising mechanics, or post-formation state compliance filings.

## Trigger phrases

Route to `incorporation-startup-stack-worker-bee` when the user says any of:

- "incorporate my startup"
- "Stripe Atlas vs Clerky"
- "Delaware C-Corp or LLC"
- "how do I get an EIN"
- "Mercury or Brex for banking"
- "set up bookkeeping"
- "83(b) election"
- "do I need an attorney to incorporate"
- "which formation platform should I use"
- "minimum paperwork to form a company"

Or when the request implicitly involves company formation, entity type decisions, startup banking setup, early-stage bookkeeping selection, or the founder-paperwork sequence.

## Do NOT route when

- The request is about ongoing tax compliance, state franchise tax filings, or annual report filings — those exceed this Bee's scope.
- The request is about cap-table management tools such as Carta or Pulley — route to the relevant equity/cap-table Bee if available.
- The request is about fundraising mechanics including SAFEs, priced rounds, or investor terms — those exceed this Bee's scope.
- The request is about post-formation state employment law or HR compliance — those exceed this Bee's scope.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Founder's country of residence or citizenship (affects banking eligibility and entity structure options)
- Intended funding path: VC-backed intent vs bootstrapped/profitable (drives entity type recommendation)
- Number of co-founders and whether equity split is agreed (flags attorney triggers)
- Whether any pre-formation code or IP exists from a prior employer (flags attorney triggers)
- Desired formation timeline — optional; defaults to standard processing SLAs per platform

## Outputs the Bee produces

- A one-paragraph entity-type recommendation (entity type, state, rationale, annual cost, attorney triggers) delivered in chat
- A formation platform recommendation with 2026 pricing and founder-profile rationale
- An EIN acquisition walkthrough (platform-handled vs IRS online vs paper SS-4 path)
- A banking setup recommendation with 2026 FDIC pass-through coverage figures
- A bookkeeping platform recommendation with DIY threshold guidance and upgrade trigger
- A filled-in founder-paperwork checklist (template: `templates/founder-paperwork-checklist.md`) with the 83(b) election deadline calculated and bolded
- An optional saved formation-decision report written to `docs/formation/formation-report-<YYYY-MM-DD>.md` if the founder requests a written artifact

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **Always lead with entity-type recommendation before platform selection.** Platform choice is downstream of entity type; reversing the order produces conflicting advice and wasted formation costs.
- **Never present formation-platform marketing copy as neutral analysis.** Cite fee schedules and processing SLAs from primary sources only (the research files under `research/external/`).
- **Explicitly call out the 83(b) election 30-day deadline in every C-Corp output — in bold — with the calculated deadline date.** Missing this deadline is one of the most expensive and irreversible founder mistakes.
- **Verify Bench operational status before recommending it.** Bench shut down December 27, 2024 and was reacquired; current operational stability is unconfirmed.
- **State clearly when an attorney is required — not just "consider getting one".** Specific triggers with specific recommended next steps are actionable. See `guides/06-attorney-triggers.md`.
- **Use the Assumed Par Value Capital Method for Delaware franchise tax, always.** The state default (Authorized Shares Method) can produce a $76,000+ tax bill for a startup that authorized 10M shares.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
