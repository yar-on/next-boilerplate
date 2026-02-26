# Services (`src/services/`)

Business logic layer for multi-step operations that coordinate multiple repositories or handle side effects.

## When to Use

- Multi-step operations (create user + send email + log event)
- Business rules that span multiple entities
- Coordinating multiple repositories
- Side effects (email, notifications, cache invalidation)
- Complex logic beyond simple CRUD

**Simple CRUD:** Server Actions can call repositories directly — no service layer needed.

## Rules

- Naming: `*.services.ts`
- Singleton class instances (same pattern as repositories)
- Return `RepositoryResultType<T>` for consistency
- Use `withTransaction()` for atomic multi-table operations
- Handle errors — never throw, always return result objects

## Current State

This directory is currently empty. Create the first service when business logic complexity warrants it.

## Pattern

```tsx
import { withTransaction } from '@/db/utils/transaction.utils';
import { userRepository } from '@/repositories/user.repository';
import type { RepositoryResultType } from '@/types/repository.types';

class UserService {
    async registerUser(data: { name: string; email: string }): Promise<RepositoryResultType<UserType>> {
        // 1. Create user in database
        const result = await userRepository.create({ data });
        if (!result.success) return result;

        // 2. Side effects (email, logging, etc.)
        // await emailService.sendWelcome(result.data.email);
        // logger.info('User registered', { userId: result.data.id });

        return result;
    }

    async transferOwnership(params: { fromId: string; toId: string }): Promise<RepositoryResultType<void>> {
        // Use transaction for atomic multi-table operations
        return withTransaction(async (tx) => {
            // ... multiple operations within single transaction
        });
    }
}

export const userService = new UserService();
```

## How to Create a New Service

1. Create `src/services/your-entity.services.ts`
2. Define singleton class with business methods
3. Return `RepositoryResultType<T>` from all methods
4. Use `withTransaction()` when multiple tables are involved
5. Call from Server Actions or API routes
