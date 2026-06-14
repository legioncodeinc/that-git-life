# justfile Template

Copy this to the repo root as `justfile` and customize the recipes.

```makefile
# justfile — {project-name}
# Run `just` with no arguments to see available recipes.

# ── Configuration ────────────────────────────────────────────────────────────
# Use bash with safety flags for all recipes
set shell := ["bash", "-euo", "pipefail", "-c"]

# Automatically load .env if present
set dotenv-load

# ── Default ──────────────────────────────────────────────────────────────────
## Show available recipes
default:
    @just --list

# ── Setup ────────────────────────────────────────────────────────────────────
## Install dependencies
install:
    # TODO: replace with your package manager
    npm ci

## Full environment setup (run once on new machine)
setup: install
    @echo "Setup complete"

# ── Development ──────────────────────────────────────────────────────────────
## Start development server
dev:
    npm run dev

## Watch and rerun tests on file changes
test-watch:
    npm run test:watch

# ── Build ────────────────────────────────────────────────────────────────────
## Build for a target environment (default: development)
build env="development":
    npm run build:{{env}}

# ── Test ─────────────────────────────────────────────────────────────────────
## Run tests (pass extra args: just test -- --reporter=verbose)
test *args:
    npm test -- {{args}}

# ── Lint ─────────────────────────────────────────────────────────────────────
## Lint TypeScript + shell scripts
lint:
    npm run lint
    shellcheck scripts/*.sh

## Auto-fix lint issues
lint-fix:
    npm run lint:fix

# ── Clean ────────────────────────────────────────────────────────────────────
## Remove build artifacts
clean:
    rm -rf dist .next node_modules

# ── CI ───────────────────────────────────────────────────────────────────────
## Full CI run: lint + test + production build
ci: lint test (build "production")

# ── Deploy ───────────────────────────────────────────────────────────────────
## Deploy to a named environment (just deploy staging)
deploy target:
    @echo "Deploying to {{target}}..."
    ./scripts/deploy.sh {{target}}
```

## Key just patterns to remember

- `@` prefix silences command echo for a recipe line.
- `*args` captures zero or more trailing arguments.
- `(recipe "arg")` calls another recipe as a dependency with an argument.
- `just -n deploy staging` does a dry-run (shows commands, does not execute).
- `just --choose` drops into fzf to select a recipe interactively.
- `just --justfile /path/to/justfile recipe` runs from a non-default location.
