# investor-cap-table-guardian — God's Guide

The God routing skill's record of when to invoke `investor-cap-table-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/investor-cap-table-guardian.md`](../../agents/investor-cap-table-guardian.md)
**Weapon:** [`ai-tools/skills/investor-cap-table-weapon/`](../../skills/investor-cap-table-weapon/)
**Command Brief:** [`ai-tools/command-briefs/investor-cap-table-guardian-command-brief.md`](../../../command-briefs/investor-cap-table-guardian-command-brief.md)
**Trigger policy:** on-demand

---

## Domain

`investor-cap-table-guardian` owns cap-table management and fundraising paperwork for startup founders. It covers the full equity lifecycle from first share issuance through Series A and beyond: platform selection (Carta, Pulley, Cake Equity, Capdesk), SAFE mechanics (YC post-money standard), priced-round term sheet interpretation (Series A+ provisions), 409A valuations (timing, providers, the signed-term-sheet danger zone), option pool sizing and refresh, vesting schedules (4-year/1-year cliff, double-trigger acceleration), and Series A data-room preparation. It is opinionated against spreadsheets and always surfaces the lawyer-review caveat. It is calibrated for US Delaware C-Corps; non-US founders are flagged for local counsel.

**2026 market note:** AngelList Stack stopped accepting new customers in August 2026. The current platform landscape for new US startups is Carta vs Pulley. Cake Equity and Capdesk serve international founders.

## Trigger phrases

Route to `investor-cap-table-guardian` when the user says any of:

- "Set up our cap table" / "which cap table platform should we use?"
- "Carta vs Pulley" / "Pulley vs Carta"
- "How does a SAFE work?" / "SAFE mechanics" / "post-money SAFE" / "SAFE conversion"
- "Explain this term sheet" / "term sheet provisions" / "liquidation preference" / "anti-dilution"
- "When do I need a 409A?" / "409A valuation" / "option strike price"
- "How big should our option pool be?" / "option pool refresh" / "ESOP dilution"
- "Vesting schedule" / "cliff vesting" / "double-trigger acceleration"
- "Data room for Series A" / "investor due diligence checklist" / "what do VCs want to see?"
- "Cap table spreadsheet" (to redirect away from spreadsheets)
- "SAFE vs convertible note"

Or when the request implicitly involves equity structuring, fundraising paperwork, or investor due diligence preparation.

## Do NOT route when

- The request is about company formation or incorporation (route to `incorporation-startup-stack-guardian`).
- The request is about Stripe billing, subscriptions, or payment processing (route to `payments-guardian`).
- The request is about drafting or reviewing legal documents as legal documents -- not their financial mechanics (route to `legal-docs-guardian`).
- The request is about ongoing bookkeeping, tax filing, or accounting software (out of scope for this Angel).
- The request is for a securities law opinion (always defer to qualified counsel; this Angel interprets mechanics, not law).

If a request straddles company formation and cap table (e.g., "I'm incorporating and need to set up equity for my co-founder"), prefer `incorporation-startup-stack-guardian` first and hand off to `investor-cap-table-guardian` for the equity platform and first grants.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- **Stage:** pre-seed, seed (SAFEs outstanding), post-priced round, or actively preparing a Series A.
- **Question type:** platform selection, SAFE mechanics, term sheet review, 409A, option pool, vesting, or data room.
- **Current cap structure (if relevant):** who owns what, any outstanding SAFEs with their cap/discount terms.
- **Jurisdiction:** US (Delaware C-Corp is assumed) or non-US (triggers jurisdiction warning and counsel recommendation).

If the stage and question type are ambiguous, the Angel will ask before diving into specific mechanics.

## Outputs the Angel produces

- **Platform recommendation:** ranked comparison table with decision rationale tied to the founder's specific inputs.
- **SAFE dilution model:** plain-language conversion mechanics + worked dilution table (using `templates/safe-conversion-model.md`).
- **Term sheet translation:** plain-language provision-by-provision breakdown; flags founder-unfavorable terms with negotiation guidance.
- **409A advisory:** trigger checklist, provider recommendation, danger-zone warnings.
- **Option pool analysis:** sizing benchmarks, refresh timing, dilution math.
- **Vesting schedule:** standard template language + acceleration clause guidance.
- **Data room:** folder structure from `templates/data-room-folder-structure.md` + pre-share checklist from `guides/07-data-room-checklist.md`.

## Multi-Angel sequences this Angel participates in

- **Company formation → cap table setup:** `incorporation-startup-stack-guardian` (forms the entity) → `investor-cap-table-guardian` (sets up equity platform and first grants).
- **Pre-raise preparation:** `investor-cap-table-guardian` (data room, cap table cleanup, 409A validation) → legal counsel review → investor outreach.

## Critical directives the orchestrator should respect

- **Never recommend spreadsheets** for an active multi-shareholder cap table -- always redirect to a platform.
- **Always include lawyer review caveat** before any legal instrument is signed.
- **Flag the AngelList Stack sunset** -- it is not available for new customers as of August 2026.
- **Flag the 409A danger zone** immediately if a signed term sheet is in the picture and the founder is asking about option grants.
- **Flag non-US jurisdiction gaps** and recommend local counsel for any non-Delaware-C-Corp equity mechanics.

(Full directives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
