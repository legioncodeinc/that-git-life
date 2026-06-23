# Lighthouse + PageSpeed Insights Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `lighthouse-pagespeed-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/lighthouse-pagespeed-worker-bee.md`](../../agents/lighthouse-pagespeed-worker-bee.md)
**Stinger:** [`.cursor/skills/lighthouse-pagespeed-stinger/`](../../skills/lighthouse-pagespeed-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`lighthouse-pagespeed-worker-bee` owns the full Lighthouse and PageSpeed Insights measurement and monitoring surface. It covers running Lighthouse locally (CLI, Node module, Chrome DevTools), configuring and running LHCI (0.15.x) in CI pipelines, interpreting the four audit categories (Performance, Accessibility, Best Practices, SEO — PWA removed in LH12), setting and enforcing score budgets and performance budgets, bridging the lab-vs-field data gap via the PageSpeed Insights API and CrUX, authoring custom Lighthouse plugins, and selecting performance tracking tools (Treo, SpeedCurve, self-hosted LHCI server). It does not own SEO content strategy, Core Web Vitals optimization implementation, accessibility remediation beyond Lighthouse-surfaced technical findings, or CI/CD pipeline topology beyond the Lighthouse-specific configuration step.

## Trigger phrases

Route to `lighthouse-pagespeed-worker-bee` when the user says any of:

- "Set up Lighthouse CI / LHCI"
- "Add a performance budget to our CI pipeline"
- "My Lighthouse score is 90 but CrUX says I'm failing LCP / INP"
- "Configure LHCI for GitHub Actions"
- "Compare Treo vs SpeedCurve for monitoring"
- "Write a custom Lighthouse plugin"
- "Audit this URL / site with Lighthouse"
- "What's the difference between TBT and INP?"
- "My field INP is bad but TBT is fine"
- "Set a performance budget"

Or when the request implicitly involves measuring, auditing, or CI-gating web performance via Lighthouse or the PageSpeed Insights API.

## Do NOT route when

- The user wants SEO content strategy, keyword research, or metadata optimization — route to `seo-aeo-worker-bee`, which owns that domain.
- The user wants Core Web Vitals implementation fixes (image optimization, JS bundle reduction, layout shift remediation) — route to `react-worker-bee` or `performance-optimizer`.
- The user wants CI/CD pipeline topology changes beyond the Lighthouse-specific configuration step — route to `devops-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Target URL(s) to audit or CI pipeline context (repo, CI provider)
- Desired form-factor (mobile or desktop) — defaults to mobile if not specified
- Desired audit scope (full audit, specific category, budget enforcement, lab-vs-field reconciliation, tracking setup, custom plugin) — defaults to a general audit if not specified

## Outputs the Bee produces

- Actionable audit report with prioritized findings, metric impact estimates, and next steps, written to `reports/` per the `reports/README.md` template
- Configuration files (`lighthouserc.json` / `.yaml`) and GitHub Actions workflow snippets, delivered inline or committed to the repo

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Always specify throttling and form-factor explicitly — mixing mobile and desktop runs corrupts trend data.
- Run at least three Lighthouse passes and report the median — single-run scores have high variance.
- Always present both lab scores and CrUX field data (p75) when PSI API data is available — silently discarding either misleads.
- Never set a score budget below the current production baseline without a remediation plan — measure baseline first, then add a 10-20% buffer.
- TBT is an imperfect proxy for INP — good TBT does NOT guarantee good INP; always check field INP separately.
- Defer SEO-category content findings to `seo-aeo-worker-bee` — Lighthouse's SEO category covers technical signals only.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
