/**
 * Database Client Singleton
 * Provides a singleton PostgreSQL connection pool with Drizzle ORM
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Env } from '@/libs/env.libs';
import * as schema from './schema/users.schema';

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export const getDb = () => {
    if (!db) {
        pool = new Pool({
            connectionString: Env.DATABASE_URL,
            max: Env.NODE_ENV === 'production' ? 20 : 5,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        db = drizzle(pool, { schema, logger: Env.NODE_ENV === 'development' });
    }

    return db;
};

export const closeDb = async (): Promise<void> => {
    if (pool) {
        await pool.end();
        pool = null;
        db = null;
    }
};

export { pool };
