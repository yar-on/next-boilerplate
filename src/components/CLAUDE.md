# Components (`src/components/`)

Reusable UI components organized by scope and purpose.

## Structure

```
components/
├── shared/                    # Cross-feature components
│   ├── header/
│   │   └── header.components.tsx
│   ├── language-selector/
│   │   └── language-selector.components.tsx
│   └── theme-toggle/
│       └── theme-toggle.components.tsx
├── server-info/               # Server-rendered components
│   ├── server-info.components.tsx
│   └── server-info.module.css
├── web-vitals/
│   └── web.vitals.components.tsx
├── preview/                   # Theme preview feature
│   ├── components-tab.components.tsx
│   ├── preview-theme-provider.components.tsx
│   ├── preview-theme-controls.components.tsx
│   ├── preview-navigation.components.tsx
│   ├── floating-theme-button.components.tsx
│   ├── theme-menu.components.tsx
│   ├── theme-color-section.components.tsx
│   ├── typography-controls.components.tsx
│   ├── radius-control.components.tsx
│   ├── theme-export.components.tsx
│   ├── theme-import.components.tsx
│   ├── back-to-top.components.tsx
│   ├── error-boundary.components.tsx
│   ├── __tests__/
│   └── demos/
│       ├── crm-demo.components.tsx
│       ├── dashboard-demo.components.tsx
│       ├── company-overview-demo.components.tsx
│       └── __tests__/
└── __tests__/
    └── server-info.components.test.tsx
```

## Component Catalog

| Component | Type | Location | Purpose |
|-----------|------|----------|---------|
| Header | Server | `shared/header/` | App header with language selector and theme toggle |
| LanguageSelector | Client | `shared/language-selector/` | Locale switcher using next-intl router |
| ThemeToggle | Client | `shared/theme-toggle/` | Light/dark mode toggle with MUI IconButton |
| ServerInfo | Server | `server-info/` | Displays server-side data (env, node version, timestamp) |
| WebVitals | Client | `web-vitals/` | Registers CLS, FCP, INP, LCP, TTFB callbacks |
| PreviewThemeProvider | Client | `preview/` | Wraps preview pages with theme context |
| PreviewThemeControls | Client | `preview/` | Theme customization panel |
| PreviewNavigation | Client | `preview/` | Navigation within preview section |
| FloatingThemeButton | Client | `preview/` | Draggable FAB to open theme menu |
| ThemeMenu | Client | `preview/` | Theme settings drawer/popover |
| ThemeColorSection | Client | `preview/` | Color palette editor |
| TypographyControls | Client | `preview/` | Font family/size/weight controls |
| RadiusControl | Client | `preview/` | Border radius slider |
| ThemeExport | Client | `preview/` | Export theme config as JSON |
| ThemeImport | Client | `preview/` | Import theme config from JSON file |
| BackToTop | Client | `preview/` | Scroll-to-top button |
| ErrorBoundary | Client | `preview/` | Error boundary for preview section |
| ComponentsTab | Client | `preview/` | MUI component showcase tab |
| DashboardDemo | Client | `preview/demos/` | Dashboard layout demo |
| CRMDemo | Client | `preview/demos/` | CRM interface demo |
| CompanyOverviewDemo | Client | `preview/demos/` | Company overview page demo |

## Rules

- **Server Components are the default** — no directive needed
- Add `'use client'` only for: event handlers, state, effects, browser APIs, React 19 hooks
- **Naming:** `kebab-case.components.tsx`
- **Composition:** Server can import Client directly. Client receives Server content via children/props.

### Client vs Server Decision

```
Need onClick/onChange?  → Client ('use client')
Need useState/useEffect? → Client
Need browser APIs?      → Client
Otherwise?              → Server (default)
```

### Composition Rules

- Server → Client: Direct import and render
- Server → Client → Server: Via children/props
- Client → Server: Cannot import directly

## Organization

| Directory | When to Use |
|-----------|-------------|
| `shared/` | Cross-feature, reused across pages |
| `server-info/` | Server-rendered display components |
| `web-vitals/` | Performance monitoring |
| `preview/` | Theme preview feature (self-contained) |
| `preview/demos/` | Demo pages for theme preview |

For future growth:
- `ui/` — Primitives (Button, Input, Card)
- `layouts/` — Structure (Header, Footer, Sidebar)
- `features/` — Domain-specific (UserProfile/, PostList/)

## How to Add a New Component

1. Choose the right directory (see Organization above)
2. Create `kebab-case-name.components.tsx`
3. Add `'use client'` only if the component needs interactivity
4. Co-locate tests in `__tests__/` directory
5. Use direct imports (no barrel exports)

## Testing

- Co-locate tests in `__tests__/` within each component directory
- File naming: `component-name.components.test.tsx` or `component-name.test.tsx`
- Use `NextIntlClientProvider` in test wrappers for i18n components
