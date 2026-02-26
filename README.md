# Next.js Boilerplate

Production-ready Next.js boilerplate with TypeScript, React 19, PostgreSQL, and modern tooling — built to work seamlessly with **Claude Code** as your AI development partner.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict mode) |
| **UI** | React 19, MUI 7, Emotion |
| **Database** | PostgreSQL 16 + Drizzle ORM |
| **i18n** | next-intl (URL-based routing: `/en/*`, `/he/*`) |
| **Testing** | Jest (unit) + Playwright (E2E) |
| **Code Quality** | ESLint, Prettier, lint-staged |
| **Validation** | Zod (client + server) |
| **Infrastructure** | Docker, multi-stage Dockerfile |
| **AI Development** | Claude Code with custom skills, rules, and agents |

---

## Getting Started

### Prerequisites

- Node.js >= 18.17.0
- npm >= 9.0.0
- Docker (for PostgreSQL)
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) (recommended)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd next-boilerplate

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start PostgreSQL
npm run docker:db

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Architecture

### Request Flow

```
Client Component → Server Action / API Route → Service (optional) → Repository → PostgreSQL
```

| Layer | Responsibility |
|-------|---------------|
| **Client Components** | UI rendering only — no direct database access |
| **Server Actions / API Routes** | Entry point for all data operations, auth verification |
| **Services** | Business logic orchestration (optional for simple CRUD) |
| **Repositories** | The only layer that touches the database |

### Critical Rule: Database is Server-Side Only

All database operations go through the repository layer. Client components **never** access PostgreSQL directly. This is enforced by the architecture and documented throughout the codebase.

```
Client (Browser) → Server Action/API Route → Repository → Drizzle ORM → PostgreSQL
```

### Internationalization

URL-based routing with next-intl supporting English (`/en`) and Hebrew (`/he`) with full RTL support.

```tsx
// Server Components
const t = await getTranslations('namespace');

// Client Components
const t = useTranslations('namespace');

// Navigation — ALWAYS use @/i18n/navigation (not next/link)
import { Link } from '@/i18n/navigation';
```

Fonts switch automatically: Inter for English, Heebo for Hebrew. The `dir` attribute and MUI theme direction sync with the active locale.

---

## Project Structure

```
src/
├── actions/         # Server Actions (reusable data mutations)
├── app/             # App Router (pages, layouts, API routes)
│   └── [locale]/    # Locale-based routing (/en/*, /he/*)
├── components/      # UI components (shared, features, layouts, ui)
├── constants/       # App-wide constants (as const)
├── contexts/        # React Context providers (theme, preview)
├── db/              # Database client, schema, migrations
├── hooks/           # Custom React hooks (use-*.hooks.ts)
├── i18n/            # Internationalization config (next-intl)
├── libs/            # Third-party wrappers (env, theme, emotion)
├── locales/         # Translation files (en.json, he.json)
├── middlewares/     # Middleware functions
├── repositories/    # Database access layer (repository pattern)
├── services/        # Business logic layer
├── types/           # Shared TypeScript types
├── utils/           # Pure utility functions
└── validations/     # Zod validation schemas

e2e/                 # Playwright E2E tests
public/              # Static assets
.claude/             # Claude Code configuration
├── rules/           # Coding rules (auto-loaded by Claude)
└── settings.json    # Claude Code project settings
```

### Where to Put Your Code

| Need | Directory | Example |
|------|-----------|---------|
| Database operation | `repositories/` | `user.repository.ts` |
| Data mutation (reusable) | `actions/` | `user.action.ts` |
| Business logic | `services/` | `user.services.ts` |
| Input validation | `validations/` | `user.validations.ts` |
| UI component | `components/` | `user-card.components.tsx` |
| Custom hook (2+ uses) | `hooks/` | `use-debounce.hooks.ts` |
| Global client state | `contexts/` | `theme-mode.context.tsx` |
| Pure function | `utils/` | `formatters.utils.ts` |
| Third-party wrapper | `libs/` | `env.libs.ts` |
| Shared type | `types/` | `user.types.ts` |
| Constant | `constants/` | `routes.constants.ts` |

### File Naming Conventions

All files use **kebab-case** with type suffixes:

| Type | Pattern | Example |
|------|---------|---------|
| Components | `*.components.tsx` | `user-profile.components.tsx` |
| Hooks | `use-*.hooks.ts` | `use-debounce.hooks.ts` |
| Utils | `*.utils.ts` | `formatters.utils.ts` |
| Services | `*.services.ts` | `user.services.ts` |
| Repositories | `*.repository.ts` | `user.repository.ts` |
| Types | `*.types.ts` | `user.types.ts` |
| Validations | `*.validations.ts` | `user.validations.ts` |
| Constants | `*.constants.ts` | `routes.constants.ts` |
| Tests | `*.test.ts` / `*.spec.ts` | `button.test.tsx` |

Import alias: `@/*` maps to `src/*`. No barrel exports — use direct imports.

---

## Scripts

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:debug` | Start with Node.js inspector |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run analyze` | Analyze bundle size |

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint errors |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm run type-check` | TypeScript type checking |
| `npm run code-standard` | Run all checks (lint, format, type-check, test, build) |

### Testing

| Command | Description |
|---------|-------------|
| `npm run test` | Run all tests (Jest + Playwright) |
| `npm run test:jest` | Run Jest unit tests |
| `npm run test:jest:watch` | Unit tests in watch mode |
| `npm run test:jest:coverage` | Unit tests with coverage |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | E2E with interactive UI |
| `npm run test:e2e:headed` | E2E in headed browser |
| `npm run test:e2e:debug` | Debug Playwright tests |

### Database

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate migrations from schema changes |
| `npm run db:migrate` | Apply migrations to database |
| `npm run db:push` | Push schema directly (dev only) |
| `npm run db:studio` | Open Drizzle Studio (visual browser) |
| `npm run db:check` | Verify migration consistency |
| `npm run docker:db` | Start PostgreSQL container |
| `npm run docker:down` | Stop all containers |
| `npm run docker:logs` | View container logs |

---

## Environment Variables

```bash
# .env.example
TZ=UTC
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nextjs_dev
DEFAULT_LOCALE=en
SUPPORTED_LOCALES=en,he
```

Environment variables are validated at runtime with Zod via `src/libs/env.libs.ts`.

| File | Purpose |
|------|---------|
| `.env.example` | Template (committed) |
| `.env.local` | Local secrets (gitignored) |
| `.env.production` | Production defaults |

---

## Docker

### Development (database only)

```bash
npm run docker:db       # Start PostgreSQL
npm run docker:logs     # View logs
npm run docker:down     # Stop containers
```

### Production (full stack)

```bash
docker-compose up       # Start app + database
```

The multi-stage Dockerfile produces an optimized standalone build with a non-root user.

---

## Building with Claude Code

This boilerplate is designed to be developed with [Claude Code](https://docs.anthropic.com/en/docs/claude-code), Anthropic's AI coding assistant. The project includes extensive configuration that makes Claude understand the architecture, conventions, and patterns — so it generates code that fits naturally into the codebase.

### How It Works

The project provides Claude with context through three mechanisms:

1. **`CLAUDE.md` files** (16 total) — One in the root and one in each `src/` subdirectory. These contain architecture decisions, coding patterns, API documentation, and rules that Claude follows when generating code.

2. **`.claude/rules/`** (10 rule files) — Auto-loaded rules for specific domains: TypeScript conventions, database patterns, component structure, validation, logging, i18n, API routes, server actions, contexts, and repository patterns.

3. **Custom skills** — Slash commands that trigger specialized workflows for common development tasks.

When you ask Claude to build a feature, it automatically:
- Follows the project's file naming conventions
- Uses the correct architectural patterns (repository → service → action)
- Applies proper TypeScript types with suffixes (`Type`, `PropsType`, `Enum`)
- Validates with Zod using `safeParse` (never `parse`)
- Handles errors with `RepositoryResultType<T>` (never throws)
- Uses the structured logger (never `console.log`)
- Keeps database operations server-side only
- Supports both locales (en/he) with RTL
- Updates the relevant `CLAUDE.md` documentation

### Claude Code Skills (Slash Commands)

Skills are specialized workflows invoked with `/command`. They automate multi-step tasks that would otherwise require detailed prompts.

| Command | What It Does | When to Use |
|---------|-------------|-------------|
| `/scaffold` | Scaffold a new file following project conventions | Creating a new repository, service, hook, component, util, validation, or constant file |
| `/db-change` | Guide through a Drizzle ORM schema change workflow | Adding or modifying database tables — walks through schema edit, migration generation, review, and apply |
| `/add-api-route` | Scaffold a new API route with logging, validation, and error handling | Creating a new REST endpoint under `src/app/api/` |
| `/add-context` | Scaffold a React context with provider, hook, hydration guard, and useMemo | Adding new global client state (e.g., sidebar, auth, feature flags) |
| `/add-translation` | Add translation keys to both en.json and he.json | Adding new user-facing text to the UI |
| `/i18n-check` | Check locale files for parity — find missing keys | Auditing translation files for consistency between languages |
| `/pr-prep` | Run format, lint, type-check, and tests — summarize what needs fixing | Before creating a pull request — ensures all quality gates pass |
| `/code-review` | Comprehensive code review of a pull request | Reviewing changes before merge |
| `/feature-workflow` | Orchestrate phased feature development: enhance → plan → implement → review → commit | Building any new feature or significant change end-to-end |
| `/x-feature` | Multi-agent feature development with automated QA cycles | Complex features that benefit from parallel agent work and automated quality assurance |
| `/x-client-feature` | Multi-agent client feature development with test-driven verification | Client-side features needing visual/interaction testing loops |
| `/frontend-design` | Create distinctive, production-grade frontend interfaces | Building web components or pages with high design quality |
| `/claude-md-management:revise-claude-md` | Update CLAUDE.md with learnings from session | After completing work that changed patterns or conventions |
| `/claude-md-management:claude-md-improver` | Audit and improve CLAUDE.md files | Periodic maintenance of project documentation quality |

### Claude Code Agents

Agents are specialized sub-processes that Claude launches for complex tasks. You don't invoke them directly — Claude selects the right agent based on your request. Understanding what each agent does helps you frame better requests.

| Agent | Specialty | When Claude Uses It |
|-------|-----------|-------------------|
| **Explore** | Fast codebase exploration — find files, search code, understand structure | When searching for patterns across the codebase or understanding how something works |
| **Plan** | Software architecture and implementation planning | When designing how to implement a feature before writing code |
| **Bash** | Terminal command execution | For git operations, npm commands, Docker, and other CLI tasks |
| **nextjs-planner** | Next.js-specific implementation planning | When you ask to plan a feature that involves Next.js architecture (routing, SSR, caching) |
| **nextjs-developer** | Next.js implementation following project conventions | When you explicitly request `nextjs-developer` for building pages, components, or features |
| **nextjs-plan-developer** | Plan-based Next.js implementation | When you explicitly request `nextjs-plan-developer` with a plan to implement |
| **database-architect** | Database schema design and data modeling | When a feature involves new data storage, schema changes, or query optimization |
| **prompt-enhancer** | Clarify vague requests into detailed specifications | When your request is brief or ambiguous — asks questions to build a complete spec |
| **code-reviewer** | Code quality review and best practices | After implementing changes, to check code quality and adherence to patterns |
| **security-reviewer** | Security analysis and vulnerability assessment | When implementing auth, handling sensitive data, or before deploying security-critical features |
| **ui-ux-reviewer** | UI/UX quality evaluation | After completing UI work — evaluates accessibility, responsiveness, and user experience |
| **qa-reviewer** | Test coverage analysis and QA guidance | After implementing features — identifies testing gaps and provides test implementation guidelines |

### Example Workflows

#### Building a New Feature End-to-End

```
You: "I need a contacts page where users can view and manage their contacts"

Claude will:
1. Use prompt-enhancer (if needed) to clarify requirements
2. Use database-architect to design the contacts schema
3. Plan the implementation across all layers
4. Scaffold: schema → repository → validation → server action → page component
5. Add translations to both en.json and he.json
6. Update relevant CLAUDE.md files
7. Run quality checks
```

Or use the skill directly:

```
You: /feature-workflow Add a contacts management page with CRUD operations
```

#### Adding a Database Table

```
You: /db-change Add a "projects" table with name, description, and owner reference

Claude will:
1. Create the schema in src/db/schema/
2. Generate the migration with npm run db:generate
3. Show you the SQL for review
4. Apply the migration with npm run db:migrate
5. Scaffold the repository
6. Update CLAUDE.md files
```

#### Quick Scaffolding

```
You: /scaffold repository for projects
You: /scaffold component feature called project-list
You: /scaffold validation for create-project
You: /add-api-route /api/projects with GET and POST
You: /add-context for project-filter state
```

#### Pre-PR Checklist

```
You: /pr-prep

Claude will:
1. Run npm run format
2. Run npm run lint
3. Run npm run type-check
4. Run npm run test:jest
5. Summarize any issues that need fixing
```

#### Translation Management

```
You: /add-translation Add "projects" namespace with title, description, createButton, emptyState

Claude will:
1. Add keys to src/locales/en.json
2. Add keys to src/locales/he.json
3. Ensure both files stay in sync
```

### Tips for Working with Claude Code in This Project

1. **Be specific about the layer** — "Add a repository method for finding projects by owner" is better than "add a database query."

2. **Use skills for repetitive tasks** — `/scaffold`, `/add-translation`, `/add-api-route` save time and ensure consistency.

3. **Let Claude plan first** — For complex features, Claude will enter plan mode to design the approach before writing code. This prevents rework.

4. **Trust the conventions** — Claude knows the file naming, type suffixes, error handling patterns, and architectural rules. You don't need to repeat them in every prompt.

5. **Run quality checks** — Use `/pr-prep` before creating pull requests. Claude will catch lint errors, type issues, and test failures.

6. **CLAUDE.md stays in sync** — When Claude makes changes, it automatically updates the relevant documentation. If you make manual changes, run `/claude-md-management:revise-claude-md` to keep docs current.

7. **Ask for reviews** — After implementing a feature, ask Claude to review it. It will use code-reviewer, security-reviewer, and qa-reviewer agents to catch issues.

---

## Coding Standards

### TypeScript

- `type` over `interface` (unless declaration merging is needed)
- Suffix conventions: `Type`, `PropsType`, `Enum`, `Interface`
- No `any` — use `unknown` and narrow
- `as const` for constant objects and arrays
- Import order: React/Next → Third-party → `@/` alias → Relative → Types

### Components

- Server Components by default — add `'use client'` only when needed
- Props typed with `*PropsType` suffix
- MUI tree-shakeable imports: `import Button from '@mui/material/Button'`
- Hydration guard (`mounted` state) when using `localStorage` or browser APIs

### Validation

- Always Zod `safeParse` — never `parse` (which throws)
- Export both schema and inferred type: `CreateUserValidation` + `CreateUserInputType`
- Validate on both client (React Hook Form + zodResolver) and server

### Error Handling

- Repository methods return `RepositoryResultType<T>` (success/error union) — never throw
- Server Actions return `RepositoryResultType<T>` — never throw
- API routes wrap responses in `ApiResponse<T>` — never expose raw errors to clients

### Logging

- Never `console.log` — use the structured logger
- Server-side: `import { logger } from '@/utils/logger/logger.server.utils'`
- Client-side: `import { logger } from '@/utils/logger/logger.utils'`
- Severity levels: `URGENT`, `HIGH`, `MEDIUM`, `LOW`, `NONE`

### Testing

- Unit tests: `*.test.ts` with Jest — coverage target: critical paths 100%, utils >80%
- E2E tests: `*.spec.ts` with Playwright in `e2e/` directory
- Use `NextIntlClientProvider` in test wrappers for i18n components

---

## CLAUDE.md Documentation System

Every `src/` subdirectory contains a `CLAUDE.md` file that documents:
- Purpose and rules for that directory
- Available items (components, functions, types, etc.)
- How to add new items
- Code examples and patterns

These files serve as both documentation for developers and context for Claude Code. The hierarchy principle: deeper files contain more detail, higher files contain overviews with references downward.

**When you change code, update the relevant CLAUDE.md.** This is part of the task — the task is not complete until documentation is in sync with the code.

---

## License

MIT
