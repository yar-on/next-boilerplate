# Validations (`src/validations/`)

Zod validation schemas for input validation. Used in Server Actions, API routes, and forms.

## Rules

- Use `.validations.ts` suffix
- Export both the Zod schema and the inferred TypeScript type
- Name schemas with `Validation` suffix, types with `Type` suffix

## Available Schemas

### `user.validations.ts`

| Schema | Fields | Purpose |
|--------|--------|---------|
| `CreateUserValidation` | `email` (email), `name` (1-255 chars), `isActive?` (boolean) | Validate new user creation |
| `UpdateUserValidation` | All fields optional | Validate user updates |

**Inferred types:** `CreateUserInputType`, `UpdateUserInputType`

### `preview-theme.validations.ts`

| Schema | Purpose |
|--------|---------|
| `PreviewColorsValidation` | Validates all color fields as strings |
| `PreviewTypographyValidation` | Validates font configs with ranges |
| `PreviewThemeValidation` | Full theme config validation |

**Inferred type:** `PreviewThemeValidationType`

## Form Integration (React Hook Form + Zod)

```tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserValidation, type CreateUserInputType } from '@/validations/user.validations';

const form = useForm<CreateUserInputType>({
    resolver: zodResolver(CreateUserValidation),
    defaultValues: { name: '', email: '' },
});

<input {...form.register('name')} />;
{form.formState.errors.name && <span>{form.formState.errors.name.message}</span>}
```

## Server-Side Validation

```tsx
const parsed = CreateUserValidation.safeParse(data);
if (!parsed.success) {
    return { success: false, error: new Error(parsed.error.issues[0].message) };
}
// parsed.data is type-safe
```

## How to Add a New Validation Schema

1. Create `src/validations/your-entity.validations.ts`
2. Define Zod schema and export inferred type:

```tsx
import { z } from 'zod';

export const CreateEntityValidation = z.object({
    name: z.string().min(1).max(255),
    // ... fields
});

export type CreateEntityInputType = z.infer<typeof CreateEntityValidation>;
```
