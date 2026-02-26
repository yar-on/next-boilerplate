---
description: Guide through a Drizzle ORM schema change workflow (schema → generate migration → review → apply)
---

# Database Schema Change Workflow

Guide through the complete Drizzle ORM schema change process safely, step by step.

## Request

$ARGUMENTS

## Instructions

### Pre-flight check

Before making any changes, confirm:
- The development PostgreSQL container is running (`npm run docker:db`)
- `DATABASE_URL` is set in `.env.local`

If either is missing, instruct the user to set it up first and stop.

---

### Step 1: Understand the change

Parse $ARGUMENTS to understand what schema change is needed:
- Adding a new table
- Adding columns to an existing table
- Modifying column types or constraints
- Adding/removing indexes
- Adding foreign key relationships

If unclear, ask the user to describe the change before proceeding.

---

### Step 2: Read the current schema

Read `src/db/schema/` (or `src/db/schema.ts` if single file) to understand the current state. Also read `src/db/CLAUDE.md` for project-specific patterns.

---

### Step 3: Plan the changes

Before writing code, describe what will change:
- Which file(s) in `src/db/schema/` will be modified
- New table definitions or column additions
- Any new indexes or relations
- Impact on existing repositories

Show the plan to the user and confirm before proceeding.

---

### Step 4: Implement the schema change

Update the Drizzle schema file(s) following project patterns:

```typescript
// src/db/schema/users.ts
import { pgTable, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type UserType = typeof users.$inferSelect;
export type NewUserType = typeof users.$inferInsert;
```

Key rules:
- Export inferred types alongside table definition
- Use `uuid` for primary keys with `defaultRandom()`
- Use `timestamp` for `createdAt`/`updatedAt`
- Use `varchar` with explicit length limits
- Add indexes for frequently queried columns

---

### Step 5: Generate the migration

Run the migration generation command:

```bash
npm run db:generate
```

Then read the generated migration file in `src/db/migrations/` and show it to the user. Explain what SQL will be executed.

---

### Step 6: Verify migration consistency

```bash
npm run db:check
```

If this fails, investigate and fix before proceeding.

---

### Step 7: Apply the migration

**Ask for explicit confirmation** before running this step — it modifies the database.

```bash
npm run db:migrate
```

Show the output to the user.

---

### Step 8: Update repository and types

After schema changes:
1. Update or create the corresponding repository in `src/repositories/`
2. Update type imports if needed
3. Update `src/db/CLAUDE.md` and `src/repositories/CLAUDE.md` with the changes

---

### Step 9: Verify with Drizzle Studio (optional)

Offer to the user:
```bash
npm run db:studio
```
Opens a visual browser at `https://local.drizzle.studio` to verify the schema.

---

## Rollback

If something goes wrong:
- Drizzle migrations are tracked in `src/db/migrations/meta/`
- To rollback, the migration file must be reverted manually and the schema restored
- For dev-only changes: `npm run db:push` can be used instead of migrations (skips migration files, use with caution)

## Usage Examples

```
/db-change add users table with email and name
/db-change add avatar_url column to users
/db-change add index on posts.created_at
/db-change create posts table with user foreign key
```

## Rules

- NEVER use `db:push` in production — migrations only
- ALWAYS read the generated migration SQL before applying
- ALWAYS update CLAUDE.md files after schema changes
- ALWAYS update repository types to match schema changes
- Foreign keys require the referenced table to exist first
- Column renames require a migration with explicit `ALTER TABLE RENAME COLUMN`
