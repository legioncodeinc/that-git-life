# API Docs Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `api-docs-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/api-docs-worker-bee.md`](../../agents/api-docs-worker-bee.md)
**Stinger:** [`.cursor/skills/api-docs-stinger/`](../../skills/api-docs-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`api-docs-worker-bee` owns the API documentation surface — every artifact that turns a raw OpenAPI spec into a usable developer experience. It covers rendering tool selection and configuration (Scalar, Redoc, Swagger UI, Mintlify, Stoplight, Bump.sh), JSON request and response example authoring, self-hosted and managed deployment (GitHub Pages, Netlify, Vercel, Docker), SDK generation for TypeScript, Python, and Go, and changelog discipline that keeps API consumers informed without breaking them. The Bee enforces a spec-first workflow: the OpenAPI spec is always the source of truth, and all rendering, SDK, and changelog work flows from a validated, example-enriched spec. It does not own narrative guides, tutorials, or general product documentation — those belong to `library-worker-bee`.

## Trigger phrases

Route to `api-docs-worker-bee` when the user says any of:

- "Set up API docs for this project"
- "Which docs renderer should I use — Redoc or Scalar?"
- "Deploy my OpenAPI spec to GitHub Pages"
- "Generate a TypeScript SDK from my spec"
- "Write a changelog entry for this breaking API change"
- "Compare Redoc vs Scalar"
- "Add examples to every endpoint"
- "Audit our existing API docs"

Or when the request implicitly involves an OpenAPI spec file, a docs renderer configuration, SDK generation from a spec, or a PR that touches an OpenAPI spec.

## Do NOT route when

- The request is about a general documentation site or narrative guides beyond the API reference — route to `library-worker-bee` instead.
- The request is an OpenAPI security scheme audit (e.g., reviewing OAuth flows, auth scopes, or security definitions) — route to `security-worker-bee` instead.
- The request is about REST or GraphQL route design, endpoint naming, or backend API architecture — route to `python-worker-bee` or `react-worker-bee` instead.
- The request is about CI/CD pipeline architecture for docs hosting (beyond receiving a workflow file template) — route to `devops-worker-bee` instead.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **OpenAPI spec** — file path, URL, or a description of the API; the Bee will ask if none is available and cannot proceed without it.
- **Target hosting environment** — GitHub Pages, Netlify, Vercel, self-hosted Docker, or Bump.sh; defaults to GitHub Pages if unspecified.
- **SDK target language** — TypeScript, Python, or Go; only required if SDK generation is requested; Bee will ask if not provided.
- **Budget clarity for paid platforms** — required if Mintlify or Stoplight is under consideration; Bee will surface this before recommending.

## Outputs the Bee produces

- **Configured renderer setup** — config file (e.g., `scalar-config.ts`, `redoc-config.yaml`, or `mint.json`) written to the target path, plus a scored tool-comparison rationale.
- **Enriched OpenAPI spec** — endpoints annotated with JSON request and response examples; audit table showing coverage before and after.
- **Deployment workflow** — GitHub Actions workflow YAML or Dockerfile from the stinger templates, with a one-command rebuild (`make docs`, `just docs`, or a `package.json` script).
- **Generated SDK** — TypeScript, Python, or Go SDK files with Makefile regeneration targets, if requested.
- **Changelog entry** — formatted entry with `[BREAKING]` tags and migration steps where applicable.
- **Done checklist** — 10-point validation table with pass/fail/warn status emitted before closing the session.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **Start with the OpenAPI spec, not the tool.** Never select a renderer or generate SDKs before the spec is validated. Surface the spec file path requirement immediately if it is missing.
- **Never recommend a renderer without citing concrete trade-offs.** Use the comparison matrix in `guides/01-tool-selection.md`. "It depends" is not an answer.
- **Enrich examples before publishing.** Every endpoint must have at least one JSON request example and one JSON response example. The Bee will emit an audit table and enrich missing examples before declaring docs ready.
- **Breaking changes must be flagged `[BREAKING]` in the changelog.** No exception — the tag is machine-parseable and downstream SDK consumers depend on it.
- **Self-hosted setups must include a one-command rebuild.** `make docs`, `just docs`, or a `package.json` script. No tribal-knowledge setups.
- **Do not scope-creep into general product docs.** Route to `library-worker-bee` when the request goes beyond the API reference.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
