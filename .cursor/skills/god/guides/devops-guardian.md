# Guide: devops-guardian

Container build + CI/CD pipeline specialist for Node / Next.js / TypeScript stacks — Dockerfile hygiene, Docker Compose for dev, GitHub Actions architecture, and Depot acceleration.

---

## What this Angel owns

`devops-guardian` designs, audits, and authors Dockerfiles, Docker Compose files, and GitHub Actions workflows. Its territory:

- **Dockerfile hygiene** — multi-stage builds (60-80% size reduction), pinned base images (Alpine vs. distroless trade-offs), non-root users, `HEALTHCHECK`, `.dockerignore`, BuildKit secret mounts, BuildKit cache mounts for package managers.
- **Multi-arch builds** — linux/amd64 + linux/arm64, when each matters, cost math (QEMU vs. native matrix vs. Depot).
- **Compose for dev** — profiles for selective service activation, `depends_on` with `condition: service_healthy`, Compose `secrets:` block (not `environment:`), `develop.watch` for hot-reload.
- **Image scanning** — Docker Scout vs. Trivy, baseline scanning in CI, severity gating (CRITICAL/HIGH with `ignore-unfixed`), SBOM + provenance for releases.
- **GitHub Actions architecture** — reusable workflows (`workflow_call`), composite actions, concurrency groups (cancel-in-progress for PR builds, never for deploys), matrix strategies, conditional jobs, environment protection.
- **GitHub Actions security** — least-privilege `GITHUB_TOKEN` (default-read-only at repo level + per-job `permissions:` blocks), pinning actions to commit SHA with version comments, OIDC federation for cloud auth (AWS, GCP, Azure, DO, Cloudflare), fork-PR safety (no `pull_request_target` + `head.sha` checkout).
- **Depot integration** — `depot/setup-action` + `depot/build-push-action` (drop-in for `docker/build-push-action`) + `depot/bake-action`, OIDC auth (no static `DEPOT_TOKEN`), shared persistent NVMe cache across team + local + CI, ephemeral ARM (Graviton) runners.
- **Caching strategies** — Depot persistent NVMe (best), registry cache, GHA cache backend (10 GB cap), BuildKit named cache mounts (Layer 1 inside `RUN` steps).
- **Pipeline shapes** — PR build + smoke test, main full build + push, scheduled rebuilds for CVE freshness, release pipeline with SBOM + provenance.
- **Local-CI parity** — Docker Bake (HCL) for shared build definitions, make-target wrappers so local devs and CI invoke the same recipe.

It does not own cloud provisioning (cloud-platform Angels), database migration authoring (`db-guardian` — devops-guardian wires the migration step into the pipeline), CVE deep audits or secret-leak forensics (`security-guardian` — devops-guardian surfaces concerns and hands off), or PRD authoring (`library-guardian`).

## When to invoke

Delegate to `devops-guardian` when the user:

- Says "review my Dockerfile", "audit our pipeline", "design our CI", "migrate to Depot".
- Reports "this build is slow", "our cache misses every time", "we leaked a secret in CI".
- Wants Compose set up for a local dev stack (Postgres + Redis + app + admin tools).
- Asks where the `permissions:` block should go, why the action should pin to SHA, or how OIDC replaces long-lived AWS keys.
- Is starting a greenfield repo and needs Dockerfile + Compose + workflows scaffolded.
- Needs an ARM (Graviton) build path or a multi-arch image manifest.

Do **not** invoke for cloud provisioning (creating the AWS/GCP/Azure/DO resource the workflow deploys to) — route to a cloud-platform Angel.

Do **not** invoke for CVE deep audit or secret-leak forensics — `devops-guardian` will surface the file:line and hand off to `security-guardian`.

Do **not** invoke for database migration authorship — `db-guardian` owns the migration content; devops-guardian only wires the step into the pipeline.

Do **not** invoke for PRD authoring on a large pipeline change — `devops-guardian` provides the technical recommendation; `library-guardian` writes the PRD.

## Paired Weapon

`.cursor/skills/devops-weapon/` — contains the master index (SKILL.md) with routing table and severity rubric, 12 guides covering principles, Dockerfile patterns, multi-arch, Compose, scanning, Actions architecture, Actions security, Depot, caching, pipeline shapes, local-CI parity, and common failure modes; 3 worked examples (Next.js + Depot + OIDC, Node API multi-arch + Trivy, Compose Next.js + Postgres + Redis); 9 templates (Dockerfile.node-app, Dockerfile.next-app, docker-compose.dev.yml, docker-compose.prod.yml, .dockerignore, three workflow files, docker-bake.hcl); 3 deterministic scripts (audit-dockerfile.sh, audit-workflow.sh, pin-actions-to-sha.sh); 8 research notes; reports template + index.

## Expected input

- The branch, PR, or directory to review (or "greenfield" if scaffolding from scratch).
- The deploy target (Vercel / Fly / DO App Platform / DOKS / EKS / Render / self-hosted) — affects the deploy step + arch decisions.
- Any existing Depot wiring and image registry (GHCR / ECR / GAR / DOCR).
- Any specific scope hint: `dockerfile-author`, `compose-bootstrap`, `pipeline-design`, `pipeline-audit`, `depot-migration`, `image-scan-setup`, `local-ci-parity`.
- Optional: pipeline metrics (cold build minutes, cache hit %, monthly Actions minutes spend) — informs Depot vs. GitHub-hosted recommendation.

## Expected output

- Findings classified per the severity rubric: must-fix / should-refactor / style.
- Every finding cites `file.ext:LN` plus a short snippet and a link to the relevant guide section + research note.
- For audits: a report at the host repo's `library/qa/devops/<date>-<scope>-audit.md` (standalone) or `library/requirements/features/feature-<###>-<title>/reports/<date>-<scope>-audit.md` (feature-tied) following `templates/audit-template.md`, with pillar ratings + findings + cross-Angel handoffs.
- For Dockerfile authoring: the file drawn from `templates/Dockerfile.node-app` or `templates/Dockerfile.next-app`, adapted to the user's stack.
- For Compose bootstrap: `docker-compose.dev.yml` from the canonical template with the user's services configured.
- For pipeline design: `.github/workflows/pr-build.yml`, `main-deploy.yml`, `reusable-build.yml`, plus `docker-bake.hcl` and `Makefile` wrapper.
- For Depot migration: phased PR plan (5-line workflow diff + OIDC trust setup + cache verification) with rollback steps.
- Explicit handoff lines for any finding that belongs to another Angel (security-guardian for secret-leak audit, db-guardian for migration content, library-guardian for PRD, react-guardian for Node-version confirmation, quality-guardian for post-fix verification).

## Critical directives to respect when routing

- **Inventory first is non-negotiable.** Recommendations written without reading the existing Dockerfile / Compose file / workflow are wrong advice. Always pass the repo or let the Angel read it.
- **Severity discipline matters.** Calling a style nit (layer ordering preference) "must-fix" destroys trust. Must-fix is reserved for security and structural issues (secrets, root user, unpinned actions, OIDC bypass).
- **Cache and parity are the recurring high-leverage findings.** Don't dismiss "your build is slow" as a perf nit — there's almost always a missing cache backend or a `COPY . .`-before-`COPY package.json` invalidation pattern.
- **Depot is a drop-in, not a rewrite.** A Depot migration is a 5-line diff per workflow, not a re-architecture. If the Angel proposes a re-architecture, the orchestrator should push back.
- **Security findings are surfaced, not audited.** `devops-guardian` flags `ARG SECRET=` and `permissions: write-all` and `pull_request_target` + `head.sha` patterns with file:line. The deep CVE audit and secret-leak forensics belong to `security-guardian`.
- **Migration step ownership is split.** `devops-guardian` ensures a migration step exists in the right phase with secrets reaching it via OIDC. `db-guardian` writes the migration content. Do not ask `devops-guardian` to author SQL or ORM migration code.

## Typical failure modes

- Invoked for a non-Node stack (Python, Go, Rails) — the Angel produces reduced-coverage output applying transferable principles (multi-stage, non-root, OIDC, pinning, cache backend) and flags "REDUCED COVERAGE". Route to a runtime-specific reviewer for runtime-specific patterns.
- Invoked for Kubernetes manifests / Helm charts — out of scope; route to a cloud-platform Angel.
- Invoked for "audit our security" generically — `devops-guardian` covers Dockerfile + workflow surface; `security-guardian` covers app-code CVEs and PII / financial data; route accordingly.
- Invoked without a clear scope — `dockerfile-author` vs. `pipeline-audit` vs. `depot-migration` produces very different output shapes. Name the scope in the delegation.
- Invoked after `quality-guardian` has already produced a report on the branch — same ordering caveat as `security-guardian`: QA report goes stale if devops-guardian's fixes mutate the workflow.

## Orchestration notes

In the Army's extended implementation loop, `devops-guardian` typically runs:

- **Before `react-guardian`** when a new repo is being scaffolded (the image's Node version + workspace setup is set first; React app conforms).
- **After `library-guardian`** when a pipeline change is large enough to need a PRD (library-guardian writes PRD, devops-guardian implements).
- **Before `security-guardian`** in a security-aware pipeline review (devops-guardian surfaces structural issues; security-guardian audits the resulting Dockerfile + workflow for CVEs and secret leakage).
- **Alongside `db-guardian`** when the pipeline has a migration step (devops-guardian wires the step; db-guardian owns its content).
- **Before `quality-guardian`** on any pipeline change — quality-guardian verifies the change matches the plan.

For standalone audits (not part of an implementation loop), `devops-guardian` runs independently — `pipeline-audit`