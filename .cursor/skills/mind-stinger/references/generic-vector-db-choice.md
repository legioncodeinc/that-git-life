# Generic Vector DB Choice (DEMOTED — the deploying product uses Qdrant)

> **Status:** Demoted reference. the deploying product uses Qdrant per-tenant collections (`{type}-{tenantId}`) with HNSW `m: 16, ef_construct: 200`, cosine distance, `strict_mode: enabled`, on_disk: false.

---

## Why Qdrant is canonical for the deploying product

1. **RPS + latency profile** is best-in-class at the open-source vector DB tier.
2. **`strict_mode_config.enabled: true`** rejects filters on unindexed fields — prevents silent full-scans (50–200ms → 2–5ms with index).
3. **Per-tenant collections** scale cleanly to 10K+ tenants without the 10× memory overhead per-user collections would incur.
4. **HNSW tuning is well-documented** (`m`, `ef_construct`, `default_segment_number`).
5. **Snapshot API** for backups (the host repo's tracker for this gap — automation pending).
6. **TS client (`@qdrant/js-client-rest`)** is mature and stable.

---

## The alternatives (for context)

### pgvector (Postgres extension)

- **Pitch:** Vector storage in the same Postgres as application data. Transactional consistency with the rest of the schema.
- **Pros vs Qdrant:** No extra service to operate; Postgres tooling (pgAdmin, backup tooling, replication) covers it; transactional consistency.
- **Cons vs Qdrant:** RPS lower at scale; HNSW support newer; Postgres-tier vector queries are slower than dedicated vector DB; requires Postgres expertise.
- **When it'd be the right call:** Vector data must be transactionally consistent with rows (e.g., session creation + episodic vector in one transaction); Postgres-bound team without ops bandwidth for a separate service.
- **Handoff:** Schema design goes to `db-worker-bee`.

### Pinecone

- **Pitch:** Managed vector DB. No ops.
- **Pros vs Qdrant:** Zero-ops; production-grade SLA; multi-region.
- **Cons vs Qdrant:** Closed-source; pricing scales aggressively with vector count and metadata; vendor lock-in.
- **When it'd be the right call:** Strict no-ops requirement + budget for managed services.

### Weaviate

- **Pitch:** Open-source vector DB with hybrid search built in (BM25 + vector).
- **Pros vs Qdrant:** Hybrid search first-class; GraphQL API.
- **Cons vs Qdrant:** Heavier resource footprint; GraphQL adds complexity; metadata filtering less flexible at scale.
- **When it'd be the right call:** Hybrid (BM25 + dense) retrieval is a primary need; Qdrant supports hybrid via named vectors but Weaviate's pattern is more idiomatic.

### Milvus

- **Pitch:** Open-source, scales to billions of vectors.
- **Pros vs Qdrant:** Higher scale ceiling; mature distributed mode.
- **Cons vs Qdrant:** Heavier ops; resource-hungry; setup complexity higher than Qdrant.
- **When it'd be the right call:** > 100M vectors with multi-node distributed requirement.

### Chroma

- **Pitch:** Embedded vector DB, simple Python API.
- **Pros vs Qdrant:** Easy local development; minimal ops.
- **Cons vs Qdrant:** Production maturity behind Qdrant; performance degrades past ~1M vectors; not battle-tested at scale.
- **When it'd be the right call:** Prototyping; local dev; not for production at the deploying product scale.

### Elasticsearch / OpenSearch (vector mode)

- **Pitch:** Existing search infrastructure, vector mode added.
- **Pros vs Qdrant:** Reuse existing infra if already on ES/OS.
- **Cons vs Qdrant:** Vector performance below dedicated vector DBs; resource usage high.
- **When it'd be the right call:** Already running ES/OS for log search and vector search is a small add-on.

### Redis (RediSearch with vector)

- **Pitch:** Vector search in Redis.
- **Pros vs Qdrant:** Reuse Valkey/Redis if already deployed.
- **Cons vs Qdrant:** Memory-bound; not designed for large vector corpora; hybrid filter performance below Qdrant.
- **When it'd be the right call:** Small vector corpus (< 100K) and existing Redis infrastructure.

---

## Decision matrix

| Factor | Qdrant | pgvector | Pinecone | Weaviate | Milvus | Chroma |
|---|---|---|---|---|---|---|
| Ops surface | Low | Lowest (in Postgres) | Zero (managed) | Medium | High | Lowest (embedded) |
| RPS at 10M vectors | High | Medium | High (managed) | Medium | High | Low |
| Filter performance | High (strict mode) | Medium (Postgres planner) | Medium | Medium | High | Low |
| Hybrid retrieval | Native (named vectors) | Manual (FTS + vector) | Manual | Native | Native | No |
| Cost | OSS + self-host | OSS + self-host | $$$ | OSS + self-host | OSS + self-host | OSS + embedded |
| fit | ✓ Canonical | secondary (Postgres-bound) | substitution | substitution | overkill | dev-only |

---

## Migration path if substitution is approved

For pgvector specifically (the most likely substitution path because the deploying product's other persistence is Postgres):

1. Schema design — `db-worker-bee` owns this.
2. Backfill — re-index all vectors into pgvector tables (one table per `{type}-{tenantId}` equivalent).
3. Dual-write during transition.
4. Cut reads to pgvector.
5. Drop Qdrant.

Re-evaluate `strict_mode_config` semantics in pgvector (which has different filter-planning than Qdrant); confirm the `tenant_id`-on-every-query rule is enforceable at the Postgres layer.
