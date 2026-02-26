---
description: Multi-agent feature development workflow with automated quality assurance cycles
---

# X-Feature: Multi-Agent Feature Development Pipeline

You are orchestrating a sophisticated, production-ready feature development workflow that implements a complete pipeline from requirements gathering through quality-assured implementation. This workflow enforces quality gates through iterative review-and-fix cycles, ensuring code only progresses when all reviewers approve.

## User Request
$ARGUMENTS

## Pre-Flight Validation

**CRITICAL - Check BEFORE starting any work:**

1. **Validate User Input**: Check if `$ARGUMENTS` contains actual feature request text
   - If `$ARGUMENTS` is empty, blank, or missing:
     ```
     ❌ ERROR: No feature request provided

     Usage: /x-feature <your feature request>

     Example:
     /x-feature Add user authentication with email and password
     /x-feature Create a dashboard with analytics charts
     /x-feature Implement dark mode toggle

     Please provide a feature request and try again.
     ```
     **STOP EXECUTION** - Do not proceed to workflow initialization

   - If `$ARGUMENTS` contains valid text: Proceed to "Workflow Context Initialization"

---

## Workflow Context Initialization

**FIRST ACTION - After validation passes:**

1. **Generate Feature Slug**: Create a kebab-case slug from the user's request (e.g., "Add user authentication" → "add-user-authentication")

2. **Create Debug Directory**: Create the directory structure:
   ```
   .claude-debug/<feature-slug>/
   ├── iteration-1/
   ├── iteration-2/  (if needed)
   └── final/
   ```

3. **Set Workflow Variables**:
   ```
   FEATURE_SLUG = <kebab-case feature name>
   DEBUG_DIR = .claude-debug/${FEATURE_SLUG}
   CURRENT_ITERATION = 1
   ITERATION_DIR = ${DEBUG_DIR}/iteration-${CURRENT_ITERATION}
   ```

4. **Display Initialization**:
   ```
   🚀 X-FEATURE WORKFLOW INITIATED
   📋 Feature: [feature name]
   📁 Debug Directory: .claude-debug/<feature-slug>/
   🔄 QA Iteration: 1

   Starting Phase 1: Requirements Engineering...
   ```

**CRITICAL FILE PATH RULES:**
- ALL markdown artifacts MUST be saved to `${ITERATION_DIR}/` (NOT project root)
- When QA cycle restarts, increment `CURRENT_ITERATION` and create new `iteration-X/` directory
- Final approved artifacts are copied to `${DEBUG_DIR}/final/`
- The `.claude-debug/` directory is gitignored (add to .gitignore if not present)

---

## Workflow Overview

This command orchestrates multiple specialized AI sub-agents through a structured 4-phase workflow:
1. **Requirements Engineering** - Transform user request into detailed specifications
2. **Planning** - Create comprehensive technical implementation plan
3. **Implementation** - Build the complete feature
4. **Quality Assurance Cycle** - Iterative multi-reviewer approval process

**CRITICAL**: The QA cycle MUST iterate until all 4 reviewers approve in sequence. Do not skip reviewers or proceed without full approval.

---

## PHASE 1: REQUIREMENTS ENGINEERING

### Step 1: Prompt Enhancement

**Agent Role**: `prompt-enhancer`

**Task**: Transform the raw user request into a professionally structured, detailed prompt with clear acceptance criteria.

**Context to Provide to Agent**:
```
Feature Request: $ARGUMENTS

Output File Path: ${ITERATION_DIR}/enhanced-requirements.md

Instructions:
- Analyze the user's basic feature request (potentially vague or unstructured)
- Expand it into a comprehensive feature specification including:
    - Clear objective and purpose
    - Detailed functional requirements
    - User stories and use cases
    - Acceptance criteria (specific, measurable)
    - Edge cases and error scenarios
    - Success metrics
    - Any assumptions or constraints
- Structure the output in a clear, professional format
- Be specific about expected behaviors and outcomes
- Save your output to the specified file path
```

**Status Update**: Display "✓ Phase 1.1 Complete: Requirements Enhanced → `${ITERATION_DIR}/enhanced-requirements.md`"

---

### Step 2: Database Assessment

**Agent Role**: `database-architect`

**Task**: Analyze if the feature requires database changes and provide architecture recommendations.

**Context to Provide to Agent**:
```
Requirements File: ${ITERATION_DIR}/enhanced-requirements.md
Output File Path: ${ITERATION_DIR}/database-architecture.md

Instructions:
- Read the requirements file at the specified path
- Assess whether this feature requires:
    - New database tables or collections
    - Schema modifications to existing tables
    - New relationships or foreign keys
    - Database migrations
    - New indexes for performance
    - Data validation rules
    - Seeding or initial data requirements
- If database changes are needed, provide:
    - Detailed schema designs (Firestore collections/documents)
    - Migration strategy
    - Rollback considerations
    - Performance implications
    - Data integrity safeguards
- If no database changes are needed, clearly state: "No database changes required for this feature"
- Save your analysis to the specified output file path
```

**Status Update**: Display "✓ Phase 1.2 Complete: Database Architecture Analyzed → `${ITERATION_DIR}/database-architecture.md`"

---

### Step 3: Requirements Consolidation

**Task**: Merge the enhanced prompt with database architecture recommendations into a unified requirements document.

**Instructions**:
- Read both:
  - `${ITERATION_DIR}/enhanced-requirements.md`
  - `${ITERATION_DIR}/database-architecture.md`
- Consolidate them into a single, comprehensive document that includes:
    - Complete feature specification
    - Database architecture (if applicable)
    - Full technical context
    - All acceptance criteria
- Ensure no information is lost in the merge
- Organize logically with clear sections
- Save to: `${ITERATION_DIR}/final-requirements.md`

**Status Update**: Display "✓ Phase 1.3 Complete: Requirements Consolidated → `${ITERATION_DIR}/final-requirements.md`"

**Phase Summary**: Display a brief summary of what will be built based on the final requirements.

---

## PHASE 2: PLANNING

### Step 4: Technical Planning

**Agent Role**: `nextjs-planner`

**Task**: Create a comprehensive technical implementation plan for the feature.

**Context to Provide to Agent**:
```
Requirements File: ${ITERATION_DIR}/final-requirements.md
Output File Path: ${ITERATION_DIR}/final-plan.md

Instructions:
- Read the consolidated requirements from the specified path
- Create a detailed implementation plan that includes:
    - **File Structure**:
        - All files that need to be created or modified
        - Directory organization
        - Component hierarchy
    - **API Routes** (if applicable):
        - Endpoint definitions
        - Request/response schemas
        - Authentication/authorization requirements
    - **Data Flow**:
        - How data moves through the application
        - State management approach
        - Data fetching strategy (client vs server)
    - **Component Architecture**:
        - Component breakdown
        - Props interfaces
        - Reusable utilities
    - **Integration Points**:
        - External APIs or services
        - Database interactions (via repositories)
        - Third-party libraries needed
    - **Testing Approach**:
        - Unit test requirements
        - Integration test scenarios
        - E2E test cases
    - **Implementation Order**:
        - Step-by-step build sequence
        - Dependencies between tasks
    - **Technical Considerations**:
        - Performance optimization strategies
        - Security measures
        - Error handling approach
        - Accessibility requirements

Output Format: Structure the plan with clear markdown headers and subsections. Use code blocks for examples.
Save to: The specified output file path
```

**Status Update**: Display "✓ Phase 2 Complete: Technical Plan Created → `${ITERATION_DIR}/final-plan.md`"

**Phase Summary**: Display key implementation highlights (major components, API routes, database changes).

---

## PHASE 3: IMPLEMENTATION

### Step 5: Feature Development

**Agent Role**: `nextjs-plan-developer`

**Task**: Implement the complete feature according to the technical plan.

**Context to Provide to Agent**:
```
Implementation Plan: ${ITERATION_DIR}/final-plan.md

Instructions:
- Read the implementation plan from the specified path
- Implement ALL aspects of the feature as specified in the plan:
    - Create all necessary files and directories
    - Implement all components with proper TypeScript types
    - Create Server Actions with proper error handling
    - Implement repository layer for Firestore operations (if database is involved)
    - Add proper validation and security measures
    - Include loading and error states
    - Implement responsive design
    - Add accessibility attributes
    - Include inline documentation and comments for complex logic
- Follow Next.js best practices:
    - Use App Router conventions
    - Implement proper server/client component separation
    - Use Server Actions where appropriate
    - Implement proper data caching strategies
    - Follow TypeScript strict mode
    - CRITICAL: Firebase is server-side ONLY - use repositories pattern
- Ensure code quality:
    - Clean, readable code
    - Proper error handling
    - Type safety throughout
    - No unused imports or variables
    - Consistent formatting
```

**Status Update**: Display "✓ Phase 3 Complete: Feature Implemented"

**Phase Summary**: List all files created/modified.

---

## PHASE 4: QUALITY ASSURANCE CYCLE

**CRITICAL WORKFLOW RULE**: This is an iterative cycle. All 4 reviewers must approve in a SINGLE cycle for the workflow to complete. If ANY reviewer does not approve, collect all issues, fix them using the `nextjs-developer` sub-agent, increment iteration, and restart from Step 1 (code-reviewer).

### QA Cycle Iteration Tracking

**Before starting the QA cycle**:
- Initialize: `CURRENT_ITERATION = 1`
- Set: `ITERATION_DIR = ${DEBUG_DIR}/iteration-${CURRENT_ITERATION}`

**At the start of each cycle**: Display "🔄 QA Cycle Iteration #${CURRENT_ITERATION} - Starting Review Process"

### Review Workflow Logic

**Sequential Review Process**:
1. **Launch code-reviewer** → If ❌ ISSUES FOUND: Jump to "Fix & Retry Section"
2. **If code-reviewer ✅ APPROVED** → Launch security-reviewer → If ❌ ISSUES FOUND: Jump to "Fix & Retry Section"
3. **If security-reviewer ✅ APPROVED** → Launch qa-reviewer → If ❌ ISSUES FOUND: Jump to "Fix & Retry Section"
4. **If qa-reviewer ✅ APPROVED** → Launch ui-ux-reviewer → If ❌ ISSUES FOUND: Jump to "Fix & Retry Section"
5. **If ui-ux-reviewer ✅ APPROVED** → All reviewers passed! → Jump to "Workflow Completion"

**Fix & Retry Section (triggered by ANY ❌)**:
- Consolidate ALL issues from the failed reviewer(s)
- Save to `${ITERATION_DIR}/qa-issues.md`
- **Launch `nextjs-developer` sub-agent** to fix ALL issues
- Agent creates `${ITERATION_DIR}/fixes-applied.md` documenting all fixes
- Increment iteration counter
- Create new iteration directory
- Restart from Review Step 1 (code-reviewer)

---

### QA Review Step 1: Code Quality Review

**Agent Role**: `code-reviewer`

**Task**: Review code for quality, best practices, and maintainability.

**Context to Provide to Agent**:
```
Implementation Context:
- Feature Plan: ${ITERATION_DIR}/final-plan.md
- Review all implemented code files from Phase 3

Review Checklist:
- **Code Quality**:
    - Clean, readable code
    - Proper naming conventions
    - No code smells or anti-patterns
    - DRY principle (no unnecessary duplication)
    - Proper code organization
- **Best Practices**:
    - Follows Next.js 15 conventions
    - Proper TypeScript usage
    - Correct React 19 patterns (hooks, composition)
    - Proper server/client component usage
    - Firebase server-side ONLY pattern enforced
- **Maintainability**:
    - Clear code structure
    - Adequate comments for complex logic
    - Reusable components
    - Modular design
- **Plan Adherence**:
    - All planned features implemented
    - Follows the technical plan structure
    - No deviations without justification
- **Technical Debt**:
    - No obvious technical debt
    - No TODO comments without issue tracking
    - No hardcoded values that should be configurable

Output Format:
- If code passes all checks: Output exactly "✅ CODE REVIEW: APPROVED"
- If issues found: Output "❌ CODE REVIEW: ISSUES FOUND" followed by:
    - File path and line number
    - Issue description
    - Severity (Critical/High/Medium/Low)
    - Recommended fix
```

**Status Update**: Display the approval status clearly with timestamp.

**STOP CONDITION**: If this review does NOT approve:
1. Collect ALL issues found by the code-reviewer agent
2. STOP here - do NOT proceed to security review
3. Jump to "Fix & Retry Section" below
4. The issues will be consolidated and passed to the `nextjs-developer` sub-agent for fixing

---

### QA Review Step 2: Security Review

**PREREQUISITE**: Only execute if Step 1 (code-reviewer) APPROVED.

**Agent Role**: `security-reviewer`

**Task**: Review code for security vulnerabilities and ensure secure implementation.

**Context to Provide to Agent**:
```
Implementation Context:
- Review all implemented code files from Phase 3
- Special attention to Firebase server-side pattern enforcement

Security Checklist:
- **Authentication & Authorization**:
    - Proper authentication checks
    - Authorization on API routes/Server Actions
    - Protected routes properly guarded
    - Session management security
- **Data Validation**:
    - Input validation on all user inputs
    - Output encoding/escaping
    - Type checking and sanitization (Zod schemas)
    - Validation on both client and server
- **Common Vulnerabilities**:
    - XSS (Cross-Site Scripting) prevention
    - NoSQL injection prevention
    - CSRF protection
    - Insecure direct object references
    - Security misconfiguration
- **Data Protection**:
    - Sensitive data not exposed in client code
    - Proper environment variable usage
    - No hardcoded secrets or credentials
    - Secure data transmission
- **Firebase Security**:
    - CRITICAL: Verify NO client-side Firebase SDK usage
    - All Firestore operations via repositories
    - Firebase Admin SDK only in server-side code
- **API Security**:
    - Rate limiting considerations
    - Proper error messages (no info leakage)
    - CORS configuration
    - API authentication

Output Format:
- If code passes all security checks: Output exactly "✅ SECURITY REVIEW: APPROVED"
- If vulnerabilities found: Output "❌ SECURITY REVIEW: VULNERABILITIES FOUND" followed by:
    - Vulnerability type
    - File path and location
    - Risk level (Critical/High/Medium/Low)
    - Exploitation scenario
    - Required fix
```

**Status Update**: Display the approval status clearly with timestamp.

**STOP CONDITION**: If this review does NOT approve:
1. Collect ALL security issues found by the security-reviewer agent
2. STOP here - do NOT proceed to QA review
3. Jump to "Fix & Retry Section" below
4. The issues will be consolidated and passed to the `nextjs-developer` sub-agent for fixing

---

### QA Review Step 3: QA/Functionality Review

**PREREQUISITE**: Only execute if Step 2 (security-reviewer) APPROVED.

**Agent Role**: `qa-reviewer`

**Task**: Review functionality, edge cases, and user experience flows.

**Context to Provide to Agent**:
```
Implementation Context:
- Feature Requirements: ${ITERATION_DIR}/final-requirements.md
- Review all implemented code files from Phase 3

Functionality Testing:
- **Core Functionality**:
    - All features from requirements implemented
    - Features work as specified
    - Happy path flows correctly
- **Edge Cases**:
    - Empty states handled
    - Null/undefined checks
    - Boundary conditions tested
    - Invalid input handling
- **Error Handling**:
    - Graceful error handling
    - User-friendly error messages
    - Proper fallback UI
    - Network error handling
    - Loading states
- **User Experience Flows**:
    - Intuitive user flows
    - Proper feedback on actions
    - State persistence where needed
    - Form validation UX
- **Data Integrity**:
    - Data validation (Zod schemas)
    - Consistent state management
    - Proper data transformations
    - Repository pattern correctly implemented
- **Performance**:
    - No obvious performance issues
    - Efficient data fetching
    - Proper use of React optimization (memoization, lazy loading)

Output Format:
- If functionality passes all checks: Output exactly "✅ QA REVIEW: APPROVED"
- If issues found: Output "❌ QA REVIEW: ISSUES FOUND" followed by:
    - Functionality issue description
    - Steps to reproduce
    - Expected vs actual behavior
    - Severity (Critical/High/Medium/Low)
    - Suggested fix
```

**Status Update**: Display the approval status clearly with timestamp.

**STOP CONDITION**: If this review does NOT approve:
1. Collect ALL QA/functionality issues found by the qa-reviewer agent
2. STOP here - do NOT proceed to UI/UX review
3. Jump to "Fix & Retry Section" below
4. The issues will be consolidated and passed to the `nextjs-developer` sub-agent for fixing

---

### QA Review Step 4: UI/UX Review

**PREREQUISITE**: Only execute if Step 3 (qa-reviewer) APPROVED.

**Agent Role**: `ui-ux-reviewer`

**Task**: Review design consistency, accessibility, and user experience.

**Context to Provide to Agent**:
```
Implementation Context:
- Review all implemented UI components from Phase 3

UI/UX Evaluation:
- **Design Consistency**:
    - Follows project design patterns
    - Consistent spacing and layout
    - Consistent component styling
    - Typography consistency
    - Color scheme adherence
- **Accessibility**:
    - Semantic HTML usage
    - ARIA labels where needed
    - Keyboard navigation support
    - Focus management
    - Screen reader compatibility
    - Sufficient color contrast (WCAG 2.1 AA)
- **Responsive Design**:
    - Mobile-friendly layout
    - Tablet compatibility
    - Desktop optimization
    - Proper breakpoints
- **User Experience**:
    - Intuitive interface
    - Clear call-to-actions
    - Proper visual hierarchy
    - Loading indicators
    - Success/error feedback
    - Smooth interactions
- **Visual Polish**:
    - No layout shifts (CLS optimization)
    - Smooth animations (if any)
    - Proper spacing
    - Visual consistency
    - Professional appearance

Output Format:
- If UI/UX passes all checks: Output exactly "✅ UI/UX REVIEW: APPROVED"
- If issues found: Output "❌ UI/UX REVIEW: ISSUES FOUND" followed by:
    - UI/UX issue description
    - Location (component/page)
    - Impact on user experience
    - Priority (Critical/High/Medium/Low)
    - Design recommendation
```

**Status Update**: Display the approval status clearly with timestamp.

**Note**: If this review does NOT approve:
1. Collect ALL UI/UX issues found by the ui-ux-reviewer agent
2. Jump to "Fix & Retry Section" below
3. The issues will be consolidated and passed to the `nextjs-developer` sub-agent for fixing

---

## Fix & Retry Section

**TRIGGER**: Execute this section if ANY reviewer in the cycle did NOT approve.

### Issue Consolidation & Prioritization

**Task**: Collect all issues found in this QA cycle iteration and prioritize them.

**Instructions**:
1. **Gather all issues** from reviewers who found problems
2. **Save issues to file**: `${ITERATION_DIR}/qa-issues.md` with format:
   ```markdown
   # QA Issues - Iteration ${CURRENT_ITERATION}

   ## Critical Issues
   - [Issue description with file:line references]

   ## High Priority Issues
   - [Issue description]

   ## Medium Priority Issues
   - [Issue description]

   ## Low Priority Issues
   - [Issue description]
   ```

3. **Organize issues by**:
    - Critical issues first
    - Then High priority
    - Then Medium priority
    - Then Low priority

4. **Display**: "📋 Issues to Fix (Iteration ${CURRENT_ITERATION}):" followed by the organized list

---

### Fix Implementation

**Agent Role**: `nextjs-developer`

**Task**: Use the `nextjs-developer` sub-agent to fix ALL identified issues from the current iteration.

**Instructions**:

1. **Launch the nextjs-developer agent** using the Task tool with the following context:

```
Task Description: Fix QA issues from iteration ${CURRENT_ITERATION}

Full Context:
You are fixing issues identified during the QA review process for this feature implementation.

Issues File: ${ITERATION_DIR}/qa-issues.md
Feature Plan: ${ITERATION_DIR}/final-plan.md
Feature Requirements: ${ITERATION_DIR}/final-requirements.md

Instructions:
- Read the qa-issues.md file at the specified path to understand ALL issues that need fixing
- Review the issues and categorize them by priority:
  * Critical issues MUST be fixed first
  * High priority issues should be fixed next
  * Medium and Low priority issues after that

- For EACH issue in the list:
  1. Locate the problematic code file and line number
  2. Understand the root cause of the issue
  3. Implement a proper fix that:
     - Addresses the issue completely
     - Doesn't break existing functionality
     - Follows Next.js 15 and React 19 best practices
     - Maintains code quality and consistency
     - Adheres to the project's coding standards (see CLAUDE.md)
  4. Verify the fix doesn't introduce new problems

- Follow all coding standards:
  - TypeScript strict mode
  - Proper error handling with Result types
  - Firebase server-side ONLY pattern (repositories)
  - Zod validation for data
  - Proper component architecture (server vs client)
  - Accessibility standards (WCAG 2.1 AA)
  - Security best practices (XSS, injection prevention)

- After completing ALL fixes, create a detailed summary and save it to:
  ${ITERATION_DIR}/fixes-applied.md

The fixes-applied.md file should include:
  # Fixes Applied - Iteration ${CURRENT_ITERATION}

  ## Summary
  - Total issues fixed: [number]
  - Critical: [number]
  - High: [number]
  - Medium: [number]
  - Low: [number]

  ## Detailed Fix Log

  ### Issue 1: [Issue title]
  - **Severity**: [Critical/High/Medium/Low]
  - **File**: [file path:line number]
  - **Problem**: [description]
  - **Solution**: [what was done to fix it]
  - **Files Modified**: [list of files changed]

  [Repeat for each issue fixed]

  ## Verification
  - [ ] All critical issues resolved
  - [ ] All high priority issues resolved
  - [ ] No new issues introduced
  - [ ] Code follows project standards
  - [ ] TypeScript compilation passes
```

2. **Monitor the agent's progress** and wait for completion

3. **After the agent completes**:
   - Verify that `${ITERATION_DIR}/fixes-applied.md` was created
   - Display "🔧 Fixes Applied (Iteration ${CURRENT_ITERATION})" with a summary
   - Show key statistics (number of issues fixed by severity)

**Example Agent Launch**:
```
Use Task tool with:
- subagent_type: "nextjs-developer"
- description: "Fix QA issues iteration ${CURRENT_ITERATION}"
- prompt: [Full context as specified above]
```

---

### Cycle Restart

**Instructions**:
1. **Increment the iteration counter**: `CURRENT_ITERATION = CURRENT_ITERATION + 1`
2. **Create new iteration directory**: `mkdir -p ${DEBUG_DIR}/iteration-${CURRENT_ITERATION}`
3. **Update iteration directory**: `ITERATION_DIR = ${DEBUG_DIR}/iteration-${CURRENT_ITERATION}`
4. **Copy planning artifacts** to new iteration:
   ```bash
   cp ${DEBUG_DIR}/iteration-1/final-requirements.md ${ITERATION_DIR}/
   cp ${DEBUG_DIR}/iteration-1/final-plan.md ${ITERATION_DIR}/
   ```
   *(These don't change, only implementation evolves)*

5. **Display**: "🔄 QA Cycle Iteration #${CURRENT_ITERATION} - Restarting Review Process"
6. **Return to**: QA Review Step 1 (Code Quality Review)
7. **Execute**: All 4 review steps again in sequence
8. **Continue**: Iterating until all 4 reviewers approve

**CRITICAL**: Never skip reviewers. Always run all 4 in sequence each cycle.

---

## Workflow Completion

**TRIGGER**: Execute only when all 4 reviewers have approved in a single cycle.

### Final Artifact Preservation

**Instructions**:
1. **Create final directory**: `mkdir -p ${DEBUG_DIR}/final`
2. **Copy all approved artifacts**:
   ```bash
   cp ${ITERATION_DIR}/final-requirements.md ${DEBUG_DIR}/final/
   cp ${ITERATION_DIR}/final-plan.md ${DEBUG_DIR}/final/
   ```
3. **Create implementation summary**: `${DEBUG_DIR}/final/implementation-summary.md` with:
   - All files created/modified
   - Key architectural decisions
   - Testing coverage
   - Performance optimizations applied

### Final Summary

**Task**: Provide a comprehensive workflow completion summary.

**Instructions**:
Display the following information:

```
╔══════════════════════════════════════════════════════════╗
║  ✅ X-FEATURE WORKFLOW COMPLETED SUCCESSFULLY            ║
╚══════════════════════════════════════════════════════════╝

📊 Workflow Statistics:
- Feature: ${FEATURE_SLUG}
- Total QA Cycles: ${CURRENT_ITERATION}
- Total Issues Found: [aggregate from all qa-issues.md files]
- Total Issues Fixed: [aggregate from all fixes-applied.md files]

📁 Debug Artifacts Location:
.claude-debug/${FEATURE_SLUG}/
├── iteration-1/          (Initial implementation + issues)
├── iteration-2/          (Fixes + new issues, if applicable)
├── ...
└── final/                (✅ Approved artifacts)
    ├── final-requirements.md
    ├── final-plan.md
    └── implementation-summary.md

📦 Implementation Files:
[List all files created/modified in src/]

✅ Quality Gates Passed:
- Code Quality Review: APPROVED
- Security Review: APPROVED
- QA/Functionality Review: APPROVED
- UI/UX Review: APPROVED

🎯 Feature Summary:
[Brief description of what was built]

🚀 Next Steps:
1. Review the implementation files
2. Test the feature in your development environment: npm run dev
3. Run type checking: npm run type-check
4. Run linting: npm run lint
5. Run tests: npm run test
6. Review debug artifacts in .claude-debug/${FEATURE_SLUG}/final/
7. Create pull request for code review

📚 Documentation Generated:
- .claude-debug/${FEATURE_SLUG}/final/final-requirements.md
- .claude-debug/${FEATURE_SLUG}/final/final-plan.md
- .claude-debug/${FEATURE_SLUG}/final/implementation-summary.md
```

---

## Important Notes

1. **Iteration is Expected**: It's normal for the QA cycle to run multiple times. This ensures high-quality output.

2. **Sequential Review**: Reviews must happen in order: Code → Security → QA → UI/UX. Do not skip ahead.

3. **Complete Fixes**: When fixing issues, address ALL problems identified, not just some.

4. **Maintain Context**: Keep track of all decisions made throughout the workflow in the iteration directories.

5. **Status Updates**: Provide clear status updates after each phase so users can track progress.

6. **File Management**: All artifacts are organized in `.claude-debug/<feature-slug>/` - never in project root.

7. **Agent Focus**: Each agent should focus only on their specific domain. Don't mix concerns.

8. **Quality over Speed**: Take the time to do thorough reviews. The goal is production-ready code.

9. **Debug Artifacts**: All QA iterations are preserved for debugging and learning purposes.

10. **Gitignore**: Ensure `.claude-debug/` is in `.gitignore` to avoid committing debug artifacts.

---

## Error Handling

If at any point in the workflow an error occurs:
1. Clearly state what went wrong
2. Explain the context (which phase/step/iteration)
3. Save error details to: `${ITERATION_DIR}/error-log.md`
4. Provide actionable guidance on how to proceed
5. Offer to retry the failed step or restart from a checkpoint

---

## .gitignore Integration

**First-time setup** (check once at workflow start):
```bash
# Check if .claude-debug is in .gitignore
if ! grep -q "^\.claude-debug/" .gitignore 2>/dev/null; then
  echo "" >> .gitignore
  echo "# Claude Code debug artifacts" >> .gitignore
  echo ".claude-debug/" >> .gitignore
  echo "✓ Added .claude-debug/ to .gitignore"
fi
```

---

## Optimization Notes

**Improvements from original version:**

1. ✅ **Organized File Management**: All artifacts in `.claude-debug/<feature-slug>/iteration-X/`
2. ✅ **Iteration Tracking**: Each QA cycle gets its own directory with full context
3. ✅ **No Root Pollution**: Project root stays clean
4. ✅ **Debug History**: All iterations preserved for analysis
5. ✅ **Parallel Feature Development**: Multiple features can run without file conflicts
6. ✅ **Context Preservation**: Each agent receives explicit file paths
7. ✅ **Rollback Capability**: Can review any iteration's state
8. ✅ **Final Artifact Curation**: Approved versions clearly separated
9. ✅ **Git-safe**: Debug directory automatically gitignored
10. ✅ **Issue Tracking**: Explicit qa-issues.md and fixes-applied.md per iteration
