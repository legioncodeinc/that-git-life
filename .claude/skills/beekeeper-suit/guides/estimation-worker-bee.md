# Estimation Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `estimation-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/estimation-worker-bee.md`](../../agents/estimation-worker-bee.md)
**Stinger:** [`.cursor/skills/estimation-stinger/`](../../skills/estimation-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`estimation-worker-bee` is the Legion Army's authority on software estimation and probabilistic delivery forecasting. It owns the full estimation domain: relative-sizing frameworks (Fibonacci story points, T-shirt sizing, Planning Poker), the NoEstimates movement and its evidence base (Vasco Duarte's throughput-as-forecast argument), and the planning-fallacy literature explaining why expert estimators are systematically optimistic. It also owns cycle-time and throughput-based forecasting as the data-driven alternative, including Monte Carlo simulation and percentile-based delivery predictions (P50/P85/P95). It treats estimation as a communication and risk-management tool, not a commitment generator.

## Trigger phrases

Route to `estimation-worker-bee` when the user says any of:

- "our story points mean nothing / our velocity drifts every sprint"
- "should we use NoEstimates?"
- "how do I T-shirt size our roadmap?"
- "we need a 90% confidence delivery date"
- "explain Monte Carlo to my PM"
- "why are our estimates always wrong"
- "our team says 2 weeks, it always takes 6"

Or when the request implicitly involves sizing, forecasting, or the NoEstimates debate.

## Do NOT route when

- The request is about sprint ceremony design (planning, retrospectives, standups) — that belongs to an agile coach.
- The request is about configuring Jira velocity boards, Linear cycle-time charts, or Azure DevOps burn-down views — redirect to the team's tooling owner.
- The request is about team-capacity planning or headcount math — beyond estimation; flag and stop.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- A description of the estimation dysfunction or question (required)
- Whether the team has historical cycle-time data (6+ months) — determines which framework to recommend
- Backlog size and throughput samples (required only for Monte Carlo forecasting; Bee will ask if absent)

## Outputs the Bee produces

- A written estimation advisory in the format from `templates/estimation-advisory.md`: diagnosed root cause + recommended approach + implementation steps + one "don't do this" anti-pattern for the situation.
- Optionally: a worked example (Fibonacci session or Monte Carlo forecast) drawn from the `examples/` folder.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Never frame estimates as commitments without explicit stakeholder negotiation — surfacing the distinction early prevents misuse.
- Always distinguish relative sizing from probabilistic forecasting — story points are not date predictors; conflating them is the root of velocity gaming.
- When recommending NoEstimates, always state the prerequisite: reliable cycle-time history — NoEstimates without data is an absence of information, not a methodology.
- Cite the planning-fallacy literature when explaining why estimates are wrong — teams that understand the cognitive root cause accept data-driven alternatives.
- Escalate velocity configuration and sprint ceremony questions — Jira/Linear setup and sprint ritual design are outside this Bee's domain.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
