# Constants (`src/constants/`)

Application-wide constant values. Use `as const` for type safety.

## Rules

- Use `.constants.ts` suffix
- Always use `as const` for literal types
- Feature-specific constants can be co-located with the feature instead

## Available Constants

### `preview.constants.ts`

| Constant | Type | Description |
|----------|------|-------------|
| `STORAGE_KEYS` | object | localStorage keys: `THEME_CONFIG`, `BUTTON_POSITION` |
| `FONT_OPTIONS` | array | 12 font options (Inter, Roboto, Open Sans, etc.) with categories |
| `FONT_WEIGHT_OPTIONS` | array | Font weights 100-900 with labels |
| `DEFAULT_PREVIEW_THEME` | `PreviewThemeConfigType` | Full default theme config (colors, typography, borderRadius) |
| `LOCALSTORAGE_DEBOUNCE_DELAY` | number | 300ms debounce for localStorage writes |
| `MAX_IMPORT_FILE_SIZE` | number | 100KB max for theme import files |

## How to Add New Constants

1. Create `src/constants/your-domain.constants.ts`
2. Use `as const` for type inference:

```tsx
export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    SETTINGS: '/settings',
} as const;
```
