# Dependency Audit Guardian — God's Guide

The God routing skill's record of when to invoke `dependency-audit-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/dependency-audit-guardian.md`](../../agents/dependency-audit-guardian.md)
**Weapon:** [`ai-tools/skills/dependency-audit-weapon/`](../../skills/dependency-audit-weapon/)
**Command Brief:** [`ai-tools/command-briefs/dependency-audit-guardian-command-brief.md`](../../../command-briefs/dependency-audit-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`dependency-audit-guardian` owns the open-source dependency supply-chain surface. It selects and configures automated update tools (Dependabot, Renovate), CVE scanners (Snyk, npm/pnpm audit, pip-audit, OWASP Dependency-Check), and behavioral threat intelligence (socket.dev). It triages vulnerability findings using CVSS scoring and exploitability analysis, enforces lockfile discipline, generates SBOMs (Syft + CycloneDX + Sigstore attestation), and verifies package provenance (npm Sigstore, PyPI PEP 740). It is the go-to Angel for any question about keeping the dependency supply chain trustworthy in 2026.

## Trigger phrases

Route to `dependency-audit-guardian` when the user says any of:

- "audit our dependencies"
- "set up Renovate" / "Renovate vs Dependabot"
- "socket.dev supply chain"
- "generate an SBOM" / "CycloneDX" / "SPDX"
- "npm audit is noisy" / "Snyk CI gate"
- "lockfile hygiene" / "npm ci enforcement"
- "npm provenance" / "PyPI attestations"
- "pip-audit" / "pip audit"
- "supply chain security"
- "dependency scanning in CI"
- "our Dependabot PRs are overwhelming us"
- "Snyk found X vulnerabilities — help me triage"

Or when the request implicitly involves setting up, auditing, or hardening any package dependency management toolchain.

## Do NOT route when

- The question is about remediating application code to fix a vulnerability (not just upgrading a package) → `security-guardian`
- The question is about Docker image scanning or CI/CD pipeline architecture beyond the dependency scanning step → `devops-guardian`
- The question is about license compatibility legal opinions → legal counsel
- The question is about a specific package's API or usage → the relevant language or framework Angel

If a request straddles `dependency-audit-guardian` and `security-guardian` (e.g., "fix the CVE in our app"), prefer `dependency-audit-guardian` first to determine if an upgrade resolves it, then escalate to `security-guardian` if code patching is required.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- Language and package manager: npm/pnpm/yarn, pip/uv/poetry, cargo, Maven/Gradle
- CI platform: GitHub Actions, GitLab CI, or other
- Existing scanner config files if any (`.snyk`, `renovate.json`, `dependabot.yml`)
- The specific task: scanner setup, CVE triage, SBOM generation, lockfile hardening, or provenance check

If language/package manager is missing, ask before invoking — the decision matrix produces different recommendations per ecosystem.

## Outputs the Angel produces

- Scanner configuration files: `renovate.json`, `.github/dependabot.yml`, `.snyk`, GitHub Actions workflow YAML
- CVE triage report: structured markdown with CVSS context, exploitability, resolution, and ignore policy
- SBOM workflow: GitHub Actions YAML adapted from `templates/github-actions-sbom-workflow.yml`
- Dependency audit report per `reports/README.md` structure

## Multi-Angel sequences this Angel participates in

- **Pre-release security sweep** — `dependency-audit-guardian` runs first (supply-chain surface), then `security-guardian` (application-code vulnerabilities), then `quality-guardian` (implementation verification)
- **New project setup** — `dependency-audit-guardian` sets up scanner stack; `devops-guardian` wires the CI pipeline; `security-guardian` audits initial codebase

## Critical directives the orchestrator should respect

- Never route `dependency-audit-guardian` requests that require code-level CVE remediation — those belong to `security-guardian`
- The Angel will surface open questions before acting on Snyk pricing, OWASP Dependency-Check Java state, or Renovate Mend tier differences; do not prompt it to skip these flags
- The Angel gates CI only on `high` and `critical` severity by default; do not override this without explicit user justification

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
