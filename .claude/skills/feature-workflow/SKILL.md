---
name: feature-workflow
description: Orchestrates phased feature development - enhance request → plan phases → implement → review → commit. Use when building any new feature or significant change.
---

# Feature Workflow Orchestrator

Phased, test-driven pipeline. Each phase is independently testable and committed.

## Workflow

1. **Enhance** → Follow `references/01-enhance.md` (uses `prompt-enhancer` agent)
2. **Plan** → Follow `references/02-plan.md` (uses `nextjs-planner` agent)
3. **Per phase in the plan**:
   a. **Implement** → Code the phase (uses `nextjs-developer` or `nextjs-plan-developer` agent)
   b. **Review** → Follow `references/03-review.md` (delegates to `code-reviewer`, `security-reviewer`, `qa-reviewer`, `ui-ux-reviewer` agents via Task tool)
   c. **Commit** → Follow `references/04-commit.md`
4. **Finalize** → Summary of all phases

## Rules

- Never skip enhance. Ambiguous requests cause rework.
- Never skip review. Every phase gets reviewed before commit.
- If review fails, fix and re-review (max 3 cycles). Escalate to user if stuck.
- Keep phases small enough to be independently testable.
- Prefer `Task` tool to delegate reviews to agents in parallel; fall back to inline if unavailable.
- Never push to remote — user decides when.
