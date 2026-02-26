# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

### Commands

```bash
# Development
npm run dev                  # Start development server (http://localhost:3000)
npm run dev:debug           # Start dev server with Node.js inspector

# Building & Production
npm run build               # Build production bundle
npm run start               # Start production server
npm run analyze             # Analyze bundle size

# Code Quality
npm run lint                # Run ESLint
npm run lint:fix            # Auto-fix ESLint errors
npm run format              # Format code with Prettier
npm run format:check        # Check formatting
npm run type-check          # TypeScript type checking

# Testing
npm run test                # Run all tests (Jest + Playwright)
npm run test:jest           # Run Jest unit tests
npm run test:jest:watch     # Jest watch mode
npm run test:jest:coverage  # Jest with coverage report
npm run test:e2e            # Run Playwright E2E tests
npm run test:e2e:ui         # Playwright with UI
npm run test:e2e:headed     # Playwright in headed mode
npm run test:e2e:debug      # Debug Playwright tests
npm run test:e2e:report     # View Playwright HTML report

# Database (Drizzle + PostgreSQL)
npm run db:generate         # Generate migrations from schema changes
npm run db:migrate          # Apply migrations to database
npm run db:push             # Push schema directly (dev only, no migrations)
npm run db:studio           # Launch Drizzle Studio (visual browser)
npm run db:check            # Verify migration consistency
npm run docker:db           # Start PostgreSQL container
npm run docker:down         # Stop all containers
npm run docker:logs         # View container logs
```

## Tech Stack

**Core:** Next.js 16 (App Router) | React 19 | TypeScript | PostgreSQL + Drizzle ORM | Jest + Playwright | Web Vitals

## Critical Database Rule

**PostgreSQL is STRICTLY server-side only.** Client components NEVER access the database directly.

```
Client Component → Server Action/API Route → Repository → Drizzle ORM → PostgreSQL
```

See [src/db/CLAUDE.md](src/db/CLAUDE.md) and [src/repositories/CLAUDE.md](src/repositories/CLAUDE.md) for details.

## Project Structure

```
src/
├── actions/         # Server Actions — see src/actions/CLAUDE.md
├── app/             # App Router, routes, API routes — see src/app/CLAUDE.md
├── components/      # UI components — see src/components/CLAUDE.md
├── constants/       # App constants — see src/constants/CLAUDE.md
├── contexts/        # React Context providers — see src/contexts/CLAUDE.md
├── db/              # Database client, schema, migrations — see src/db/CLAUDE.md
├── hooks/           # Custom hooks — see src/hooks/CLAUDE.md
├── i18n/            # Internationalization (next-intl) — see src/i18n/CLAUDE.md
├── libs/            # Third-party wrappers — see src/libs/CLAUDE.md
├── locales/         # Translation files ({locale}.json) — see src/i18n/CLAUDE.md
├── middlewares/     # Middleware functions — see src/middlewares/CLAUDE.md
├── repositories/    # Database access layer — see src/repositories/CLAUDE.md
├── services/        # Business logic — see src/services/CLAUDE.md
├── types/           # Shared types — see src/types/CLAUDE.md
├── utils/           # Pure functions — see src/utils/CLAUDE.md
└── validations/     # Zod schemas — see src/validations/CLAUDE.md

public/              # Static assets
e2e/                 # Playwright tests
```

**Import Aliases:** `@/*` → `src/*`

### Where to Put Your Code

| Directory | Purpose | When to Use |
|-----------|---------|-------------|
| `repositories/` | Database access | ALL database operations |
| `actions/` | Server Actions | Reused across pages/components |
| `services/` | Business logic | Multi-operation coordination |
| `middlewares/` | Request processing | Auth checks, logging |
| `hooks/` | Custom hooks | Reusable stateful logic (2+ uses) |
| `contexts/` | Context providers | Global client state |
| `utils/` | Pure functions | No side effects, testable |
| `libs/` | Third-party wrappers | SDK integration, singletons |
| `types/` | Shared types | Cross-domain types |
| `constants/` | App constants | Global config values |
| `validations/` | Zod schemas | Input validation |

### Decision Tree

- **Database Operation?** → ALWAYS server-side only via repositories
- **Component?** → `ui/` | `layouts/` | `features/` | `shared/`
- **Server Action?** → Reused: `actions/` | Single-use: co-locate
- **Business Logic?** → `services/` | **Pure Function?** → `utils/`
- **Third-party Wrapper?** → `libs/` | **Type?** → Shared: `types/` | Feature: co-locate

## File Naming

| Type | Convention | Examples |
|------|-----------|---------|
| Components | `*.components.tsx` | `user-profile.components.tsx` |
| Utils | `*.utils.ts` | `formatters.utils.ts` |
| Services | `*.services.ts` | `user.services.ts` |
| Repositories | `*.repository.ts` | `user.repository.ts` |
| Middlewares | `*.middlewares.ts` | `auth.middlewares.ts` |
| Types | `*.types.ts` | `user.types.ts` |
| Validations | `*.validations.ts` | `user.validations.ts` |
| Hooks | `use-*.hooks.ts` | `use-debounce.hooks.ts` |
| Constants | `*.constants.ts` | `routes.constants.ts` |
| Tests | `*.test.ts` / `*.spec.ts` | `button.test.tsx` |
| Next.js special | lowercase | `page.tsx`, `layout.tsx` |

All files use **kebab-case**. Avoid barrel exports — use direct imports.

## Request Flow

```
Client → Server Action/API Route → Service (optional) → Repository → PostgreSQL
```

- **Client Components:** UI only, NO database access
- **Server Actions/API Routes:** Auth verification, entry point for DB operations
- **Service:** Business logic, orchestration (optional — skip for simple CRUD)
- **Repository:** Database operations ONLY

## Environment Config

```bash
.env              # Defaults (committed, no secrets)
.env.local        # Secrets (gitignored)
.env.production   # Production config
```

Type-safe via `src/libs/env.libs.ts` (Zod validation). See [src/libs/CLAUDE.md](src/libs/CLAUDE.md).

## Internationalization (i18n)

**System:** next-intl with URL-based routing (`/en/*`, `/he/*`)

```tsx
// Server Components
const t = await getTranslations('namespace');

// Client Components ('use client')
const t = useTranslations('namespace');

// Navigation — use @/i18n/navigation (not next/link)
import { Link } from '@/i18n/navigation';
```
```
src/locales/
├── en.json           # English translations
└── he.json           # Hebrew translations
```
See [src/i18n/CLAUDE.md](src/i18n/CLAUDE.md) for full documentation.

## Coding Standards

### Style Guide

**Files:** kebab-case with appropriate suffixes
**Imports:** React/Next → Third-party → `@/` → Relative → Types
**Code:** Semicolons | Single quotes | 1TBS | `type` > `interface` | Arrow fns | `const` > `let` | No `any`
**Comments:** Self-documenting names | JSDoc for APIs | Explain "why"

### Testing

```tsx
// Unit (*.test.ts):
describe('fn', () => { it('does X', () => expect(fn()).toBe(result)); });

// E2E (*.spec.ts):
test('action', async ({ page }) => { await page.goto('/path'); });
```

**Coverage:** Critical: 100% | Utils: >80% | UI: main paths | API: all methods

### Logging & Error Handling

Use the structured `logger` utility for all logging. **Two imports** depending on environment:

```tsx
// Server-side (API routes, Server Actions, repos, services, server-only libs):
import { logger, LogSeverityEnum } from '@/utils/logger/logger.server.utils';

// Client-side (components, isomorphic utils):
import { logger, LogSeverityEnum } from '@/utils/logger/logger.utils';

// API: all methods accept { message, severity?, error?, context? }
await logger.error({ message: 'Failed', error: err, severity: LogSeverityEnum.HIGH, context: { userId: '123' } });
void logger.warn({ message: 'Deprecated API' });  // fire-and-forget in sync contexts
```

See [src/utils/CLAUDE.md](src/utils/CLAUDE.md) for full API documentation and usage examples.

### Security

- **Env:** `NEXT_PUBLIC_*` = client-exposed | Others = server-only | Validate with Zod
- **Database:** NEVER expose credentials to client — all operations server-side only
- **Auth:** All auth server-side only | Session cookies for client state
- **SQL Injection:** Drizzle ORM parameterizes automatically — never use raw SQL with user input

### Accessibility

Semantic HTML | Alt text | Keyboard nav | ARIA when needed | 4.5:1 contrast | Form labels (`htmlFor`/`id`)

### Authentication (Not Yet Implemented)

All auth operations MUST be server-side: `Client (Cookie/Session) → Server Action/API → Auth Service → PostgreSQL`

## MUST: Keep CLAUDE.md Files Updated

**Every code change that adds, removes, or modifies functionality MUST include updates to the relevant `CLAUDE.md` file(s). This is NOT optional.**

When you:
- **Add** a component, hook, util, action, repository, type, validation, constant, context, service, middleware, or route → **Add it** to the corresponding `src/*/CLAUDE.md`
- **Remove** any of the above → **Remove it** from the corresponding `CLAUDE.md`
- **Rename or change the API** of any export → **Update** the documentation to match
- **Add a new directory** under `src/` → **Create** a `CLAUDE.md` for it
- **Change project-wide patterns** (file naming, conventions, architecture) → **Update** root `CLAUDE.md`

**The CLAUDE.md update is part of the task — the task is not complete until documentation is in sync with the code.**

### CLAUDE.md Hierarchy Rules

**IMPORTANT:** Only update CLAUDE.md files in the direct hierarchy of the changed code.

**Hierarchy Pattern:**
- A file/directory at `src/X/Y/Z/file.ts` should only update:
  1. `src/X/Y/Z/CLAUDE.md` (if it exists) — **Most detailed documentation**
  2. `src/X/Y/CLAUDE.md` (if Z doesn't have CLAUDE.md) — **Detailed documentation**
  3. `src/X/CLAUDE.md` (if Y doesn't have CLAUDE.md) — **Comprehensive documentation**
  4. Root `CLAUDE.md` (only for project-wide patterns, not individual utilities/components) — **Overview + references**

**Information Depth Principle:**
- **Deeper CLAUDE.md files = More detailed information** (full API docs, examples, patterns)
- **Higher CLAUDE.md files = Overview + references** (point to deeper files via "See [path/to/CLAUDE.md]")
- Root `CLAUDE.md` provides high-level architecture and references subdirectory CLAUDE.md files
- Subdirectory CLAUDE.md files contain comprehensive documentation for their domain

**Examples:**
- `src/utils/logger/logger.utils.ts` → Update `src/utils/CLAUDE.md` with full API details (NOT `src/actions/CLAUDE.md`, `src/repositories/CLAUDE.md`, etc.)
- `src/components/ui/button.components.tsx` → Update `src/components/CLAUDE.md` with component API
- `src/repositories/user.repository.ts` → Update `src/repositories/CLAUDE.md` with repository methods
- Change to project-wide file naming convention → Update root `CLAUDE.md`
- Root `CLAUDE.md` references: "See [src/utils/CLAUDE.md](src/utils/CLAUDE.md) for available utilities"

**Rule:** Do NOT update sibling or unrelated CLAUDE.md files. Only update files in the direct parent hierarchy. Higher-level files reference lower-level files for details.

## Quick Fixes

**Type Errors:** `npm run type-check` then restart TS server
**Stale Cache:** Clear `.next` folder or use `revalidateTag()`
**Build Fails:** Check `.env.local` has all required vars (especially `DATABASE_URL`)
**Test Fails:** Run `npx playwright install` for E2E

## Architecture Decisions

**Why Server Components First?** Smaller bundles, direct database access, better SEO, secure by default

**Why Not Cached by Default?** Predictability, easier debugging, opt-in performance

**Why PostgreSQL + Drizzle?** Type-safe SQL, powerful queries, full control, excellent tooling, migration support

**Why Repository Pattern?** Centralized data access, consistent error handling, easier testing, better maintainability
