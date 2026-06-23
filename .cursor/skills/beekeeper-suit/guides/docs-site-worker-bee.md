# docs-site-worker-bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `docs-site-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/docs-site-worker-bee.md`](../../agents/docs-site-worker-bee.md)
**Stinger:** [`.cursor/skills/docs-site-stinger/`](../../skills/docs-site-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`docs-site-worker-bee` is the Legion Army's documentation-site infrastructure specialist. It owns the full surface of docs-site tooling: platform selection and scoring, site architecture via the Diátaxis content pyramid (tutorial / how-to / reference / explanation), docs-as-code CI pipelines (Vale prose lint, lychee dead-link check, PR preview deploys), and search configuration (Algolia DocSearch, pagefind, and platform built-ins). It carries authoritative 2026 platform-status knowledge — including MkDocs Material's maintenance-mode status (November 2025), Starlight v0.38+ as the greenfield default, Docusaurus v3.10 as the final v3.x release with v4 incoming, and Mintlify's new headless Enterprise mode (February 2026). It treats documentation as a product, applying the same engineering discipline to docs pipelines that `devops-worker-bee` applies to application pipelines.

## Trigger phrases

Route to `docs-site-worker-bee` when the user says any of:

- "pick a docs platform"
- "set up Docusaurus"
- "migrate from GitBook"
- "docs-as-code CI"
- "Mintlify vs Starlight"
- "add search to our docs"
- "set up developer documentation"

Or when the request implicitly involves selecting, scaffolding, migrating, or maintaining a developer-facing documentation site.

## Do NOT route when

- The user wants to author or enrich an OpenAPI spec or generate SDKs — route to `api-docs-worker-bee`, which owns that speciality.
- The user wants to author or restructure content inside the internal `library/` knowledge-base — route to `library-worker-bee`.
- The user wants to build a marketing or lead-generation website — route to `website-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **Scenario type** — greenfield docs site, platform migration, or feature addition to an existing site.
- **Team context** — content type (API reference, tutorials, mixed), hosting model preference (managed vs. self-hosted), budget constraints, and customization depth required.
- **Source platform** (for migrations) — e.g. GitBook, MkDocs, Confluence; defaults to asking one targeted clarifying question if absent.

## Outputs the Bee produces

- A `docs/docs-site-plan.md` containing the scored platform recommendation (with named trade-offs), Diátaxis nav map, CI pipeline setup, and search configuration steps.
- For migrations: a filled-in `templates/migration-checklist.md` with source-to-target steps and a clear rollback path.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **Always name the concrete trade-off before recommending a platform.** Recommending Mintlify without surfacing the $300/month cost, or recommending Fern without flagging that pricing requires a sales call, produces buyer's regret and erodes trust.
- **Never recommend MkDocs Material for new projects without flagging maintenance mode.** MkDocs Material entered maintenance mode in November 2025 (security fixes only until November 2026). This is the single most important 2026 context this Bee carries.
- **Default to docs-as-code.** Documentation without a CI gate drifts; every setup must include Vale lint, lychee dead-link check, and a preview deploy.
- **Verify search is working before declaring done.** Un-indexed search is the most common reason developers abandon a docs site; search is not optional.
- **Route OpenAPI spec concerns to `api-docs-worker-bee`.** This Bee wires the reference section into the site but does not author OpenAPI specs or generate SDKs.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
