/**
 * E2E tests for Home Page
 */

import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test('should load the home page successfully', async ({ page }) => {
        await page.goto('/');

        // Check if the page title is correct
        await expect(page).toHaveTitle(/Next.js Boilerplate/);

        // Check if the main heading is visible
        const heading = page.getByRole('heading', { name: /Welcome to/i });
        await expect(heading).toBeVisible();
    });

    test('should display server-side rendered data', async ({ page }) => {
        await page.goto('/');

        // Check if server info card is present (uses actual translation: "Server Information")
        const serverInfoHeading = page.getByRole('heading', { name: /Server Information/i });
        await expect(serverInfoHeading).toBeVisible();

        // Check if timestamp is displayed
        await expect(page.getByText(/Timestamp:/i)).toBeVisible();

        // Check if environment is displayed
        await expect(page.getByText(/Environment:/i)).toBeVisible();
    });

    test('should display features list', async ({ page }) => {
        await page.goto('/');

        // Check if features heading exists
        const featuresHeading = page.getByRole('heading', { name: /Features/i });
        await expect(featuresHeading).toBeVisible();

        // Check if key features are listed
        await expect(page.getByText(/Next.js 15 with App Router/i)).toBeVisible();
        await expect(page.getByText(/React 19 with Server Components/i)).toBeVisible();
        await expect(page.getByText(/TypeScript with strict mode/i)).toBeVisible();
    });

    test('should have working API link', async ({ page }) => {
        await page.goto('/');

        // Find and check the API Routes link
        const apiLink = page.getByRole('link', { name: /API Routes/i });
        await expect(apiLink).toBeVisible();
        await expect(apiLink).toHaveAttribute('href', '/api/hello');
    });

    test('should have working documentation link', async ({ page }) => {
        await page.goto('/');

        // Find the documentation link
        const docsLink = page.getByRole('link', { name: /Documentation/i });
        await expect(docsLink).toBeVisible();
        await expect(docsLink).toHaveAttribute('href', 'https://nextjs.org/docs');
    });

    test('should be responsive on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Check if content is still visible on mobile
        const heading = page.getByRole('heading', { name: /Welcome to/i });
        await expect(heading).toBeVisible();
    });

    test('should have proper accessibility', async ({ page }) => {
        await page.goto('/');

        // Run a basic accessibility check (you can extend this with axe-core)
        // Check if main landmark exists
        const main = page.locator('main');
        await expect(main).toBeVisible();

        // Check if footer exists
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
    });
});
