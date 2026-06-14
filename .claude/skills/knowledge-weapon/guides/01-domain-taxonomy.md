# Domain Taxonomy — What Belongs Where

Full detail on each of the 15 standard knowledge domains. For each domain: what to include, what NOT to include, and how many docs to expect for a typical full-stack SaaS.

---

## `architecture/`

Lives alongside the ADR files. Narrative docs that explain the system as a whole — not decisions (those are ADRs) but descriptions of the resulting architecture.

**What belongs:**
- `system-overview.md` — master architecture diagram (Mermaid `flowchart TB`), component summary table, key design decisions table that cross-references ADRs
- `request-lifecycle.md` — sequence diagram of the most important request (e.g., a user sends a message → what happens end to end)
- `{plane-name}-plane.md` or `{major-component}-placement.md` — why a central component is placed where it is; how it relates to other components
- `network-topology.md` — if the system has a complex network topology

**What NOT to include:** ADRs themselves (those are `ADR-NNN-slug.md`). Decision rationale belongs in the ADR. This folder covers WHAT the system looks like, not WHY it was designed that way.

**Typical doc count:** 3-5

---

## `ai/`

Everything about LLM integration, RAG, prompt engineering, and AI observability.

**What belongs:**
- `resolver-overview.md` (or `ai-architecture-overview.md`) — the AI service's responsibilities, how it fits in the architecture, the five things it does
- `prompt-cascade-{N}-layer.md` — how system prompts are assembled, each layer's purpose, how overlays work
- `rag-pipeline.md` — embedding, vector search, reranking, context assembly
- `graphrag.md` — if GraphRAG is used: entity extraction, graph traversal, RRF fusion
- `model-routing.md` — which model for which task, phase-based provider plan
- `coach-system.md` or `skill-bundles.md` — how AI personas/skills are configured, applied, and protected
- `ai-trace-observability.md` — the trace schema, what's captured, PII redaction, retention
- `cross-project-knowledge-sharing.md` — if users have multi-project memory
- `portkey-virtual-keys.md` (or similar) — LLM gateway per-tenant/per-project key management

**What NOT to include:** ADRs about AI decisions (those go in `architecture/`). Application code. Skill file content (that's IP, never in docs).

**Typical doc count:** 7-12

---

## `auth/`

Authentication and authorization: the full stack from provider through session through RBAC.

**What belongs:**
- `auth-architecture.md` — provider choice (e.g., Clerk), sequence diagram of the full auth flow, enforcement layers
- `session-model.md` — JWT format, cookie properties, session duration, 2FA re-challenge window
- `rbac.md` — role definitions, RBAC enforcement in route handlers, middleware patterns
- `tenant-roles.md` (or `roles.md`) — each role's capabilities and how roles are assigned
- `api-keys.md` — if the system has programmatic API keys (e.g., plugin tokens)

**What NOT to include:** The actual implementation code. That lives in the codebase.

**Typical doc count:** 3-6

---

## `container/`

Server-side container runtime docs. Only relevant for products that run learner/user containers (IDE products, sandboxes, code execution platforms).

**What belongs:**
- `container-runtime-overview.md` — base image, resource limits, lifecycle state machine, volume management
- `hibernation-engine.md` — each hibernation tier, CRIU details, reaper job
- `pty-bridge.md` — terminal WebSocket protocol, fan-out to collaborators
- `file-sync.md` — CRDT-backed editor sync, fs/watch WebSocket, object storage versioning
- `preview-proxy.md` — auth-gated preview subdomain, cookie mechanics, cold-resume placeholder
- `egress-rules.md` — iptables whitelist, allowed host categories, module-declared host extensions

**Typical doc count:** 5-8

---

## `curriculum/`

Education system docs. Relevant for any product with a structured learning path.

**What belongs:**
- `education-hierarchy.md` — the N-level hierarchy (Resource → Module → Class → Semester → Degree), extensibility model
- `resource-type-system.md` — resource type registry, renderer dispatch, AI prompt overlay mechanics
- `module-system.md` — module structure, progression state machine, quiz evaluation
- `class-graph.md` — ReactFlow authoring, node/edge schema, DFS validation, completion engine
- `module-triggering.md` — trigger type registry, evaluator plugin interface
- `onboarding-journey.md` — mandatory gate design, platform seed, completion effects
- `ai-journey-tools.md` — structured AI tools that produce artifacts, multi-turn dialog state
- `semester-degree.md` — linear sequencing, auto-unlock, graduation milestone
- `gamification.md` — XP, levels, badges, leaderboard, adaptive nudges

**Typical doc count:** 7-12

---

## `data/`

All data storage docs. This is where someone looks when they need to know the schema.

**What belongs:**
- `postgres-schema.md` — the FULL consolidated DDL for all tables (not split by feature — one canonical reference). Include indexes and migration strategy.
- `valkey-patterns.md` — every Valkey key pattern, TTL, and invalidation trigger as a catalog table
- `qdrant-collections.md` — per-entity collections, embedding model, payload schemas, ingestion paths
- `do-spaces-buckets.md` (or `s3-buckets.md`) — object storage layout, path patterns, lifecycle policy
- `audit-logging-retention.md` — tiered retention, `do_not_purge` flag, PII redaction, user purge flow

**What NOT to include:** Per-feature schema changes (those are in individual PRDs). This is the canonical rolled-up reference.

**Typical doc count:** 4-7

---

## `frontend/`

The browser-side application: shell layout, component frameworks, routing.

**What belongs:**
- `{shell-name}-shell.md` — CSS Grid layout, lazy loading, keyboard shortcuts, routing
- `{widget}-framework.md` — if there's an extensible component slot system
- `chat-stream.md` — message schema, virtual scrolling, SSE streaming, compaction
- `mobile-pwa.md` — if mobile is a distinct surface with different architecture

**Typical doc count:** 3-6

---

## `infrastructure/`

Operational infrastructure: compute, deployment, observability.

**What belongs:**
- `worker-fleet.md` — Droplets/EC2s/Pods spec, assignment algorithm, image registry
- `control-plane.md` — the primary API server's structure, background jobs, WebSocket handlers
- `deployment.md` — CI/CD pipeline, rolling deploy pattern, health check
- `observability.md` — what's instrumented, how to query it, alert thresholds

**Typical doc count:** 4-8

---

## `monetization/`

Revenue model, billing mechanics, Stripe integration.

**What belongs:**
- `billing-overview.md` — revenue streams, tier table, the billing architecture diagram
- `subscription-tiers.md` — tier configs, Stripe Checkout flow, dunning sequence
- `token-metering-wallet.md` — metering pipeline, wallet ledger, Stripe usage reporting
- `stripe-connect.md` — if the platform has instructor/seller revenue share

**Typical doc count:** 3-5

---

## `multi-tenant/`

Tenancy model, tenant provisioning, cross-tenant features.

**What belongs:**
- `tenant-model.md` — the tenancy design, `tenant_id` on every row, super-admin view
- `tenant-provisioning.md` — provisioning runner steps, idempotency
- `marketplace.md` — cross-tenant browse/purchase if applicable
- `rls-hardening.md` — RLS policy DDL, session variable pattern, PgBouncer notes

**Typical doc count:** 3-5

---

## `security/`

Trust model, data classification, defenses.

**What belongs:**
- `trust-boundaries.md` — trust boundary diagram, what each boundary enforces
- `data-classification.md` — data classes (IP, user data, tenant data), what leaves the server
- `egress-model.md` — container/service outbound network rules
- `prompt-injection-defenses.md` — if AI is used: prompt constraint layers, input caps, no-leak directives
- `audit-log-design.md` — append-only log, hash-chain if applicable

**Typical doc count:** 4-8

---

## `standards/`

Coding conventions, API design, process rules.

**What belongs:**
- `coding-standards-{language}.md` — TypeScript/Python/Go conventions, strict config, Zod/Pydantic patterns
- `api-design-conventions.md` — route naming, error shape, HTTP status codes, SSE conventions
- `error-handling-conventions.md` — global error handler, client-safe messages, upstream error masking
- `git-conventions.md` — Conventional Commits, PR template, merge strategy, signing

**Typical doc count:** 3-6

---

## `collaboration/`

Real-time multi-user features.

**What belongs:**
- `coach-attach.md` (or `pair-programming.md`) — CRDT co-editing, shared PTY, presence, AI mute
- `live-sessions.md` — WebRTC SFU choice, signaling, session lifecycle
- `recordings.md` — recording capture, webhook processing, feed routing

**Typical doc count:** 2-5

---

## `plugins/`

External plugin/integration surfaces.

**What belongs:**
- `plugin-api.md` — the external API endpoint, token auth, scope enforcement, audit log
- `{plugin-name}.md` — one doc per major plugin: thin client design, auth setup, skill content

**Typical doc count:** 2-6

---

## `operations/`

Operational runbooks and process docs.

**What belongs:**
- `capacity-planning.md` — how to detect saturation, when to scale
- `incident-severity-matrix.md` — S1/S2/S3/S4 definitions
- `on-call-runbook.md` — first-responder steps, escalation paths
- `slo-and-sla.md` — commitments and measurement

**Typical doc count:** 3-6

---

## `overview.md` (top-level, not in a subfolder)

A single `overview.md` at the root of `library/knowledge/private/`. This is the human-curated entry point — think of it as the README for the entire knowledge base.

**Required sections:**
1. What this repo/product is (1-2 paragraphs, plain English)
2. Top-level architecture summary (planes, services, key external deps)
3. Key modules / components
4. Where to start reading (role-based reading guide)
5. Library coverage stats (total docs, ADR count, last updated)
