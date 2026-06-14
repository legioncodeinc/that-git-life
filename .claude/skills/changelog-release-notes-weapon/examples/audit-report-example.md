# Example: Changelog Audit Report

> Demonstrates a filled-in audit report for a fictional product "Taskr" (a task management SaaS).
> Guide references: `guides/05-audit-playbook.md`

---

## Audit: Taskr Changelog

**Audited by:** changelog-release-notes-guardian  
**Date:** 2026-05-20  
**Changelog URL:** taskr.app/changelog  
**Entries reviewed:** 8 most recent entries (covering 2025-09 to 2026-04)  
**Time span:** ~7 months

---

## Scores

| Dimension | Score | Notes |
|---|---|---|
| Cadence | 3/5 | 8 entries over 7 months; 2 gaps of 6+ weeks with no entry despite visible product changes |
| User-centric language | 2/5 | Approximately 60% of bullets read as raw commit messages or internal ticket references |
| Tone consistency | 4/5 | Generally professional tone; one entry (2026-01-14) was notably more casual |
| Distribution coverage | 2/5 | In-app widget present; no email digest; no community posts found |
| Honest scope | 1/5 | "Smart inbox" was announced at their 2025 conference and has appeared in zero changelogs despite 7 months of releases |

**Total: 12/25** — Below healthy threshold (18). Priority improvements needed.

---

## Findings by dimension

### Cadence (3/5)

Two gaps:
- 2025-09-12 to 2025-11-08: 8 weeks with no entry. Product was shipping (checked GitHub releases).
- 2025-12-20 to 2026-02-01: 6 weeks over the holidays. Partially expected, but a single "here's what shipped in January" entry would have covered it.

**Recommendation:** Nominate one person per sprint to own the changelog entry before the sprint closes. Treat it as a done criterion alongside tests and deployment.

### User-centric language (2/5)

Sample bullets from the most recent entry:

- "Fixed race condition in task assignment API" — ❌ Implementation. Rewrite: "Fixed a bug where assigning tasks to a teammate sometimes didn't save."
- "Migrated to React 19" — ❌ Invisible. Omit unless there is a user-facing improvement to name (e.g., "Faster page transitions" if React 19 brought a visible speedup).
- "Add keyboard shortcut for quick-add task (Cmd+K)" — ✅ User-centric. Good.
- "Resolve issue #3241 regarding filter persistence" — ❌ Ticket reference. Rewrite: "Fixed a bug where your saved filters were reset on page refresh."

**Recommendation:** Apply the user-centric rewrite from `guides/03-copy-craft.md` to the backlog of existing entries, and add a review step to the changelog process.

### Tone consistency (4/5)

Minor: 2026-01-14 entry was substantially more casual than surrounding entries ("Hey! We snuck in a few fixes before the holidays"). This is not a problem if it reflects the team's actual voice, but it felt like an anomaly. Clarify with the team whether the product voice is casual or professional.

### Distribution coverage (2/5)

The widget is present (Headway). No email subscriber signup visible on the changelog page. No #changelog or #product-updates mention found in the public Discord.

**Recommendation:**
1. Enable the Headway email subscriber feature — add the signup widget to the changelog page footer.
2. Post one-liner links in the Discord #announcements channel for each new entry.

### Honest scope (1/5)

"Smart inbox" was featured in a conference keynote and is the most common support ticket topic ("when is Smart inbox coming?"). It has appeared in zero of the 8 reviewed changelog entries.

**Recommendation:** Add the following note to the next changelog entry immediately:

> "Smart inbox: we are actively working on this and expect to ship an early version in Q3 2026. We know it is the most-requested feature — thank you for your patience."

Then include a brief update in every subsequent entry until it ships.

---

## Priority action plan

1. **Immediate:** Add the Smart inbox honest scope note to the next entry.
2. **This sprint:** Rewrite the 3 most recent entries using `guides/03-copy-craft.md`.
3. **This month:** Enable Headway email subscriptions + Discord announcement habit.
4. **Next quarter:** Add changelog entry as a sprint done criterion.
