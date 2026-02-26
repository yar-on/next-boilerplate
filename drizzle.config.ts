import type { Config } from 'drizzle-kit';
import { Env } from '@/libs/env.libs';

export default {
    schema: './src/db/schema/index.ts',
    out: './src/db/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: Env.DATABASE_URL,
    },
    verbose: true,
    strict: true,
} satisfies Config;
