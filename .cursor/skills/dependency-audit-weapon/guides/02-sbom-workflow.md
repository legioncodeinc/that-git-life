# SBOM Workflow (Syft + CycloneDX + Sigstore)

> **Research source:** `research/external/03-sbom-cyclonedx-spdx-2026.md` (CRITICAL)
> **Template:** `templates/github-actions-sbom-workflow.yml`

A Software Bill of Materials (SBOM) is a machine-readable inventory of every component in your software artifact. In 2026, SBOM generation is required or strongly recommended by: the EU Cyber Resilience Act (CRA), US Executive Order 14028, many enterprise procurement policies, and SLSA Level 2+.

---

## Format selection: CycloneDX 1.6 vs SPDX 2.3

Both formats are valid. Choose based on your consumer:

| Use case | Recommended format |
|---|---|
| CI vulnerability scanning (Grype, Dependency-Track) | CycloneDX 1.6 JSON |
| License compliance tooling (FOSSA, License Finder) | SPDX 2.3 JSON or RDF |
| Government/regulatory submission | SPDX (common in US federal; CRA accepts both) |
| General/default | CycloneDX 1.6 JSON |

Generate CycloneDX as primary; add SPDX as secondary when compliance requires it.

---

## Generator selection by ecosystem

| Ecosystem | Recommended generator |
|---|---|
| Default / multi-language container image | `anchore/syft` (`anchore/sbom-action@v0.24.0+`) |
| Python project (directory-level) | `cyclonedx-py` (`cyclonedx-bom` package) |
| Rust crate | `cargo-cyclonedx` |
| Node.js (single package) | `@cyclonedx/cyclonedx-npm` |
| Java (Maven) | `cyclonedx-maven-plugin` |

**Key rule:** Generate from the **built artifact** (Docker image, compiled binary, dist directory), not the source tree. Source-tree SBOMs miss transitive dependencies that get bundled during build. Source: `research/external/03-sbom-cyclonedx-spdx-2026.md`.

---

## The 5-step production workflow

1. **Build the artifact** (your existing build step)
2. **Generate SBOM** from the built artifact using Syft or ecosystem-specific generator
3. **Verify SBOM** — check component count against expectations; fail if < expected baseline
4. **Attest with Sigstore** using `actions/attest-sbom@v2` (GitHub's OIDC-backed attestation)
5. **Store in cold storage** — GitHub artifact retention is 90 days; CRA requires longer; mirror to S3 / GCS

See `templates/github-actions-sbom-workflow.yml` for the ready-to-use GitHub Actions implementation.

---

## Attestation: why and how

An unattested SBOM is a document. An attested SBOM is a signed claim. Sigstore attestation provides:

- Cryptographic proof that the SBOM was generated from a specific artifact at a specific time
- Immutable audit trail tied to the GitHub Actions OIDC token (no long-lived signing keys)
- Verifiable by consumers using `gh attestation verify`

```bash
# Consumer verification
gh attestation verify oci://my-registry/my-app:1.2.3 \
  --owner my-org \
  --predicate-type https://spdx.dev/Document

# Or for generic SBOM
gh attestation verify ./my-app-sbom.cdx.json --owner my-org
```

---

## CRA storage requirement

GitHub artifact retention defaults to 90 days. The EU Cyber Resilience Act requires SBOMs to be available for the supported lifecycle of the product. Mirror SBOM artifacts to:

- AWS S3 with Object Lock (WORM)
- Google Cloud Storage with retention policy
- An artifact repository (Artifactory, Nexus) with retention configured

Include a storage step in the workflow after attestation. See `templates/github-actions-sbom-workflow.yml` Step 5.

---

## When to trigger SBOM generation

- **Trigger on tag push** (`on: push: tags: ['v*']`), not on branch push. This generates one SBOM per release, not one per commit.
- Also trigger on `release: published` if you use GitHub Releases.
- Do NOT trigger on every PR — SBOM generation is slow (30-120 seconds) and the output is only meaningful for release artifacts.

---

*Previous: `guides/01-vulnerability-triage.md`. Next: `guides/03-lockfile-discipline.md`.*
