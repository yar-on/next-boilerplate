---
name: add-api-route
description: Scaffold a new API route following project conventions (ApiResponse<T>, logging, Zod validation, repository pattern, HTTP status codes)
---

# Add API Route

Create a new Next.js App Router API route handler following all project conventions.

## Instructions

### 1. Parse the request

Extract from the user's request:
- **Resource name** — e.g., `users`, `posts`, `auth/session`
- **HTTP methods** — which of GET / POST / PUT / PATCH / DELETE to implement
- **Entity type** — what data is returned/created (links to repository)

If any are ambiguous, ask the user before proceeding.

### 2. Determine file path

```
src/app/api/<resource>/route.ts          # collection endpoint
src/app/api/<resource>/[id]/route.ts     # single-resource endpoint
```

Read `src/app/CLAUDE.md` and `src/types/index.ts` to check the `ApiResponse<T>` shape before writing.

### 3. Generate the route file

Use this full pattern — DO NOT omit logging or the `ApiResponse<T>` wrapper:

```typescript
import { type NextRequest, NextResponse } from 'next/server';
import { logger, LogSeverityEnum } from '@/utils/logger/logger.server.utils';
import type { ApiResponse } from '@/types';
// import { <entity>Repository } from '@/repositories/<entity>.repository';
// import { Create<Entity>Validation } from '@/validations/<entity>.validations';

// Define the response shape
type <Entity>ResponseType = {
  id: string;
  // ...
};

export async function GET(request: NextRequest) {
  try {
    await logger.info({
      message: 'GET /api/<resource> called',
      context: { url: request.url },
    });

    // const result = await <entity>Repository.findAll();
    // if (!result.success) throw result.error;

    const response: ApiResponse<<Entity>ResponseType[]> = {
      data: [], // result.data
      message: 'Success',
    };

    return NextResponse.json(response, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    await logger.error({
      message: 'Error in GET /api/<resource>',
      error,
      severity: LogSeverityEnum.MEDIUM,
    });
    return NextResponse.json<ApiResponse>(
      { data: null, error: 'Internal server error', message: 'Failed to fetch' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    // const parse = Create<Entity>Validation.safeParse(body);
    // if (!parse.success) {
    //   return NextResponse.json<ApiResponse>(
    //     { data: null, error: parse.error.issues[0]?.message ?? 'Validation failed' },
    //     { status: 422 }
    //   );
    // }

    await logger.info({
      message: 'POST /api/<resource> called',
      context: { body },
    });

    // const result = await <entity>Repository.create({ data: parse.data });
    // if (!result.success) throw result.error;

    return NextResponse.json<ApiResponse<void>>(
      { data: undefined, message: 'Created successfully' },
      { status: 201 }
    );
  } catch (error) {
    await logger.error({
      message: 'Error in POST /api/<resource>',
      error,
      severity: LogSeverityEnum.HIGH,
    });
    return NextResponse.json<ApiResponse>(
      { data: null, error: 'Internal server error', message: 'Failed to create' },
      { status: 500 }
    );
  }
}
```

**For `[id]` routes**, add the `params` argument:
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

**HTTP status code reference:**
| Status | When |
|--------|------|
| 200 | Successful GET |
| 201 | POST that creates a resource |
| 204 | DELETE with no body |
| 400 | Malformed request body |
| 401 | Not authenticated |
| 403 | Not authorized |
| 404 | Resource not found |
| 422 | Zod validation failed |
| 500 | Unexpected server error |

### 4. Only scaffold requested methods

Do NOT generate all HTTP methods by default. Only generate the ones explicitly requested. Remove the others entirely.

### 5. Update CLAUDE.md

Update `src/app/CLAUDE.md` to document the new route (path, methods, purpose).

### 6. Report

Show the user:
- File path created
- HTTP methods implemented
- TODOs remaining (repository import, validation import, etc.)
- How to test the route

## Rules

- ALWAYS use `ApiResponse<T>` wrapper — never return raw data
- ALWAYS log with server logger at start (info) and in catch (error)
- ALWAYS validate POST/PUT/PATCH bodies with Zod `safeParse` before use
- NEVER access database directly — always via repositories
- NEVER expose raw error messages in 5xx responses
- Add `Cache-Control: no-store` header for data routes
- Use `Promise<{ params }>` type for dynamic route params (Next.js 16)
