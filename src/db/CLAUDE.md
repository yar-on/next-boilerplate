# Database (`src/db/`)

PostgreSQL database client, schema definitions, and transaction utilities using Drizzle ORM.

## CRITICAL RULE

Database client is ONLY imported in `src/db/` and `src/repositories/`. Never import `getDb()` or `pool` anywhere else in the application.

```
Client Component → Server Action → Repository → src/db/ → PostgreSQL
```

## Files

| File | Purpose |
|------|---------|
| `client.ts` | Singleton connection pool and Drizzle ORM instance |
| `schema/index.ts` | Re-exports all schema tables |
| `schema/users.schema.ts` | Users table definition and types |
| `utils/transaction.utils.ts` | `withTransaction()` helper for atomic operations |

## Client (`client.ts`)

**Exports:** `getDb()`, `closeDb()`, `pool`

- Singleton pattern with lazy initialization
- Uses Node.js `pg` Pool with environment-based config
- Drizzle ORM with schema binding and logger (dev only)
- Pool config: 20 connections (prod) / 5 (dev), 30s idle timeout, 2s connection timeout

```tsx
import { getDb } from '@/db/client';
const db = getDb(); // Returns singleton Drizzle instance
```

## Schema Conventions

- Use `pgTable()` from `drizzle-orm/pg-core`
- Export inferred types alongside table definitions:

```tsx
import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type UserType = typeof users.$inferSelect;
export type NewUserType = typeof users.$inferInsert;
```

## Current Schema

### `users` table

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, random default |
| email | varchar(255) | unique, not null |
| name | varchar(255) | not null |
| is_active | boolean | default true |
| created_at | timestamp with tz | default now |
| updated_at | timestamp with tz | default now |

## Transaction Utility

```tsx
import { withTransaction } from '@/db/utils/transaction.utils';

const result = await withTransaction(async (tx) => {
    await tx.insert(users).values(userData);
    await tx.insert(auditLog).values(logData);
    return { userId: userData.id };
});
// result: RepositoryResultType<{ userId: string }>
```

## Migration Workflow

```bash
# 1. Modify schema files in src/db/schema/
# 2. Generate migration
npm run db:generate

# 3. Apply migration
npm run db:migrate

# 4. For dev-only quick sync (no migration file)
npm run db:push

# 5. Visual browser
npm run db:studio
```

## How to Add a New Table

1. Create `src/db/schema/your-table.schema.ts`
2. Define table with `pgTable()` and export inferred types
3. Re-export from `src/db/schema/index.ts`
4. Run `npm run db:generate` then `npm run db:migrate`
5. Create a repository in `src/repositories/` to access the table
