# 08 — Companion Agent Handoff

Once the seven-artifact folder is populated, this Angel's job is done.
The companion Angel — `ux-ui-guardian` — takes ownership and enforces
the system over time.

## The clean-handoff principle

- `design-system-guardian` **creates**. It bootstraps from scratch for
  new products.
- `ux-ui-guardian` **maintains**. It reviews PRs, flags drift, authors
  incremental updates, archives superseded sections.

The Angels are paired but strictly separated. After bootstrap, the
builder never looks at the system again unless a major overhaul is
commissioned.

## Handoff mechanics

### 1. Populate the README with ownership

`README.md` names the owning Angel explicitly:

```markdown
## Change control

The [`ux-ui-guardian`](../../../.cursor/agents/ux-ui-guardian.md) subagent
owns this folder. A PR that changes UI in a way not already described
here must either (a) land an update to this folder as part of the same
PR, or (b) be rejected by `quality-guardian` with a pointer back here.
```

This paragraph is what keeps the system from drifting.

### 2. Status table

Include a status table so future readers can see what's authored, what
was aligned, and when.

```markdown
| Item               | Status                          |
|--------------------|---------------------------------|
| Design brief       | Authored YYYY-MM-DD             |
| Tokens / CSS layer | Authored YYYY-MM-DD             |
| Component briefs   | Authored YYYY-MM-DD             |
| Screen briefs      | Authored YYYY-MM-DD             |
| HTML examples      | Authored YYYY-MM-DD             |
| Code alignment     | Pending / In progress / Aligned |
```

### 3. Commit message convention

Both Angels inherit:
`<angel-name>: <section>: <change>`

So the git log reads:
- `design-system-guardian: initial: bootstrap ux-ui folder`
- `ux-ui-guardian: cards-and-surfaces: add subtle hover lift`
- `ux-ui-guardian: tokens: add --dur-xslow for modal entry`

### 4. Optional — stub the companion Angel

If the consumer product doesn't yet have `ux-ui-guardian`, emit a stub
at `.cursor/agents/ux-ui-guardian.md` with:

- A pointer to the new folder.
- The list of guardrails (from `00-principles.md`).
- The change-control paragraph.

Leave the stub at "draft" status; `angel-creator` finishes it in Phase
3 of the Legendary Angel Factory pipeline.

## What this Angel does NOT do after handoff

- It does not review PRs.
- It does not approve design changes.
- It does not enforce tokens in component code.
- It does not author PRDs that reference the system.
- It does not touch the system again unless commissioned for a major
  overhaul (e.g., rebrand, aesthetic shift, v2).

## Triggering this Angel again (rare)

Re-invoke `design-system-guardian` only when:

1. **Major rebrand.** The product is changing its aesthetic wholesale
   (new palette, new typography, new depth language). Treat as a fresh
   bootstrap; new timestamps, new principles section.
2. **Product split.** One product spins off into two, and the second
   needs its own design system.
3. **Platform expansion.** The product adds a surface (e.g., adds an
   iOS native app) that needs its own dedicated spec layer.

For anything less than that — a new component, a new screen, a token
addition, a dark-mode rollout — `ux-ui-guardian` handles it.

## The clean-ownership test

After handoff, if a reader cannot answer the question "who owns this
folder?" in under 10 seconds, the README is broken. The answer should
be unmissable in the first paragraph of `README.md` and in the
`## Change control` section.
