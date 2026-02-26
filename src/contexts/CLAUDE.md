# Contexts (`src/contexts/`)

React Context providers for global client-side state.

## Rules

- All context files are client components (`'use client'`)
- Each context exports: Provider component + `use*` hook
- Hooks throw if used outside their provider
- Use localStorage for persistence with hydration safety (render null during SSR)

## Available Contexts

| File | Context | Hook | Purpose |
|------|---------|------|---------|
| `theme-mode.context.tsx` | `ThemeModeProvider` | `useThemeMode()` | Light/dark mode with localStorage persistence |
| `mui-theme.context.tsx` | `MuiThemeProvider` | — | Combines Emotion cache + ThemeModeProvider + MUI ThemeProvider |
| `preview-theme.context.tsx` | `PreviewThemeProvider` | `usePreviewThemeContext()` | Theme customization state for preview feature |

### ThemeModeContext

```tsx
const { mode, toggleTheme, setThemeMode } = useThemeMode();
// mode: 'light' | 'dark'
// Persists to localStorage, checks system preference as fallback
// Returns null during SSR to prevent hydration mismatch
```

### MuiThemeProvider

Wrapper that combines:
1. `NextAppDirEmotionCacheProvider` (Emotion SSR cache)
2. `ThemeModeProvider` (light/dark state)
3. MUI `ThemeProvider` (applies theme)

Accepts optional `themeConfig` prop for preview feature.

### PreviewThemeContext

```tsx
const { themeConfig, updateThemeConfig, resetTheme } = usePreviewThemeContext();
```

## How to Create a New Context

1. Create `src/contexts/your-context.context.tsx`
2. Add `'use client'` directive
3. Define context type, create context with `createContext<YourType | null>(null)`
4. Export Provider component and `useYourContext()` hook
5. Handle hydration safety if using localStorage/browser APIs

```tsx
'use client';
import { createContext, useContext, useState } from 'react';

type YourContextType = { value: string; setValue: (v: string) => void };

const YourContext = createContext<YourContextType | null>(null);

export function YourProvider({ children }: { children: React.ReactNode }) {
    const [value, setValue] = useState('');
    return <YourContext value={{ value, setValue }}>{children}</YourContext>;
}

export function useYourContext() {
    const ctx = useContext(YourContext);
    if (!ctx) throw new Error('useYourContext must be used within YourProvider');
    return ctx;
}
```
