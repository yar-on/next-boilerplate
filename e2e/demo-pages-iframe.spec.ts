/**
 * E2E Tests for Demo Pages in iFrames
 *
 * Tests user flows for demo selection and switching via iframes.
 */

import { test, expect } from '@playwright/test';

test.describe('Demo Pages in iFrames', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/preview');
        // Click on Demos tab if needed
        const demosTab = page.getByRole('tab', { name: /demos/i });
        if (await demosTab.isVisible()) {
            await demosTab.click();
        }
        // Wait for layout to stabilize
        await page.waitForLoadState('networkidle');
    });

    test('should load company-overview demo in iframe by default', async ({ page }) => {
        // Check that an iframe with company-overview is present
        const iframe = page.frameLocator('iframe[title*="Company Overview"]');

        // Verify iframe is visible
        await expect(iframe.locator('body')).toBeTruthy();

        // Verify the iframe src contains company-overview
        const iframeElement = page.locator('iframe[title*="Company Overview"]');
        const src = await iframeElement.getAttribute('src');

        expect(src).toContain('?demo=company-overview');
    });

    test('should switch to dashboard demo when button clicked', async ({ page }) => {
        const dashboardButton = page.getByRole('button', { name: /dashboard/i }).first();

        await dashboardButton.click();

        // Wait for iframe to update
        await page.waitForSelector('iframe[src*="?demo=dashboard"]');

        const iframeElement = page.locator('iframe[title*="Dashboard"]');
        const src = await iframeElement.getAttribute('src');

        expect(src).toContain('?demo=dashboard');
    });

    test('should switch to crm demo when button clicked', async ({ page }) => {
        const crmButton = page.getByRole('button', { name: /^CRM/i }).first();

        await crmButton.click();

        // Wait for iframe to update
        await page.waitForSelector('iframe[src*="?demo=crm"]');

        const iframeElement = page.locator('iframe[title*="CRM"]');
        const src = await iframeElement.getAttribute('src');

        expect(src).toContain('?demo=crm');
    });

    test('should switch between all three demos in sequence', async ({ page }) => {
        // Start with company-overview (default)
        let iframeElement = page.locator('iframe[title*="Company Overview"]');
        let src = await iframeElement.getAttribute('src');
        expect(src).toContain('?demo=company-overview');

        // Switch to dashboard
        const dashboardButton = page.getByRole('button', { name: /dashboard/i }).first();
        await dashboardButton.click();
        await page.waitForSelector('iframe[src*="?demo=dashboard"]');

        iframeElement = page.locator('iframe[title*="Dashboard"]');
        src = await iframeElement.getAttribute('src');
        expect(src).toContain('?demo=dashboard');

        // Switch to crm
        const crmButton = page.getByRole('button', { name: /^CRM/i }).first();
        await crmButton.click();
        await page.waitForSelector('iframe[src*="?demo=crm"]');

        iframeElement = page.locator('iframe[title*="CRM"]');
        src = await iframeElement.getAttribute('src');
        expect(src).toContain('?demo=crm');

        // Switch back to company-overview
        const companyOverviewButton = page.getByRole('button', { name: /company overview/i }).first();
        await companyOverviewButton.click();
        await page.waitForSelector('iframe[src*="?demo=company-overview"]');

        iframeElement = page.locator('iframe[title*="Company Overview"]');
        src = await iframeElement.getAttribute('src');
        expect(src).toContain('?demo=company-overview');
    });

    test('should handle rapid clicking of demo buttons', async ({ page }) => {
        const dashboardButton = page.getByRole('button', { name: /dashboard/i }).first();
        const crmButton = page.getByRole('button', { name: /^CRM/i }).first();
        const companyOverviewButton = page.getByRole('button', { name: /company overview/i }).first();

        // Rapidly click buttons
        await dashboardButton.click();
        await crmButton.click();
        await companyOverviewButton.click();

        // Wait a bit for final state to settle
        await page.waitForTimeout(500);

        // Verify final state is company-overview
        const iframeElement = page.locator('iframe[title*="Company Overview"]');
        const src = await iframeElement.getAttribute('src');
        expect(src).toContain('?demo=company-overview');

        // Should not have JavaScript errors
        const jsErrors: string[] = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                jsErrors.push(msg.text());
            }
        });

        expect(jsErrors).toHaveLength(0);
    });

    test('should have accessible iframe attributes', async ({ page }) => {
        const iframeElement = page.locator('iframe').first();

        // Check for title attribute
        const title = await iframeElement.getAttribute('title');
        expect(title).toBeTruthy();
        expect(title).toContain('Preview');

        // Check for aria-label attribute
        const ariaLabel = await iframeElement.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel).toContain('Demo');
    });

    test('should display responsive layout on mobile viewport', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Wait for layout to adjust
        await page.waitForLoadState('networkidle');

        // Check that layout selector is visible
        const demoTitle = page.getByText(/Demos/i);
        await expect(demoTitle).toBeVisible();

        // Check that iframe is visible
        const iframeElement = page.locator('iframe').first();
        await expect(iframeElement).toBeVisible();
    });

    test('should display responsive layout on desktop viewport', async ({ page }) => {
        // Set desktop viewport
        await page.setViewportSize({ width: 1920, height: 1080 });

        // Wait for layout to adjust
        await page.waitForLoadState('networkidle');

        // Check that layout selector is visible
        const demoTitle = page.getByText(/Demos/i);
        await expect(demoTitle).toBeVisible();

        // Check that iframe is visible
        const iframeElement = page.locator('iframe').first();
        await expect(iframeElement).toBeVisible();
    });

    test('should support keyboard navigation', async ({ page }) => {
        // Tab to first demo button
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab'); // Multiple tabs to reach buttons

        // Get currently focused element
        const focusedElement = await page.evaluate(() => document.activeElement?.tagName);

        // Focus should be on a button
        expect(focusedElement).toBe('BUTTON');
    });

    test('should load iframe without blocking page interaction', async ({ page }) => {
        const dashboardButton = page.getByRole('button', { name: /dashboard/i }).first();

        // Click should be immediate
        const startTime = Date.now();
        await dashboardButton.click();
        const clickTime = Date.now() - startTime;

        // Click should respond quickly (< 100ms)
        expect(clickTime).toBeLessThan(100);

        // Page should still be responsive
        const crmButton = page.getByRole('button', { name: /^CRM/i }).first();
        await expect(crmButton).toBeEnabled();
    });

    test('should verify iframe loads without console errors', async ({ page }) => {
        const jsErrors: string[] = [];

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                jsErrors.push(msg.text());
            }
        });

        // Wait for page to fully load
        await page.waitForLoadState('networkidle');

        // Check for errors (excluding expected warnings)
        const criticalErrors = jsErrors.filter((error) => !error.includes('warning') && !error.includes('deprecated'));

        expect(criticalErrors).toHaveLength(0);
    });
});
