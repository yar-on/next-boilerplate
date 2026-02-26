# Validation Rules (Zod)

## File location & naming

```
src/validations/<entity>.validations.ts
```

Naming convention: `<Action><Entity>Validation` (PascalCase + `Validation` suffix).

## Schema structure

```typescript
// src/validations/user.validations.ts
import { z } from 'zod';

export const CreateUserValidation = z.object({
  email:    z.string().email('Invalid email format').max(255),
  name:     z.string().min(1, 'Name is required').max(255),
  isActive: z.boolean().optional().default(true),
});

export const UpdateUserValidation = z.object({
  email:    z.string().email('Invalid email format').max(255).optional(),
  name:     z.string().min(1).max(255).optional(),
  isActive: z.boolean().optional(),
});

// Always export inferred types alongside schemas
export type CreateUserInputType = z.infer<typeof CreateUserValidation>;
export type UpdateUserInputType = z.infer<typeof UpdateUserValidation>;
```

## Using `safeParse` — never `parse`

```typescript
// ✅ correct — handles errors gracefully
const parse = CreateUserValidation.safeParse(inputData);
if (!parse.success) {
  return {
    success: false,
    error: new Error(parse.error.issues[0]?.message ?? 'Validation failed'),
  };
}
const validatedData = parse.data; // type-safe

// ❌ never — throws on invalid input
const data = CreateUserValidation.parse(inputData); // can throw!
```

## FormData parsing

```typescript
// In Server Actions — extract from FormData, then validate
const parse = CreateUserValidation.safeParse({
  email: formData.get('email'),    // returns string | null
  name:  formData.get('name'),
});
```

## API route body parsing

```typescript
// In route handlers — parse JSON body, then validate
const body = (await request.json()) as Record<string, unknown>;
const parse = CreateUserValidation.safeParse(body);
if (!parse.success) {
  return NextResponse.json(
    { data: null, error: parse.error.issues[0]?.message ?? 'Invalid input' },
    { status: 422 }
  );
}
```

## Complex schemas (nested objects, enums)

```typescript
export const PreviewThemeValidation = z.object({
  version: z.string(),
  mode:    z.enum(['light', 'dark']),
  colors: z.object({
    light: PreviewColorsValidation,
    dark:  PreviewColorsValidation,
  }),
  typography:   PreviewTypographyValidation,
  borderRadius: z.number().min(0).max(100),
});
```

## Client-side form validation (React Hook Form)

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserValidation, type CreateUserInputType } from '@/validations/user.validations';

const form = useForm<CreateUserInputType>({
  resolver: zodResolver(CreateUserValidation),
  defaultValues: { email: '', name: '' },
});
```

## Rules

- ALWAYS use `safeParse` — never `parse` (which throws)
- ALWAYS export the inferred type alongside the schema
- Schema names end in `Validation`, inferred types end in `InputType`
- Provide human-readable error messages in schema (`.email('Invalid email format')`)
- Validate on BOTH client (React Hook Form) and server (Server Action / API route)
- For `z.enum()`, use string literals — not TypeScript enums
