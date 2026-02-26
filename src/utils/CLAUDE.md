# Utilities (`src/utils/`)

Pure functions and utility modules. Same input always produces same output — no side effects, no database calls.

## Rules

- Pure functions only (exception: logger which has I/O side effects)
- No database or external API calls
- Use `.utils.ts` suffix
- Co-locate tests in `__tests__/` directory
- Aim for >80% test coverage

## Available Utilities

| File | Exports | Purpose |
|------|---------|---------|
| `logger/logger.types.ts` | `BaseLogger`, `LogLevelEnum`, `LogSeverityEnum`, `LogParamsType`, `LogEntryType` | Logger types, enums, abstract base class |
| `logger/logger.server.utils.ts` | `logger` (ServerLogger) | Structured JSON via `process.stdout/stderr` — immune to `removeConsole` |
| `logger/logger.client.utils.ts` | `logger` (ClientLogger) | Formatted `console.*` output for browser/dev |
| `logger/logger.utils.ts` | Re-exports `logger` (ClientLogger) + all types | Safe default import for any environment |
| `color-conversion.utils.ts` | `detectColorFormat`, `extractAlpha`, `toHexForPicker`, `fromPickerToOriginalFormat` | Color format conversion (hex/rgba) |
| `locale-formatter.utils.ts` | `formatDate`, `formatNumber`, `formatCurrency` | Locale-aware formatting via `Intl` APIs |
| `preview.utils.ts` | `isValidHexColor`, `isValidRgbaColor`, `clampPosition`, `debounce`, `hexToRgba`, etc. | Theme preview utilities |
| `theme-builder.utils.ts` | `createThemeFromConfig` | Builds MUI Theme from `PreviewThemeConfigType` |

### Logger

The logger provides the same async API (`info`, `warn`, `error`, `debug`) with different backends for server and client.

**Import rules:**

| Code Type | Import Path | Why |
|-----------|-------------|-----|
| API routes, Server Actions, repos, services | `@/utils/logger/logger.server.utils` | Production-visible structured JSON logs |
| Server-only libs (e.g., `theme-config.libs.ts`) | `@/utils/logger/logger.server.utils` | Uses Node.js `process.stdout/stderr` |
| Client components, isomorphic utilities | `@/utils/logger/logger.utils` | Browser-safe `console.*` output |

**API:**

```tsx
import { logger, LogSeverityEnum } from '@/utils/logger/logger.utils';
// or for server: import { logger, LogSeverityEnum } from '@/utils/logger/logger.server.utils';

// All methods accept a single LogParamsType object:
await logger.info({ message: 'User created', context: { userId: '123' } });
await logger.error({ message: 'Failed', error: err, severity: LogSeverityEnum.HIGH });
void logger.warn({ message: 'Deprecated API' });  // fire-and-forget in sync contexts
void logger.debug({ message: 'Debug info', context: { data } });  // suppressed in production
```

**`LogParamsType`:**
- `message: string` — required
- `severity?: LogSeverityEnum` — defaults to `NONE`
- `error?: unknown` — accepts any catch error directly
- `context?: Record<string, unknown>` — additional structured data

**`void` vs `await`:**
- Use `await` in async functions (API routes, server actions)
- Use `void` in sync functions/callbacks (components, event handlers, useEffect)

### Locale Formatter

```tsx
import { formatDate, formatNumber, formatCurrency } from '@/utils/locale-formatter.utils';

formatDate(new Date(), 'en', { dateStyle: 'medium' });  // "Jan 1, 2026"
formatNumber(1234.5, 'he');                               // "1,234.5" (Hebrew locale)
formatCurrency(99.99, 'en', 'USD');                       // "$99.99"
```

## Tests

```
utils/
├── __tests__/
│   ├── color-conversion.utils.test.ts
│   ├── locale-formatter.test.ts
│   ├── logger.test.ts
│   └── logger.server.test.ts
```

## How to Add a New Utility

1. Create `src/utils/your-utility.utils.ts`
2. Export pure functions (no classes unless singleton like logger)
3. Add tests in `src/utils/__tests__/your-utility.utils.test.ts`
4. For complex utilities, use a subdirectory: `src/utils/your-utility/your-utility.utils.ts`
