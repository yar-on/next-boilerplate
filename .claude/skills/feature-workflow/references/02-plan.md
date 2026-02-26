---
name: plan-phases
description: Breaks an enhanced spec into ordered, independently testable implementation phases. Each phase defines files, acceptance criteria, and required tests.
---

# 02 - Plan Implementation Phases

Break the enhanced spec into ordered, testable phases. Each phase delivers a working increment.

## Input
Approved enhanced spec from step 01.

## Process

1. **Analyze the spec** — Identify components, hooks, utils, types, and data flows.

2. **Define phases** — Each phase must:
   - Be independently testable (has clear "done" criteria)
   - Build on previous phases (no forward dependencies)
   - Be small (1-3 files created/modified)
   - Have a descriptive name for the commit message

3. **For each phase, document**:
   - **Goal**: What this phase achieves
   - **Files**: Create/modify list with full paths
   - **Acceptance criteria**: Subset from enhanced spec this phase satisfies
   - **Tests needed**: Unit, component, E2E, or Playwright tests for this phase
   - **Dependencies**: Packages to install, files from prior phases

4. **Define test strategy per phase**:
   - Unit tests for utils/hooks/pure logic
   - Component tests (React Testing Library) for UI behavior
   - E2E/Playwright tests for critical user flows (only where needed — not every phase)

## Output Format

```
## Phase N: [Name]
Goal: ...
Files: ...
Criteria: ...
Tests: ...
```

## Rules
- Prefer more smaller phases over fewer large ones.
- Phase 1 should always be foundational (types, utils, base components).
- Final phase should include integration and any E2E tests.
- Do NOT implement anything here — planning only.
