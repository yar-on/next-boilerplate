/**
 * E2E Tests for i18n and RTL/LTR in Preview Demos
 *
 * P0 Tests: Critical user flows with locale switching
 * Updated to use direct demo routes instead of iframe
 */

import { test, expect } from '@playwright/test';

test.describe('Preview Demos - i18n and RTL/LTR', () => {
    test.describe('EN-01: Dashboard demo in English (LTR)', () => {
        test('should display dashboard in English with LTR direction', async ({ page }) => {
            await page.goto('/en/preview/demos/dashboard');
            await page.waitForLoadState('networkidle');

            // Verify HTML has LTR direction
            const html = page.locator('html');
            await expect(html).toHaveAttribute('dir', 'ltr');

            // Verify English translations are displayed
            await expect(page.getByText('Dashboard')).toBeVisible();
            await expect(page.getByPlaceholder('Search...')).toBeVisible();
            await expect(page.getByText('Total Revenue')).toBeVisible();
            await expect(page.getByText('Recent Activity')).toBeVisible();
        });

        test('should have correct navigation items in English', async ({ page }) => {
            await page.goto('/en/preview/demos/dashboard');
            await page.waitForLoadState('networkidle');

            // Verify all navigation items
            await expect(page.getByText('Analytics')).toBeVisible();
            await expect(page.getByText('Users')).toBeVisible();
            await expect(page.getByText('Settings')).toBeVisible();
        });

        test('should have correct metrics labels in English', async ({ page }) => {
            await page.goto('/en/preview/demos/dashboard');
            await page.waitForLoadState('networkidle');

            // Verify all metrics
            await expect(page.getByText('Total Revenue')).toBeVisible();
            await expect(page.getByText('New Orders')).toBeVisible();
            await expect(page.getByText('Active Users')).toBeVisible();
            await expect(page.getByText('Conversion Rate')).toBeVisible();
        });
    });

    test.describe('EN-02: Dashboard demo in Hebrew (RTL)', () => {
        test('should display dashboard in Hebrew with RTL direction', async ({ page }) => {
            await page.goto('/he/preview/demos/dashboard');
            await page.waitForLoadState('networkidle');

            // Verify HTML has RTL direction
            const html = page.locator('html');
            await expect(html).toHaveAttribute('dir', 'rtl');

            // Verify Hebrew translations are displayed
            await expect(page.getByText('לוח בקרה')).toBeVisible();
            await expect(page.getByPlaceholder('חיפוש...')).toBeVisible();
            await expect(page.getByText('סך הכנסות')).toBeVisible();
            await expect(page.getByText('פעילות אחרונה')).toBeVisible();
        });

        test('should have correct navigation items in Hebrew', async ({ page }) => {
            await page.goto('/he/preview/demos/dashboard');
            await page.waitForLoadState('networkidle');

            // Verify all navigation items in Hebrew
            await expect(page.getByText('אנליטיקה')).toBeVisible();
            await expect(page.getByText('משתמשים')).toBeVisible();
            await expect(page.getByText('הגדרות')).toBeVisible();
        });

        test('should have correct metrics labels in Hebrew', async ({ page }) => {
            await page.goto('/he/preview/demos/dashboard');
            await page.waitForLoadState('networkidle');

            // Verify all metrics in Hebrew
            await expect(page.getByText('סך הכנסות')).toBeVisible();
            await expect(page.getByText('הזמנות חדשות')).toBeVisible();
            await expect(page.getByText('משתמשים פעילים')).toBeVisible();
            await expect(page.getByText('שיעור המרה')).toBeVisible();
        });
    });

    test.describe('EN-03: All demos load in both locales', () => {
        const demos = [
            { name: 'company-overview', enText: "Building Tomorrow's Spaces Today", heText: 'בונים את המרחבים של מחר היום' },
            { name: 'dashboard', enText: 'Dashboard', heText: 'לוח בקרה' },
            { name: 'crm', enText: 'Leads', heText: 'לידים' },
        ];

        for (const demo of demos) {
            test(`should load ${demo.name} demo in English`, async ({ page }) => {
                await page.goto(`/en/preview/demos/${demo.name}`);
                await page.waitForLoadState('networkidle');

                // Verify LTR direction
                const html = page.locator('html');
                await expect(html).toHaveAttribute('dir', 'ltr');

                // Verify English text is present
                await expect(page.getByText(demo.enText)).toBeVisible();
            });

            test(`should load ${demo.name} demo in Hebrew`, async ({ page }) => {
                await page.goto(`/he/preview/demos/${demo.name}`);
                await page.waitForLoadState('networkidle');

                // Verify RTL direction
                const html = page.locator('html');
                await expect(html).toHaveAttribute('dir', 'rtl');

                // Verify Hebrew text is present
                await expect(page.getByText(demo.heText)).toBeVisible();
            });
        }
    });

    test.describe('EN-06: Keyboard navigation in RTL (basic check)', () => {
        test('should support Tab navigation in RTL mode', async ({ page }) => {
            await page.goto('/he/preview/demos/dashboard');
            await page.waitForLoadState('networkidle');

            // Start tabbing through elements
            await page.keyboard.press('Tab');

            // Get the focused element
            const focusedElement = await page.evaluate(() => {
                return document.activeElement?.tagName;
            });

            // Should be able to focus on interactive elements
            expect(['BUTTON', 'INPUT', 'A']).toContain(focusedElement);
        });

        test('should maintain focus visibility in RTL mode', async ({ page }) => {
            await page.goto('/he/preview/demos/dashboard');
            await page.waitForLoadState('networkidle');

            // Tab to first interactive element
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');

            // Check if focus is visible (element should have focus styles)
            const focusedElement = page.locator(':focus');
            await expect(focusedElement).toBeVisible();
        });
    });

    test.describe('EN-07: HTML attributes (lang, dir) set correctly', () => {
        test('should have correct HTML attributes for English', async ({ page }) => {
            await page.goto('/en/preview/demos/dashboard');
            await page.waitForLoadState('networkidle');

            // Check lang attribute
            const html = page.locator('html');
            await expect(html).toHaveAttribute('lang', 'en');

            // Check dir attribute
            await expect(html).toHaveAttribute('dir', 'ltr');
        });

        test('should have correct HTML attributes for Hebrew', async ({ page }) => {
            await page.goto('/he/preview/demos/dashboard');
            await page.waitForLoadState('networkidle');

            // Check lang attribute
            const html = page.locator('html');
            await expect(html).toHaveAttribute('lang', 'he');

            // Check dir attribute
            await expect(html).toHaveAttribute('dir', 'rtl');
        });

        test('should update attributes when switching locales via URL', async ({ page }) => {
            // Start with English
            await page.goto('/en/preview/demos/dashboard');
            await page.waitForLoadState('networkidle');

            let html = page.locator('html');
            await expect(html).toHaveAttribute('dir', 'ltr');
            await expect(html).toHaveAttribute('lang', 'en');

            // Switch to Hebrew via URL
            await page.goto('/he/preview/demos/dashboard');
            await page.waitForLoadState('networkidle');

            html = page.locator('html');
            await expect(html).toHaveAttribute('dir', 'rtl');
            await expect(html).toHaveAttribute('lang', 'he');
        });
    });

    test.describe('Navigation between demos', () => {
        test('should maintain locale when navigating between demos', async ({ page }) => {
            // Start with Hebrew dashboard
            await page.goto('/he/preview/demos/dashboard');
            await page.waitForLoadState('networkidle');

            // Verify Hebrew is active in dashboard
            await expect(page.getByText('לוח בקרה')).toBeVisible();

            // Navigate to CRM demo using the navigation menu
            await page.getByText('דוגמאות').click();
            await page.getByText('מערכת CRM').click();
            await page.waitForLoadState('networkidle');

            // Hebrew should still be active
            await expect(page.getByText('לידים')).toBeVisible();

            const html = page.locator('html');
            await expect(html).toHaveAttribute('dir', 'rtl');
            await expect(html).toHaveAttribute('lang', 'he');
        });

        test('should navigate between components and demos', async ({ page }) => {
            await page.goto('/en/preview/demos/crm');
            await page.waitForLoadState('networkidle');

            // Click on Components nav item
            await page.getByText('Components').first().click();
            await page.waitForLoadState('networkidle');

            // Should be on components page
            await expect(page).toHaveURL('/en/preview/components');

            // Navigate back to demos
            await page.getByText('Demos').click();
            await page.getByText('CRM System').click();
            await page.waitForLoadState('networkidle');

            // Should be back on CRM demo
            await expect(page).toHaveURL('/en/preview/demos/crm');
            await expect(page.getByText('Leads')).toBeVisible();
        });
    });

    test.describe('Fallback behavior', () => {
        test('should redirect invalid locale to default', async ({ page }) => {
            // Try to access with invalid locale
            await page.goto('/invalid/preview/demos/dashboard');
            await page.waitForLoadState('networkidle');

            // Should redirect to default locale (en)
            await expect(page).toHaveURL(/\/(en|he)\/preview\/demos\/dashboard/);
        });
    });
});
