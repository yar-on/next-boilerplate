# Hooks (`src/hooks/`)

Custom React hooks for reusable stateful logic. Client-side only.

## Rules

- Naming: `use-*.hooks.ts` (kebab-case with `use-` prefix and `.hooks.ts` suffix)
- Client-side only — used in `'use client'` components
- Only create a hook when logic is reused in 2+ components

## Available Hooks

### `use-preview-theme.hooks.ts`

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `config` | `PreviewThemeConfigType` | Current theme config |
| `theme` | `Theme` | Generated MUI theme object |
| `isLoaded` | `boolean` | Always `true` |
| `setMode(mode)` | function | Update light/dark mode |
| `setColor(mode, colorKey, value)` | function | Update a specific color |
| `setTypography(key, value)` | function | Update typography property |
| `setBorderRadius(radius)` | function | Update border radius |
| `resetToDefaults()` | function | Reset to default theme |
| `importConfig(config)` | function | Validate and import config |
| `exportConfig()` | function | Export current config |

**Dependencies:** `usePreviewThemeContext()`, `createThemeFromConfig()`, `PreviewThemeValidation`

## How to Create a New Hook

1. Create `src/hooks/use-your-hook.hooks.ts`
2. Export a named function starting with `use`:

```tsx
import { useState, useEffect } from 'react';

export function useYourHook(param: string) {
    const [state, setState] = useState(null);

    useEffect(() => {
        // effect logic
    }, [param]);

    return { state };
}
```
