# Server Actions Rules

## File location & naming

- Reusable across multiple pages: `src/actions/<name>.action.ts`
- Used by a single page/component: co-locate next to it
- Always starts with `'use server'` directive

## Canonical action pattern

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { userRepository } from '@/repositories/user.repository';
import { CreateUserValidation } from '@/validations/user.validations';
import type { RepositoryResultType } from '@/types/repository.types';
import type { UserType } from '@/db/schema';

export async function createUser(formData: FormData): Promise<RepositoryResultType<UserType>> {
  // 1. Validate input
  const parse = CreateUserValidation.safeParse({
    email: formData.get('email'),
    name:  formData.get('name'),
  });

  if (!parse.success) {
    return {
      success: false,
      error: new Error(parse.error.issues[0]?.message ?? 'Validation failed'),
    };
  }

  // 2. Business logic (e.g., duplicate check)
  const existing = await userRepository.findByEmail({ email: parse.data.email });
  if (existing.success && existing.data) {
    return { success: false, error: new Error('Email already registered') };
  }

  // 3. Repository call
  const result = await userRepository.create({ data: parse.data });

  // 4. Revalidate cache on success
  if (result.success) {
    revalidatePath('/users');
  }

  return result;
}
```

## Rules

- ALWAYS validate with Zod `safeParse` — never trust raw input
- Return `RepositoryResultType<T>` — never throw, never return plain objects
- Use `revalidatePath()` or `revalidateTag()` after mutations
- For JSON body (not FormData): use `params: { data: CreateUserInputType }` typed arg
- No direct `console.log` — use server logger if needed

## Client-side usage

```tsx
'use client';
import { createUser } from '@/actions/user.action';

export function CreateUserForm() {
  const handleSubmit = async (formData: FormData) => {
    const result = await createUser(formData);
    if (!result.success) {
      // show result.error.message
    }
  };

  return <form action={handleSubmit}>{/* fields */}</form>;
}
```
