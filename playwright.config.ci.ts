/**
 * Playwright Configuration for CI/CD
 * Runs all browser tests for comprehensive coverage
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: true,
    retries: 2,
    workers: 1,

    reporter: [
        ['html'],
        ['json', { outputFile: 'playwright-report/results.json' }],
        ['list'],
        ['github'], // GitHub Actions annotations
    ],

    use: {
        baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    // Test all browsers in CI
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],

    webServer: {
        command: 'npm run build && npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: false,
        timeout: 120000,
    },
});
