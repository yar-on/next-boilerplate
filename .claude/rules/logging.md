# Logging Rules

## Two imports — choose by environment

```typescript
// Server-side: API routes, Server Actions, repositories, services, server-only libs
import { logger, LogSeverityEnum } from '@/utils/logger/logger.server.utils';

// Client-side: components, hooks, isomorphic utils
import { logger, LogSeverityEnum } from '@/utils/logger/logger.utils';
```

Mixing them causes build errors — the server logger uses Node.js APIs unavailable in the browser.

## API signature

```typescript
// All methods accept the same shape:
type LogParamsType = {
  message: string;
  severity?: LogSeverityEnum;  // defaults to LOW if omitted
  error?: unknown;             // pass the raw caught error
  context?: Record<string, unknown>;
};

// Methods: debug, info, warn, error
```

## Severity levels

| Level    | When to use                                            |
|----------|--------------------------------------------------------|
| `URGENT` | System down, data loss, security breach                |
| `HIGH`   | Feature broken, user-facing error, failed DB operation |
| `MEDIUM` | Unexpected state, degraded functionality               |
| `LOW`    | Informational, expected failures, debug info           |
| `NONE`   | Suppress (don't use unless explicitly suppressing)     |

## `await` vs `void` — when to use each

```typescript
// await — in async functions where you need it to complete before returning
export async function GET(request: NextRequest) {
  try {
    await logger.info({ message: 'Request received', context: { url: request.url } });
    // ...
  } catch (error) {
    await logger.error({ message: 'Handler failed', error, severity: LogSeverityEnum.HIGH });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// void — fire-and-forget in synchronous contexts or when not blocking
const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  void logger.warn({ message: 'Deprecated usage detected' });
  // continue synchronously
};

// Also void for non-critical logging inside try/catch
} catch (error) {
  void logger.error({ message: 'Minor background task failed', error });
  return { success: false, error: error instanceof Error ? error : new Error('Unknown') };
}
```

## Examples

```typescript
// Info with context
await logger.info({
  message: 'API /users called',
  context: { method: 'GET', userId: params.id },
});

// Error with severity and context
await logger.error({
  message: 'Database query failed',
  error,
  severity: LogSeverityEnum.HIGH,
  context: { repositoryMethod: 'findById', id: params.id },
});

// Warn — fire-and-forget
void logger.warn({ message: 'Deprecated endpoint accessed', context: { path: '/api/old' } });

// Debug
void logger.debug({ message: 'Cache miss', context: { key: cacheKey } });
```

## Rules

- NEVER use `console.log`, `console.error`, etc. — always use the structured logger
- Server-side logger outputs structured JSON to stdout/stderr (captured by log aggregators)
- Client-side logger outputs formatted console output (visible in DevTools)
- Always pass the raw `error` object — don't stringify it before passing
- Include `context` with relevant IDs for traceability (userId, requestId, entityId)
