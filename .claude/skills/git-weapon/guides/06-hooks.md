# Hooks — git-weapon

Client-side Git hooks: pre-commit, commit-msg, prepare-commit-msg, pre-push. Hook managers: Husky, lefthook.

---

## Hook types and when they fire

| Hook | When it fires | Common use |
|---|---|---|
| `pre-commit` | Before commit is recorded | Lint, format, run fast tests |
| `prepare-commit-msg` | Before commit message editor opens | Inject branch name into message |
| `commit-msg` | After message is entered | Validate conventional commit format |
| `pre-push` | Before `git push` | Run full test suite, block force-push to main |
| `post-commit` | After commit is recorded | Trigger notification, open PR URL |
| `post-checkout` | After `git checkout` | Install dependencies, rebuild assets |
| `pre-rebase` | Before rebase starts | Stash check, validation |

Server-side hooks (`pre-receive`, `update`, `post-receive`) run on the remote server — escalate to `devops-guardian`.

---

## Where hooks live

Hooks are executable scripts in `.git/hooks/`. By default they are samples (`.sample` extension, not executed).

```bash
ls .git/hooks/
# pre-commit.sample  commit-msg.sample  pre-push.sample ...
```

To enable a hook, remove `.sample` and make it executable:
```bash
cp .git/hooks/pre-commit.sample .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

**Problem:** `.git/` is not tracked by Git. Hooks cannot be shared with the team this way.

---

## Sharing hooks with the team

### Method 1: `.githooks/` directory + `core.hooksPath`

```bash
# Create a tracked hooks directory:
mkdir -p .githooks

# Configure Git to use it:
git config --local core.hooksPath .githooks

# Or set per-developer via a setup script in package.json / justfile:
# git config core.hooksPath .githooks
```

Check `.githooks/` into the repo. Each developer must run `git config core.hooksPath .githooks` after cloning.

### Method 2: Husky (Node.js projects)

```bash
npm install --save-dev husky
npx husky init
# Creates .husky/ directory and installs hooks via npm prepare
```

Husky hooks are in `.husky/` (tracked by Git):
```bash
# .husky/pre-commit
npm run lint
npm run test:unit
```

Husky auto-runs `git config core.hooksPath .husky` during `npm install` (via `prepare` script in `package.json`).

### Method 3: lefthook (language-agnostic, fast parallel execution)

```bash
# Install (multiple options):
brew install lefthook          # macOS
npm install --save-dev lefthook
pip install lefthook

# Initialize:
lefthook install
```

Configure in `lefthook.yml`:
```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{ts,tsx,js}"
      run: npx eslint {staged_files}
    format:
      glob: "*.{ts,tsx}"
      run: npx prettier --check {staged_files}
    typecheck:
      run: npx tsc --noEmit

commit-msg:
  commands:
    conventional:
      run: npx commitlint --edit {1}
```

lefthook runs commands in parallel and only on staged files matching the glob — significantly faster than running on all files.

---

## Writing a pre-commit hook

```bash
#!/usr/bin/env bash
set -euo pipefail

# Run linter on staged files only
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(ts|tsx|js|jsx)$' || true)

if [ -n "$STAGED_FILES" ]; then
  echo "Running ESLint on staged files..."
  npx eslint $STAGED_FILES
fi

# Run fast unit tests
echo "Running unit tests..."
npm run test:unit --silent
```

---

## Writing a commit-msg hook (conventional commits)

```bash
#!/usr/bin/env bash
set -euo pipefail

COMMIT_MSG_FILE="$1"
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Conventional commit pattern:
# type(scope): description
# Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
PATTERN="^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?(!)?: .{1,100}"

if ! echo "$COMMIT_MSG" | grep -qE "$PATTERN"; then
  echo "ERROR: Commit message does not follow Conventional Commits format."
  echo "Expected: type(scope): description"
  echo "Example:  feat(auth): add Google OAuth login"
  exit 1
fi
```

---

## Writing a pre-push hook (block force-push to main)

```bash
#!/usr/bin/env bash
set -euo pipefail

PROTECTED_BRANCH="main"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

while read local_ref local_sha remote_ref remote_sha; do
  if [[ "$remote_ref" == "refs/heads/$PROTECTED_BRANCH" ]]; then
    # Detect force-push by checking if remote sha is an ancestor of local sha
    if [ "$remote_sha" != "0000000000000000000000000000000000000000" ]; then
      if ! git merge-base --is-ancestor "$remote_sha" "$local_sha" 2>/dev/null; then
        echo "ERROR: Force-push to $PROTECTED_BRANCH is blocked by pre-push hook."
        echo "Use a feature branch and open a PR instead."
        exit 1
      fi
    fi
  fi
done
```

---

## Bypassing hooks (when necessary)

```bash
# Skip pre-commit and commit-msg hooks:
git commit --no-verify -m "Emergency fix"

# Skip pre-push hook:
git push --no-verify
```

`--no-verify` should be rare and intentional. Log it in the commit message when used in emergencies.

---

## Server-side hooks: escalate to devops-guardian

Server-side hooks (`pre-receive`, `update`, `post-receive`) run on the remote Git server. They enforce rules that clients cannot bypass. Configuration depends on the hosting platform (GitHub, GitLab, Bitbucket, Gitea). Escalate to `devops-guardian` for server-side hook setup.

Sources: research/external/01-interactive-rebase.md (autosquash section mentions hooks)
