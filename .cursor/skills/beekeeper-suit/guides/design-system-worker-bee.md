# Design System Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `design-system-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/design-system-worker-bee.md`](../../agents/design-system-worker-bee.md)
**Stinger:** [`.cursor/skills/design-system-stinger/`](../../skills/design-system-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`design-system-worker-bee` owns the full bootstrapping of a product's design system from scratch. It conducts a structured aesthetic interview, selects the closest starter kit (glass-on-beige, flat-modern, or editorial-serif), and materializes the canonical seven-artifact folder: `00-design-brief.md`, `01-master-tokens.css`, `02-<utility-layer>.css`, `03-components/*.md`, `04-screens/*.md`, `05-html-examples/*.html`, and `README.md`. It also handles migration of ad-hoc, unsystematic CSS codebases into this canonical structure. Once the system exists on disk, ownership transfers unconditionally to `ux-ui-worker-bee` — this Bee creates, it does not maintain.

## Trigger phrases

Route to `design-system-worker-bee` when the user says any of:

- "build a design system for X"
- "bootstrap UI for product Y"
- "create tokens and utilities for this product"
- "scaffold the design language"
- "I need a design brief and tokens for X"
- "create the source-of-truth for our UI"

Or when the request implicitly involves bootstrapping a design system from scratch for a new or unsystematic product.

## Do NOT route when

- The request is for incremental token changes, component tweaks, or PR reviews — that is `ux-ui-worker-bee`'s job.
- The request concerns an existing, already-bootstrapped design system (maintenance, additions, or review) — that is `ux-ui-worker-bee`'s territory.
- The request is a major rebrand of an existing system unless the user has explicitly decided to re-bootstrap from scratch.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The product name and a brief description of what it does
- Any aesthetic references, brand constraints, or non-negotiables (extracted via interview if not provided upfront)
- Target output path — defaults to `library/knowledge-base/<product>-ux-ui/` if not specified
- Scope flags: whether tenant theming, dark mode, and/or RTL are in scope (optional — Bee will ask if absent)

## Outputs the Bee produces

- The canonical seven-artifact design system folder at the target path: `00-design-brief.md`, `01-master-tokens.css`, `02-<utility-layer>.css`, `03-components/` (8–15 files), `04-screens/` (5–10 files), `05-html-examples/` (5–8 HTML files + `_shared.css`), and `README.md`
- A bootstrap report written to `library/qa/design-system/<date>-<product>-bootstrap.md` (standalone) or `library/requirements/features/feature-<###>-<title>/reports/<date>-design-system-bootstrap.md` (feature-tied), plus a handoff line handing ownership to `ux-ui-worker-bee`

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Never let the Bee invent the aesthetic — if the user says "you decide", the Bee must push back and request three reference products whose aesthetic the user admires before proceeding.
- Enforce the layering order: token layer first, utility layer second, components third, screens fourth — a component spec that references a hex value instead of a token is a bug.
- Every non-negotiable rule in the brief must be accompanied by a one-line justification — unreasoned rules are disallowed.
- HTML examples are static photographs: self-contained, double-click-openable, and must not contradict the brief (if they do, the brief wins and the HTML is the bug).
- Motion must be systemic: every duration and curve is a named token; custom curves and ad-hoc transitions are rejected; `prefers-reduced-motion` is honored on every motion token.
- Tenant theming, dark mode, and RTL are designed in from the start if they are in scope — they are never bolted on after the fact.
- This Bee produces source-of-truth documents (`.md` and `.css`); wiring them into a live codebase is `ux-ui-worker-bee`'s responsibility.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
