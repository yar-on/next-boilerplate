# Test Utilities

This directory contains shared testing utilities for the i18n and RTL/LTR features.

## Files

### `mock-translations.ts`

Mock translation data for testing i18n functionality in both English and Hebrew.

**Exports:**

- `mockEnTranslations` - English translations for preview demos
- `mockHeTranslations` - Hebrew translations for preview demos

**Usage:**

```typescript
import { mockEnTranslations, mockHeTranslations } from '@/../test-utils/mock-translations';

renderWithLocale(<MyComponent />, {
  locale: 'en',
  translations: mockEnTranslations,
});
```

### `render-with-locale.tsx`

Custom render function that wraps components with `LocaleProvider` and `ThemeProvider`.

**Function:** `renderWithLocale(ui, options)`

**Parameters:**

- `ui` - React element to render
- `options.locale` - Locale to use ('en' or 'he'), defaults to 'en'
- `options.translations` - Translation object, defaults to empty object
- `...renderOptions` - Additional options passed to `@testing-library/react` render

**Returns:** Render result from `@testing-library/react`

**Usage:**

```typescript
import { renderWithLocale } from '@/../test-utils/render-with-locale';
import { mockEnTranslations } from '@/../test-utils/mock-translations';

// Render with English
renderWithLocale(<DashboardDemo />, {
  locale: 'en',
  translations: mockEnTranslations,
});

// Render with Hebrew
renderWithLocale(<DashboardDemo />, {
  locale: 'he',
  translations: mockHeTranslations,
});
```

## Benefits

1. **Consistent Testing**: All component tests use the same locale context setup
2. **Type Safety**: Full TypeScript support with proper types
3. **Theme Integration**: Automatically configures MUI theme direction (LTR/RTL)
4. **DRY Principle**: Avoid repeating locale provider setup in every test
5. **Easy to Extend**: Add more mock translations as needed

## Adding New Translations

To add translations for a new demo or feature:

1. Update `mockEnTranslations` with English keys
2. Update `mockHeTranslations` with corresponding Hebrew translations
3. Maintain the same structure in both objects

Example:

```typescript
// In mock-translations.ts
export const mockEnTranslations = {
    preview: {
        demos: {
            newDemo: {
                title: 'New Demo',
                subtitle: 'Demo subtitle',
            },
        },
    },
};

export const mockHeTranslations = {
    preview: {
        demos: {
            newDemo: {
                title: 'דמו חדש',
                subtitle: 'כותרת משנה לדמו',
            },
        },
    },
};
```
