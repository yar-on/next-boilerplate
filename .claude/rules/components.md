# Component Rules

## Default: Server Component (no directive)

```tsx
// src/app/[locale]/page.tsx — server component pattern
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });
  return { title: t('title'), description: t('description') };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale); // required for static rendering

  const t = await getTranslations({ locale, namespace: 'pages.home' });

  return <main>{t('title')}</main>;
}
```

## Client Component — only when required

Add `'use client'` only for: event handlers, `useState`/`useReducer`, `useEffect`, browser APIs, or React 19 hooks.

```tsx
'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';

type CounterPropsType = {
  initialCount?: number;
};

export function Counter({ initialCount = 0 }: CounterPropsType) {
  const [count, setCount] = useState(initialCount);
  const t = useTranslations('common');

  return (
    <button onClick={() => setCount((c) => c + 1)}>
      {t('count')}: {count}
    </button>
  );
}
```

## Props typing

```typescript
// Always suffix with PropsType
type UserCardPropsType = {
  userId: string;
  className?: string;
};

// Server component signature
export async function UserCard({ userId, className }: UserCardPropsType): Promise<JSX.Element> { ... }

// Client component signature
export function UserCard({ userId, className }: UserCardPropsType) { ... }
```

## File structure

```
src/components/
├── ui/          # Generic reusable (Button, Input, Modal)
├── layouts/     # Page wrappers (Sidebar, PageLayout)
├── features/    # Feature-specific (UserProfile, OrderList)
└── shared/      # Cross-feature (Header, Footer, LanguageSelector)
```

- File name: `kebab-case.components.tsx` (e.g., `user-card.components.tsx`)
- One component per file (unless tightly coupled sub-components)
- No barrel `index.ts` — import directly: `import { UserCard } from '@/components/features/user-card/user-card.components'`

## Context + hydration safety

When a context depends on `localStorage` or browser APIs, guard against hydration mismatch:

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null; // prevents SSR mismatch
```

## MUI component usage

```tsx
import Button from '@mui/material/Button';       // tree-shakeable (preferred)
import { Box, Stack } from '@mui/material';       // ok for layout primitives
// NEVER: import * from '@mui/material'
```

Use `sx` prop for one-off styles, `styled()` for reusable styled components.
