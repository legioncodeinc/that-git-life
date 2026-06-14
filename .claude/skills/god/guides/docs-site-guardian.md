# Docs Site Guardian: God's Guide

The God routing skill's record of when to invoke `docs-site-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`.cursor/agents/docs-site-guardian.md`](../../agents/docs-site-guardian.md)
**Weapon:** [`.cursor/skills/docs-site-weapon/`](../../skills/docs-site-weapon/)
**Trigger policy:** proactive

---

## Domain

`docs-site-guardian` owns developer-facing documentation site infrastructure. It selects, sets up, and maintains docs platforms (Docusaurus v3/v4, Mintlify, GitBook, MkDocs Material which is in maintenance mode, Nextra v4, Starlight on Astro, Fern). It applies the Diataxis content pyramid, builds docs-as-code CI pipelines (Vale, lychee), and wires search (Algolia DocSearch, pagefind). It also runs platform migration playbooks. Every platform recommendation names the concrete trade-off, including price and lock-in, before the pick.

## Trigger phrases

Route to `docs-site-guardian` when the user says any of:

- "pick a docs platform"
- "set up Docusaurus"
- "migrate from GitBook"
- "docs-as-code CI"
- "Mintlify vs Starlight"
- "add search to docs"
- "MkDocs Material maintenance"
- "set up developer documentation"

Or when the request implicitly involves standing up or maintaining a developer documentation site.

## Do NOT route when

- The request is OpenAPI spec authorship or SDK generation. Route to **api-docs-guardian**.
- The request is the internal `library/` knowledge base or knowledge docs. Route to **library-guardian** or **knowledge-guardian**.
- The request is a customer-facing help center or support knowledge base. Route to **knowledge-base-help-center-guardian**.
- The request is a marketing website build. Route to **website-guardian**.

If a request straddles two Angels, prefer the narrower-scoped Angel and let the broader one act as backup.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The goal: new docs site, platform migration, CI gate, or search setup.
- The current platform and stack, if one exists.
- Optional: budget tolerance and self-host vs hosted preference.

If a required input is missing, do not invoke yet. Ask the user to supply it.

## Outputs the Angel produces

- A platform recommendation with the trade-off stated plainly.
- A configured docs site or migration plan.
- A docs-as-code CI pipeline (link checking, prose linting).
- Working, indexed search.

## Multi-Angel sequences this Angel participates in

- **New site bring-up**: `docs-site-guardian` handles the docs platform; `website-guardian` handles the marketing site; `api-docs-guardian` handles the API reference.
- **Documentation system**: `docs-site-guardian` publishes the site; `knowledge-guardian` and `library-guardian` author the content.

## Critical directives the orchestrator should respect

- Always name the concrete trade-off before recommending a platform.
- Never recommend MkDocs Material for new projects without flagging maintenance mode.
- Default to docs-as-code.
- Verify search is working before declaring done.
- Route OpenAPI spec concerns to `api-docs-guardian`.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`.cursor/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
