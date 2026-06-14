#!/usr/bin/env bash
# scripts/scan.sh — Phase 1 deterministic security scans for security-guardian.
#
# Runs the checks a human or a grep can do — so the Angel spends its reasoning
# on the judgment calls (IDOR, business logic, PCI architecture).
#
# Outputs land in reports/scan-output/. The Angel reads them, dedupes with its
# own observations, and promotes findings into the audit report.
#
# Usage (from repo root being audited):
#   bash .cursor/skills/security-weapon/scripts/scan.sh
#
# Exit code is always 0 — the Angel decides what's fatal.

set -u
OUT_DIR="reports/scan-output"
mkdir -p "$OUT_DIR"

hr() { printf '\n============================================================\n%s\n============================================================\n' "$*"; }

# ----------------------------------------------------------------------------
# 1. npm audit
# ----------------------------------------------------------------------------
hr "1. npm audit (high+)"
if command -v pnpm >/dev/null 2>&1 && [ -f pnpm-lock.yaml ]; then
  pnpm audit --prod --audit-level=high --json > "$OUT_DIR/npm-audit.json" 2>/dev/null || true
elif [ -f package-lock.json ]; then
  npm audit --audit-level=high --json > "$OUT_DIR/npm-audit.json" 2>/dev/null || true
elif [ -f yarn.lock ]; then
  yarn npm audit --severity=high --recursive --json > "$OUT_DIR/npm-audit.json" 2>/dev/null || true
else
  echo "no lockfile found" > "$OUT_DIR/npm-audit.json"
fi
echo "  -> $OUT_DIR/npm-audit.json"

# ----------------------------------------------------------------------------
# 2. CVE version gate — Next.js + React
# ----------------------------------------------------------------------------
hr "2. CVE version gate"
: > "$OUT_DIR/cve-version-check.txt"
{
  echo "CVE-2025-29927 (Next.js middleware bypass) — patched: 14.2.25 / 15.2.3"
  echo "CVE-2025-55182 (React2Shell RCE) — patched: react 19.0.1 / 19.1.2 / 19.2.1"
  echo ""
  if [ -f package.json ]; then
    echo "--- package.json (declared) ---"
    grep -E '"(next|react|react-dom)":' package.json || echo "(no next/react declared)"
  fi
  echo ""
  for lock in package-lock.json pnpm-lock.yaml yarn.lock; do
    if [ -f "$lock" ]; then
      echo "--- $lock (resolved) ---"
      grep -E '(next|react|react-dom)@?[0-9]+\.[0-9]+\.[0-9]+' "$lock" 2>/dev/null | head -40 || true
    fi
  done
} >> "$OUT_DIR/cve-version-check.txt"
echo "  -> $OUT_DIR/cve-version-check.txt"

# ----------------------------------------------------------------------------
# 3. Rules File Backdoor — hidden Unicode in AI rules files
# ----------------------------------------------------------------------------
hr "3. Unicode scan (.cursor/rules, .cursorrules, AGENTS.md, CLAUDE.md, copilot-instructions)"
: > "$OUT_DIR/unicode-scan.txt"
UNICODE_RE='[\x{200B}-\x{200F}\x{202A}-\x{202E}\x{2060}-\x{2069}\x{FEFF}]'
SCAN_GLOBS=(
  ".cursor/rules"
  ".cursorrules"
  "AGENTS.md"
  "CLAUDE.md"
  ".github/copilot-instructions.md"
)
for target in "${SCAN_GLOBS[@]}"; do
  if [ -e "$target" ]; then
    # use rg if available — faster, fewer false positives
    if command -v rg >/dev/null 2>&1; then
      rg -n -P "$UNICODE_RE" "$target" >> "$OUT_DIR/unicode-scan.txt" 2>/dev/null || true
    else
      grep -rnP "$UNICODE_RE" "$target" >> "$OUT_DIR/unicode-scan.txt" 2>/dev/null || true
    fi
  fi
done
if [ ! -s "$OUT_DIR/unicode-scan.txt" ]; then
  echo "clean — no zero-width or bidirectional Unicode detected" > "$OUT_DIR/unicode-scan.txt"
fi
echo "  -> $OUT_DIR/unicode-scan.txt"

# ----------------------------------------------------------------------------
# 4. Pattern sweeps — known vulnerable patterns
# ----------------------------------------------------------------------------
hr "4. Vulnerable-pattern regex sweep"
: > "$OUT_DIR/grep-findings.txt"

section() { printf '\n--- %s ---\n' "$1" >> "$OUT_DIR/grep-findings.txt"; }

# prefer rg
RG_OR_GREP() {
  local pattern="$1"; shift
  local paths="$*"
  if command -v rg >/dev/null 2>&1; then
    rg -n --no-heading -g '!node_modules' -g '!.next' -g '!dist' -g '!build' "$pattern" $paths 2>/dev/null || true
  else
    grep -rnE --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' \
      --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist \
      "$pattern" $paths 2>/dev/null || true
  fi
}

section "NEXT_PUBLIC_ leaks (secrets in client bundle)"
RG_OR_GREP 'NEXT_PUBLIC_.*(sk_live_|sk_test_|SECRET|PRIVATE|TOKEN|PASSWORD)' . >> "$OUT_DIR/grep-findings.txt"

section "Hardcoded secrets (stripe/openai/aws/JWT-shaped)"
RG_OR_GREP '(sk_live_[A-Za-z0-9]{10,}|sk_test_[A-Za-z0-9]{10,}|-----BEGIN\s+(RSA|OPENSSH|PRIVATE)|AIza[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16})' . >> "$OUT_DIR/grep-findings.txt"

section "dangerouslySetInnerHTML usage (XSS vector)"
RG_OR_GREP 'dangerouslySetInnerHTML' . >> "$OUT_DIR/grep-findings.txt"

section "localStorage / sessionStorage writes"
RG_OR_GREP '(localStorage|sessionStorage)\.setItem\(' . >> "$OUT_DIR/grep-findings.txt"

section "Raw card fields (PCI DSS)"
RG_OR_GREP '(cardNumber|card_number|\bcvv\b|\bcvc\b|exp_month|exp_year)' . >> "$OUT_DIR/grep-findings.txt"

section "Stripe webhooks without constructEvent"
RG_OR_GREP 'stripe.*webhook' . >> "$OUT_DIR/grep-findings.txt"

section "JWT verify without pinned algorithm"
RG_OR_GREP 'jwt\.(verify|decode)\(' . >> "$OUT_DIR/grep-findings.txt"

section "Prototype pollution sinks"
RG_OR_GREP '(Object\.assign\(.*JSON\.parse|_\.merge\(|_\.defaultsDeep\(|_\.mergeWith\()' . >> "$OUT_DIR/grep-findings.txt"

section "SQL injection shape (template literals in db.query)"
RG_OR_GREP '(db|pool|connection|client)\.query\(\s*`' . >> "$OUT_DIR/grep-findings.txt"

section "Command injection shape (exec with template literal)"
RG_OR_GREP '(child_process\.)?exec\(\s*`' . >> "$OUT_DIR/grep-findings.txt"

section "Wildcard CORS with credentials"
RG_OR_GREP "Access-Control-Allow-Origin.*['\"]\\*['\"]" . >> "$OUT_DIR/grep-findings.txt"

section "console.log / Sentry.captureException around users/payments"
RG_OR_GREP '(console\.(log|error|info)|Sentry\.captureException|LogRocket)' \
  "app/api" "app/actions" "pages/api" "src/lib" "src/server" >> "$OUT_DIR/grep-findings.txt" 2>/dev/null || true

section "Server Actions missing auth (heuristic: 'use server' without auth() nearby)"
if command -v rg >/dev/null 2>&1; then
  rg -l "'use server'" -g '*.ts' -g '*.tsx' --iglob '!node_modules' 2>/dev/null | while read -r f; do
    if ! grep -qE '\b(auth|verifySession|getServerSession)\s*\(' "$f"; then
      echo "$f — 'use server' present but no auth()/verifySession()/getServerSession() call" >> "$OUT_DIR/grep-findings.txt"
    fi
  done
fi

echo "  -> $OUT_DIR/grep-findings.txt"

# ----------------------------------------------------------------------------
# 5. Env files review
# ----------------------------------------------------------------------------
hr "5. Environment files summary"
: > "$OUT_DIR/env-summary.txt"
for f in .env .env.local .env.production .env.development .env.example; do
  if [ -f "$f" ]; then
    echo "--- $f (keys only, values stripped) ---" >> "$OUT_DIR/env-summary.txt"
    sed -E 's/=.*/=***/' "$f" >> "$OUT_DIR/env-summary.txt"
    echo "" >> "$OUT_DIR/env-summary.txt"
  fi
done

if git ls-files 2>/dev/null | grep -qE '^\.env(\.|$)' ; then
  echo "WARNING: .env* file(s) tracked by git:" >> "$OUT_DIR/env-summary.txt"
  git ls-files | grep -E '^\.env(\.|$)' >> "$OUT_DIR/env-summary.txt"
fi
echo "  -> $OUT_DIR/env-summary.txt"

# ----------------------------------------------------------------------------
# 6. Security headers check in next.config.*
# ----------------------------------------------------------------------------
hr "6. next.config headers check"
: > "$OUT_DIR/next-config-headers.txt"
for cfg in next.config.js next.config.mjs next.config.ts; do
  if [ -f "$cfg" ]; then
    echo "--- $cfg ---" >> "$OUT_DIR/next-config-headers.txt"
    for header in 'Strict-Transport-Security' 'X-Content-Type-Options' 'X-Frame-Options' 'Referrer-Policy' 'Content-Security-Policy' 'Permissions-Policy'; do
      if grep -q "$header" "$cfg"; then
        echo "  PRESENT: $header"
      else
        echo "  MISSING: $header"
      fi
    done >> "$OUT_DIR/next-config-headers.txt"
  fi
done
echo "  -> $OUT_DIR/next-config-headers.txt"

hr "scan.sh complete — outputs in $OUT_DIR/"
exit 0
