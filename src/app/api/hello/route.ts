/**
 * Example API Route - /api/hello
 *
 * This demonstrates:
 * - TypeScript types for API routes
 * - Request/Response handling
 * - Error handling
 * - CORS headers
 * - JSON response formatting
 */

import { type NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';
import { logger, LogSeverityEnum } from '@/utils/logger/logger.server.utils';

interface HelloResponse {
    message: string;
    timestamp: string;
    timezone: string;
    method: string;
    userAgent: string | null;
}

// GET handler
export async function GET(request: NextRequest) {
    try {
        await logger.info({ message: 'API /hello called', context: { method: 'GET', url: request.url } });

        const data: HelloResponse = {
            message: 'Hello from Next.js API Route!',
            timestamp: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            method: request.method,
            userAgent: request.headers.get('user-agent'),
        };

        const response: ApiResponse<HelloResponse> = {
            data,
            message: 'Success',
        };

        return NextResponse.json(response, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (error) {
        await logger.error({ message: 'Error in /api/hello', error, severity: LogSeverityEnum.MEDIUM });

        const errorResponse: ApiResponse = {
            data: null,
            error: 'Internal server error',
            message: 'Failed to process request',
        };

        return NextResponse.json(errorResponse, {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

// POST handler (example)
export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as Record<string, unknown>;

        await logger.info({ message: 'API /hello POST called', context: { body } });

        const response: ApiResponse = {
            data: {
                received: body,
                timestamp: new Date().toISOString(),
            },
            message: 'Data received successfully',
        };

        return NextResponse.json(response, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        await logger.error({ message: 'Error in /api/hello POST', error, severity: LogSeverityEnum.MEDIUM });

        const errorResponse: ApiResponse = {
            data: null,
            error: 'Invalid request body',
            message: 'Failed to parse request',
        };

        return NextResponse.json(errorResponse, {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
