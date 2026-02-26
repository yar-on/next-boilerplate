---
description: Multi-agent client feature development with test-driven verification loops (project)
---

# X-Client-Feature: Test-Driven Client Feature Pipeline

You are orchestrating a streamlined, test-driven workflow for implementing fully functional client-facing features. This workflow prioritizes:

1. **Explicit acceptance criteria** verified through automated tests
2. **Test-driven verification** with actual test execution
3. **Self-correcting loops** that fix issues rather than just report them
4. **Client-first focus** optimized for UI/UX-centric features

## User Request

$ARGUMENTS

---

## Pre-Flight Validation

**CRITICAL - Check BEFORE any work:**

1. **Validate User Input**: Check if `$ARGUMENTS` contains actual feature request text
   - If `$ARGUMENTS` is empty, blank, or missing:
     ```
     ERROR: No feature request provided

     Usage: /x-client-feature <your feature request>

     Examples:
     /x-client-feature Add a dark mode toggle with system preference detection
     /x-client-feature Create a search bar with autocomplete and keyboard navigation
     /x-client-feature Implement a notification toast system with animations

     Please provide a feature request and try again.
     ```
     **STOP EXECUTION** - Do not proceed

   - If `$ARGUMENTS` contains valid text: Proceed to "Workflow Initialization"

---

## Workflow Initialization

**FIRST ACTION - After validation passes:**

1. **Generate Feature Slug**: Create kebab-case slug (e.g., "dark mode toggle" -> "dark-mode-toggle")

2. **Create Debug Directory**:
   ```
   .claude-debug/<feature-slug>/
   ├── artifacts/
   ├── iterations/
   └── final/
   ```

3. **Set Workflow Variables**:
   ```
   FEATURE_SLUG = <kebab-case feature name>
   DEBUG_DIR = .claude-debug/${FEATURE_SLUG}
   ARTIFACTS_DIR = ${DEBUG_DIR}/artifacts
   ITERATION = 0
   ```

4. **Ensure .gitignore includes .claude-debug/**:
   ```bash
   if ! grep -q "^\.claude-debug/" .gitignore 2>/dev/null; then
     echo "" >> .gitignore
     echo "# Claude Code debug artifacts" >> .gitignore
     echo ".claude-debug/" >> .gitignore
   fi
   ```

5. **Display Initialization**:
   ```
   CLIENT-FEATURE WORKFLOW INITIATED
   Feature: [feature name]
   Debug Directory: .claude-debug/<feature-slug>/

   Starting Phase 1: Feature Analysis...
   ```

---

## Workflow Overview

This workflow uses a **hybrid agent architecture**:

**Core Agents** (always present):
1. **Feature Architect** - Defines requirements and acceptance criteria
2. **UI Engineer** - Implements client components and interactions
3. **Test Engineer** - Writes and maintains tests at all layers
4. **Reviewer** - Performs comprehensive self-review

**Dynamic Agents** (spawned when complexity demands):
- Accessibility Specialist - For complex a11y requirements
- State Management Specialist - For complex state flows
- Performance Specialist - For animation/rendering optimization
- Edge Case Handler - For complex validation/error scenarios

---

## PHASE 1: FEATURE ANALYSIS

### Step 1.1: Requirements Clarification

**Agent Role**: `prompt-enhancer`

**Task**: Transform the raw feature request into detailed specifications with explicit acceptance criteria.

**Context to Provide**:
```
Feature Request: $ARGUMENTS
Output File: ${ARTIFACTS_DIR}/requirements.md

This is a CLIENT-FACING feature. Focus on:
- User interactions and behaviors
- UI states (loading, success, error, empty)
- Responsiveness across viewports
- Accessibility requirements (keyboard, screen reader)
- Animation/transition expectations
- Edge cases in user interaction

Generate comprehensive requirements including:
1. Feature Overview - What this feature does and why
2. User Stories - As a [user], I want [action], so that [benefit]
3. UI Components - What visual elements are needed
4. Interaction Patterns - How users interact with the feature
5. State Management - What states exist and how they transition
6. Acceptance Criteria - Specific, testable conditions for "done"
7. Edge Cases - Boundary conditions and error scenarios
8. Accessibility Requirements - WCAG 2.1 AA compliance needs

Format acceptance criteria as testable assertions:
- GIVEN [context], WHEN [action], THEN [expected result]
```

**Status Update**: Display "Phase 1.1 Complete: Requirements Defined"

---

### Step 1.2: Test Strategy Definition

**Task**: Define the testing approach based on feature complexity.

**Instructions**:
Read `${ARTIFACTS_DIR}/requirements.md` and create `${ARTIFACTS_DIR}/test-strategy.md` containing:

1. **Test Layers Needed**:
   - Unit Tests: Which utilities, hooks, or logic need isolated testing?
   - Component Tests: Which components need behavioral testing?
   - Integration Tests: Which component combinations need testing?
   - E2E Tests: Which user flows need full browser testing?

2. **Test Priorities** (P0 = must have, P1 = should have, P2 = nice to have):
   - P0: Core acceptance criteria
   - P1: Error handling and edge cases
   - P2: Performance and accessibility validation

3. **Test File Mapping**:
   ```
   Component/Feature -> Test File -> Test Type -> Priority
   ```

4. **Mocking Strategy**:
   - What external dependencies need mocking?
   - What Server Actions need mocking for client tests?

**Status Update**: Display "Phase 1.2 Complete: Test Strategy Defined"

---

### Step 1.3: Design Specification

**Task**: Create a technical design for the feature implementation.

**Instructions**:
Create `${ARTIFACTS_DIR}/design.md` containing:

1. **Component Architecture**:
   ```
   - Component tree/hierarchy
   - Server vs Client component decisions
   - Props interfaces for each component
   - State management approach
   ```

2. **Data Flow**:
   ```
   - How data enters the component tree
   - State updates and event handling
   - Server Action interactions (if any)
   ```

3. **File Structure**:
   ```
   - New files to create (with full paths)
   - Existing files to modify
   - Test file locations
   ```

4. **Dependencies**:
   ```
   - External packages needed
   - Internal utilities/hooks to use
   - Shared components to leverage
   ```

5. **Implementation Order**:
   ```
   - What to build first
   - Dependencies between tasks
   - Parallelizable work
   ```

**Status Update**: Display "Phase 1.3 Complete: Design Specified"

**Phase 1 Summary**: Display feature overview, component count, and test count expected.

---

## PHASE 2: IMPLEMENTATION

### Step 2.1: Feature Implementation

**Agent Role**: `nextjs-developer`

**Task**: Implement the complete feature according to the design specification.

**Context to Provide**:
```
Design Specification: ${ARTIFACTS_DIR}/design.md
Requirements: ${ARTIFACTS_DIR}/requirements.md

Implement the client feature following these guidelines:

1. **Component Architecture**:
   - Use Server Components by default (no directive)
   - Add 'use client' only when needed for: events, state, effects, browser APIs
   - Follow composition patterns (children, render props when needed)

2. **Code Quality**:
   - TypeScript strict mode with proper types
   - Props types with Type suffix (ButtonPropsType)
   - Clean, readable code with self-documenting names
   - No unused imports or variables

3. **Styling & Responsiveness**:
   - Mobile-first responsive design
   - Use existing design system/tokens
   - Proper spacing and typography

4. **Accessibility**:
   - Semantic HTML elements
   - ARIA labels where needed
   - Keyboard navigation support
   - Focus management

5. **Error Handling**:
   - Graceful degradation
   - User-friendly error messages
   - Loading states

6. **File Naming**:
   - Components: kebab-case.components.tsx
   - Hooks: use-kebab-case.hooks.ts
   - Utils: kebab-case.utils.ts
   - Types: kebab-case.types.ts

DO NOT write tests in this step - focus only on implementation.
```

**Status Update**: Display "Phase 2.1 Complete: Feature Implemented"
**File Summary**: List all files created/modified.

---

## PHASE 3: TESTING

### Step 3.1: Unit & Component Tests

**Agent Role**: `nextjs-developer` (with test context)

**Task**: Write comprehensive unit and component tests.

**Context to Provide**:
```
Test Strategy: ${ARTIFACTS_DIR}/test-strategy.md
Requirements: ${ARTIFACTS_DIR}/requirements.md

Write tests for the implemented feature:

1. **Unit Tests** (for utilities, hooks, pure logic):
   - File pattern: *.test.ts in __tests__/ directories
   - Test all exported functions
   - Cover edge cases and error scenarios
   - Use descriptive test names

2. **Component Tests** (for React components):
   - File pattern: *.test.tsx in __tests__/ directories
   - Test rendering with different props
   - Test user interactions (click, type, keyboard)
   - Test state changes and side effects
   - Mock Server Actions and external dependencies

3. **Test Structure**:
   ```typescript
   describe('ComponentName', () => {
     describe('when [condition]', () => {
       it('should [expected behavior]', () => {
         // Arrange, Act, Assert
       });
     });
   });
   ```

4. **Coverage Requirements**:
   - All P0 acceptance criteria must be tested
   - All error handling paths must be tested
   - Edge cases from requirements must be tested

Save test files following project conventions.
```

**Status Update**: Display "Phase 3.1 Complete: Unit/Component Tests Written"

---

### Step 3.2: E2E Tests

**Agent Role**: `nextjs-developer` (with Playwright context)

**Task**: Write E2E tests for critical user flows.

**Context to Provide**:
```
Test Strategy: ${ARTIFACTS_DIR}/test-strategy.md
Requirements: ${ARTIFACTS_DIR}/requirements.md

Write Playwright E2E tests for user flows:

1. **Test File Location**: e2e/<feature-slug>.spec.ts

2. **Test Structure**:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Feature Name', () => {
     test('should [user flow description]', async ({ page }) => {
       // Navigate
       await page.goto('/path');

       // Interact
       await page.click('[data-testid="element"]');

       // Assert
       await expect(page.locator('...')).toBeVisible();
     });
   });
   ```

3. **Coverage**:
   - Happy path for each user story
   - Error scenarios (validation, network failure)
   - Responsive behavior (test on mobile viewport)
   - Keyboard navigation for accessibility

4. **Selectors**:
   - Prefer data-testid attributes
   - Use semantic selectors (role, label) for a11y
   - Avoid brittle CSS selectors
```

**Status Update**: Display "Phase 3.2 Complete: E2E Tests Written"

---

### Step 3.3: Test Execution

**Task**: Run all tests and capture results.

**Instructions**:

1. **Run Unit/Component Tests**:
   ```bash
   npm run test -- --coverage --passWithNoTests 2>&1 | tee ${ARTIFACTS_DIR}/test-results-unit.txt
   ```

2. **Run E2E Tests** (if applicable):
   ```bash
   npm run test:e2e -- --reporter=list 2>&1 | tee ${ARTIFACTS_DIR}/test-results-e2e.txt
   ```

3. **Capture Results**:
   - Parse test output for failures
   - Document any failing tests in `${ARTIFACTS_DIR}/test-failures.md`

4. **Decision Point**:
   - If ALL tests pass: Proceed to Phase 4
   - If ANY tests fail: Enter Test Fix Loop

---

### Test Fix Loop

**TRIGGER**: Any test failure in Step 3.3

**Agent Role**: `nextjs-developer`

**Task**: Fix failing tests by correcting implementation or test code.

**Process**:
1. Read `${ARTIFACTS_DIR}/test-failures.md`
2. For each failure, determine if issue is in:
   - Implementation code (fix the component/logic)
   - Test code (fix the test assertion/setup)
3. Apply fixes
4. Re-run tests
5. Repeat until all tests pass

**Max Iterations**: 5 (if exceeded, escalate to user with detailed failure report)

**Status Update**: Display "Test Fix Loop Iteration N: [X] tests remaining"

When all tests pass: Display "Phase 3 Complete: All Tests Passing"

---

## PHASE 4: VERIFICATION LOOP

This phase runs a self-review cycle. All reviewers must approve for completion.

### Verification Cycle Initialization

```
VERIFICATION_CYCLE = 1
MAX_CYCLES = 3
```

Display: "Verification Cycle #${VERIFICATION_CYCLE} Starting..."

---

### Step 4.1: Code Quality Review

**Agent Role**: `code-reviewer` (or inline review)

**Task**: Review implementation for code quality and best practices.

**Review Checklist**:
- Clean, readable code
- Proper TypeScript usage
- No anti-patterns or code smells
- Follows project conventions (CLAUDE.md)
- No security vulnerabilities
- Proper error handling
- No unused code or imports

**Output**:
- If PASS: Display "Code Review: APPROVED"
- If FAIL: Document issues in `${ARTIFACTS_DIR}/review-issues.md`

---

### Step 4.2: UI/UX Review

**Agent Role**: `ui-ux-reviewer`

**Task**: Verify UI/UX quality meets standards.

**Context to Provide**:
```
Feature Requirements: ${ARTIFACTS_DIR}/requirements.md
Acceptance Criteria: [extract from requirements]

Evaluate the implemented feature for:
1. Visual hierarchy and clarity
2. Accessibility (WCAG 2.1 AA)
3. Responsiveness (desktop + mobile)
4. Consistency with design system
5. Usability and user feedback
6. Performance perception (loading states, transitions)

Threshold Score: 85

If score >= 85: Output "UI/UX Review: APPROVED"
If score < 85: Provide prioritized recommendations
```

**Output**:
- If PASS: Display "UI/UX Review: APPROVED"
- If FAIL: Add issues to `${ARTIFACTS_DIR}/review-issues.md`

---

### Step 4.3: Acceptance Criteria Verification

**Task**: Verify each acceptance criterion is met.

**Instructions**:
1. Read `${ARTIFACTS_DIR}/requirements.md` for acceptance criteria
2. For EACH criterion:
   - Check if implementation satisfies it
   - Check if test exists that validates it
   - Mark as PASS or FAIL

3. Create `${ARTIFACTS_DIR}/acceptance-verification.md`:
   ```markdown
   # Acceptance Criteria Verification

   | # | Criterion | Implementation | Test Coverage | Status |
   |---|-----------|----------------|---------------|--------|
   | 1 | [criterion] | [file:line] | [test file] | PASS/FAIL |
   ```

**Output**:
- If ALL criteria PASS: Display "Acceptance Verification: APPROVED"
- If ANY criteria FAIL: Add to `${ARTIFACTS_DIR}/review-issues.md`

---

### Step 4.4: Verification Decision Point

**Evaluate all reviews**:

1. **If ALL reviews APPROVED**:
   - Proceed to Phase 5 (Completion)

2. **If ANY review FAILED**:
   - Check cycle count: `VERIFICATION_CYCLE < MAX_CYCLES`
   - If under limit: Enter Fix & Retry
   - If at limit: Escalate to user with detailed report

---

### Fix & Retry Section

**TRIGGER**: Any review failure in current cycle.

**Agent Role**: `nextjs-developer`

**Task**: Fix all identified issues.

**Process**:
1. Read `${ARTIFACTS_DIR}/review-issues.md`
2. Prioritize by severity (Critical > High > Medium > Low)
3. For each issue:
   - Locate the problematic code
   - Apply the fix
   - Verify fix doesn't break existing functionality
4. Clear `${ARTIFACTS_DIR}/review-issues.md`
5. Increment cycle: `VERIFICATION_CYCLE += 1`
6. Return to Step 4.1

**Status Update**: Display "Fixes Applied - Restarting Verification Cycle #${VERIFICATION_CYCLE}"

---

## PHASE 5: COMPLETION

**TRIGGER**: All verification reviews approved.

### Step 5.1: Final Artifacts

1. **Create Implementation Summary**: `${DEBUG_DIR}/final/implementation-summary.md`
   ```markdown
   # Implementation Summary: [Feature Name]

   ## Overview
   [Brief description of what was built]

   ## Files Created
   - [list of new files with descriptions]

   ## Files Modified
   - [list of modified files with change summary]

   ## Components
   - [component hierarchy and responsibilities]

   ## Test Coverage
   - Unit Tests: [count] tests in [files]
   - E2E Tests: [count] tests in [files]

   ## Acceptance Criteria
   [table of criteria and verification status]

   ## Key Decisions
   - [architectural decisions made during implementation]
   ```

2. **Copy Approved Artifacts**:
   ```bash
   cp ${ARTIFACTS_DIR}/requirements.md ${DEBUG_DIR}/final/
   cp ${ARTIFACTS_DIR}/design.md ${DEBUG_DIR}/final/
   cp ${ARTIFACTS_DIR}/test-strategy.md ${DEBUG_DIR}/final/
   cp ${ARTIFACTS_DIR}/acceptance-verification.md ${DEBUG_DIR}/final/
   ```

---

### Step 5.2: Final Summary

Display:
```
══════════════════════════════════════════════════════════
  CLIENT-FEATURE WORKFLOW COMPLETED SUCCESSFULLY
══════════════════════════════════════════════════════════

Statistics:
- Feature: ${FEATURE_SLUG}
- Verification Cycles: ${VERIFICATION_CYCLE}
- Test Fix Iterations: [count]

Files Created:
[list of new files]

Files Modified:
[list of modified files]

Test Coverage:
- Unit/Component Tests: [count] tests, [X]% coverage
- E2E Tests: [count] tests

Verification Results:
- Code Quality: APPROVED
- UI/UX (Score): [score]/100
- Acceptance Criteria: [X]/[Y] verified

Debug Artifacts:
.claude-debug/${FEATURE_SLUG}/
├── artifacts/          (working documents)
├── iterations/         (fix history if any)
└── final/              (approved deliverables)

Next Steps:
1. Review implementation: [main component file]
2. Run dev server: npm run dev
3. Run all tests: npm test && npm run test:e2e
4. Review debug artifacts: .claude-debug/${FEATURE_SLUG}/final/
5. Create pull request when ready
```

---

## Dynamic Agent Spawning

When feature complexity requires specialized expertise, spawn dynamic agents:

### Accessibility Specialist

**Spawn When**:
- Feature has complex keyboard interactions
- Custom focus management required
- ARIA patterns beyond basic usage
- Screen reader compatibility critical

**Task**: Provide accessibility-specific implementation guidance and validation.

---

### State Management Specialist

**Spawn When**:
- Complex state transitions
- Optimistic updates required
- Multiple components share state
- Undo/redo functionality needed

**Task**: Design optimal state management approach and implementation.

---

### Performance Specialist

**Spawn When**:
- Complex animations
- Large list rendering
- Real-time updates
- Bundle size concerns

**Task**: Optimize rendering and bundle performance.

---

## Error Handling

If errors occur at any phase:

1. **Document Error**: Save to `${DEBUG_DIR}/error-log.md`
   ```markdown
   # Error Log

   ## Error Details
   - Phase: [phase name]
   - Step: [step name]
   - Time: [timestamp]
   - Error: [error message]

   ## Context
   [relevant context and state]

   ## Recovery Options
   1. [option 1]
   2. [option 2]
   ```

2. **Offer Recovery Options**:
   - Retry current step
   - Skip to next phase (with warning)
   - Escalate to user for guidance

---

## Quality Standards

### Success Condition

The workflow only completes when:
1. Feature is functionally complete per acceptance criteria
2. All tests pass (unit, component, E2E where applicable)
3. Code review finds no blocking issues
4. UI/UX score >= 85 (or user-specified threshold)
5. All acceptance criteria verified

### Guardrails

- Do NOT hallucinate APIs, components, or libraries
- Do NOT leave features partially tested
- Do NOT stop after "happy path" success
- Do NOT over-engineer beyond requirements
- Prefer correctness and clarity over cleverness
- If assumptions required, state them explicitly

---

## Notes

1. **Test-Driven Focus**: Unlike x-feature, this command runs tests and fixes failures as part of the workflow.

2. **Client-First**: Optimized for UI/UX features. Database architecture is minimal (use x-feature for data-heavy features).

3. **Self-Correcting**: The verification loop actively fixes issues rather than just reporting them.

4. **Acceptance-Driven**: Explicit criteria are defined and verified, not just reviewed.

5. **Iterative**: Quality gates are enforced through loops, not single-pass reviews.

6. **Pragmatic**: Max cycle limits prevent infinite loops while maintaining quality.