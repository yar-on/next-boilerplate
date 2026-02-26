# Server Actions (`src/actions/`)

Server-side functions called from client components. Entry point for all client-initiated database operations.

## Rules

- All files use `'use server'` directive
- Validate input with Zod schemas before calling repositories
- Return `RepositoryResultType<T>` for consistency
- Call `revalidatePath()` or `revalidateTag()` after mutations
- Co-locate single-use actions in component files; shared actions go here

## Available Actions

### `user.action.ts`

| Action | Input | Description |
|--------|-------|-------------|
| `createUser(formData: FormData)` | FormData with name, email | Validates, checks duplicates, creates user |
| `updateUser({ id, data })` | Object with id + partial fields | Validates and updates user |
| `getUser(id)` | User UUID string | Fetches single user |
| `getAllUsers()` | None | Fetches all users ordered by createdAt |
| `deleteUser(id)` | User UUID string | Deletes user by ID |

## Pattern

```tsx
'use server';

import { revalidatePath } from 'next/cache';
import { YourValidation } from '@/validations/your.validations';
import { yourRepository } from '@/repositories/your.repository';
import type { RepositoryResultType } from '@/types/repository.types';

export async function createEntity(formData: FormData): Promise<RepositoryResultType<EntityType>> {
    // 1. Parse and validate input
    const parsed = YourValidation.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { success: false, error: new Error(parsed.error.issues[0].message) };
    }

    // 2. Business logic (duplicate checks, etc.)

    // 3. Call repository
    const result = await yourRepository.create({ data: parsed.data });

    // 4. Revalidate cache on success
    if (result.success) {
        revalidatePath('/your-path');
    }

    return result;
}
```

## How to Add a New Server Action

1. Create `src/actions/your-entity.action.ts` with `'use server'` directive
2. Create Zod validation in `src/validations/your-entity.validations.ts`
3. Validate all input before calling the repository
4. Return `RepositoryResultType<T>`
5. Call `revalidatePath()` or `revalidateTag()` after successful mutations
