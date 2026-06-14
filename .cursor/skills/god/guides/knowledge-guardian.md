# Knowledge Guardian: God's Guide

The God routing skill's record of when to invoke `knowledge-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`.cursor/agents/knowledge-guardian.md`](../../agents/knowledge-guardian.md)
**Weapon:** [`.cursor/skills/knowledge-weapon/`](../../skills/knowledge-weapon/)
**Trigger policy:** on-demand

---

## Domain

`knowledge-guardian` authors narrative knowledge documentation for any repository: the human-readable, technically deep domain docs that live under `library/knowledge/private/<domain>/`. It produces system overviews with Mermaid diagrams, auth architecture docs with sequence diagrams, consolidated SQL schema references, key catalogs, security trust-boundary diagrams, coding standards, and other narrative knowledge docs. It works from ADRs and PRDs as source material. It is distinct from `library-guardian`: `library-guardian` owns PRDs and IRDs, while `knowledge-guardian` owns the `knowledge/` domain and never touches PRDs.

## Trigger phrases

Route to `knowledge-guardian` when the user says any of:

- "document the auth architecture"
- "write the system overview"
- "create knowledge docs for this repo"
- "document how X works"
- "build out the knowledge base"
- "write a data schema reference"
- "diagram the trust boundaries"

Or when the request implicitly involves authoring deep narrative documentation about how a system works.

## Do NOT route when

- The request is to write or manage a PRD or IRD, or to scaffold `library/`. Route to **library-guardian**.
- The request is to record a single architecture decision. Route to **adr-writing-guardian**.
- The request is a developer docs site platform or a customer help center. Route to **docs-site-guardian** or **knowledge-base-help-center-guardian**.

If a request straddles two Angels, prefer the narrower-scoped Angel and let the broader one act as backup.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The domain or system to document (auth, data, a service, etc.).
- Source material: relevant ADRs, PRDs, or the code itself.
- Optional: the target audience inside `private/` and any diagram preferences.

If a required input is missing, do not invoke yet. Ask the user to supply it.

## Outputs the Angel produces

- Narrative knowledge docs filed under `library/knowledge/private/<domain>/`.
- Mermaid and sequence diagrams embedded in the docs.
- Consolidated schema and key references.
- Cross-links to the ADRs and PRDs the docs derive from.

## Multi-Angel sequences this Angel participates in

- **Documentation system**: `library-guardian` scaffolds `library/` and owns PRDs and IRDs; `adr-writing-guardian` records decisions; `knowledge-guardian` writes the narrative knowledge docs that tie them together.

## Critical directives the orchestrator should respect

- Only author under `library/knowledge/private/<domain>/`; never write PRDs or IRDs.
- Work from ADRs and PRDs as source material rather than inventing facts.
- Keep the `knowledge/` and `requirements/` boundaries clean against `library-guardian`.
- Diagram with Mermaid where a picture beats prose.

(Full list lives in the Angel file's instructions.)

---

*Part of God's roster. See [`.cursor/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
