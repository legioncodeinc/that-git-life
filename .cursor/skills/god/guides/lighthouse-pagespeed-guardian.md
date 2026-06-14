# lighthouse-pagespeed-guardian — God's Guide

The God routing skill's record of when to invoke `lighthouse-pagespeed-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/lighthouse-pagespeed-guardian.md`](../../agents/lighthouse-pagespeed-guardian.md)
**Weapon:** [`ai-tools/skills/lighthouse-pagespeed-weapon/`](../../skills/lighthouse-pagespeed-weapon/)
**Command Brief:** [`ai-tools/command-briefs/lighthouse-pagespeed-guardian-command-brief.md`](../../command-briefs/lighthouse-pagespeed-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`lighthouse-pagespeed-guardian` owns the full Lighthouse + PageSpeed Insights measurement and monitoring surface: running Lighthouse locally (CLI, Node module, Chrome DevTools), configuring LHCI in CI pipelines (GitHub Actions), interpreting all four audit categories (Performance, Accessibility, Best Practices, SEO — PWA removed in LH12), setting score budgets and performance budgets, bridging the lab-vs-field data gap via the PSI API and CrUX, authoring custom Lighthouse plugins, and selecting performance tracking tools (Treo, SpeedCurve, self-hosted LHCI server). It does NOT own SEO content strategy (seo-aeo-guardian), Core Web Vitals optimization implementation (react-guardian or performance-optimizer), or CI/CD pipeline topology beyond the Lighthouse-specific step (devops-guardian).

## Trigger phrases

Route to `lighthouse-pagespeed-guardian` when the user says any of:

- "set up Lighthouse CI" / "LHCI"
- "add a performance budget to CI"
- "configure LHCI for GitHub Actions"
- "my Lighthouse score is 90 but CrUX says I'm failing"
- "lab data vs field data" / "lab vs CrUX"
- "TBT is good but INP is failing"
- "compare Treo vs SpeedCurve"
- "write a custom Lighthouse plugin"
- "audit this site with Lighthouse"
- "PageSpeed Insights API"
- "CrUX field data"
- "performance budget"
- "lighthouserc.json"

Or when the request involves Lighthouse scoring, LHCI configuration, or CrUX/PSI data interpretation.

## Do NOT route when

- The request is about SEO content strategy, keyword research, or metadata optimization — route to `seo-aeo-guardian`. (Lighthouse's SEO category covers technical signals only; seo-aeo-guardian owns the content layer.)
- The request is about implementing Core Web Vitals fixes (e.g., "reduce my LCP by optimizing images", "fix INP in my React components") — route to `react-guardian` or `performance-optimizer`. Lighthouse-pagespeed-guardian diagnoses; other Angels fix.
- The request is about CI/CD pipeline topology or GitHub Actions beyond the Lighthouse-specific step — route to `devops-guardian`.
- The request is about accessibility design decisions or remediation beyond Lighthouse-flagged technical checks.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- **URL(s) or local server address** to audit
- **Environment context**: local dev, staging, or production
- **Audit scope**: specific categories, any custom plugins needed
- **CI context**: which CI platform (GitHub Actions, GitLab, CircleCI, etc.)
- Optionally: existing score thresholds, a Lighthouse JSON report file, or a PSI API response

If the scenario is ambiguous, `lighthouse-pagespeed-guardian` will ask one targeted clarifying question.

## Outputs the Angel produces

- Markdown audit report with scored categories, prioritized findings table, and remediation snippets
- `lighthouserc.json`/yaml config (from `templates/lighthouserc-starter.yaml`)
- GitHub Actions workflow for LHCI CI integration
- Lab-vs-field data reconciliation with PSI API query and explanation
- Custom Lighthouse plugin scaffold (from `templates/custom-plugin-starter.js`)
- Performance tracking tool recommendation (Treo / SpeedCurve / self-hosted LHCI server)

## Multi-Angel sequences this Angel participates in

- **Performance audit + remediation**: `lighthouse-pagespeed-guardian` runs the audit and produces findings; `react-guardian` or `performance-optimizer` implements the fixes; `seo-aeo-guardian` handles any SEO-category findings that go beyond technical checks.
- **CI pipeline setup**: `devops-guardian` designs the overall GitHub Actions pipeline; `lighthouse-pagespeed-guardian` provides the Lighthouse-specific step config and `lighthouserc.json`.
- **New feature release QA**: `lighthouse-pagespeed-guardian` can be added to the Plan execution loop alongside `security-guardian` and `quality-guardian` to gate releases on performance regression.

## Critical directives the orchestrator should respect

- Always specify throttling and form-factor explicitly — never compare scores run with different settings.
- Always run at least 3 Lighthouse passes and report the median — single-run scores are not reliable.
- Always show both lab scores and CrUX field data when PSI API data is available.
- Never set a CI budget below the current production baseline without a remediation plan.
- TBT good does NOT mean INP good — always check field INP separately.
- Custom plugin capability is limited — plugins cannot access custom Gatherers.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
