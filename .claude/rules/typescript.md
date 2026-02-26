# TypeScript Rules

## `type` over `interface`

```typescript
// ✅ correct
type UserType = { id: string; email: string };
type UserPropsType = { userId: string; className?: string };

// ❌ avoid (use only when declaration merging is intentional)
interface User { id: string }
```

## Suffix conventions (mandatory)

| Suffix      | When to use                        | Example                         |
|-------------|------------------------------------|---------------------------------|
| `Type`      | All type aliases                   | `UserType`, `ApiResponseType`   |
| `PropsType` | Component props                    | `ButtonPropsType`               |
| `Enum`      | TypeScript enums                   | `LogSeverityEnum`               |
| `Interface` | When declaration merging is needed | `LocaleConfigInterface`         |

## Infer types from Drizzle schema

```typescript
// In schema file
export const users = pgTable('users', { ... });
export type UserType    = typeof users.$inferSelect;
export type NewUserType = typeof users.$inferInsert;

// In repository — import inferred types, not hand-written ones
import { users, type UserType, type NewUserType } from '@/db/schema';
```

## Infer types from Zod schemas

```typescript
export const CreateUserValidation = z.object({ email: z.string().email() });
export type CreateUserInputType = z.infer<typeof CreateUserValidation>;
// ↑ always export the inferred type alongside the schema
```

## No `any` — use `unknown` and narrow

```typescript
// ✅ correct
} catch (error) {
  return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
}

// ❌ never
} catch (error: any) { ... }
```

## `as const` for constant objects/arrays

```typescript
export const STORAGE_KEYS = {
  THEME_CONFIG:    'preview-theme-config',
  BUTTON_POSITION: 'theme-button-position',
} as const;

export const locales = ['en', 'he'] as const;
export type LocaleType = (typeof locales)[number]; // literal union from array
```

## Import order

```typescript
// 1. React / Next.js
import { useState, useEffect } from 'react';
import type { Metadata } from 'next';

// 2. Third-party
import { z } from 'zod';
import { eq } from 'drizzle-orm';

// 3. Alias imports — @/
import { getDb } from '@/db/client';
import { logger } from '@/utils/logger/logger.server.utils';

// 4. Relative
import { MyHelper } from './helper';

// 5. Types (can be grouped with #3 using `import type`)
import type { UserType } from '@/db/schema';
```

## Utility types

```typescript
// Use built-in utility types
type PartialUser    = Partial<UserType>;
type PickedUser     = Pick<UserType, 'id' | 'email'>;
type OmittedUser    = Omit<UserType, 'createdAt' | 'updatedAt'>;
type NullableUser   = UserType | null;    // prefer this over Nullable<T>
type OptionalUser   = UserType | undefined;

// Exhaustive switch
function assertNever(x: never): never {
  throw new Error('Unexpected value: ' + x);
}
```

## Avoid

- `any` — use `unknown` and narrow
- Non-null assertion (`!`) — guard explicitly
- Type casting with `as` except for `as const` and narrowing
- `namespace` or `module` declarations
- Barrel exports (`export * from`) — use direct imports
