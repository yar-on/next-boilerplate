---
name: enhance-request
description: Transforms a vague user request into a detailed, testable spec with acceptance criteria and edge cases. Run before planning.
---

# 01 - Enhance User Request

Transform raw request into clear, testable requirements.

**Agent**: Delegate to `prompt-enhancer` agent via Task tool, or run inline.

## Process

1. **Clarify ambiguity** — Ask user if critical info is missing (max 3 grouped questions). For minor gaps, state assumptions explicitly.

2. **Produce enhanced spec**:
   - **Summary**: 1-2 sentences — what and why
   - **User stories**: `As [user], I want [action], so that [benefit]`
   - **UI states**: loading, success, error, empty, disabled
   - **Acceptance criteria**: `GIVEN [context], WHEN [action], THEN [result]`
   - **Edge cases**: boundary conditions, invalid input, network failures
   - **Accessibility**: keyboard nav, screen reader, ARIA, focus management
   - **Out of scope**: what we're NOT building

3. **Confirm with user** — Proceed only after approval or adjustments.

## Output
Approved enhanced spec for the planning phase.
