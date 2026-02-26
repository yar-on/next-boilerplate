# Internationalization (i18n) Guide

## Overview

This project uses **next-intl** for internationalization with URL-based locale routing. Translations are managed through unified JSON files, and the system supports both LTR (Left-to-Right) and RTL (Right-to-Left) languages.

## Architecture

### URL Structure

- **English (default)**: `/` or `/en/page`
- **Hebrew**: `/he/page`
- The default locale (`en`) can omit the prefix using `localePrefix: 'as-needed'`

### File Structure

```
src/i18n/
├── config.ts          # Locale configuration (locales, directions, labels)
├── request.ts         # Translation loading configuration
├── navigation.ts      # Type-safe navigation helpers
└── CLAUDE.md         # This file

src/locales/
├── en.json           # English translations
└── he.json           # Hebrew translations

src/proxy.ts     # Next.js proxy (middleware) for locale detection (create when needed)
```

## How It Works

### 1. Middleware Layer

A `src/middleware.ts` file should be created to use next-intl's `createMiddleware()` for:

- Detecting user's preferred locale from browser/cookies
- Redirecting `/` to `/en` (default locale)
- Handling locale switching via URL changes

**Note:** This file may not exist yet — create it using next-intl's middleware when locale routing is needed.

### 2. Configuration (`src/i18n/config.ts`)

Defines:

- **Supported locales**: `['en', 'he']`
- **Default locale**: `'en'`
- **Locale labels**: Display names for language selector
- **Locale directions**: `ltr` for English, `rtl` for Hebrew

### 3. Translation Loading (`src/i18n/request.ts`)

- Dynamically imports locale JSON files based on current locale
- Provides translations to all components via next-intl

### 4. Navigation (`src/i18n/navigation.ts`)

Exports type-safe wrappers:

- `Link`: Locale-aware Link component
- `useRouter()`: Locale-aware router
- `usePathname()`: Get current pathname
- `redirect()`: Programmatic navigation

## Using Translations

### Server Components

```typescript
import { getTranslations } from 'next-intl/server';

export async function MyServerComponent() {
  const t = await getTranslations('namespace');

  return <h1>{t('title')}</h1>;
}
```

### Client Components

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function MyClientComponent() {
  const t = useTranslations('namespace');

  return <button>{t('submit')}</button>;
}
```

### With Variables

```typescript
// Translation: "Welcome, {name}!"
const greeting = t('welcome', { name: 'John' });
// Result: "Welcome, John!"
```

### Getting Current Locale

```typescript
// Server Component
import { getLocale } from 'next-intl/server';
const locale = await getLocale();

// Client Component
import { useLocale } from 'next-intl';
const locale = useLocale();
```

## Navigation

### Use Locale-Aware Navigation

```typescript
// ❌ DON'T use next/link
import Link from 'next/link';

// ✅ DO use i18n navigation
import { Link } from '@/i18n/navigation';

<Link href="/about">About</Link>
// Automatically becomes /en/about or /he/about
```

### Programmatic Navigation

```typescript
'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: 'en' | 'he') => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <button onClick={() => switchLocale('he')} disabled={isPending}>
      Switch to Hebrew
    </button>
  );
}
```

## Language Direction (RTL/LTR)

### How It Works

Direction is automatically applied based on locale configuration in `src/i18n/config.ts`:

```typescript
export const localeDirections: Record<LocaleType, 'ltr' | 'rtl'> = {
    en: 'ltr', // Left-to-Right
    he: 'rtl', // Right-to-Left
};
```

The `[locale]/layout.tsx` reads this config and sets:

```tsx
<html lang={locale} dir={direction}>
```

### Font Switching

Fonts automatically switch based on locale:

- **English**: Inter font (sans-serif)
- **Hebrew**: Heebo font (Hebrew-optimized)

Configuration in `[locale]/layout.tsx`:

```typescript
const fontClasses = locale === 'he' ? heebo.className : inter.className;
```

### CSS for RTL

Use CSS logical properties for automatic RTL support:

```css
/* ❌ Avoid */
margin-left: 10px;
padding-right: 20px;

/* ✅ Use logical properties */
margin-inline-start: 10px; /* Left in LTR, Right in RTL */
padding-inline-end: 20px; /* Right in LTR, Left in RTL */
```

### MUI Theme Direction

MUI theme direction is synchronized:

```typescript
const theme = createTheme({
    direction: locale === 'he' ? 'rtl' : 'ltr',
    // ... other theme config
});
```

## Adding a New Language

### Step 1: Create Translation File

Create `src/locales/{locale}.json` with all translation keys:

```json
// src/locales/fr.json
{
    "common": {
        "welcome": "Bienvenue, {name}!",
        "loading": "Chargement...",
        "error": "Erreur"
    },
    "pages": {
        "home": {
            "title": "Accueil"
        }
    }
    // ... copy structure from en.json or he.json
}
```

**Important:** Ensure all translation keys match the structure in `en.json`.

### Step 2: Update Configuration

Update `src/i18n/config.ts`:

```typescript
// Add locale to array
export const locales = ['en', 'he', 'fr'] as const;

// Add label
export const localeLabels: Record<LocaleType, string> = {
    en: 'English',
    he: 'עברית',
    fr: 'Français', // Add new label
};

// Add direction
export const localeDirections: Record<LocaleType, 'ltr' | 'rtl'> = {
    en: 'ltr',
    he: 'rtl',
    fr: 'ltr', // French is LTR
};
```

### Step 3: Update Middleware (Optional)

If needed, update the matcher in `src/middleware.ts`:

```typescript
export const config = {
    matcher: ['/', '/(en|he|fr)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
    //                      ^^^ Add new locale here
};
```

### Step 4: Add Font (Optional)

If the language requires a special font, update `[locale]/layout.tsx`:

```typescript
import { Inter, Heebo, Roboto } from 'next/font/google';

const roboto = Roboto({
    subsets: ['latin', 'latin-ext'],
    weight: ['400', '700'],
    display: 'swap',
    variable: '--font-roboto',
});

// Update font selection logic
const fontClasses = locale === 'he' ? heebo.className : locale === 'fr' ? roboto.className : inter.className;
```

### Step 5: Test

1. Build the project: `npm run build`
2. Navigate to `http://localhost:3000/fr`
3. Test language switching
4. Verify all translations load correctly

## Translation File Structure

### Namespace Organization

Organize translations by feature/domain:

```json
{
    "common": {
        "buttons": { "submit": "Submit", "cancel": "Cancel" },
        "messages": { "success": "Success!", "error": "Error" }
    },
    "pages": {
        "home": { "title": "Home", "subtitle": "Welcome" },
        "about": { "title": "About Us" }
    },
    "components": {
        "header": { "logo": "Logo", "menu": "Menu" },
        "footer": { "copyright": "© 2026" }
    }
}
```

### Using Nested Namespaces

```typescript
// Access nested translations
const t = await getTranslations('pages.home');
const title = t('title'); // "Home"

// Or access directly
const t = await getTranslations();
const title = t('pages.home.title'); // "Home"
```

## Best Practices

### 1. Never Use Curly Braces for Non-Variables

```json
// ❌ WRONG - next-intl will interpret {3} as a variable
"description": "Component with elevation={3}"

// ✅ CORRECT
"description": "Component with elevation=3"

// ✅ CORRECT - If you need braces, use variables
"description": "Component with elevation={level}"
// Then pass: t('description', { level: 3 })
```

### 2. Keep Translation Keys Consistent

All locale files should have identical keys:

```bash
# Use this command to compare keys
diff <(jq -r 'keys' src/locales/en.json) <(jq -r 'keys' src/locales/he.json)
```

### 3. Use Meaningful Namespaces

```typescript
// ❌ BAD
const t = useTranslations();
t('string1');
t('string2');

// ✅ GOOD
const t = useTranslations('auth.login');
t('title');
t('emailLabel');
```

### 4. Handle Pluralization

```json
{
    "itemCount": "{count, plural, =0 {No items} one {# item} other {# items}}"
}
```

```typescript
t('itemCount', { count: 0 }); // "No items"
t('itemCount', { count: 1 }); // "1 item"
t('itemCount', { count: 5 }); // "5 items"
```

### 5. Date and Number Formatting

Use next-intl's formatting utilities:

```typescript
import { useFormatter } from 'next-intl';

export function MyComponent() {
  const format = useFormatter();

  const date = format.dateTime(new Date(), {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const number = format.number(1234.56, {
    style: 'currency',
    currency: 'USD'
  });

  return <div>{date} - {number}</div>;
}
```

## Troubleshooting

### Issue: Translation Not Found

**Symptom:** Key displays as-is instead of translation
**Solution:**

- Verify key exists in locale JSON file
- Check namespace matches
- Ensure JSON is valid (no trailing commas)

### Issue: Hydration Mismatch

**Symptom:** React hydration warning
**Solution:**

- Don't use `Date.now()` or `Math.random()` in translations
- Ensure server and client use same locale

### Issue: Language Switching Not Working

**Solution:**

- Use `@/i18n/navigation` imports (not `next/link`)
- Ensure middleware is configured correctly
- Check browser console for errors

### Issue: RTL Layout Issues

**Solution:**

- Use CSS logical properties (`margin-inline-start` instead of `margin-left`)
- Test with Hebrew locale (`/he`)
- Verify MUI theme has `direction: 'rtl'`

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/)
- [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
