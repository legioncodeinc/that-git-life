# Worked Example — Low: Verbose Error Response (No Sensitive Leakage)

Demonstrates: `guides/03-owasp-top-10.md` B10.1 · `guides/01-scan-procedure.md` Step 6 (error disclosure sub-check) · Low-severity "document only" rule.

---

## Scenario

A utility endpoint `app/api/healthz/details/route.ts` returns an error payload that includes the JavaScript error `.message` (but not the stack, not DB queries, and no user data). It's used by an internal monitoring dashboard.

## Code pattern observed

```ts
export async function GET() {
  try {
    const ok = await checkDatabase();
    return Response.json({ ok });
  } catch (err) {
    return Response.json({ ok: false, error: (err as Error).message });
  }
}
```

## Finding text (report-ready)

> - [ ] **Information Disclosure — Error message echoed to response** `app/api/healthz/details/route.ts:6` — Endpoint returns `err.message` directly to the client. The message may include library-internal detail (pg error codes, DNS resolution failures) which slightly aids reconnaissance. No stack trace, no user data, no secrets.

## Severity rationale

**Low.** Per the rubric in `guides/00-principles.md`:

- Not financial or PII → the never-downgrade rule does not force High.
- Not an auth bypass, not an injection, not a secret.
- The leaked information is error messages, not stack frames or structured data.
- Typical hardening / hygiene gap.

**Document only.** Don't spend session time fixing this — the minimal-blast-radius rule means Low findings should accumulate in a follow-up backlog rather than churn the current diff.

## What goes in the audit report

Under **Low Findings (documentation only):**

- [ ] **Information Disclosure — Error message echoed** `app/api/healthz/details/route.ts:6` — Returns `err.message` in response body. Recommend: log server-side with `console.error`, return generic `{ ok: false }` to clients.

## Why this example matters

The Weapon must train the Angel's judgment that NOT fixing is sometimes the right answer. Low findings clutter diffs, and a scan that auto-fixes everything creates review fatigue and makes it harder for the reviewer to see the Critical/High fixes that matter. The report captures the finding so it's not lost, but the session stays disciplined.

Counter-case: if the endpoint were returning DB error messages that contained row data, SQL fragments, or file paths, it would escalate to Medium or High. The severity is in the content of the leak, not the pattern of the code.
