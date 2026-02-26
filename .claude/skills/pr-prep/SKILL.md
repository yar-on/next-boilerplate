---
name: pr-prep
description: Run the full pre-PR quality gate — format, lint, type-check, and tests — then summarize what needs fixing
---

# PR Prep

Run all quality checks before creating a pull request. Identifies every issue that CI would catch so you can fix them before pushing.

## Instructions

### 1. Check git status first

```bash
git status
git diff --stat
```

Show the user what files have changed so they know the scope of the PR.

### 2. Run all checks in sequence

Run each command and capture the result. Do NOT stop on first failure — run all checks to give a complete picture.

**Step 1 — Format check:**
```bash
npm run format:check
```

**Step 2 — Lint:**
```bash
npm run lint
```

**Step 3 — TypeScript type check:**
```bash
npm run type-check
```

**Step 4 — Unit tests:**
```bash
npm run test:jest
```

**Step 5 — Build check** (only if the user explicitly asked for `full` or `build`):
```bash
npm run build
```

**Step 6 — Skip tests** (skip Step 4 if the user explicitly asked to `skip tests`).

### 3. Summarize results

Present a clear pass/fail table:

```
## PR Readiness Report

| Check          | Status    | Issues                      |
|----------------|-----------|-----------------------------|
| Format         | ✅ Pass    | —                           |
| Lint           | ❌ Fail    | 3 errors in src/...         |
| Type check     | ❌ Fail    | 2 errors                    |
| Unit tests     | ✅ Pass    | 42 passed                   |
| Build          | ⏭ Skipped | —                           |
```

### 4. Fix automatically fixable issues

If format or lint issues are found, offer to fix them:

```bash
# Fix formatting
npm run format

# Fix lint auto-fixable errors
npm run lint:fix
```

Ask before running these — do not auto-apply without confirmation.

### 5. Guide manual fixes

For type errors and test failures that cannot be auto-fixed:
- Show the exact error messages
- Point to the specific files and line numbers
- Suggest likely causes based on the error

### 6. Re-run after fixes

After any fixes are applied, re-run only the checks that previously failed to confirm they pass.

### 7. Confirm PR readiness

Only declare the branch "PR-ready" when ALL checks pass. If anything still fails, list the remaining blockers clearly.

## Modifiers

The user may specify modifiers in their message:
- `full` or `build` → also run `npm run build`
- `skip tests` → omit `test:jest` (useful when tests are slow and already known-good)
- No modifier → run format + lint + type-check + tests

## Rules

- NEVER push or create a PR — only run checks and report
- Run ALL checks even if early ones fail — give the complete picture upfront
- Do NOT auto-fix without asking the user first
- Show exact file:line references for every error
- A PR is only "ready" when format + lint + type-check + tests all pass
