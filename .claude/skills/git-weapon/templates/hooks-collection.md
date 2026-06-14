# Hooks Collection Template

Ready-to-use Git hook scripts for pre-commit, commit-msg, and pre-push.

---

## How to use

Place in `.githooks/` and configure:
```bash
git config core.hooksPath .githooks
chmod +x .githooks/*
```

Or use with Husky (`.husky/<hook-name>`) or lefthook (`lefthook.yml`).

---

## pre-commit: lint + fast tests

```bash
#!/usr/bin/env bash
set -euo pipefail

# Staged TypeScript/JavaScript files only
STAGED=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(ts|tsx|js|jsx)$' || true)

if [ -n "$STAGED" ]; then
  echo "ESLint..."
  npx eslint --fix $STAGED
  git add $STAGED  # re-stage auto-fixed files

  echo "TypeScript type-check..."
  npx tsc --noEmit
fi

echo "Unit tests..."
npm run test:unit --silent
```

---

## commit-msg: enforce conventional commits

```bash
#!/usr/bin/env bash
set -euo pipefail

MSG=$(cat "$1")
PATTERN="^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?(!)?: .{1,100}"

if echo "$MSG" | grep -qE "^(Merge|Revert|fixup!|squash!)"; then
  exit 0  # Allow merge commits, reverts, autosquash markers
fi

if ! echo "$MSG" | grep -qE "$PATTERN"; then
  echo "ERROR: commit message must follow Conventional Commits."
  echo "Pattern: type(scope): description (max 100 chars)"
  echo "Types: feat fix docs style refactor perf test build ci chore revert"
  echo "Example: feat(auth): add Google OAuth login"
  exit 1
fi
```

---

## pre-push: block force-push to protected branches

```bash
#!/usr/bin/env bash
set -euo pipefail

PROTECTED="main master develop"

while read local_ref local_sha remote_ref remote_sha; do
  BRANCH="${remote_ref##refs/heads/}"

  for PROTECTED_BRANCH in $PROTECTED; do
    if [ "$BRANCH" = "$PROTECTED_BRANCH" ]; then
      # Detect force-push (remote sha is not an ancestor of local sha)
      if [ "$remote_sha" != "0000000000000000000000000000000000000000" ]; then
        if ! git merge-base --is-ancestor "$remote_sha" "$local_sha" 2>/dev/null; then
          echo "ERROR: Force-push to $PROTECTED_BRANCH is blocked."
          echo "Use a feature branch and open a PR."
          exit 1
        fi
      fi
    fi
  done
done

exit 0
```

---

## lefthook.yml configuration

```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{ts,tsx,js,jsx}"
      run: npx eslint --fix {staged_files} && git add {staged_files}
    typecheck:
      run: npx tsc --noEmit
    test:
      run: npm run test:unit --silent

commit-msg:
  commands:
    conventional:
      run: npx commitlint --edit {1}

pre-push:
  commands:
    tests:
      run: npm run test --silent
```
