# Scanner Decision Matrix

> **Research sources:** `research/external/01-renovate-vs-dependabot-2026.md` (CRITICAL), `research/external/02-socket-dev-supply-chain-2026.md` (CRITICAL)
> **Example:** `examples/happy-path-node-scanner-setup.md`

The supply-chain scanning ecosystem has four complementary layers in 2026. No single tool covers all threat classes. This guide helps you pick the right combination for a given project.

---

## The four scanner layers

### Layer 1: Automated update PRs (Dependabot vs Renovate)

Both tools watch dependency manifests and open PRs when new versions are published. They are NOT interchangeable — the choice depends on team needs.

| Dimension | Dependabot | Renovate |
|---|---|---|
| Cost | Free | Free (self-hosted AGPL) or Mend hosted |
| Ecosystem coverage | 30+ package managers | 90+ package managers |
| VCS support | GitHub only | GitHub, GitLab, Bitbucket, Azure DevOps, Gitea |
| Automerge | Requires third-party Actions workaround | Built-in, configurable by semver range |
| PR grouping | No | Yes — reduces PR volume 3-5x |
| `minimumReleaseAge` | No | Yes — delays PRs for new releases by N days (XZ backdoor protection) |
| Config complexity | YAML, minimal | JSON5, steep initial learning curve |

**Decision rule:**
- **Choose Dependabot** when: GitHub-only team, minimal config budget, no automerge need, fewer than 20 open PR slots.
- **Choose Renovate** when: automerge is required, PR volume from Dependabot is overwhelming, monorepo with multiple package managers, non-GitHub VCS.

> **Key finding from research (2026-02-20):** Renovate's grouping reduced PR volume 3-5x in measured deployments. The `minimumReleaseAge: 7` setting (delays PRs for packages published less than 7 days ago) directly counters the XZ-style "rush the merge window" attack pattern. Source: `research/external/01-renovate-vs-dependabot-2026.md`.

---

### Layer 2: CVE database scanners (Snyk / npm audit / pip-audit / OWASP Dependency-Check)

These tools scan your dependency tree against known CVE databases. They answer: "Is any package I'm using affected by a published vulnerability?"

| Tool | Ecosystem | CI integration | License scanning | Notes |
|---|---|---|---|---|
| **npm/pnpm audit** | npm, pnpm | Built-in | No | CVE compliance baseline; cannot detect zero-day supply-chain attacks |
| **pip-audit** | Python (pip, uv, poetry) | CLI/CI | No | Queries PyPI Advisory Database + OSV; integrates with `uv` |
| **Snyk CLI** | 10+ ecosystems incl. containers | `snyk test` + `snyk monitor` | Yes (paid?) | Developer-friendly, IDE plugins, reachability analysis |
| **OWASP Dependency-Check** | Java, .NET primarily | Maven/Gradle plugin, CLI | No | Deep CPE matching; NVD API v2 migration required in 2026; slower than Snyk for CI |

**Recommended configuration for each:**

- `npm audit --audit-level=high` — gate on high/critical only; ignore low/moderate in CI
- `pip-audit --vulnerability-service osv` — OSV database is more complete than PyPI-only
- `snyk test --severity-threshold=high --fail-on=upgradable` — only fail when an upgrade exists

> **OQ-1:** Snyk license scanning availability on free tier vs paid plan is unconfirmed from research. Resolve before encoding in client-facing recommendation.

> **OQ-2:** OWASP Dependency-Check 2026 maintenance state for Java — NVD API v2 migration required but status uncertain. See `research/research-summary.md` OQ-2.

---

### Layer 3: Behavioral threat intelligence (socket.dev)

socket.dev analyzes package behavior signals, not CVE databases. It catches:

- Typosquatting (package names that impersonate popular packages)
- Obfuscated code, hidden network activity, shell execution in install scripts
- Account takeover (maintainer account compromised, behavior change detected)
- Supply-chain hijacks BEFORE a CVE is published

**2026 ecosystem coverage (GA):** npm, PyPI, Maven, Cargo, RubyGems, NuGet, Go, OpenVSX. Source: `research/external/02-socket-dev-supply-chain-2026.md`.

**Key point:** Snyk and socket.dev are complementary, not competitive. Snyk finds CVEs. socket.dev finds zero-day behavioral signals that have no CVE yet. The March 2026 axios maintainer account hijack (backdoor published in 40 minutes, no CVE at time of attack) is the canonical evidence that `npm audit` alone is insufficient for supply-chain security.

**Integration options:**
- GitHub App (recommended): blocks PRs that introduce packages with socket.dev alerts
- Registry Firewall (enterprise): proxy that blocks malicious package resolution at install time
- CLI: `socket npm pack` before publishing

**Decision rule:** Add socket.dev when your threat model includes supply-chain attacks, not just CVE compliance. Start with the free GitHub App.

---

### Layer 4: SBOM generation (Syft + CycloneDX)

SBOMs document what's in your software. They are not a scanner — they are the inventory that other scanners (Grype, Dependency-Track) consume.

See `guides/02-sbom-workflow.md` for the full workflow. Short version:
- Use Syft as the default SBOM generator (supports CycloneDX 1.6 JSON and SPDX 2.3)
- Generate from the built artifact, not the source tree
- Attest with Sigstore via `actions/attest-sbom@v2`
- Store in cold storage beyond GitHub's 90-day retention for CRA compliance

---

## The recommended baseline stack

| Project type | Minimum baseline | Add when needed |
|---|---|---|
| Node.js (GitHub) | Renovate + npm audit (`--audit-level=high`) | socket.dev GitHub App for supply-chain threat intel |
| Node.js (non-GitHub) | Renovate + Snyk CLI | socket.dev Registry Firewall (enterprise) |
| Python | Renovate + pip-audit + `uv lock` | socket.dev (PyPI GA Jan 2026), Snyk for license scanning |
| Java/.NET | Dependabot or Renovate + Snyk CLI | OWASP Dependency-Check for deep CPE analysis (see OQ-2) |
| Rust | Renovate + `cargo audit` | `cargo-deny` for combined policy (see OQ-5) |
| Multi-ecosystem monorepo | Renovate (90+ ecosystems) + Snyk CLI + socket.dev | SBOM pipeline when compliance required |

---

*Next: `guides/01-vulnerability-triage.md` for handling what these scanners find.*
