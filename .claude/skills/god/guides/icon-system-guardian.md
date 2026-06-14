# icon-system-guardian — God's Guide

The God routing skill's record of when to invoke `icon-system-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/icon-system-guardian.md`](../../agents/icon-system-guardian.md)  
**Weapon:** [`ai-tools/skills/icon-system-weapon/`](../../skills/icon-system-weapon/)  
**Command Brief:** [`ai-tools/command-briefs/icon-system-guardian-command-brief.md`](../../../command-briefs/icon-system-guardian-command-brief.md)  
**Trigger policy:** proactive

---

## Domain

`icon-system-guardian` owns the icon delivery layer in React/Next.js applications. It selects the right icon library for the project's constraints (Lucide, Heroicons, Tabler, Phosphor, or Iconify), decides the delivery strategy (named ESM tree-shaking vs SVG sprite), implements the dynamic-import-by-name pattern for runtime icon name strings, authors typed custom SVG wrapper components, and audits all icons against the WCAG accessibility contract (decorative icons hidden from AT, semantic icons labeled, interactive icon buttons named). It is the single owner of everything between "which icon library do we use?" and "does this icon button have an accessible name?".

## Trigger phrases

Route to `icon-system-guardian` when the user says any of:

- "Which icon library should we use?"
- "My icon imports are bloating the bundle"
- "How do I load an icon by name at runtime?"
- "Build me a reusable icon component"
- "Audit our icons for accessibility"
- "Should I use an SVG sprite or tree-shaking?"
- "The icon button has no accessible name"
- "How do I set up Lucide React?"
- "Compare Heroicons vs Tabler vs Phosphor"
- "Set up Iconify in Next.js"

Or when the request implicitly involves icon imports, SVG component patterns, or icon accessibility in a React codebase.

## Do NOT route when

- The user asks about icon sizing or color tokens — route to `ux-ui-guardian` (owns design tokens).
- The user needs SVG sprite build-pipeline tooling configured at the bundler level (SVGO config, svg-sprite CLI, vite-plugin-svgr webpack rules) — route to `devops-guardian`.
- The user asks about general bundle optimization beyond icon imports — route to `devops-guardian`.
- The user asks about icon design or visual style guidelines — route to `ux-ui-guardian`.

If a request straddles `icon-system-guardian` and `ux-ui-guardian` (e.g., "set up icons with the right sizes for our design system"), handle the delivery and accessibility layer with `icon-system-guardian`, then hand off size/color token decisions to `ux-ui-guardian`.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The React/Next.js framework context (App Router or Pages Router, Tailwind or CSS-modules, RSC boundaries).
- The icon library already installed (or a request to choose one).
- Whether the icon set is static (defined at build time) or dynamic (icon name as a string at runtime).
- Any performance budget or Lighthouse score constraint (for bundle-impact decisions).
- For accessibility audits: file paths or PR diff containing icon component code.

If a required input is missing, do not invoke yet — ask the user to supply it.

## Outputs the Angel produces

- **Primary:** Markdown audit report (from `templates/icon-audit-report.md`) for audit requests, OR ready-to-use React component code for implementation requests.
- **Secondary:** Named bundle-size estimate for the proposed icon import pattern.
- **Consumers:** PR author, `react-guardian` (architecture sign-off), `ux-ui-guardian` (token alignment), `devops-guardian` (if SVG sprite pipeline changes are needed).

## Multi-Angel sequences this Angel participates in

- **Icon system setup sequence:** `icon-system-guardian` (library + delivery + accessibility) → `ux-ui-guardian` (size/color tokens) → `devops-guardian` (if SVG sprite build pipeline needed).
- **Plan execution loop:** implementation Angel → `security-guardian` → `quality-guardian` (standard close-out; `icon-system-guardian` may appear in the implementation slot for icon-related features).

## Critical directives the orchestrator should respect

- Never import from a library's barrel root without confirming tree-shaking is guaranteed.
- Every icon must be either `aria-hidden="true"` (decorative) or carry an accessible name (semantic/interactive).
- Dynamic-by-name loading must not be used for above-the-fold SSR-critical icons.
- `focusable="false"` is required on all custom SVG elements.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
