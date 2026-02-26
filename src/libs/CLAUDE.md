# Libraries (`src/libs/`)

Third-party library wrappers and configuration singletons.

## Available Libraries

| File | Purpose |
|------|---------|
| `env.libs.ts` | Zod-validated environment variables |
| `mui-theme.libs.ts` | MUI theme factory function |
| `emotion-cache.libs.tsx` | Emotion SSR cache provider for App Router |
| `theme-config.libs.ts` | Loads and validates `theme-config.json` from project root |

### `env.libs.ts`

Exports `Env` (parsed config object) and `EnvType` (Zod-inferred type).

**Validated variables:**

| Variable | Type | Required | Notes |
|----------|------|----------|-------|
| `NODE_ENV` | `'development' \| 'test' \| 'production'` | No | Default: `'development'` |
| `NODE_VERSION` | string | Yes | From `process.version` |
| `NODE_PLATFORM` | string | Yes | From `process.platform` |
| `NEXT_PUBLIC_APP_URL` | URL string | No | Client-exposed |
| `DEFAULT_LOCALE` | `'en' \| 'he'` | No | Default: `'en'` |
| `SUPPORTED_LOCALES` | string | No | Comma-separated: `'en,he'` |
| `DATABASE_URL` | string | Yes | Must start with `postgresql://` or `postgres://` |
| `API_SECRET_KEY` | string | No | Server-only secret |

**Usage:**
```tsx
import { Env } from '@/libs/env.libs';
const dbUrl = Env.DATABASE_URL;
```

### `mui-theme.libs.ts`

Exports `getTheme(mode: PaletteMode)` — factory function returning MUI Theme.

- Supports light/dark modes
- Default primary: `#1976d2`, secondary: `#9c27b0`
- Default font: Inter, border radius: 8px
- Includes component overrides for MUI components

### `emotion-cache.libs.tsx`

Exports `NextAppDirEmotionCacheProvider` — client component for SSR styling.

- Registers inserted styles with `useServerInsertedHTML()`
- Handles both global and scoped Emotion styles
- Required wrapper for MUI in Next.js App Router

### `theme-config.libs.ts`

Exports `loadThemeConfig()` — loads `theme-config.json` from project root.

- Returns `PreviewThemeConfigType | null`
- Validates with `PreviewThemeValidation` Zod schema
- Caches result in production, re-reads in development
- Returns null if file doesn't exist or is invalid

## How to Add a New Library Wrapper

1. Create `src/libs/your-lib.libs.ts` (or `.tsx` for JSX)
2. Wrap third-party initialization, export singleton or factory
3. Keep configuration centralized — consumers should not need to know initialization details
