# Database Rules (Drizzle ORM + PostgreSQL)

## DB Client — Always use `getDb()` singleton

```typescript
// src/db/client.ts exports a lazy singleton — NEVER instantiate drizzle directly
import { getDb } from '@/db/client';

class MyRepository {
  private get db() {
    return getDb(); // lazy, avoids cold-start issues
  }
}
```

## Schema — Exact column conventions

```typescript
import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id:        uuid('id').defaultRandom().primaryKey(),          // always uuid PK
  email:     varchar('email', { length: 255 }).notNull().unique(),
  name:      varchar('name', { length: 255 }).notNull(),
  isActive:  boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Always export inferred types alongside table
export type UserType    = typeof users.$inferSelect;
export type NewUserType = typeof users.$inferInsert;
```

- `uuid().defaultRandom()` — always for PKs, never serial/int
- `timestamp({ withTimezone: true })` — always include timezone
- `varchar` with explicit `length` — never `text` for bounded strings
- Snake_case column names, camelCase field names
- Always add `createdAt` / `updatedAt` to entities

## Query patterns

```typescript
import { eq, desc, and, isNull } from 'drizzle-orm';

// Single row
const [row] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);

// Insert with returning
const [created] = await this.db.insert(users).values(data).returning();

// Update with returning
const [updated] = await this.db
  .update(users)
  .set({ ...data, updatedAt: new Date() })
  .where(eq(users.id, id))
  .returning();

// Delete
await this.db.delete(users).where(eq(users.id, id));
```

- Always destructure `[row]` from selects — never `.then(rows => rows[0])`
- Always add `updatedAt: new Date()` on updates
- Use `.returning()` for insert/update — avoids a second query

## Migration workflow

```bash
# 1. Edit src/db/schema/*.schema.ts
# 2. Generate migration
npm run db:generate

# 3. Review the generated SQL in src/db/migrations/
# 4. Check consistency
npm run db:check

# 5. Apply (confirm with user first — irreversible)
npm run db:migrate
```

- NEVER use `db:push` in production
- NEVER write raw SQL with user input — Drizzle parameterizes automatically
- NEVER import `getDb()` outside `src/repositories/` or `src/db/`
