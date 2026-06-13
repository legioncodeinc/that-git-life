# Analysis Workflow — From Zero to Full Knowledge Base

How to go from a repo with only ADRs and PRDs to a complete `library/knowledge/private/` knowledge base. This is the methodology used to produce 68 knowledge docs for `legion-code` from 19 ADRs and 43 PRDs.

---

## Step 1: Survey the source material

### Read all ADRs

List every ADR and note the domain it belongs to:

```
ADR-001 — Stack (Theia + React)     → architecture/, frontend/
ADR-002 — LLM Gateway (Resolver)   → ai/, architecture/
ADR-003 — Storage                  → data/
ADR-004 — Container Runtime        → container/
ADR-005 — Auth (GitHub OAuth)      → auth/
ADR-006 — Tenant Model             → multi-tenant/
ADR-007 — Project as Unit of State → architecture/, data/
ADR-008 — Education Hierarchy      → curriculum/
ADR-009 — Monetization             → monetization/
ADR-010 — Coach Attach             → collaboration/
ADR-011 — Live Sessions            → collaboration/
ADR-012 — Plugin Distribution      → plugins/, security/
ADR-013 — Theia as Library         → frontend/, architecture/
ADR-014 — GraphRAG                 → ai/
ADR-015 — Cross-Project Knowledge  → ai/
ADR-016 — Mobile Experience        → frontend/
ADR-017 — Replicate for GPU        → ai/
ADR-018 — Atlas Map Upsell         → (non-goal, reference in overview)
ADR-019 — Audit Logging Retention  → data/, security/
```

This mapping tells you which domain folders to create and what ADRs each doc should reference.

### Read all PRDs (extract technical detail)

For each PRD, extract:
- **SQL DDL:** Every `CREATE TABLE` block → contributes to `data/postgres-schema.md`
- **API specs:** Endpoint signatures → contributes to `standards/api-design-conventions.md` and domain docs
- **Technical Considerations sections:** Implementation details → contribute to the relevant domain docs
- **Files Touched sections:** Real file paths → used to cite source code in knowledge docs
- **Architecture notes:** System-level observations → contribute to `architecture/` docs

**Do NOT copy PRD content verbatim.** PRDs are specs ("what to build"). Knowledge docs are explanations ("how it works and why"). Transform spec language into narrative explanations.

---

## Step 2: Plan the domain structure

Create a planning table before writing any docs:

```
Domain           | Docs to create                          | Source material
-----------------|-----------------------------------------|----------------
architecture/    | system-overview, request-lifecycle,      | ADR-001,002,003,004,007
                 | resolver-placement                       |
ai/              | resolver-overview, prompt-cascade,       | ADR-002,014,015 + PRDs 005,016
                 | rag-pipeline, graphrag, model-routing,   |
                 | coach-system, ai-trace-observability,    |
                 | cross-project-knowledge-sharing,         |
                 | portkey-virtual-keys                     |
auth/            | auth-architecture, session-model,        | ADR-005,006 + PRD-001
                 | tenant-roles, rbac                       |
...
```

Confirm the domain list matches the ADRs and PRDs in this repo. Skip domains that aren't applicable (e.g., `container/` is irrelevant for a pure API product).

---

## Step 3: Author in dependency order

### Batch A first (sets the stage)

Always write these docs first — every other doc cross-references them:

1. `library/knowledge/private/overview.md` — the entry point doc
2. `library/knowledge/private/architecture/system-overview.md` — master diagram
3. `library/knowledge/private/architecture/request-lifecycle.md` — end-to-end flow

These three docs force you to understand the system well enough to write everything else.

### Batches B-E can parallelize

After Batch A, the remaining domains are largely independent:

```
Batch B: ai/ + auth/ + data/
Batch C: container/ + frontend/
Batch D: curriculum/ + collaboration/ + plugins/
Batch E: infrastructure/ + monetization/ + multi-tenant/ + security/ + standards/
```

---

## Step 4: Writing each doc

### For narrative docs (architecture, AI, auth, security)

1. Open the relevant ADR(s). Understand the DECISION section.
2. Open the relevant PRD(s). Read the Technical Considerations section.
3. Write the doc opening with WHY (pulled from ADR's Context section), then WHAT (the component's role), then HOW (pulled from PRD's Technical Considerations).
4. Add a Mermaid diagram if the doc benefits from a visual.
5. Fill in the Related section.

### For schema docs (data/postgres-schema.md)

1. Collect ALL `CREATE TABLE` DDL from all PRDs across all phases.
2. Organize by phase (Phase 1, Phase 2, Phase 3, etc.) within the doc.
3. Add explanatory prose above each table group: "These tables were introduced in Phase 1 to support..."
4. Add migration strategy note at the end.

### For catalog docs (data/valkey-patterns.md, data/qdrant-collections.md)

1. Scan all PRDs for Valkey keys (grep for `valkey.set`, `valkey.get`).
2. Collect into a table: Key pattern | TTL | Invalidated by | Description.
3. Add usage sections for common patterns (working memory, distributed locks, caching).

### For standards docs

1. Look at any existing `tsconfig.json`, `eslint.config.js`, `.prettierrc`.
2. Look at any existing convention notes in the codebase.
3. Make explicit what was implicit — the conventions developers follow by habit.
4. Add examples from the actual codebase (cite file paths).

---

## Step 5: Cross-link verification

After all docs are written, verify cross-links:

1. Every doc's Related section: do all linked files exist?
2. Every ADR reference: does the cited ADR exist at the expected path?
3. `overview.md` reading guide: do all paths it mentions exist?
4. No doc is an island — every doc should link to at least 2 others.

Quick check command:
```bash
# List all docs in the knowledge base
find library/knowledge/private -name "*.md" | grep -v "ADR-" | sort

# Check for broken relative links (manual inspection of Related sections)
grep -r "\]\(\.\./" library/knowledge/private/ | grep -v "ADR-"
```

---

## Step 6: Quality check checklist

Before declaring the knowledge base complete:

- [ ] Every domain folder has at least one doc (no empty folders)
- [ ] `overview.md` exists at the top level and has a reading guide
- [ ] `architecture/system-overview.md` has a Mermaid architecture diagram
- [ ] `data/postgres-schema.md` has DDL for every table (check against PRDs)
- [ ] Every doc has the standard header (Category, Version, Date, Status)
- [ ] Every doc has a Related section with at least 2 links
- [ ] No doc exceeds 500 lines without a good reason
- [ ] All Mermaid diagrams use standard formatting (no explicit colors, no click events)
- [ ] Security doc `trust-boundaries.md` has a trust boundary diagram
- [ ] Standards docs have concrete code examples (not just prose rules)

---

## Common Pitfalls

### Pitfall: Copying PRD content verbatim
PRDs are specs. Knowledge docs are explanations. "The system MUST do X" (spec language) becomes "The system does X" (knowledge language). "Implementation Notes" becomes narrative prose.

### Pitfall: Making one giant doc per domain
Split by coherent topic. `data/` should have separate files for Postgres, Valkey, Qdrant, Spaces, and audit retention — not one 2000-line file.

### Pitfall: Skipping the overview.md
The overview is the map. Without it, someone arriving at the knowledge base cold doesn't know where to start. Write it after Batch A so you have a clear picture of the whole system.

### Pitfall: Diagrams with spaces in node IDs
`A[My Component]` is fine. `My Component --> Another Component` will break. Always use camelCase or underscores in Mermaid node IDs.

### Pitfall: Writing bullet soup instead of prose
If a section is 12 nested bullets with no connective tissue, rewrite as prose. Bullets are for true lists (tables, catalogs, checklists). For explanations, use paragraphs.

### Pitfall: Forgetting to update cross-references
When you add a new doc, add it to the Related section of its most related sibling. Knowledge bases rot when docs become islands.
