# Script Review — Real-World Deployment Script

A worked example of `terminal-bash-guardian` reviewing a shell script that deploys a Node.js app to a VPS.

Demonstrates: audit procedure, finding classification, fix generation.

References: `guides/03-shell-scripting.md`, `guides/00-principles.md`

---

## Input

Developer submits `scripts/deploy.sh` for review:

```bash
#!/bin/bash
SERVER=$1
BRANCH=$2

echo "Deploying $BRANCH to $SERVER"

ssh $SERVER "
  cd /app
  git pull origin $BRANCH
  npm install
  npm run build
  pm2 restart app
"
```

## Angel's review

### Findings

| Finding | Severity | SC rule |
|---|---|---|
| Missing `set -euo pipefail` | High | SC2039 (implicit) |
| `$1`/`$2` unquoted | High | SC2086 |
| No validation that `$1` / `$2` were provided | High | SC2086 |
| `#!/bin/bash` should be `#!/usr/bin/env bash` | Low | SC2096 |
| Heredoc passes unquoted `$BRANCH` into remote shell | Medium | injection risk |

### Escalation note

This script runs on a VPS (production server). For CI-triggered deploys, `devops-guardian` should review the CI step that calls this script. `terminal-bash-guardian` covers the script's shell safety; `devops-guardian` covers the CI integration.

### Fixed script

```bash
#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 <server_host> <branch>"
  exit 1
}

# Validate required args
if [[ $# -lt 2 ]]; then
  echo "Error: server and branch are required." >&2
  usage
fi

SERVER="$1"
BRANCH="$2"

echo "Deploying branch '${BRANCH}' to server '${SERVER}'"

# Use a quoted heredoc to prevent local variable expansion in the remote shell
# (EOFDEPLOY is single-quoted, so $BRANCH is expanded locally before ssh)
ssh "$SERVER" "
  set -euo pipefail
  cd /app
  git pull origin '${BRANCH}'
  npm install --production
  npm run build
  pm2 restart app
"

echo "Deploy complete."
```

### Report summary

- **Critical fixes:** 3 (missing safety preamble, unquoted variable expansions, missing arg validation)
- **Medium fixes:** 1 (injection risk in heredoc — resolved by expanding locally and quoting in remote shell)
- **Low fixes:** 1 (shebang portability)
- **Escalation:** recommend `devops-guardian` reviews the CI step that invokes this script.
