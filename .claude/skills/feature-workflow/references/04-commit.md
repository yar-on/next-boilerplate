---
name: commit-phase
description: Commits a reviewed and tested phase using conventional commit format. One commit per phase, never commits failing tests.
---

# 04 - Commit Phase

After phase passes review and all tests pass, commit changes.

## Process

1. **Stage files** — Only files from the current phase:
   ```bash
   git add [files created/modified in this phase]
   ```

2. **Commit**:
   ```bash
   git commit -m "<type>(<scope>): <description>"
   ```

## Conventional Commit Types

- `feat(scope)` — New feature or component
- `test(scope)` — Adding or updating tests
- `refactor(scope)` — Restructure, no behavior change
- `fix(scope)` — Bug fix
- `chore(scope)` — Config, deps, tooling

**Scope** = feature/component in kebab-case.
**Description** = imperative mood, lowercase, no period, ≤72 chars.

## Rules
- One commit per phase. Never batch multiple phases.
- Never commit failing tests.
- If phase has both implementation and tests, use `feat`.
- Never push to remote — user decides when.
