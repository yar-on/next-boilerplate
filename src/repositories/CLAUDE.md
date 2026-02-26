# Repositories (`src/repositories/`)

Database access layer. ALL database operations MUST go through repositories.

## Rules

- Singleton class instances exported from `*.repository.ts`
- All methods return `RepositoryResultType<T>` — never throw errors
- Method params via object: `{ id?, data?, ... }`
- Auto-set `updatedAt` on updates
- NEVER import `getDb()` outside `src/db/` and `src/repositories/`

## Available Repository

### `userRepository` (`user.repository.ts`)

| Method | Params | Returns | Description |
|--------|--------|---------|-------------|
| `create` | `{ data: NewUserType }` | `RepositoryResultType<UserType>` | Insert new user |
| `findById` | `{ id: string }` | `RepositoryResultType<UserType>` | Find by UUID |
| `findByEmail` | `{ email: string }` | `RepositoryResultType<UserType>` | Find by email |
| `findAll` | none | `RepositoryResultType<UserType[]>` | All users, ordered by createdAt DESC |
| `update` | `{ id: string; data: Partial<NewUserType> }` | `RepositoryResultType<UserType>` | Update fields, auto-sets updatedAt |
| `delete` | `{ id: string }` | `RepositoryResultType<UserType>` | Delete by UUID |

## Usage

```tsx
import { userRepository } from '@/repositories/user.repository';

const result = await userRepository.findById({ id: 'user123' });
if (!result.success) return handleError(result.error);
const user = result.data; // Type-safe UserType
```

## RepositoryResultType Pattern

```tsx
type RepositoryResultType<T> =
    | { success: true; data: T }
    | { success: false; error: Error };
```

## How to Create a New Repository

1. Create `src/repositories/your-entity.repository.ts`
2. Follow the singleton class pattern:

```tsx
import { eq, desc } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { yourTable } from '@/db/schema';
import type { RepositoryResultType } from '@/types/repository.types';
import type { YourEntityType, NewYourEntityType } from '@/db/schema/your-entity.schema';

class YourEntityRepository {
    private get db() {
        return getDb();
    }

    async findById(params: { id: string }): Promise<RepositoryResultType<YourEntityType>> {
        try {
            const [result] = await this.db.select().from(yourTable).where(eq(yourTable.id, params.id));
            if (!result) return { success: false, error: new Error('Not found') };
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
        }
    }

    // ... other methods
}

export const yourEntityRepository = new YourEntityRepository();
```

3. Add corresponding Server Actions in `src/actions/`
4. Reference implementation: `src/repositories/user.repository.ts`
