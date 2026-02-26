---
name: review-phase
description: Reviews implemented phase code by delegating to code-reviewer, security-reviewer, qa-reviewer, and ui-ux-reviewer agents. Must pass before committing.
---

# 03 - Review Phase Code

After implementing a phase, review before committing.

## Execution Strategy

**Option A — Subagent via Task tool (preferred):**
Spawn these agents in parallel with the list of files changed in this phase:

| Agent | Focus |
|-------|-------|
| `code-reviewer` | Code quality, TypeScript, patterns, readability, project conventions |
| `security-reviewer` | Secrets, input validation, XSS, server action safety |
| `qa-reviewer` | Test coverage gaps, missing edge cases, test quality |
| `ui-ux-reviewer` | Visual quality, responsiveness, accessibility, UX (uses Playwright MCP) |

Task prompt template:
```
Review files changed in this phase: [file list]
Phase goal: [goal from plan]
Acceptance criteria: [criteria from plan]
Report PASS or FAIL with specific issues per area.
```

**Option B — Inline (fallback if Task tool unavailable):**
Walk through each agent's focus area sequentially using their checklist approach.

## After Reviews

1. **Run tests**:
   ```bash
   npm run test -- --passWithNoTests [relevant test files]
   npx playwright test [relevant spec file]  # if E2E specified in plan
   ```
2. Fix any test failures before proceeding.

## Decision

- **All agents PASS + tests pass** → Proceed to commit
- **Any FAIL** → Fix issues, re-review (max 3 cycles)
- **3 cycles exhausted** → Escalate to user with detailed report
