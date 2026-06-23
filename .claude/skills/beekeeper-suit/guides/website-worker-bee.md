# Website Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `website-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/website-worker-bee.md`](../../agents/website-worker-bee.md)
**Stinger:** [`.cursor/skills/website-stinger/`](../../skills/website-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`website-worker-bee` owns end-to-end website construction using the SvelteKit (Svelte 5) + Payload CMS + Supabase stack. Given a brief and brand inputs, it scaffolds a pnpm monorepo (`apps/web` + `apps/cms`), wires both apps to Vercel, and executes a 12-phase playbook covering monorepo setup, performance, SEO/AEO, analytics, Supabase schema + RLS, auth + RBAC, Payload admin, lead capture, blog, webhooks, visual design tokens, and conversion-rate optimization. The default CMS mode is Payload 3.x; a TypeScript-as-CMS fallback is available for one-page lead-gen sites that do not need a managed admin panel. The Bee is intentionally autonomous: it batches all clarifying questions at the start, then runs phase by phase with smoke checks and structured commits.

## Trigger phrases

Route to `website-worker-bee` when the user says any of:

- "build a website"
- "scaffold a SvelteKit site"
- "spin up a marketing/lead-gen site"
- "ship a website from scratch"
- "create a SvelteKit + Supabase site"
- "take this brand kit and ship a site"

Or when the request implicitly involves building a new web presence end-to-end from a brief.

## Do NOT route when

- The request is a one-off page tweak or copy edit on an existing site — no Bee owns this; handle inline.
- The request is a Lighthouse audit or performance review on an existing site — route to `quality-worker-bee`.
- The request is deploy-only (e.g., "push to Vercel", "run CI") with no scaffolding involved — route to `devops-worker-bee` or handle directly.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- A site brief (product description, target audience, desired pages/features)
- Brand inputs: color palette, typography, logo (or explicit instruction to use neutral defaults)
- CMS mode decision: does the site need a managed admin panel with blog/content management by non-developer editors? (defaults to Payload mode if absent)
- Target repo path or workspace location — defaults to a new directory named after the product if not specified

## Outputs the Bee produces

- A working pnpm monorepo at the target path containing `apps/web` (SvelteKit) and, in Payload mode, `apps/cms` (Next.js + Payload 3.x), with Vercel configuration for both apps
- A `build-report.md` in the repo root — 12-phase pass/fail/skip table with PRD citations, risks, open questions, and recommended downstream Bees

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`
- Phase 3 delegates to `seo-aeo-worker-bee` (SvelteKit track) for sitemap, robots, and structured-data wiring
- Phase 5 delegates to `db-worker-bee` for detailed schema design, index selection, and zero-downtime migration patterns
- Phase 7 and Phase 9 delegate to `cms-payload-worker-bee` for Payload Collections, Blocks, Lexical rendering, and Live Preview

## Critical directives the orchestrator should respect

- Always read `SKILL.md` and `guides/00-principles.md` before any file write — architectural commitments are load-bearing
- Never deploy secrets, run destructive SQL on shared Supabase projects, or trigger production builds without explicit user confirmation
- Honor the canonical phase execution order: `1 → 2 → 5 → 6 → 7 → 3 → 4 → 8 → 9 → 10 → 12 → 11`
- When a phase acceptance criterion cannot be met, mark it Skip with a one-line reason — never silently fudge
- Never overwrite a non-empty target directory without confirmation
- Surface every Risk (R-N) and Open Question (Q-N) from the source PRDs in the Build Report's Next steps

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
