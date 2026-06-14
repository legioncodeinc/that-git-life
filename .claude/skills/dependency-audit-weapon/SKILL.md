---
name: dependency-audit-weapon
description: Supply-chain security specialist for open-source dependency hygiene. Owns scanner selection and configuration (Dependabot, Renovate, Snyk, socket.dev, OWASP Dependency-Check), vulnerability triage (CVSS + exploitability context), SBOM generation (Syft, CycloneDX, SPDX), lockfile discipline (npm ci enforcement, Renovate lockFileMaintenance), and provenance verification (npm Sigstore, PyPI PEP 740). Use when the user says "audit our dependencies", "set up Renovate", "Renovate vs Dependabot", "socket.dev supply chain", "generate an SBOM", "npm audit is noisy", "lockfile hygiene", "npm provenance", "PyPI attestations", "Snyk CI gate", or when dependency-audit-guardian is invoked. Do NOT use for application-code vulnerability remediation (security-guardian), Docker image scanning pipeline architecture (devops-guardian), or license compliance legal review (legal counsel).
license: MIT
---

# dependency-audit Weapon

Procedural arsenal for `dependency-audit-guardian`, the supply-chain security specialist of the Legion Army. This weapon encodes the 2026-current toolchain decision matrix, vulnerability triage workflow, SBOM generation pipeline, lockfile discipline checklist, and provenance verification guide for npm, PyPI, and Cargo ecosystems.

**First action when this weapon is loaded:** Read `guides/00-scanner-decision-matrix.md` to orient to the toolchain landscape before doing anything else. Every other guide assumes you have read that decision matrix.

---

## When this weapon applies

Load this weapon when `dependency-audit-guardian` is invoked. Typical triggers:

- "Set up Dependabot / Renovate for our repo"
- "Renovate vs Dependabot - which should we use?"
- "Our Dependabot PRs are overwhelming our team"
- "Snyk found 47 vulnerabilities - help me triage"
- "We need an SBOM for CRA compliance"
- "Generate an SBOM and attest it in CI"
- "npm audit returns 0 issues but I don't trust it"
- "socket.dev is blocking our npm install"
- "Our lockfile keeps changing unexpectedly"
- "npm provenance - what is it and should we enable it?"
- "PyPI attestations - are these packages safe?"
- "Set up a dependency scanning step in GitHub Actions"
- "pip-audit vs Safety vs Snyk for Python"

Do NOT load it for:

- Application-code CVEs requiring code changes → `security-guardian`
- Container image scanning → `devops-guardian`
- License compatibility legal opinions → legal counsel
- CI/CD pipeline architecture beyond the dependency scanning step → `devops-guardian`

---

## Critical directives

These are the non-negotiables from the Command Brief. The full rationale lives in each guide.

- **Never recommend ignoring a critical CVE without requiring an expiry date and issue link.** See `guides/01-vulnerability-triage.md`.
- **Always differentiate direct vs transitive vulnerability exposure before recommending an upgrade.** See `guides/01-vulnerability-triage.md`.
- **Prefer Renovate over Dependabot for teams that need automerge or grouping.** See `guides/00-scanner-decision-matrix.md`.
- **Always validate lockfile integrity after any dependency change recommendation.** See `guides/03-lockfile-discipline.md`.
- **Do not configure Snyk or socket.dev to block CI on `low` severity by default.** Gate only on `high` and `critical`. See `guides/01-vulnerability-triage.md`.
- **Defer to `security-guardian` for any CVE requiring patching application code, not just upgrading a package.**

---

## Toolchain overview (2026 state)

| Tool | Primary value | What it does NOT do |
|---|---|---|
| **Dependabot** | Free, GitHub-native auto-PRs for 30+ ecosystems | No automerge without third-party Actions, no grouping, GitHub-only VCS |
| **Renovate** | Flexible automerge, grouping, 90+ ecosystems, 5 VCS platforms | Requires self-hosted or Mend; more config complexity |
| **Snyk** | CVE database + license scanning + dev workflow integration | Cannot detect zero-day behavioral signals or malicious packages without CVE |
| **socket.dev** | Real-time behavioral threat intelligence (typosquatting, backdoors, account takeover) for npm, PyPI, Maven, Cargo, RubyGems, NuGet, Go, OpenVSX | Not a CVE scanner; complements Snyk, does not replace it |
| **npm/pnpm audit** | CVE compliance baseline, zero config, built-in | Does not catch supply-chain attacks without a CVE (axios hijack, XZ backdoor window) |
| **pip-audit** | PyPI Advisory Database + OSV scanning, integrates with uv/poetry/pip | Python-only; no behavioral analysis |
| **Syft + CycloneDX** | SBOM generation in CycloneDX 1.6 JSON / SPDX 2.3; CI-ready with Sigstore attestation | Does not scan vulnerabilities; pairs with Grype for that |
| **OWASP Dependency-Check** | Deep Java/.NET CVE scanning with CPE matching | NVD API v2 migration required; known rate-limit issues; slower than Snyk CLI for CI gates |

> **Key 2026 insight from research:** `npm audit` is a CVE compliance tool, not a supply-chain security tool. The March 2026 axios maintainer account hijack published a backdoor in 40 minutes with no CVE at time of attack — `npm audit` showed clean throughout. socket.dev behavioral analysis and `minimumReleaseAge` in Renovate are the controls that protect against this class of attack. See `research/external/04-npm-provenance-sigstore-2026.md`.

---

## Guide map

Read the guide matching your task:

| Task | Guide |
|---|---|
| Pick the right scanner(s) for this project | `guides/00-scanner-decision-matrix.md` |
| Triage a CVE finding from any scanner | `guides/01-vulnerability-triage.md` |
| Generate and attest an SBOM in CI | `guides/02-sbom-workflow.md` |
| Harden lockfile discipline | `guides/03-lockfile-discipline.md` |
| Verify npm / PyPI provenance | `guides/04-provenance-verification.md` |

---

## Template map

| Template | Use case |
|---|---|
| `templates/renovate-base-config.json` | Drop-in Renovate config for Node.js / Python / Cargo monorepos with grouping, automerge, and `minimumReleaseAge` |
| `templates/github-actions-sbom-workflow.yml` | 5-step SBOM generation + Sigstore attestation on tag push |
| `templates/snyk-ci-gate.yml` | GitHub Actions Snyk scan with `high`/`critical`-only gate |

---

## Open questions (flagged from research)

These questions survived the literature sweep. Resolve with the user before acting on the affected guide:

- **OQ-1 (Snyk pricing):** Snyk license scanning — free tier vs paid? Affects the scanner decision matrix cost comparison vs socket.dev.
- **OQ-2 (OWASP Dependency-Check 2026):** Current maintenance state and NVD API v2 migration status for Java projects. See `research/research-summary.md`.
- **OQ-3 (Renovate Mend vs self-hosted):** Does Mend's hosted tier add features (Merge Confidence, reachability) not in the AGPL open-source version?
- **OQ-4 (Python package manager):** Recommend `uv` as the default or remain tool-agnostic for Python lockfile discipline?
- **OQ-5 (Cargo/Rust):** `cargo audit` vs `cargo-deny` — which to recommend for Rust CVE scanning?

> These are flagged per `weapon-forge` protocol. Do not invent answers; surface to the user.

---

## Folder layout

```text
dependency-audit-weapon/
+- SKILL.md                                   (this file)
+- README.md                                  (one-page human overview)
+- guides/
|  +- 00-scanner-decision-matrix.md           (Dependabot / Renovate / Snyk / socket.dev / OWASP comparison + project decision tree)
|  +- 01-vulnerability-triage.md              (CVSS + exploitability + direct vs transitive + ignore discipline)
|  +- 02-sbom-workflow.md                     (Syft + CycloneDX 1.6 + Sigstore + CRA-compliant storage)
|  +- 03-lockfile-discipline.md               (npm ci enforcement + Renovate lockFileMaintenance + minimumReleaseAge)
|  +- 04-provenance-verification.md           (npm --provenance + PyPI PEP 740 + consumer verification)
+- examples/
|  +- happy-path-node-scanner-setup.md        (Renovate + socket.dev + Snyk for a new Node.js monorepo)
|  +- edge-case-critical-cve-triage.md        (triaging a critical CVE in a transitive dependency)
+- templates/
|  +- renovate-base-config.json               (ready-to-use Renovate config)
|  +- github-actions-sbom-workflow.yml        (5-step SBOM + attestation workflow)
|  +- snyk-ci-gate.yml                        (Snyk GitHub Actions step with high/critical gate)
+- reports/
|  +- README.md                               (how audit reports accumulate)
+- research/                                  (DO NOT MODIFY -- owned by scripture-historian)
   +- research-plan.md
   +- research-summary.md
   +- index.md
   +- internal/01-command-brief.md
   +- external/ (5 source files)
```

---

## Pairing

| Role | Artifact |
|---|---|
| This weapon | `ai-tools/skills/dependency-audit-weapon/` |
| Paired Angel | `ai-tools/agents/dependency-audit-guardian.md` |
| Command Brief | `ai-tools/command-briefs/dependency-audit-guardian-command-brief.md` |

---

*Forged by `weapon-forge` from `dependency-audit-guardian-command-brief.md` and `research/`. Part of the Legion AI Tools Factory by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
