# Example: Worktree Parallel Features Workflow

Two features in progress simultaneously without stash context-switch overhead.

---

## Situation

A developer is working on `feature/user-profile` and receives a high-priority request to also prototype `feature/stripe-checkout`. Both branches need to be active and ready to demo at any time. Stashing and switching branches every few hours is creating friction.

---

## Setup: add a second worktree

```bash
# Current state: in the main repo directory, on feature/user-profile
ls .git/  # the repo's .git is here

# Add a second worktree for the Stripe feature:
git worktree add -b feature/stripe-checkout ../repo-stripe main

# List worktrees:
git worktree list
# /home/dev/repo             abc1234 [feature/user-profile]
# /home/dev/repo-stripe      def5678 [feature/stripe-checkout]
```

---

## Day-to-day workflow

```bash
# Work on user profile in the original directory:
cd ~/repo
# ... edit files, test, commit as normal ...
git add -p
git commit -m "feat(profile): add avatar upload"

# Switch to Stripe feature by changing directory (no stash needed):
cd ~/repo-stripe
# The Stripe feature branch is exactly as you left it
# ... edit files, test, commit ...
git add src/checkout/
git commit -m "feat(checkout): add Stripe Payment Element"

# Push both branches:
git push origin feature/user-profile   # from ~/repo
git push origin feature/stripe-checkout # from ~/repo-stripe
```

---

## Fetching remote updates in both worktrees

Both worktrees share the same object store. Fetching in one updates objects for both:

```bash
# Fetch from either worktree:
cd ~/repo
git fetch origin

# Now in the other worktree, the new objects are available:
cd ~/repo-stripe
git rebase origin/main   # rebases onto the newly fetched main
```

---

## Running different dev servers

Each worktree can have its own dev server on a different port:

```bash
# Terminal 1 — user profile feature:
cd ~/repo
npm run dev -- --port 3000

# Terminal 2 — Stripe checkout feature:
cd ~/repo-stripe
npm run dev -- --port 3001
```

Both servers run simultaneously. Switching between them is a tab switch, not a stash + branch switch + `npm run dev` cycle.

---

## Demo preparation

Before a demo, ensure each feature is at its best state without cross-contamination:

```bash
# User profile demo:
cd ~/repo
git status  # confirm clean
npm run build

# Stripe checkout demo:
cd ~/repo-stripe
git status  # confirm clean
npm run build
```

---

## Cleanup when a feature is merged

```bash
# After feature/stripe-checkout is merged via PR:
cd ~/repo
git fetch origin
git branch -d feature/stripe-checkout  # delete local branch

# Remove the worktree:
git worktree remove ../repo-stripe

# Confirm:
git worktree list
# /home/dev/repo  abc1234 [feature/user-profile]
```

---

## What this avoids

- `git stash` / `git stash pop` cycles (stash is error-prone; conflicts can occur on pop)
- Waiting for `npm install` after branch switches (if `node_modules` differs between branches)
- Accidentally committing to the wrong branch after context-switching
- Losing unsaved work because you forgot to stash
