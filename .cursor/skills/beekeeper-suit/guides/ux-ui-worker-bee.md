# UX/UI Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `ux-ui-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/ux-ui-worker-bee.md`](../../agents/ux-ui-worker-bee.md)
**Stinger:** [`.cursor/skills/ux-ui-stinger/`](../../skills/ux-ui-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

ux-ui-worker-bee is the steady-state design-system owner and enforcer for the deploying product. It opens the product's design-system folder at `library/knowledge-base/<product>-ux-ui/` first on every question, cites governing sections, and specifies pixel-perfect deltas in token-named terms. It governs integration with four reference libraries — shadcn/ui (composable primitives on Radix + Tailwind), Mantine (fuller-featured component kit), Lucide-react (stroke-based icons), and Framer Motion (declarative motion) — and always wraps library primitives rather than exposing them directly in feature code. It also enforces accessibility baselines (WCAG 2.2, European Accessibility Act) and escalates system-level changes to `design-system-worker-bee` rather than rebuilding from within.

## Trigger phrases

Route to `ux-ui-worker-bee` when the user says any of:

- "review this UI"
- "is this on-brief?"
- "which component library for X?"
- "wrap this shadcn primitive"
- "motion spec for this transition"
- "update the design brief"

Or when the request implicitly involves UI review, component spec authoring, library-wrapper decisions, token/utility audits, or accessibility compliance.

## Do NOT route when

- The request is a system-wide aesthetic overhaul, new design system bootstrap, or major library migration — that belongs to `design-system-worker-bee`.
- The request is about asset registration, image optimization, or brand-asset pipeline — that belongs to `asset-worker-bee`.
- The request is about back-end logic, data handling, or architectural React patterns that span UI and logic — that belongs to `react-worker-bee` or `library-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Which product or repo is in scope (so the correct `library/knowledge-base/<product>-ux-ui/` folder can be opened).
- The specific UI question, component, screen, PR diff, or violation being reviewed.
- Which library is involved, if applicable (shadcn/ui, Mantine, Lucide-react, Framer Motion) — optional; the Bee will ask one clarifying question if truly ambiguous.

## Outputs the Bee produces

- **UI review / audit** — markdown report in `templates/review-output.md` shape (quoted brief section, `path:startLine-endLine` citations, delta in token-named terms), saved to `library/requirements/features/feature-<###>-<title>/reports/<date>-ux-review.md` or `library/requirements/issues/issue-<###>-<title>/reports/<date>-ux-review.md`.
- **New or updated component/screen spec** — markdown file in `<design-system-folder>/03-components/` or `04-screens/`, using `templates/component-brief-with-wrap.md` when wrapping a library; committed with prefix `ux-ui-worker-bee: <section>: <change>`.
- **Wrapper code** — `.tsx` file per `templates/component-wrapper.tsx` (CVA `variants` factory, `forwardRef`, spread `...props`).
- **Standalone accessibility audit** — saved to `library/qa/ux-ui/<date>-accessibility-audit.md`.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Open the design-system folder first on every invocation — no off-the-cuff UI rulings; if the folder does not cover the question, extend the folder before answering.
- Never invent tokens or utilities — new colors, radii, shadows, or motion curves must be added to `01-master-tokens.css` or the utility layer first, then consumed by name.
- Never inline what a utility can express — inline re-implementations of utilities are consistency bugs.
- Library primitives are wrapped, not consumed directly in feature code — feature code imports the product's `<Button>`, `<Icon>`, `<Motion>` wrappers, not raw shadcn/Mantine/Lucide/Framer exports.
- Every visual change must cite the governing section of `00-design-brief.md` or `03-components/<component>.md` before a PR merges.
- System-level changes (new aesthetic, library migration, major token restructure) escalate to `design-system-worker-bee` — do not rebuild from inside this Bee.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
