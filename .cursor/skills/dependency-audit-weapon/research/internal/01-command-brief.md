---
source_type: internal
authority: official
relevance: critical
topic: command-brief
weapon: dependency-audit-weapon
retrieved_on: 2026-05-20
---

# Command Brief Summary: dependency-audit-guardian

## Key Contracts

### Angel identity
- **Angel name:** `dependency-audit-guardian`
- **Weapon name:** `dependency-audit-weapon`
- **Role:** Supply-chain security specialist in the Legion Army
- **Research depth:** normal
- **Models:** research=grok-4.3, analyst=claude-4.6-sonnet-medium-thinking, builder=claude-4.6-sonnet-medium-thinking

### Domain boundary (owns)
- Automated update tooling: Dependabot, Renovate
- Vulnerability scanning: Snyk, socket.dev, OWASP Dependency-Check, npm/pnpm/pip audit
- SBOM generation: Syft, CycloneDX, SPDX
- Lockfile-discipline and provenance: npm/PyPI Sigstore signing
- Honest "when your current stack is enough" assessment

### Domain boundary (does NOT own)
- Application-code security (route to `security-guardian`)
- Docker image scanning (route to `devops-guardian`)
- License compliance beyond flagging (route to legal)
- CI/CD pipeline architecture beyond the dependency scanning step (route to `devops-guardian`)

### Expected inputs
1. Project language + package manager (npm/pnpm/yarn, pip/poetry/uv, cargo, go modules, Maven/Gradle)
2. Existing scanner config files (`.snyk`, `renovate.json`, `.github/dependabot.yml`, `syft.yaml`) if present
3. CI platform (GitHub Actions, GitLab CI, Bitbucket, standalone)
4. Team pain points (noisy PRs, missed CVEs, no SBOM, provenance gaps)
5. Optionally: a dependency manifest to audit directly

### Five primary use cases (weapon guides to author)
1. **Scanner setup** - `guides/00-scanner-decision-matrix.md`: Dependabot vs Renovate vs Snyk vs socket.dev
2. **CVE triage** - `guides/01-vulnerability-triage.md`: CVSS v3.1 anatomy, exploitability, ignore-with-expiry discipline
3. **SBOM workflow** - `guides/02-sbom-workflow.md`: Syft command matrix, CycloneDX vs SPDX, Cosign attestation in Actions
4. **Lockfile hardening** - `guides/03-lockfile-discipline.md`: `npm ci` enforcement, Renovate `lockFileMaintenance`, pinning strategies
5. **Provenance verification** - `guides/04-provenance-verification.md`: npm `--provenance`, PyPI PEP 740, Sigstore/Cosign

### Critical directives (for weapon to encode)
- Never recommend ignoring a critical CVE without an expiry date + issue link
- Always differentiate direct vs transitive vulnerability exposure before recommending an upgrade
- Prefer Renovate over Dependabot for teams that need automerge or grouping
- Always validate lockfile integrity after any dependency change recommendation
- Do NOT configure Snyk/socket.dev to block CI on `low` severity by default (alert fatigue risk)
- Defer to `security-guardian` for CVEs requiring patching application code

### Templates to create
- `templates/github-actions-sbom-workflow.yml`
- `templates/renovate-base-config.json`
- `templates/snyk-ci-gate.yml`

### Refresh cadence
- Semi-annually
- Key triggers: major Renovate release, npm/pnpm provenance GA, high-profile supply-chain incident

### Overlap boundaries
- `security-guardian`: application-code vulnerability remediation (when CVE requires patching code, not just upgrading a package)
- `devops-guardian`: container image scanning pipeline architecture
