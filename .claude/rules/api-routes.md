# API Route Rules

## File location

```
src/app/api/<resource>/route.ts        # REST endpoint
src/app/api/<resource>/[id]/route.ts   # With dynamic segment
```

## Response wrapper — always use `ApiResponse<T>`

```typescript
// src/types/index.ts
interface ApiResponse<T = unknown> {
  data: T;
  error?: string;
  message?: string;
}
```

All routes return `NextResponse.json<ApiResponse<T>>()` — never raw data.

## Canonical route pattern

```typescript
import { type NextRequest, NextResponse } from 'next/server';
import { logger, LogSeverityEnum } from '@/utils/logger/logger.server.utils';
import type { ApiResponse } from '@/types';

interface UserResponse {
  id: string;
  email: string;
  name: string;
}

export async function GET(request: NextRequest) {
  try {
    await logger.info({
      message: 'GET /api/users called',
      context: { url: request.url },
    });

    // business logic here (via repository)
    const result = await userRepository.findAll();
    if (!result.success) throw result.error;

    const response: ApiResponse<UserResponse[]> = {
      data: result.data,
      message: 'Success',
    };

    return NextResponse.json(response, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    await logger.error({
      message: 'Error in GET /api/users',
      error,
      severity: LogSeverityEnum.MEDIUM,
    });

    const errorResponse: ApiResponse = {
      data: null,
      error: 'Internal server error',
      message: 'Failed to process request',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    // Validate with Zod
    const parse = CreateUserValidation.safeParse(body);
    if (!parse.success) {
      return NextResponse.json<ApiResponse>(
        { data: null, error: parse.error.issues[0]?.message ?? 'Validation failed' },
        { status: 422 }
      );
    }

    const result = await userRepository.create({ data: parse.data });
    if (!result.success) throw result.error;

    return NextResponse.json<ApiResponse<UserResponse>>(
      { data: result.data, message: 'Created successfully' },
      { status: 201 }
    );
  } catch (error) {
    await logger.error({ message: 'Error in POST /api/users', error, severity: LogSeverityEnum.HIGH });
    return NextResponse.json<ApiResponse>(
      { data: null, error: 'Internal server error', message: 'Failed to create' },
      { status: 500 }
    );
  }
}
```

## HTTP status codes

| Status | When                                              |
|--------|---------------------------------------------------|
| 200    | Successful GET / action with no new resource      |
| 201    | Successful POST that creates a resource           |
| 204    | Successful DELETE (no body)                       |
| 400    | Malformed request / cannot parse body             |
| 401    | Not authenticated                                 |
| 403    | Authenticated but not authorized                  |
| 404    | Resource not found                                |
| 422    | Validation failed (Zod errors)                    |
| 500    | Unexpected server error                           |
| 503    | Service unavailable (DB down, etc.)               |

## Rules

- ALWAYS log with server logger at start of handler (info) and in catch (error)
- ALWAYS validate request body with Zod before using it
- NEVER expose raw error messages to clients — use generic messages for 5xx
- NEVER access database directly in route file — use repositories
- Add `'Cache-Control': 'no-store'` header for dynamic data routes
- For health checks, test the actual DB connection: `await db.execute(sql\`SELECT 1\`)`
