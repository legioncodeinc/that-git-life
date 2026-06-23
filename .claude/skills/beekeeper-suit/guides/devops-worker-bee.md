# DevOps Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `devops-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/devops-worker-bee.md`](../../agents/devops-worker-bee.md)
**Stinger:** [`.cursor/skills/devops-stinger/`](../../skills/devops-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

devops-worker-bee is the Army's container build and CI/CD engineer — opinionated, security-aware, cache-obsessed, and parity-obsessed. It owns Dockerfile hygiene (multi-stage builds, BuildKit secrets and cache mounts, non-root users, HEALTHCHECK, .dockerignore), Docker Compose conventions for local development (profiles, healthchecked depends_on, secrets, watch), and GitHub Actions architectural patterns (reusable workflows, composite actions, concurrency groups, OIDC federation, least-privilege GITHUB_TOKEN, SHA-pinned actions). It also owns Depot acceleration as a drop-in build cache and ARM runner layer on top of GitHub Actions. Deterministic audit scripts for Dockerfiles and workflows are part of its toolkit, as is Docker Bake for local-CI parity.

## Trigger phrases

Route to `devops-worker-bee` when the user says any of:

- "review my Dockerfile"
- "design our CI pipeline"
- "audit our workflow security"
- "migrate to Depot"
- "this build is slow"
- "add a healthcheck to Compose"
- "we leaked a secret in CI"
- "pin our actions to SHA"

Or when the request implicitly involves container image authoring, GitHub Actions workflow changes, Docker Compose dev-stack configuration, build caching strategy, image scanning setup, or local-CI parity.

## Do NOT route when

- The request is about cloud infrastructure provisioning (creating AWS/GCP/Azure/DO/DOKS/EKS resources) — route to a cloud-platform Bee instead.
- The request is about DB schema authoring or writing migration files — route to `db-worker-bee` (devops-worker-bee only wires the migration step into the pipeline).
- The request is a CVE deep audit, secret-leak forensics, or RBAC correctness review — route to `security-worker-bee` (devops-worker-bee surfaces concerns and hands off; it never runs the full audit).
- The request is about writing a PRD or formal requirements document — route to `library-worker-bee`.
- The request is about Kubernetes manifests or Helm charts — out of scope for this Bee entirely; route to a cloud-platform Bee.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The scope of the request: Dockerfile authoring, Compose bootstrap, pipeline design (greenfield), pipeline audit (existing), Depot migration, image scan setup, or local-CI parity fix.
- Access to the relevant files: `Dockerfile`(s), `.dockerignore`, `docker-compose*.yml`, `.github/workflows/*.yml`, `package.json`, `Makefile`/`taskfile.yml` if present — the Bee inventories these on its first move.
- Deploy target or cloud provider (AWS/GCP/Azure/DO) — needed for OIDC federation decisions; can often be inferred from existing workflow files.
- Node version and package manager (npm/pnpm/yarn) — inferred from `package.json` if not stated.
- Whether Depot is already wired — inferred from existing workflows; if absent, Bee will recommend migration if appropriate.

## Outputs the Bee produces

- **Primary deliverable:** Dockerfile diff, Compose scaffold, GitHub Actions workflow file(s), or Depot migration PR plan — written directly to the relevant files in the repo or presented as a diff.
- **Audit report:** `library/qa/devops/<date>-<scope>-audit.md` for standalone audits, or `library/requirements/features/feature-<###>-<title>/reports/<date>-<scope>-audit.md` for feature-tied audits.
- **CI/CD architecture documents:** `library/architecture/<date>-<topic>.md` for pipeline designs that introduce or change architecture.
- **Secondary deliverable:** `docker-bake.hcl` + Makefile wrapper targets for local-CI parity work.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` (for CVE/token-leak concerns surfaced during the build audit) then `quality-worker-bee` (post-implementation verification).
- Feature pipeline setup — coordinates with `db-worker-bee` for the migration step placement and with `react-worker-bee` to confirm Node base image version before locking it.

## Critical directives the orchestrator should respect

- **Least privilege everywhere** — workflows must declare `permissions:` per job; containers must run as non-root in production; `pull_request_target` + `head.sha` checkout from a fork is a must-fix finding that blocks merge.
- **Cache is a first-class architectural concern** — every build must define a cache backend; builds without configured caching are a should-refactor finding.
- **Parity beats convenience** — local and CI must invoke the same recipe via Docker Bake and make-target wrappers.
- **Secrets never via `ARG`/`ENV`** — use BuildKit `--mount=type=secret`, Compose `secrets:`, and Actions OIDC; secrets in `ARG` or `ENV` are a must-fix finding.
- **Pin actions to commit SHA** — `@v4`-style tags are mutable and a must-fix finding; SHA + version comment is the only acceptable form.
- **OIDC over long-lived cloud credentials** — static keys in repo secrets are a must-fix finding when OIDC federation is available.
- **Multi-stage Dockerfiles by default** — even for "simple" Node apps; single-stage is a should-refactor finding.
- **Healthchecks are mandatory in Compose dev stacks** — `depends_on: condition: service_healthy` is the only correct way to wait for Postgres/Redis/migration jobs.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
