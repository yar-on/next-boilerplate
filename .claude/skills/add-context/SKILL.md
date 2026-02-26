---
name: add-context
description: Scaffold a React context + provider + custom hook with hydration guard, useMemo, and mounted pattern
---

# Add Context

Create a new React context with provider and custom hook following project patterns.
Includes hydration-safe mounting guard, memoized value, and typed error boundary in the hook.

## Instructions

### 1. Parse the request

Extract from the user's request:
- **Context name** — e.g., `theme-mode`, `user-preferences`, `cart`
- **State shape** — what data the context holds
- **Browser APIs** — does it need `localStorage` or `window`? (determines if mounted guard is needed)

If the state shape or purpose is unclear, ask before generating.

### 2. Determine file path

```
src/contexts/<name>.context.tsx
```

Read `src/contexts/CLAUDE.md` for existing patterns and registered contexts.

### 3. Generate the context file

Use the full project pattern:

```typescript
'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

type <Name>ContextType = {
  // TODO: define the shape
  value: string;
  setValue: (value: string) => void;
};

// ── Context ────────────────────────────────────────────────────────────────

const <Name>Context = createContext<<Name>ContextType | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────────────────────

type <Name>ProviderPropsType = {
  children: React.ReactNode;
  // TODO: add props if needed (e.g. initialValue)
};

export function <Name>Provider({ children }: <Name>ProviderPropsType) {
  const [mounted, setMounted] = useState(false);

  // Lazy initializer — safe for SSR
  const [value, setValue] = useState<string>(() => {
    if (typeof window === 'undefined') return ''; // SSR default
    return localStorage.getItem('<storage-key>') ?? '';
  });

  // Mount guard — prevents hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Persist to localStorage after mount
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('<storage-key>', value);
    }
  }, [value, mounted]);

  // Memoize to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      value,
      setValue,
    }),
    [value]
  );

  // Do NOT render children until mounted — prevents hydration mismatch
  if (!mounted) return null;

  return <<Name>Context.Provider value={contextValue}>{children}</<Name>Context.Provider>;
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function use<Name>() {
  const context = useContext(<Name>Context);
  if (context === undefined) {
    throw new Error('use<Name> must be used within a <Name>Provider');
  }
  return context;
}
```

**If the context does NOT use browser APIs** (no `localStorage`/`window`), simplify by removing the `mounted` guard and lazy initializer:

```typescript
export function <Name>Provider({ children }: <Name>ProviderPropsType) {
  const [value, setValue] = useState<string>('');

  const contextValue = useMemo(() => ({ value, setValue }), [value]);

  return <<Name>Context.Provider value={contextValue}>{children}</<Name>Context.Provider>;
}
```

### 4. Decide on the mounted guard

Ask or infer from the request:
- **With localStorage/window** → include `mounted` guard (return `null` until mounted)
- **Pure state, no browser APIs** → omit the guard entirely

### 5. Register in the layout

Show the user where to add the provider in the component tree. Typical location: `src/app/[locale]/layout.tsx` or inside an existing provider wrapper in `src/libs/`.

Example composition:
```tsx
// Wrap inside existing providers
<ExistingProvider>
  <NewNameProvider>
    {children}
  </NewNameProvider>
</ExistingProvider>
```

### 6. Update CLAUDE.md

Update `src/contexts/CLAUDE.md` to document:
- The new context name and file path
- What state it manages
- The exported hook name

### 7. Report

Show the user:
- File path created
- Exported names (Provider + hook)
- Where to add the Provider in the tree
- Usage example for a consumer component:

```tsx
'use client';
import { use<Name> } from '@/contexts/<name>.context';

export function MyComponent() {
  const { value, setValue } = use<Name>();
  return <div>{value}</div>;
}
```

## Rules

- Context default MUST be `undefined` — never `null` or a fake object
- Custom hook MUST throw if called outside its Provider
- ALWAYS memoize the `contextValue` with `useMemo`
- ALWAYS use `mounted` guard when reading `localStorage` or `window` — prevents hydration mismatch
- File name: `<name>.context.tsx` in `src/contexts/`
- Export BOTH the Provider and the hook from the same file
- NEVER use context in Server Components — contexts are `'use client'` only
