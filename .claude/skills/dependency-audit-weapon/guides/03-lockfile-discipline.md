# Lockfile Discipline

> **Research sources:** `research/external/01-renovate-vs-dependabot-2026.md` (HIGH), `research/external/04-npm-provenance-sigstore-2026.md` (HIGH)

The lockfile is the first line of defense in supply-chain security. A team that runs `npm install` in CI instead of `npm ci`, or that does not commit their lockfile, has no reproducible builds and no defense against a compromised registry serving a different package than what was tested.

---

## The five lockfile rules

### Rule 1: Always commit the lockfile

- `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `poetry.lock`, `uv.lock`, `Cargo.lock`
- Do NOT add lockfiles to `.gitignore` (a surprisingly common mistake on Node projects)
- Exception: published library packages on npm — the lockfile in the repo is for development; consumers get their own resolution

### Rule 2: Use `npm ci` (or equivalent) in CI, never `npm install`

```yaml
# Correct
- run: npm ci

# Wrong - allows the resolver to upgrade within semver ranges
- run: npm install
```

| Command | What it does |
|---|---|
| `npm install` | Resolves dependencies, may update `package-lock.json` |
| `npm ci` | Installs exactly from `package-lock.json`; fails if file is missing or inconsistent |
| `pnpm install --frozen-lockfile` | pnpm equivalent of `npm ci` |
| `yarn install --frozen-lockfile` | yarn equivalent |
| `uv sync --frozen` | uv equivalent |

### Rule 3: Enforce `npm ci` via a pre-push hook

```json
// package.json - using husky
{
  "husky": {
    "hooks": {
      "pre-commit": "node -e \"const l=require('./package-lock.json');const p=require('./package.json');Object.keys(p.dependencies||{}).concat(Object.keys(p.devDependencies||{})).forEach(d=>{if(!l.packages['node_modules/'+d]) throw new Error('Lockfile out of sync for '+d)})\""
    }
  }
}
```

Or more simply: run `npm ci --dry-run` in a pre-commit hook and fail if the lockfile would be modified.

### Rule 4: Use Renovate `lockFileMaintenance`

Renovate's `lockFileMaintenance` opens a weekly PR that updates the lockfile (resolving within declared semver ranges) without changing `package.json`. This prevents lockfile drift accumulating silently.

```json
{
  "lockFileMaintenance": {
    "enabled": true,
    "schedule": ["before 5am on monday"]
  }
}
```

### Rule 5: Set `minimumReleaseAge` to protect against XZ-style attacks

The XZ backdoor (2024) succeeded partly because the malicious version was merged before maintainers had time to react. Setting a minimum release age delays Renovate PRs for packages published less than N days ago:

```json
{
  "minimumReleaseAge": "7 days"
}
```

This gives the security community time to detect and report malicious packages before your CI automatically merges them. Source: `research/external/01-renovate-vs-dependabot-2026.md`.

A 7-day delay catches the majority of "rush the window" attacks; 14 days provides more coverage at the cost of slower security updates. For critical security packages, you can override `minimumReleaseAge` at the package level.

---

## Pinning vs semver ranges

| Context | Strategy | Reason |
|---|---|---|
| Production `dependencies` | Pin exact version (e.g., `"1.2.3"`) | Reproducible builds; no surprise resolutions |
| Development `devDependencies` | Semver range (e.g., `"^1.2.0"`) | Acceptable drift; Renovate manages updates |
| Framework / runtime | Pin + use `minimumReleaseAge` | High-impact, high-risk upgrade path |
| Internal packages | Pin exact + Renovate grouping | Prevents cross-package version skew |

---

## pnpm v11 specifics (2026)

pnpm v11 (released late 2025) changed audit behavior:

- Uses **GHSA identifiers** instead of CVE IDs (GHSA is GitHub's Advisory Database)
- Added `--fix=update` mode: more precise than npm's approach, updates only the vulnerable package
- Added registry signature verification by default
- `pnpm install --frozen-lockfile` is unchanged and still the recommended CI mode

Source: `research/external/04-npm-provenance-sigstore-2026.md`.

---

> **OQ-4:** For Python projects: recommend `uv lock` + `uv sync --frozen` as the default, or remain tool-agnostic? The research shows `uv` as the 2026 standard but this choice should be confirmed by the user. See `research/research-summary.md` OQ-4.

---

*Previous: `guides/02-sbom-workflow.md`. Next: `guides/04-provenance-verification.md`.*
