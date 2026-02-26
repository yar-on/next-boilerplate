/**
 * Transaction Utility
 * Provides a helper for running multiple database operations atomically
 */

import { getDb } from '@/db/client';
import type { RepositoryResultType } from '@/types/repository.types';

export async function withTransaction<T>(callback: (tx: Parameters<Parameters<ReturnType<typeof getDb>['transaction']>[0]>[0]) => Promise<T>): Promise<RepositoryResultType<T>> {
    const db = getDb();

    try {
        const result = await db.transaction(async (tx) => {
            return await callback(tx);
        });

        return { success: true, data: result };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error('Transaction failed'),
        };
    }
}
