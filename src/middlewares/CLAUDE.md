# Middlewares (`src/middlewares/`)

Reusable request processing functions for auth, logging, error handling, and other cross-cutting concerns.

## Rules

- Naming: `*.middlewares.ts`
- These are **application-level middleware functions** (composable, reusable)
- NOT the same as Next.js edge middleware (`src/middleware.ts` at project root)

## Current State

This directory is currently empty. Use it when you need reusable middleware functions.

## When to Add Middleware Here

- Authentication/authorization wrappers (e.g., `withAuth()`)
- Logging wrappers (e.g., `withLogging()`)
- Error handling wrappers (e.g., `withErrorHandler()`)
- Rate limiting or validation wrappers

## Pattern

```tsx
import type { NextRequest, NextResponse } from 'next/server';

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
    return async (req: NextRequest) => {
        // Verify authentication
        const session = await getSession(req);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return handler(req);
    };
}
```

## Note

Next.js edge middleware (for routing, redirects, i18n) goes in `src/middleware.ts` at the project root, not in this directory.
