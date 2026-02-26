# Types (`src/types/`)

Shared TypeScript types, interfaces, and enums used across the application.

## Rules

- Suffix types with `Type`, interfaces with `Interface`, enums with `Enum`
- Use `*.types.ts` for feature-specific files
- Prefer `type` over `interface` (project convention)
- Feature-specific types can be co-located in feature directories instead

## Available Types

| File | Exports | Purpose |
|------|---------|---------|
| `repository.types.ts` | `RepositoryResultType<T>`, `RepositorySuccessType<T>`, `RepositoryErrorType` | Consistent result pattern for all repository/service methods |
| `index.ts` | `ApiResponse<T>`, `Nullable<T>`, `Optional<T>`, re-exports | Global utility types |
| `preview.types.ts` | `PreviewThemeConfigType`, `PreviewColorsType`, `PreviewTypographyType`, `FontOptionType`, `DemoTypeType`, etc. | Theme preview feature types |
| `locales.types.ts` | `SupportedLocaleType`, `LocaleDirectionType`, `LocaleConfigInterface`, `LOCALE_CONFIG` | i18n locale types |

### RepositoryResultType (core pattern)

```tsx
type RepositorySuccessType<T> = { success: true; data: T };
type RepositoryErrorType = { success: false; error: Error };
type RepositoryResultType<T> = RepositorySuccessType<T> | RepositoryErrorType;

// Usage
const result = await userRepository.findById({ id });
if (!result.success) return handleError(result.error);
const user = result.data; // Type-safe T
```

## TypeScript Patterns

```tsx
// Props types
type ButtonPropsType = {
    variant: 'primary' | 'secondary';
    onClick: () => void;
    children: React.ReactNode;
};

// satisfies (constraint without losing literals)
const config = { ... } satisfies Config;

// Extract props from component
React.ComponentProps<typeof Component>;

// Utility types
Partial<T>, Pick<T, K>, Omit<T, K>;

// Exhaustive checking
default: {
    const _exhaustive: never = action;
    throw new Error(`Unhandled: ${action}`);
}
```

## How to Add New Types

1. **Shared across features:** Add to `src/types/your-domain.types.ts`
2. **Feature-specific:** Co-locate with the feature (e.g., `src/components/preview/preview.types.ts`)
3. **Database types:** Export from schema files (`$inferSelect` / `$inferInsert`)
4. Re-export shared types from `src/types/index.ts` if widely used
