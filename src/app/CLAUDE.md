# App Router (`src/app/`)

Next.js App Router entry point. Contains all routes, layouts, API routes, and page components.

## Structure

```
app/
├── layout.tsx                           # Root layout (minimal HTML shell)
├── globals.css                          # Global styles
├── error.module.css                     # Error page styles
├── [locale]/
│   ├── layout.tsx                       # Locale layout (fonts, theme, metadata, dir)
│   ├── page.tsx                         # Home page (server component)
│   ├── home-content.components.tsx      # Home page client component
│   ├── error.tsx                        # Error boundary
│   └── preview/
│       ├── layout.tsx                   # Preview layout with theme provider
│       ├── page.tsx                     # Redirects to /preview/components
│       ├── components/
│       │   └── page.tsx                 # MUI component showcase
│       └── demos/
│           ├── crm/page.tsx             # CRM demo
│           ├── dashboard/page.tsx       # Dashboard demo
│           └── company-overview/page.tsx # Company overview demo
└── api/
    ├── health/route.ts                  # GET /api/health
    └── hello/route.ts                   # GET/POST /api/hello
```

## Routes

| URL | File | Type | Description |
|-----|------|------|-------------|
| `/{locale}` | `[locale]/page.tsx` | Server | Home page with SSR data |
| `/{locale}/preview` | `[locale]/preview/page.tsx` | Server | Redirects to components |
| `/{locale}/preview/components` | `[locale]/preview/components/page.tsx` | Server | MUI component showcase |
| `/{locale}/preview/demos/crm` | `[locale]/preview/demos/crm/page.tsx` | Server | CRM demo |
| `/{locale}/preview/demos/dashboard` | `[locale]/preview/demos/dashboard/page.tsx` | Server | Dashboard demo |
| `/{locale}/preview/demos/company-overview` | `[locale]/preview/demos/company-overview/page.tsx` | Server | Company overview demo |
| `/api/health` | `api/health/route.ts` | API | Health check endpoint |
| `/api/hello` | `api/hello/route.ts` | API | Example GET/POST endpoint |

## Locale Layout Architecture

The `[locale]/layout.tsx` handles:
- Font loading (Inter for EN, Heebo for HE)
- HTML `dir` attribute (LTR/RTL based on locale)
- MUI theme provider with Emotion cache
- `NextIntlClientProvider` with messages
- `setRequestLocale()` for static rendering

## Data Fetching & Caching

**Default: NOT CACHED** (Next.js 15+ behavior)

```tsx
// Fetch patterns
const data = await fetch(url);                                    // Not cached
const cached = await fetch(url, { cache: 'force-cache' });       // Explicit cache
const timed = await fetch(url, { next: { revalidate: 3600 } });  // Revalidate after 1h
const tagged = await fetch(url, { next: { tags: ['users'] } });  // Tag-based invalidation

// Repository caching
import { unstable_cache } from 'next/cache';
const getCachedUsers = unstable_cache(
    async () => {
        const result = await userRepository.findAll();
        return result.success ? result.data : [];
    },
    ['users-list'],
    { revalidate: 3600, tags: ['users'] }
);

// Request deduplication (within single request)
import { cache } from 'react';
const getUser = cache(async (id: string) => {
    const result = await userRepository.findById({ id });
    return result.success ? result.data : null;
});

// Revalidation
revalidateTag('users');       // After mutations
revalidatePath('/dashboard'); // After updates
```

## SEO & Metadata

```tsx
// Static metadata
export const metadata = {
    title: '<60 chars',
    description: '150-160 chars',
};

// Dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.home' });
    return { title: t('title'), description: t('description') };
}
```

**Checklist:** Semantic HTML | Single h1 | Alt texts | sitemap.xml | robots.txt

## Performance

```tsx
// Images
<Image src="/hero.jpg" width={1200} height={600} priority />

// Code Splitting
const Chart = dynamic(() => import('./Chart'), { ssr: false });

// Bundle: Named imports, analyze with `npm run analyze`
```

## Advanced Patterns

```tsx
// Parallel Fetching - PREFER Promise.allSettled
const results = await Promise.allSettled([userRepository.findAll(), postRepository.findAll()]);
const users = results[0].status === 'fulfilled' && results[0].value.success ? results[0].value.data : [];

// Streaming
<Suspense fallback={<Loading />}>
    <SlowComponent />
</Suspense>

// Optimistic Updates ('use client')
const [optimisticItems, addOptimistic] = useOptimistic(items, (state, newItem) => [...state, newItem]);

// Error Boundaries ('use client')
export function ErrorBoundary({ error, reset }) { /* logger.error + UI */ }
```

## Route Groups

Use `(name)/` for organization without URL segments:

```
(auth)/sign-in/     → URL: /sign-in
(marketing)/about/  → URL: /about
```

## How to Add a New Page

1. Create `src/app/[locale]/your-page/page.tsx`
2. Accept `params: Promise<{ locale: string }>` prop
3. Call `setRequestLocale(locale)` for static rendering
4. Add translations to `src/locales/{locale}.json`
5. Add metadata via `generateMetadata()` or `export const metadata`
6. Use `@/i18n/navigation` for internal links
