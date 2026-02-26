---
description: Scaffold a new file following project conventions (repository, service, hook, component, util, validation, constant)
---

# Scaffold File

Create a new file following the project's established naming conventions, directory structure, and boilerplate patterns.

## Request

$ARGUMENTS

## Instructions

### 1. Parse the request

Determine the file **type** and **name** from $ARGUMENTS:
- `repository <name>` → `src/repositories/<name>.repository.ts`
- `service <name>` → `src/services/<name>.services.ts`
- `hook <name>` → `src/hooks/use-<name>.hooks.ts`
- `util <name>` → `src/utils/<name>.utils.ts`
- `validation <name>` → `src/validations/<name>.validations.ts`
- `constant <name>` → `src/constants/<name>.constants.ts`
- `type <name>` → `src/types/<name>.types.ts`
- `component <category> <name>` → `src/components/<category>/<name>.components.tsx`
  - Categories: `ui`, `layouts`, `features`, `shared`
- `action <name>` → `src/actions/<name>.action.ts`

If the type is ambiguous, ask the user.

### 2. Read relevant CLAUDE.md

Before creating the file, read the `CLAUDE.md` in the target directory (e.g., `src/repositories/CLAUDE.md`) to understand current patterns and available types.

### 3. Generate the file

Use the appropriate boilerplate for each type:

**Repository:**
```typescript
import { db } from '@/db/client';
// import { tableName } from '@/db/schema';
import type { RepositoryResultType } from '@/types/repository.types';
import { logger } from '@/utils/logger/logger.server.utils';

class <Name>Repository {
  async findById(params: { id: string }): Promise<RepositoryResultType<<Entity> | null>> {
    try {
      // TODO: implement
      return { success: true, data: null };
    } catch (error) {
      void logger.error({ message: 'findById failed', error: error instanceof Error ? error : new Error('Unknown') });
      return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }
}

export const <name>Repository = new <Name>Repository();
```

**Service:**
```typescript
import type { RepositoryResultType } from '@/types/repository.types';
import { logger } from '@/utils/logger/logger.server.utils';

class <Name>Service {
  async <method>(params: {}): Promise<RepositoryResultType<void>> {
    try {
      // TODO: implement
      return { success: true, data: undefined };
    } catch (error) {
      void logger.error({ message: '<method> failed', error: error instanceof Error ? error : new Error('Unknown') });
      return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }
}

export const <name>Service = new <Name>Service();
```

**Hook:**
```typescript
'use client';

export const use<Name> = () => {
  // TODO: implement
  return {};
};
```

**Util:**
```typescript
export const <name> = (): void => {
  // TODO: implement
};
```

**Validation:**
```typescript
import { z } from 'zod';

export const <Name>Schema = z.object({
  // TODO: add fields
});

export type <Name>Type = z.infer<typeof <Name>Schema>;
```

**Constant:**
```typescript
export const <NAME>_CONSTANT = {
  // TODO: add values
} as const;
```

**Server Action:**
```typescript
'use server';

import type { RepositoryResultType } from '@/types/repository.types';
import { logger } from '@/utils/logger/logger.server.utils';

export const <name>Action = async (params: {}): Promise<RepositoryResultType<void>> => {
  try {
    // TODO: implement
    return { success: true, data: undefined };
  } catch (error) {
    void logger.error({ message: '<name>Action failed', error: error instanceof Error ? error : new Error('Unknown') });
    return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};
```

**Component (Server):**
```tsx
import type { JSX } from 'react';

type <Name>PropsType = {
  // TODO: add props
};

export const <Name> = async ({ }: <Name>PropsType): Promise<JSX.Element> => {
  return (
    <div>
      {/* TODO: implement */}
    </div>
  );
};
```

**Component (Client):**
```tsx
'use client';

type <Name>PropsType = {
  // TODO: add props
};

export const <Name> = ({ }: <Name>PropsType) => {
  return (
    <div>
      {/* TODO: implement */}
    </div>
  );
};
```

### 4. Update CLAUDE.md

After creating the file, update the relevant `src/*/CLAUDE.md` to document the new file. Follow the CLAUDE.md hierarchy rules — only update the direct parent.

### 5. Report

Show the user:
- The file path created
- The file type and boilerplate used
- Which CLAUDE.md was updated
- Any next steps (e.g., "Add your schema fields to the Zod object")

## Usage Examples

```
/scaffold repository user
/scaffold service email-notification
/scaffold hook use-debounce
/scaffold component ui button
/scaffold component features user-profile
/scaffold validation create-user
/scaffold action send-email
/scaffold util date-formatter
```

## Rules

- Always use **kebab-case** for file names
- Never create barrel exports (`index.ts`) — use direct imports
- Always include the correct file suffix (`.repository.ts`, `.services.ts`, etc.)
- Use `type` over `interface` for TypeScript types
- Server-side files get `logger.server.utils` import, client files get `logger.utils`
- Repositories MUST use `RepositoryResultType<T>` return type
