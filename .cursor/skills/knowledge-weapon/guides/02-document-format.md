# Document Format Specification

Every knowledge doc must follow this exact format. Consistency across all docs makes the knowledge base feel like a single authored artifact, not a pile of individually-styled pages.

---

## Annotated Template

```markdown
# Auth Architecture                                        ← Title Case, no "doc" or "overview" suffix

> Category: Auth | Version: 1.0 | Date: May 2026 | Status: Active

                                                           ← One sentence only. Who reads this + what it covers.
Legion Code's authentication and authorization architecture — provider, session model, and enforcement layers.

**Related:**                                               ← 3-8 links. Sibling docs first, then ADRs.
- [`session-model.md`](session-model.md)
- [`rbac.md`](rbac.md)
- [`../architecture/ADR-005-auth-github-oauth-mandatory.md`](../architecture/ADR-005-auth-github-oauth-mandatory.md)

---

## Provider: Clerk                                         ← H2 for major sections, H3 for subsections

[Narrative prose. Open with WHY, then WHAT, then HOW.]
[First paragraph: the most important thing to know.]
[No passive voice. No "it should be noted that".]

---

## Auth flow (GitHub OAuth → Clerk → Legion)              ← Sequence diagrams get their own section

```mermaid
sequenceDiagram
    participant B as Browser
    participant SK as SvelteKit
    participant Clerk as Clerk
    participant GitHub as GitHub OAuth

    B->>SK: GET /sign-in
    SK-->>B: Render <SignIn /> component
    B->>Clerk: Click "Sign in with GitHub"
    Clerk->>GitHub: OAuth redirect
    ...
```

---

## JWT format                                              ← Use H2 for each major concept

```
Claims:
- sub: Clerk user ID
- exp: expiry (60s)
- iss: Clerk instance URL
```

---

## Two enforcement layers

**Layer 1 — SvelteKit middleware:**
- Verifies JWT on every request
- Redirects unauthenticated requests to /sign-in

**Layer 2 — Go API middleware:**
- Independently verifies JWT
- Sets app.current_org_id for RLS

[End with a summary statement linking to peer docs.]
```

---

## Header Rules

| Field | Value |
|---|---|
| `Category` | Domain folder name, Title Case (e.g., `Auth`, `AI`, `Data`, `Security`) |
| `Version` | Start at `1.0`; bump patch for additions (`1.1`), minor for restructures (`2.0`) |
| `Date` | Month + year of last meaningful edit (`May 2026`) |
| `Status` | `Active` for live docs; `Draft` for in-progress; `Archived` for superseded |

---

## Related Section Rules

- Link to 3-8 items
- **Order:** sibling docs in the same domain first, then cross-domain docs, then ADRs last
- Use relative paths: `[title](relative-path.md)`
- ADR links: `[ADR-NNN title](../architecture/ADR-NNN-slug.md)`
- PRD links: `[prd-NNN](../../../requirements/backlog/prd-NNN-slug/prd-NNN-slug-index.md)` (use sparingly — knowledge docs reference ADRs, not PRDs)

---

## Section Structure

### H2 for major concepts
One H2 per major concept or component. Each H2 should be independently readable.

### H3 for subsections within a concept
Use H3 when an H2 section has multiple distinct sub-topics. Avoid H4+ — if you need H4, split into a separate doc.

### Progressive disclosure
- H2 section 1: "Why this exists" — the motivation
- H2 sections 2-N: technical details, schemas, flows, code samples
- Last section (optional): "Alternatives considered" or "Known limitations"

---

## Code Block Standards

**SQL DDL:** Include all columns with types, constraints, and indexes. No `...` truncation — this is the canonical reference.

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  email         TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON users (clerk_user_id);
```

**TypeScript:** Real code with types. Show actual function signatures, not pseudocode.

```typescript
async function getOrProvisionVirtualKey(projectId: string): Promise<string> {
  const cached = await valkey.get(`portkey:vkey:${projectId}`);
  if (cached) return cached;
  // ...
}
```

**Mermaid diagrams:**
- `flowchart TD` for process flows
- `sequenceDiagram` for temporal flows (request/response)
- `stateDiagram-v2` for state machines
- NO explicit colors (breaks dark mode)
- NO `click` events (disabled for security)
- Node IDs: `camelCase` only (no spaces)
- Quote labels with special chars: `A["Process (main)"]`

**Shell commands:** Show actual commands users would run.

```bash
docker run \
  --memory=1g \
  --cpus=1 \
  --net=legion-egress \
  legion-code/base:v1
```

---

## Prose Style

**Do:**
- Open each section with the most important sentence (inverted pyramid)
- Use direct, active voice
- Name specific things: "Fastify's `preHandler` chain" not "the middleware"
- Cite specific table/column names, file paths, function names
- Explain trade-offs when they matter ("Why X instead of Y: ...")

**Don't:**
- Use passive voice: "it is ensured that..." → "the middleware ensures..."
- Use filler phrases: "It should be noted that", "In this case", "As mentioned"
- Repeat the title in the first sentence
- Write bullet soup when prose works better
- Use hedging: "may", "might", "could be" → be direct

---

## Doc Length Guidelines

| Doc type | Target length |
|---|---|
| `overview.md` (top-level) | 100-200 lines |
| Architecture narrative | 150-300 lines |
| Schema doc (full DDL) | 200-500 lines |
| Domain narrative | 100-300 lines |
| Standards doc | 100-200 lines |

If a doc exceeds ~400 lines, split it. Use progressive disclosure: put the overview in the main doc and link to a detail doc.

---

## Filename Conventions

- Lowercase kebab-case: `auth-architecture.md`, `postgres-schema.md`
- No version suffix in the filename (version is in the header)
- No `doc-` or `guide-` prefix
- Descriptive and specific: `token-metering-wallet.md` not `billing-details.md`
- Acronyms: lowercase in filename (`rag-pipeline.md`, `pty-bridge.md`)
