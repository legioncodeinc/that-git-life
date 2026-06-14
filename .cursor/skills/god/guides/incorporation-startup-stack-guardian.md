# Incorporation & Startup Stack Guardian — God's Guide

The God routing skill's record of when to invoke `incorporation-startup-stack-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/incorporation-startup-stack-guardian.md`](../../agents/incorporation-startup-stack-guardian.md)
**Weapon:** [`ai-tools/skills/incorporation-startup-stack-weapon/`](../../skills/incorporation-startup-stack-weapon/)
**Command Brief:** [`ai-tools/command-briefs/incorporation-startup-stack-guardian-command-brief.md`](../../../ai-tools/command-briefs/incorporation-startup-stack-guardian-command-brief.md)
**Trigger policy:** on-demand

---

## Domain

`incorporation-startup-stack-guardian` owns company formation and early back-office setup for software startup founders. It covers the formation-platform decision (Stripe Atlas, Clerky, Doola, Firstbase), the entity-type choice (Delaware C-Corp vs LLC vs international), EIN acquisition, startup banking (Mercury, Brex, Relay Financial), bookkeeping platform selection (Pilot, Bench), and the minimum founder-paperwork checklist including the 83(b) election deadline. It gives opinionated, research-backed guidance and explicitly calls out the specific situations that require a human attorney.

## Trigger phrases

Route to `incorporation-startup-stack-guardian` when the user says any of:

- "incorporate my startup"
- "Stripe Atlas vs Clerky"
- "Delaware C-Corp or LLC"
- "should I use a C-Corp or LLC?"
- "how do I get an EIN"
- "Mercury or Brex for my startup"
- "83(b) election"
- "set up bookkeeping for my startup"
- "do I need an attorney to incorporate?"
- "minimum paperwork to form a company"
- "Doola vs Firstbase"
- "formation platform comparison"
- "what do I need to do after incorporating?"

Or when the request implicitly involves company formation, entity type selection, startup banking setup, or the founder-paperwork checklist.

## Do NOT route when

- The user asks about ongoing tax compliance, state franchise tax filings, or annual report filings — those exceed this Angel's scope (no peer Angel owns this; flag to user).
- The user asks about cap-table management tools (Carta, Pulley) — no peer Angel owns this; flag to user.
- The user asks about fundraising mechanics (SAFEs, priced rounds, convertible notes) — no peer Angel owns this; flag to user.
- The user asks about Stripe payment integration — that belongs to `payments-guardian`.
- The user is asking a general accounting or tax preparation question unrelated to formation.

If a request straddles formation and ongoing compliance, handle the formation portion and explicitly flag the ongoing compliance scope as out-of-scope with a suggestion to consult a CPA or tax attorney.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- Target use case: VC-backed SaaS, bootstrapped product, freelance/agency, international founder, or other
- Desired timeline (urgent < 1 week, standard 1–4 weeks, no rush)
- Team size and co-founder count
- Country/state of residence of founders
- Budget range for formation
- Whether the company already exists

If required inputs are missing, ask the user to supply them before invoking.

## Outputs the Angel produces

- An opinionated entity-type recommendation with rationale
- A formation platform recommendation with 2026 pricing
- An EIN acquisition path (platform-handled or manual)
- A banking recommendation (primary bank, FDIC coverage, monthly cost)
- A bookkeeping recommendation with DIY threshold and upgrade trigger
- A completed `templates/founder-paperwork-checklist.md` with the 83(b) deadline calculated
- An attorney-triggers audit with specific trigger identification and referral if needed
- Optionally: a saved formation report at `docs/formation/formation-report-<YYYY-MM-DD>.md`

## Multi-Angel sequences this Angel participates in

- **Formation → Payments:** After `incorporation-startup-stack-guardian` completes formation, `payments-guardian` can be invoked to set up Stripe payment processing (the entity and bank account are now in place).

## Critical directives the orchestrator should respect

- Always confirm entity type before asking about formation platform — do not skip ahead.
- Always include the 83(b) election deadline (bolded, with the calculated date) in every C-Corp output.
- Always check for attorney triggers before completing the flow.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
