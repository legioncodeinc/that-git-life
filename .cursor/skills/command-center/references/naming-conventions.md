# Naming Conventions for Bees and Stingers

The Bee/Stinger pair is the atomic unit of the roster. Their names are how the primary Cursor agent, the beekeeper-suit routing skill, and the rest of the pipeline locate them. Bad names cause silent failures (the router can't find the Bee) or drift (two Bees with overlapping scope). Take naming seriously.

---

## Bee (subagent) names

**Format rules:**

- All lowercase.
- Hyphens only as separators. No spaces, underscores, or camelCase.
- Must end in `-worker-bee`.
- Between 2 and 4 words before the `-worker-bee` suffix. `security-worker-bee` (good). `ultra-advanced-cloud-native-kubernetes-worker-bee` (too long — pick the domain, not the stack).

**Semantic rules:**

- Name the Bee after the **domain** it owns, not the action it performs. `database-worker-bee`, not `query-writer-worker-bee`.
- Avoid adjectives that don't narrow the domain. `fast-security-worker-bee` vs. `security-worker-bee` — cut the "fast".
- If two candidate Bees would legitimately overlap, pick the narrower scope for each and let beekeeper-suit route based on the task.

**File location:**

```
ai-tools/agents/<bee-name>.md
```

Example: `ai-tools/agents/security-worker-bee.md`.

---

## Stinger (skill) names

**Format rules:**

- All lowercase.
- Hyphens only.
- Must end in `-stinger`.
- Mirror the Bee name: `security-worker-bee` → `security-stinger`. The suffix is the only differentiator.

**File location:**

```
ai-tools/skills/<stinger-name>/SKILL.md
```

Example: `ai-tools/skills/security-stinger/SKILL.md`.

---

## Command Brief file name

The Command Brief for each Bee/Stinger pair lives in `ai-tools/command-briefs/` at the repo root and follows this format:

```
ai-tools/command-briefs/<bee-name>-command-brief.md
```

Example: `ai-tools/command-briefs/security-worker-bee-command-brief.md`. The brief uses the Bee name (with the `-worker-bee` suffix) because the brief is primarily about the Bee; the Stinger inherits from it.

---

## Collision and edge cases

- **Existing name.** Before finalizing, check `ai-tools/agents/` for the proposed Bee name and `ai-tools/skills/` for the proposed Stinger name. If either exists, either pick a different name or confirm with the user that you're intentionally overwriting.
- **Near-duplicates.** `security-worker-bee` and `security-audit-worker-bee` are too close. Force a disambiguation: perhaps `security-worker-bee` (broad scope) and `pentest-worker-bee` (narrower). Or collapse to one.
- **Legacy names.** If porting from another system, rename to fit the convention rather than preserving the old name. Consistency matters more than history here.

---

## Examples of good and bad names

| Bee proposal | Verdict | Reason |
| --- | --- | --- |
| `security-worker-bee` | Good | Domain-scoped, correct suffix. |
| `ux-ui-worker-bee` | Good | Two-word domain is fine. |
| `fix-my-bugs-agent` | Bad | No `-worker-bee` suffix, vague action-based name. |
| `Security Worker Bee` | Bad | Capitalization and space. |
| `security_worker-bee` | Bad | Underscore. |
| `the-security-worker-bee` | Bad | Leading article adds no information. |
| `database-migration-worker-bee` | OK | Acceptable if the Bee is specifically for migrations; otherwise prefer `database-worker-bee`. |

If in doubt, propose two or three names to the user and let them choose — the collaborative act of naming often clarifies scope on its own.
