# Open Questions — seo-aeo-stinger

These are user-resolvable (not web-resolvable). They came out of the brief's IDEAS, SUGGESTIONS, QUESTIONS section. Not blocking the forge — each has a default captured in the guides — but called out so the user can override.

## Q1. Pages Router migration guide — in scope?

**Brief:** "Should the Stinger include a 'migration from Pages Router' guide, or is that out of scope? The source doc assumes App Router throughout."

**Default in this forge:** Out of scope. `guides/00-principles.md` declares Next.js 14+ App Router scope and instructs the Bee to flag Pages Router codebases as degraded coverage, escalating to `react-worker-bee` for the App Router migration. Preserves the canonical playbook's scope.

**Override trigger:** User asks for an explicit migration playbook.

## Q2. AEO-specific citation optimization — separate guide or folded into 05?

**Brief:** "Should AEO-specific patterns (optimizing for ChatGPT/Perplexity citations) be a separate guide or folded into `guides/05-answer-engine-optimization.md`?"

**Default in this forge:** Folded into `guides/05-answer-engine-optimization.md` with a dedicated section "AI Assistant Citation Patterns" that layers on top of the featured-snippet patterns. Keeps the 1:1 mapping to playbook §6 intact.

**Override trigger:** AEO becomes materially distinct from featured snippets (e.g., new protocol emerges like `llms.txt` adoption pattern hardening). At that point, promote to `guides/12-ai-assistants.md` or similar.

## Q3. local-seo — always on or conditional?

**Brief:** "Should `local-seo` be a conditionally-activated guide (only invoked when the project has a local business context)?"

**Default in this forge:** Always authored (playbook §9 is in scope), conditionally *applied* by the Bee. The Bee's Step 1 scoping determines whether the target is a local-business site; if not, `guides/08-local-seo.md` becomes low-priority reading rather than checklist-blocking.

**Override trigger:** A user explicitly wants local-SEO validation skipped for non-local sites in CI.

## Q4. Schema validation in CI — automate?

**Brief (inferred from "SUBAGENT CRITICAL DIRECTIVES"):** Schema must be validated; manual Rich Results Test is the current expectation.

**Default in this forge:** `scripts/validate-schema.ts` stub is provided as a starting point for headless validation against `validator.schema.org`. It is *not* wired into a default CI pipeline — the user decides whether to adopt it.

**Override trigger:** User wants CI-blocking schema validation; we'd extend the script and emit a GitHub Actions workflow template.

## Q5. 90-day refresh protocol — who owns it?

**Brief:** "Refresh cadence: SEO/AEO drift fast — 90-day review cycle on `research/`."

**Default in this forge:** Documented in `research/refresh-cadence.md`. Owner left unspecified; `seo-aeo-worker-bee` Bee can execute the review when prompted ("refresh seo-aeo research"). The Bee re-runs the research plan's queries and updates dated notes.

**Override trigger:** User wants this to be a scheduled automation rather than on-demand.
