# Repository Rules

## RepositoryResultType — mandatory return type

```typescript
// src/types/repository.types.ts defines:
type RepositorySuccessType<T> = { success: true; data: T };
type RepositoryErrorType      = { success: false; error: Error };
type RepositoryResultType<T>  = RepositorySuccessType<T> | RepositoryErrorType;
```

Every repository method MUST return `Promise<RepositoryResultType<T>>`. Never throw.

## Repository class structure

```typescript
// src/repositories/user.repository.ts
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { users, type UserType, type NewUserType } from '@/db/schema';
import type { RepositoryResultType } from '@/types/repository.types';

class UserRepository {
  private get db() { return getDb(); }

  async create(params: { data: NewUserType }): Promise<RepositoryResultType<UserType>> {
    try {
      const [user] = await this.db.insert(users).values(params.data).returning();
      if (!user) {
        return { success: false, error: new Error('Creation failed — no record returned') };
      }
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  async findById(params: { id: string }): Promise<RepositoryResultType<UserType | null>> {
    try {
      const [user] = await this.db.select().from(users).where(eq(users.id, params.id)).limit(1);
      return { success: true, data: user ?? null };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  async update(params: { id: string; data: Partial<NewUserType> }): Promise<RepositoryResultType<UserType>> {
    try {
      const [user] = await this.db
        .update(users)
        .set({ ...params.data, updatedAt: new Date() })
        .where(eq(users.id, params.id))
        .returning();
      if (!user) {
        return { success: false, error: new Error('Not found or update failed') };
      }
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  async delete(params: { id: string }): Promise<RepositoryResultType<void>> {
    try {
      await this.db.delete(users).where(eq(users.id, params.id));
      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }
}

export const userRepository = new UserRepository();
```

## Rules

- Params are always a single **named object**: `params: { id: string }` — never positional args
- `findById` returns `UserType | null` (not throws) when not found
- `delete` returns `RepositoryResultType<void>`
- Export a singleton instance (`export const userRepository = new UserRepository()`)
- File name: `<entity>.repository.ts` in `src/repositories/`
- NEVER import repositories in Client Components — only in Server Actions, API routes, services

## Consuming results

```typescript
// Always check success before accessing data
const result = await userRepository.findById({ id });
if (!result.success) {
  // result.error is an Error instance
  return { success: false, error: result.error };
}
const user = result.data; // type-safe UserType | null
```
