/**
 * Health Check API Endpoint
 * Returns the health status of the application and database connection
 */

import { NextResponse } from 'next/server';
import { getDb } from '@/db/client';
import { sql } from 'drizzle-orm';

export async function GET() {
    try {
        const db = getDb();

        // Simple query to verify database connection
        await db.execute(sql`SELECT 1`);

        return NextResponse.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: 'unhealthy',
                database: 'disconnected',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            },
            { status: 503 }
        );
    }
}
