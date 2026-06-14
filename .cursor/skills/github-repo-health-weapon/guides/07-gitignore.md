# 07 — .gitignore Coverage Audit

*Research basis: `research/external/07-gitignore-canonical.md` (github/gitignore canonical templates)*

## What to check

1. **Presence:** Does a `.gitignore` exist at the repo root?
2. **Language/framework coverage:** Does it match the detected tech stack?
3. **Secret/credential exposure:** Are common secret files or patterns NOT covered?
4. **Build artifact tracking:** Are build output directories accidentally tracked?
5. **IDE and OS junk:** Are `.DS_Store`, `Thumbs.db`, `.idea/`, `.vscode/` covered (or intentionally left for developer discretion)?

## Language detection (quick heuristic)

```bash
# Detect primary languages
ls package.json pyproject.toml Gemfile go.mod Cargo.toml pom.xml 2>/dev/null
# Or use GitHub linguist via the API:
gh api /repos/{owner}/{repo}/languages
```

## Critical secret patterns (must be in .gitignore)

```gitignore
# Environment files
.env
.env.*
!.env.example
!.env.*.example

# Credentials
*.pem
*.key
credentials.json
serviceAccount*.json

# Secret manager outputs
.aws/credentials
.gcp/
```

## Common build artifact patterns (by stack)

| Stack | Should be ignored |
|---|---|
| Node.js | `node_modules/`, `.next/`, `dist/`, `build/`, `.cache/` |
| Python | `__pycache__/`, `*.pyc`, `.venv/`, `dist/`, `*.egg-info/` |
| Go | vendor/ (optional), binary outputs |
| Java | `target/`, `*.class`, `*.jar` |
| Ruby | `.bundle/`, `vendor/bundle/` |

## Scoring rubric

| Condition | Score |
|---|---|
| All stack patterns covered, secret patterns covered, no build artifacts tracked | 10 |
| Stack and secret patterns covered, minor IDE patterns missing | 8 |
| Main stack covered, some build artifacts missing | 6 |
| Generic .gitignore not matching detected stack | 4 |
| .gitignore present but severely incomplete | 2 |
| No .gitignore | 0 |

## Quick check for accidentally tracked files

```bash
# Files that should be ignored but are tracked
git ls-files | grep -E '(\.env$|node_modules|__pycache__|\.DS_Store|\.idea|dist/|build/)'
```

## Report section template

```markdown
### .gitignore Coverage (Score: X/10)

**Detected stack:** Node.js (Next.js), Python (scripts)
**Secret patterns:** ✅ `.env`, `.env.*` covered; `!.env.example` correctly excluded
**Build artifacts:** ✅ `node_modules/`, `.next/`, `dist/` covered; Python `__pycache__/` ⚠️ missing
**Accidentally tracked files:** None found

**Findings:**
- RECOMMEND: Add Python `.gitignore` patterns (`__pycache__/`, `*.pyc`, `.venv/`) — repo contains Python scripts in `scripts/`.
```

## Handoff

Secret-in-git-history incidents or secret scanning results → `security-guardian`.
