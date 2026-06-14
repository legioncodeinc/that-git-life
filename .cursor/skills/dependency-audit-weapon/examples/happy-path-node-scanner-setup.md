# Happy Path: Setting Up Scanners for a New Node.js Monorepo

> **Guides demonstrated:** `guides/00-scanner-decision-matrix.md`, `guides/03-lockfile-discipline.md`
> **Template used:** `templates/renovate-base-config.json`, `templates/snyk-ci-gate.yml`

## Scenario

A team is starting a new Node.js monorepo (two apps, three shared packages) on GitHub. They want automated dependency updates, CVE scanning in CI, and supply-chain threat intelligence. They have no existing scanner setup.

## Step 1: Choose the scanner stack

**Decision matrix applied (from `guides/00-scanner-decision-matrix.md`):**

- GitHub? Yes → Dependabot is available, but team needs automerge and PR grouping → **Choose Renovate**
- CVE scanning? → **npm audit** baseline (free) + **Snyk CLI** for developer workflow integration
- Supply-chain threat intel? → **socket.dev GitHub App** (free tier, covers npm + PyPI + Cargo)
- SBOM required? → Not yet, but will add when CRA compliance is scoped

**Result:** Renovate + npm audit + Snyk CLI + socket.dev

## Step 2: Install Renovate

1. Install the Renovate GitHub App: https://github.com/apps/renovate
2. Create `renovate.json` in the repo root (use `templates/renovate-base-config.json` as the base):

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "minimumReleaseAge": "7 days",
  "schedule": ["before 5am on monday"],
  "lockFileMaintenance": { "enabled": true },
  "packageRules": [
    {
      "matchDepTypes": ["devDependencies"],
      "automerge": true,
      "automergeType": "pr",
      "requiredStatusChecks": null
    },
    {
      "groupName": "internal packages",
      "matchPackagePrefixes": ["@myorg/"]
    }
  ]
}
```

3. Verify a Renovate onboarding PR is opened within 24 hours.

## Step 3: Enforce lockfile discipline

Add to `.github/workflows/ci.yml`:

```yaml
- name: Install dependencies
  run: npm ci  # NOT npm install
```

Verify `package-lock.json` is committed and not in `.gitignore`.

## Step 4: Add Snyk CI gate

Add the Snyk step from `templates/snyk-ci-gate.yml` to the CI workflow:

```yaml
- name: Snyk security scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity-threshold=high --fail-on=upgradable
```

This gates CI only on high/critical CVEs where an upgrade is available. Does not block on unresolvable vulnerabilities.

## Step 5: Install socket.dev GitHub App

1. Install from https://github.com/marketplace/socket-security
2. No configuration required — socket.dev auto-comments on PRs introducing packages with behavioral signals
3. Alert categories to leave enabled by default: `malware`, `install-scripts`, `network`, `obfuscated-code`
4. Alert categories to disable in high-noise environments: `debug-access`, `deprecated`

## Step 6: Verify the setup

After completing all steps, open a PR that bumps a minor version dependency. Verify:
- [ ] Renovate opened a PR for the bump
- [ ] `npm ci` passed in CI
- [ ] Snyk scan ran and reported 0 high/critical or listed actionable findings
- [ ] socket.dev either passed silently or commented with a relevant alert

## Expected outcome

From week 1, the team has:
- Automated PRs for all dependency updates (grouped, with `minimumReleaseAge` protection)
- CVE compliance baseline in CI (only high/critical, only upgradable)
- Supply-chain behavioral threat intelligence on every new package introduction
- Reproducible builds enforced via `npm ci`
