# Dark Mode Theming Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `dark-mode-theming-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/dark-mode-theming-worker-bee.md`](../../agents/dark-mode-theming-worker-bee.md)
**Stinger:** [`.cursor/skills/dark-mode-theming-stinger/`](../../skills/dark-mode-theming-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`dark-mode-theming-worker-bee` owns the runtime theming layer for React/Next.js applications — the surface that translates design tokens into theme-aware CSS variables and wires them to user preferences. It covers the full stack from `prefers-color-scheme` detection through `next-themes` ThemeProvider integration, FOWT (flash-of-wrong-theme) prevention via blocking inline scripts, SSR hydration safety (`suppressHydrationWarning`, `typeof window` guards, mounted guard pattern), Tailwind v4 dark-mode configuration via `@custom-variant`, and multi-brand/white-label runtime theme swapping via CSS variable overrides scoped to `data-brand` attributes. It does not own palette creation, per-component visual decisions, persisted-preference DB schemas, or auth-gated per-user themes.

## Trigger phrases

Route to `dark-mode-theming-worker-bee` when the user says any of:

- "set up dark mode"
- "next-themes keeps flashing" / "FOWT fix"
- "dark mode on SSR" / "hydration mismatch suppressHydrationWarning"
- "CSS variable token architecture" / "CSS variable token layer"
- "Tailwind v4 dark mode" / "@custom-variant dark"
- "multi-brand theming" / "white-label theme runtime swap"
- "prefers-color-scheme in Next.js"
- "audit dark mode"

Or when the request implicitly involves wiring a theme provider, eliminating a white flash on page load, fixing SSR/hydration theme mismatches, or setting up runtime CSS variable overrides for multiple brands.

## Do NOT route when

- The user wants to **create a color palette or author the source-of-truth token file** — that belongs to `design-system-worker-bee`.
- The user asks **which token maps to a specific component state or visual role** — that belongs to `ux-ui-worker-bee`.
- The user wants to **design the `user_preferences.theme` DB schema or persist theme choices server-side** — that belongs to `db-worker-bee`.
- The user asks to **validate that a `data-brand` value from URL params or user input is safe** — that belongs to `security-worker-bee`.
- The user needs **auth-gated per-user theme (RBAC + server-side preference)** — route to `auth-worker-bee` + `db-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The **React/Next.js router type** (App Router vs. Pages Router) — determines ThemeProvider placement and FOWT script location.
- The **Tailwind version** (v3 vs. v4) — determines whether `darkMode: 'class'` config or `@custom-variant` is used.
- The **existing token/CSS files** (`globals.css`, `tokens.css`) — required for audit or refactor tasks; can be discovered by reading the repo if not stated.
- **Brand/tenant identifiers** if multi-brand theming is in scope — optional; defaults to single-brand setup if absent.

## Outputs the Bee produces

- **Code blocks or file writes** implementing the CSS variable token layer (`:root` / `.dark` blocks in `globals.css`), `ThemeProvider` wiring, FOWT-prevention inline script, and Tailwind v4 `@custom-variant` configuration — delivered at the relevant file paths.
- **Audit report** (when auditing) — structured markdown using `templates/audit-report.template.md`, written to `reports/`.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` (CSS variable injection validation for any user-controlled brand/tenant input) then `quality-worker-bee`.

## Critical directives the orchestrator should respect

- **Never emit raw hex values in component code.** All color references must go through `var(--token-name)`; raw values bypass the theming system and cannot be audited.
- **Always inject the FOWT-prevention script before first paint.** A visible flash destroys user trust and is not recoverable after hydration.
- **Distinguish `prefers-color-scheme` (system preference) from persisted preference (`localStorage` / cookie).** System preference is the fallback; overwriting it with the OS value erases the user's manual choice.
- **Require `typeof window` guards in every SSR-executed code path that reads theme state.** `next-themes` returns `undefined` during SSR; unguarded reads throw or cause hydration mismatches.
- **Scope multi-brand overrides to CSS variables, not JS state.** CSS variable overrides are zero-JS and zero-rerender; JS state causes full-tree re-renders.
- **Separate semantic tokens from primitive tokens.** Semantic tokens are theme-agnostic building blocks; primitive tokens are not.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
