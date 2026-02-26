/**
 * E2E tests for API Routes
 */

import { test, expect } from '@playwright/test';

test.describe('API Routes', () => {
    test('GET /api/hello should return valid response', async ({ request }) => {
        const response = await request.get('/api/hello');

        // Check status code
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        // Check response body
        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('message');
        expect(data.message).toBe('Success');

        // Check data structure
        expect(data.data).toHaveProperty('message');
        expect(data.data).toHaveProperty('timestamp');
        expect(data.data).toHaveProperty('timezone');
        expect(data.data).toHaveProperty('method');
        expect(data.data.method).toBe('GET');
    });

    test('POST /api/hello should accept and echo data', async ({ request }) => {
        const testData = {
            name: 'Test User',
            email: 'test@example.com',
        };

        const response = await request.post('/api/hello', {
            data: testData, // Playwright automatically converts to JSON
        });

        // Check status code
        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();

        // Check response body
        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data.data).toHaveProperty('received');
        expect(data.data.received).toEqual(testData);
        expect(data.message).toBe('Data received successfully');
    });

    test('API should return proper headers', async ({ request }) => {
        const response = await request.get('/api/hello');

        // Check headers
        expect(response.headers()['content-type']).toContain('application/json');
    });

    test('API should handle malformed JSON', async ({ baseURL }) => {
        // Use native fetch to send truly malformed JSON (Playwright's request methods auto-convert)
        const response = await fetch(`${baseURL}/api/hello`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: '{invalid json',
        });

        // API should return error status
        expect(response.status).toBe(400);

        // Should return JSON error response
        const data = await response.json();
        expect(data).toHaveProperty('error');
        expect(data.error).toBe('Invalid request body');
    });
});
