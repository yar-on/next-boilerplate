# Context & Hooks Rules

## Context pattern

```tsx
// src/contexts/theme-mode.context.tsx

'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';

// 1. Define types
type ThemeModeType = 'light' | 'dark';

type ThemeModeContextType = {
  mode:         ThemeModeType;
  toggleTheme:  () => void;
  setThemeMode: (mode: ThemeModeType) => void;
};

// 2. Create context with undefined default (not null)
const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

// 3. Provider component
export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Lazy initializer for browser-only state
  const [mode, setMode] = useState<ThemeModeType>(() => {
    if (typeof window === 'undefined') return 'light'; // SSR default
    const saved = localStorage.getItem('theme-mode') as ThemeModeType | null;
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('theme-mode', mode);
  }, [mode, mounted]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      mode,
      toggleTheme:  () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
      setThemeMode: (newMode: ThemeModeType) => setMode(newMode),
    }),
    [mode]
  );

  // Prevent hydration mismatch — return null until mounted
  if (!mounted) return null;

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

// 4. Custom hook with guard
export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (context === undefined) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
}
```

## Hook pattern

```typescript
// src/hooks/use-preview-theme.hooks.ts
'use client';

import { useMemo, useCallback } from 'react';

export function usePreviewTheme() {
  const { themeConfig, updateThemeConfig } = usePreviewThemeContext();

  // useMemo for derived expensive values
  const theme = useMemo(() => createThemeFromConfig(themeConfig, themeConfig.mode), [themeConfig]);

  // useCallback for stable function references
  const setMode = useCallback(
    (mode: 'light' | 'dark') => {
      updateThemeConfig({ ...themeConfig, mode });
    },
    [themeConfig, updateThemeConfig]
  );

  return { theme, setMode };
}
```

## Rules

- All contexts and hooks are `'use client'` — never used in Server Components
- Context default value must be `undefined` (not `null` or a fake object) — guard in the hook
- Custom hook MUST throw a clear error if used outside its provider
- Memoize context `value` with `useMemo` keyed on state that triggers re-renders
- Use `mounted` guard when context reads `localStorage` or `window` — prevents hydration mismatch
- Hook files: `use-<name>.hooks.ts` in `src/hooks/`
- Context files: `<name>.context.tsx` in `src/contexts/`
- Export both the Provider and the custom hook from the same file

## Provider composition

```tsx
// Compose providers in layout — innermost wraps children
export function MuiThemeProvider({ children, themeConfig }: MuiThemeProviderPropsType) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeModeProvider>
        <MuiThemeProviderInternal themeConfig={themeConfig ?? null}>
          {children}
        </MuiThemeProviderInternal>
      </ThemeModeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
```
