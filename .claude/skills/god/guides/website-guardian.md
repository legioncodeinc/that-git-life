# Website Guardian — God's Guide

The God routing skill's record of when to invoke `website-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`army/.cursor/agents/website-guardian.md`](../../agents/website-guardian.md)
**Weapon:** [`army/.cursor/skills/website-weapon/`](../../skills/website-weapon/)
**Command Brief:** [`army/website-guardian-command-brief.md`](../../../website-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`website-guardian` owns end-to-end website builds: scaffolding a Next.js 15 + Vite-admin + Supabase monorepo, applying a 12-phase site-template playbook (architecture, performance, SEO/AEO, analytics, backend, auth, admin SPA, lead capture, blog, webhooks, visual design, conversion-rate optimization), and delivering a working repo plus a structured Build Report. It is the first Angel a user invokes when they have a brief and need a production-grade site. It does not pick brand identity, write marketing copy, or deploy to production without confirmation.

## Trigger phrases

Route to `website-guardian` when the user says any of:

- "Build me a website / a marketing site / a lead-gen site"
- "Scaffold a Next.js + Supabase site"
- "Spin up a one-page lead-capture site"
- "Ship a website from scratch"
- "Take this brand kit and ship a site by EOD"
- "Create a Next.js 15 + Vite admin monorepo"
- "Set up a new Next.js project with Supabase + analytics + SEO + a contact form"

Or when the request implicitly requires standing up a new website project end to end (brief + brand + deploy target supplied).

## Do NOT route when

- The user wants a one-off page tweak, copy edit, or component rewrite on an existing site — handle inline or via a future content/UI Angel.
- The user wants an SEO audit on an existing site — that is `seo-guardian`'s domain (when registered).
- The user wants an accessibility audit on existing rendered routes — that is a future `accessibility-guardian`.
- The user wants only deployment/CI wiring on an already-built repo — that is a future `deploy-guardian`.
- The user wants a backend microservice with no public marketing site — pick a different Angel (or build directly without invoking website-guardian).

If the user's request straddles "scaffold a site" and "audit the resulting site", invoke `website-guardian` first; downstream auditing Angels run over its output.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- A short brief: site name, audience, primary CTA.
- Brand inputs: primary + accent colors (HSL preferred), font preference (or "tasteful default"), logo or placeholder.
- Repo target path (must be empty or near-empty).
- Confirmation of stack defaults (Next.js 15, Vite admin, Supabase, Vercel) or an explicit deviation.
- **Conditional, may be missing without blocking:** Vercel project link, Supabase project ref, GA4 measurement ID, optional WhatConverts/Clarity/Facebook Pixel IDs. Missing analytics IDs gate features but not the build; missing Supabase forces alternate Phase 8 delivery path.
- Optional: phase opt-outs (skip blog, skip admin SPA, etc.).

If the brand colors or repo path are missing, do not invoke yet — ask the user to supply them in a single batched round before scaffolding starts.

## Outputs the Angel produces

- A working dual-app monorepo at the target path (`apps/web` Next.js, `apps/admin` Vite SPA, `supabase/migrations/`, `supabase/functions/`, root + per-app `vercel.json`).
- A Build Report at `<repo-root>/build-report.md` mapping every phase to its acceptance criteria with pass/fail/skip and one-line evidence, plus a Next steps section listing inherited Risks (R-N) and Open Questions (Q-N).
- Per-phase commits (`feat(phase-N): <name>`) so the audit trail is replayable from `git log`.

## Multi-Angel sequences this Angel participates in

- **New site bring-up** — `website-guardian` is Phase A: produces the repo and Build Report. Phase B (when registered): `seo-guardian` reviews the SEO-relevant code paths the build produced. Phase C (when registered): `accessibility-guardian` audits the rendered routes. Phase D (when registered): `deploy-guardian` wires CI/CD beyond the `vercel.json` defaults.
- The Build Report's "Recommended downstream Angels" section names which Phase-B+ Angels apply to the produced site.

## Critical directives the orchestrator should respect

- Never deploy secrets, run destructive SQL on shared Supabase projects, or trigger production builds without explicit user confirmation. The Angel will pause; do not push it past the pause.
- Never overwrite a non-empty target directory without confirmation.
- Honor the canonical phase order; do not ask the Angel to "just skip ahead to Phase 8" — it will refuse and log the request as an Open Question.
- Skip is honest; if the user opts out of a phase, the Build Report row will read `skip` with rationale. That is correct behavior.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`army/.cursor/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
