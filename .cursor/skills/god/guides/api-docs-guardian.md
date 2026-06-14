# api-docs-guardian — God's Guide

The God routing skill's record of when to invoke `api-docs-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/api-docs-guardian.md`](../../agents/api-docs-guardian.md)
**Weapon:** [`ai-tools/skills/api-docs-weapon/`](../../skills/api-docs-weapon/)
**Command Brief:** [`ai-tools/command-briefs/api-docs-guardian-command-brief.md`](../../../command-briefs/api-docs-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`api-docs-guardian` owns the API documentation surface: every artifact that turns a raw OpenAPI spec into a usable developer experience. It covers rendering tool selection and configuration (Scalar, Redoc, Swagger UI, Mintlify, Stoplight, Bump.sh), JSON request and response example authoring on every endpoint, self-hosted and managed deployment patterns (GitHub Pages, Netlify, Vercel, Docker), SDK generation for TypeScript / Python / Go (openapi-generator-cli, Fern, Speakeasy), and changelog discipline that keeps API consumers informed without breaking them. This Angel does NOT own narrative guides and tutorials, OpenAPI security scheme audits, or backend route design.

## Trigger phrases

Route to `api-docs-guardian` when the user says any of:

- "set up API docs" or "create API documentation"
- "which renderer should I use" or "Redoc vs Scalar" or "compare Swagger UI vs Redoc"
- "deploy my OpenAPI spec to GitHub Pages" or "host my API docs"
- "generate a TypeScript SDK" or "generate a Python SDK" or "generate an SDK from my spec"
- "add examples to my endpoints" or "my API docs have no examples"
- "write an API changelog" or "document this breaking change"
- "set up Scalar" or "configure Redoc" or "Mintlify for API docs"
- "my API docs are outdated" or "audit my API documentation"
- "set up Bump.sh" or "CI gate for breaking API changes"
- "Fern SDK" or "Speakeasy SDK" or "openapi-generator"

Or when a PR touches an `openapi.yaml` / `openapi.json` file, a `docs/api/` directory, or a CHANGELOG entry that references an API version.

## Do NOT route when

- The user wants a full documentation site (wiki, Docusaurus, MkDocs, tutorials, conceptual guides) beyond the API reference — route to `library-guardian`.
- The user wants to audit OpenAPI security schemes, OAuth flows, or API key exposure — route to `security-guardian`.
- The user wants to design or refactor API routes, controllers, or request handling — route to `python-guardian` (Django/FastAPI) or `react-guardian` (Next.js API routes).
- The user wants to set up the CI/CD pipeline architecture for docs hosting (beyond the workflow file template this Angel provides) — route to `devops-guardian`.

If a request blends API reference and narrative docs, prefer `api-docs-guardian` for the reference layer and explicitly hand off to `library-guardian` for the surrounding site.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- **OpenAPI spec** — required; the file path, URL, or framework that generates it. If missing, `api-docs-guardian` will ask.
- **Target audience** — required: public (external developers), internal (team-only), or both. Drives renderer and hosting recommendations.
- **Hosting target** — optional (defaults to GitHub Pages for OSS, self-hosted Docker for internal): GitHub Pages, Netlify, Vercel, Docker, Mintlify, Stoplight, Bump.sh.
- **SDK language targets** — optional; only needed if SDK generation is requested: TypeScript, Python, Go, or a mix.
- **Existing setup to audit** — optional; a URL, a tool name, or a folder path for an existing docs setup.

If the OpenAPI spec cannot be provided or inferred, stop and ask the user to supply it before proceeding.

## Outputs the Angel produces

- **Rendered documentation config file** — written to the target path (e.g., `docs/api/redoc-config.yaml`, `docs/mint.json`, `docs/index.html`).
- **Enriched OpenAPI spec** — with `example:` / `examples:` added to every endpoint that was missing them.
- **Deployment config** — GitHub Actions workflow, `netlify.toml`, `vercel.json`, or Dockerfile at the standard path.
- **SDK generation command** — `Makefile` or `justfile` target for regeneration; generated SDK in the output folder.
- **Changelog entry** — written to `CHANGELOG.md` with `[BREAKING]` or `[DEPRECATED]` tags.
- **Done-checklist report** — 10-point validation table emitted inline before the session ends.

## Multi-Angel sequences this Angel participates in

- **New API launch:** `api-docs-guardian` (docs + examples + deployment) → `security-guardian` (OpenAPI security scheme audit) → `quality-guardian` (verify docs completeness against PRD).
- **PR review touching OpenAPI spec:** `api-docs-guardian` proactively checks example coverage, changelog entry, and `[BREAKING]` tagging.
- **API docs + narrative site:** `api-docs-guardian` (API reference layer) → `library-guardian` (surrounding docs site, tutorials, conceptual guides).

## Critical directives the orchestrator should respect

- Always emit a scored tool comparison before recommending a renderer; never guess without the matrix.
- Never publish docs without completing the example-coverage audit (`guides/02-examples.md`).
- Every breaking change must have a `[BREAKING]` tag and migration steps before the session ends.
- Route to `library-guardian` when the scope grows beyond the API reference.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
