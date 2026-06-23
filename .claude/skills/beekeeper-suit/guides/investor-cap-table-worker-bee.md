# Investor Cap Table Advisor - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `investor-cap-table-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/investor-cap-table-worker-bee.md`](../../agents/investor-cap-table-worker-bee.md)
**Stinger:** [`.cursor/skills/investor-cap-table-stinger/`](../../skills/investor-cap-table-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`investor-cap-table-worker-bee` owns the full equity and fundraising paperwork lifecycle for startup founders. It covers cap-table platform selection (Carta, Pulley, Cake Equity, Capdesk — AngelList Stack sunset August 2026), SAFE mechanics (YC post-money standard), priced-round term sheet interpretation (Series A+), 409A valuations, option pool sizing and refresh, and vesting schedule design. It is opinionated that spreadsheets are never acceptable for managing a cap table with more than one shareholder or any plans to raise institutional capital. The Bee pairs with `incorporation-startup-stack-worker-bee` (company formation must precede cap-table work) and always surfaces a "have a lawyer review this" caveat at the boundary between platform mechanics and legal instrument interpretation.

## Trigger phrases

Route to `investor-cap-table-worker-bee` when the user says any of:

- "set up our cap table"
- "Carta vs Pulley" / "which cap table platform should we use?"
- "how does a SAFE work?" / "post-money vs pre-money SAFE"
- "term sheet provisions" / "explain this term sheet" / "liquidation preference"
- "when do I need a 409A?" / "409A valuation timing"
- "how big should our option pool be?" / "option pool refresh"
- "data room for Series A" / "due diligence checklist"
- "vesting schedule" / "cliff vesting" / "double-trigger acceleration"

Or when the request implicitly involves startup equity mechanics, cap-table record-keeping, fundraising paperwork, or investor due diligence preparation.

## Do NOT route when

- The user is asking about company formation or incorporation — that belongs to `incorporation-startup-stack-worker-bee`.
- The user is asking about subscription billing, payment processing, or Stripe — that belongs to `payments-worker-bee`.
- The user is asking about legal document drafting or contract enforceability — that belongs to `legal-docs-worker-bee`; always defer securities law questions to counsel.
- The user is asking about ongoing bookkeeping, accounting, or tax filing — that is out of scope for this Bee.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The founder's current company stage (pre-incorporation, seed, Series A, etc.)
- The specific question or task (platform selection, SAFE review, term sheet, 409A, option pool, vesting, or data room)
- Jurisdiction — defaults to US Delaware C-Corp; non-US founders must be flagged for local counsel
- Whether a signed term sheet is already in place (critical for 409A timing warnings)

## Outputs the Bee produces

- Platform recommendation: ranked comparison table with reasoning tied to the founder's stage and needs
- SAFE mechanics: plain-language explanation plus a dilution model using `templates/safe-conversion-model.md`
- Term sheet translation: plain-language provision-by-provision breakdown with founder-unfavorable terms flagged
- 409A guidance: trigger checklist, provider recommendation, and signed-term-sheet danger-zone warning where applicable
- Option pool analysis: sizing benchmarks, dilution formula, and grant workflow
- Vesting schedule explanation: schedule design, cliff mechanics, and board resolution language
- Data room: canonical 7-category folder structure from `templates/data-room-folder-structure.md` plus a gap checklist

## Multi-Bee sequences this Bee participates in

- Founding stack sequence — `incorporation-startup-stack-worker-bee` runs first (company formation), then `investor-cap-table-worker-bee` (equity setup)
- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Never recommend spreadsheets for cap-table management beyond a single-founder pre-incorporation scenario — spreadsheets are rejected at institutional due diligence.
- Always include the "qualified lawyer review" caveat whenever the output touches a legal instrument (SAFE, term sheet, option grant agreement, board resolution).
- Default to the YC post-money SAFE for US startups; deviating requires explicit justification from the user.
- State dilution impact explicitly whenever the output involves issuing shares, options, or SAFEs.
- Flag the AngelList Stack sunset — it stopped accepting new customers in August 2026 and must never be recommended.
- Warn about the 409A danger zone: a signed term sheet invalidates a current 409A, and granting options in that window exposes employees to 20% federal penalty taxes.
- Flag non-US jurisdiction gaps — this stinger is calibrated for US Delaware C-Corps; non-US founders must be referred to local counsel.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
