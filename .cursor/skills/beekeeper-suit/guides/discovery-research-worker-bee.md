# Discovery Research Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `discovery-research-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/discovery-research-worker-bee.md`](../../agents/discovery-research-worker-bee.md)
**Stinger:** [`.cursor/skills/discovery-research-stinger/`](../../skills/discovery-research-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`discovery-research-worker-bee` owns the full continuous product discovery cycle, rooted in Teresa Torres' framework and Opportunity Solution Trees (OST). It covers defining a measurable desired outcome, building and maintaining the OST, generating Jobs-to-be-Done (JTBD) interview scripts using the Five-Act structure, mapping desirability/viability/feasibility assumptions on a 2×2 importance-vs-uncertainty matrix, and designing the smallest prototype experiment that validates or invalidates each critical assumption. This Bee runs before implementation begins — it answers "what should we build and why?" — and hands off to implementation Bees only once a desired outcome is agreed and a winning, assumption-tested opportunity is identified. It does not own what happens after a feature ships.

## Trigger phrases

Route to `discovery-research-worker-bee` when the user says any of:

- "run a discovery session"
- "build an OST" / "build an opportunity solution tree"
- "write an interview script"
- "map our assumptions"
- "design a prototype experiment"
- "weekly discovery summary"

Or when the request implicitly involves a team being unsure what to build next and needing to run discovery before planning.

## Do NOT route when

- The request is about usability testing of a **shipped** feature — that belongs to `quality-worker-bee`.
- The request is about UI or UX design decisions — that belongs to `ux-ui-worker-bee`.
- The request is to author a PRD, feature spec, or implementation plan — that belongs to `library-worker-bee`.
- The request is to interpret analytics results or experiment outcome data — handle inline or defer to a future analytics Bee; this Bee designs experiments, it does not evaluate shipped results.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **A desired outcome or product area** — the customer segment and what they want to accomplish; if absent, the Bee will run the outcome-scoping interview from `guides/01-desired-outcome.md` before proceeding.
- **The specific discovery task** — e.g., build/update OST, generate interview script, map assumptions, design experiment, or produce a weekly summary; if unspecified, the Bee defaults to starting at Step 1 (anchor to desired outcome).
- **Target opportunity node** (optional, for interview scripts) — identifies which OST node the script is for; if absent, the Bee will prompt or default to the top-level opportunity cluster.

## Outputs the Bee produces

- **Primary deliverables written to `library/discovery/`** — the desired outcome (`desired-outcome.md`), OST (`opportunity-solution-tree.md`), interview scripts (`interview-scripts/<YYYY-MM-DD>-<slug>.md`), assumption maps (`assumption-maps/<solution-slug>.md`), and experiment plans (`experiments/<YYYY-MM-DD>-<slug>.md`).
- **Optional stakeholder summary** — a one-page weekly discovery summary produced on demand using `templates/weekly-summary.md`, covering top opportunities, interview insights, and the next queued experiment.

## Multi-Bee sequences this Bee participates in

- **Pre-implementation discovery loop** — `discovery-research-worker-bee` runs first when the team is uncertain what to build; once a validated opportunity and winning solution are identified, it hands off to `library-worker-bee` (PRD), `react-worker-bee`, or `python-worker-bee` for implementation.
- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`.

## Critical directives the orchestrator should respect

- **Never recommend building without at least one validated assumption test.** The "build less, learn more" loop exists to prevent building on wrong assumptions; skipping it is the failure mode continuous discovery is designed to catch.
- **Always anchor work to a single desired outcome before any other step.** OSTs without a defined outcome become wish lists; every interview, opportunity, and experiment must trace back to the outcome.
- **Distinguish opportunities (customer problems/desires) from solutions (product ideas).** Conflating the two is the most common discovery anti-pattern; the OST's power is the explicit separation of the problem space from the solution space.
- **Do not produce a PRD, implementation plan, or code.** Hand off a validated opportunity plus winning solution to `library-worker-bee` or an implementation Bee — do not cross into their domain.
- **Escalate and STOP rather than guessing** when the team refuses the outcome-scoping interview, when no OST node exists for a requested interview script, or when a stakeholder demands building without assumption testing; surface the risk and the decision to the user.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
