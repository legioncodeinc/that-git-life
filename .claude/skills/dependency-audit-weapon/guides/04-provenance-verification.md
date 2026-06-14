# Provenance Verification

> **Research sources:** `research/external/04-npm-provenance-sigstore-2026.md` (HIGH), `research/external/05-python-pip-audit-pypi-attestations-2026.md` (HIGH)

Package provenance is cryptographic proof of where a package was built and by whom. It answers: "Was this package actually built from the claimed source repository, or was it tampered with post-build?"

---

## npm provenance (Sigstore-backed)

### Publishing with provenance

```bash
# From GitHub Actions (OIDC-enabled runner)
npm publish --provenance --access public
```

Requirements:
- Must run from GitHub Actions, GitLab CI, or another Sigstore-supported CI provider
- Generates a Sigstore attestation automatically (no signing keys needed)
- Attestation is stored in the npm registry and visible at `npmjs.com/package/<name>/v/<version>`

### Verifying provenance as a consumer

```bash
# Check a package's provenance before installing
npm audit signatures <package-name>@<version>

# Output full Sigstore bundle (March 2026 addition)
npm audit signatures <package-name>@<version> --include-attestations

# View in browser
https://npmjs.com/package/<package-name>/v/<version>?activeTab=code
```

The `--include-attestations` flag (merged March 2026) outputs the full Sigstore bundle in JSON, enabling CI integration and automated verification. Source: `research/external/04-npm-provenance-sigstore-2026.md`.

### What provenance tells you

- The source repository URL and commit SHA the package was built from
- The GitHub Actions workflow run that produced it
- That the package was not modified after CI produced it

### What provenance does NOT tell you

- That the source code itself is trustworthy (a compromised repo produces valid provenance)
- That the source repo commit is safe (provenance is a transport guarantee, not a content guarantee)

---

## PyPI attestations (PEP 740)

### 2026 state: good publisher adoption, no consumer-side enforcement yet

As of late 2024 / early 2026:
- **~20,000+ packages** carry PEP 740 attestations, growing
- Attestations are **automatic** for GitHub Actions users using Trusted Publishing
- `pip` and `uv` do **NOT** yet verify attestations at install time

This means PyPI attestations are currently a transparency improvement (you can verify manually), not an enforcement control. Source: `research/external/05-python-pip-audit-pypi-attestations-2026.md`.

### Verifying a PyPI package attestation manually

```bash
# Install the verification tool
pip install sigstore

# Download and verify
pip download <package>==<version> --no-deps -d ./tmp_verify
python -m sigstore verify github \
  --cert-identity "https://github.com/<owner>/<repo>/.github/workflows/publish.yml@refs/tags/<tag>" \
  ./tmp_verify/<package>-<version>*.whl
```

### The path to consumer-side verification: PEP 751

PEP 751 (standardized Python lockfiles with hash pinning and attestation binding) is the mechanism that will enable `pip` and `uv` to verify attestations at install time. As of 2026, PEP 751 is in draft. Trail of Bits is building a pip plugin for attestation verification as an interim measure.

**Current recommendation:** For Python projects, rely on `pip-audit` for CVE scanning and `uv lock` / `poetry.lock` hash pinning for integrity. Provenance verification is currently manual or CI-scripted.

---

## Cargo / Rust

Cargo registry signing is in active development as of 2026. Source: `research/research-summary.md` OQ-5.

> **OQ-5:** `cargo audit` vs `cargo-deny` for Rust CVE scanning is unresolved from research. Until resolved, recommend both: `cargo audit` for CVE scanning, `cargo-deny` for combined policy (duplicate detection + license + CVE + banned crates). See `research/research-summary.md`.

---

## CI integration checklist

| Action | npm | Python | Rust |
|---|---|---|---|
| Verify package signatures in CI | `npm audit signatures` | Manual / pip plugin (coming) | `cargo audit` |
| Generate provenance when publishing | `npm publish --provenance` | PyPA Trusted Publishing | Cargo signing (in development) |
| Lockfile integrity check | `npm ci` | `uv sync --frozen` | `cargo fetch --locked` |
| Behavioral threat scanning | socket.dev | socket.dev (PyPI GA 2026) | socket.dev (Cargo GA 2026) |

---

*Previous: `guides/03-lockfile-discipline.md`. Return to `SKILL.md` for the full guide map.*
