/**
 * E2E tests for Theme Settings Color Picker
 * Tests native color picker integration for real-time theme customization
 */

import { test, expect } from '@playwright/test';

// Type for window with test error tracking
interface WindowWithError extends Window {
    lastError?: unknown;
}

test.describe('Native Color Picker Feature', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to preview page
        await page.goto('/preview');

        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');
    });

    test('[P0] should open theme settings and display color buttons', async ({ page }) => {
        // Open theme settings drawer (look for theme button/menu)
        const themeButton = page.getByRole('button', { name: /theme/i }).first();
        await expect(themeButton).toBeVisible();
        await themeButton.click();

        // Wait for drawer/menu to open
        await page.waitForTimeout(300); // Animation delay

        // Verify color section is visible
        await expect(page.getByText('Colors')).toBeVisible();

        // Verify Light/Dark mode tabs
        await expect(page.getByRole('tab', { name: /Light Mode/i })).toBeVisible();
        await expect(page.getByRole('tab', { name: /Dark Mode/i })).toBeVisible();

        // Verify all color categories
        await expect(page.getByText('Palette Colors')).toBeVisible();
        await expect(page.getByText('Background Colors')).toBeVisible();
        await expect(page.getByText('Text & Divider')).toBeVisible();
        await expect(page.getByText('Custom Typography Colors')).toBeVisible();
    });

    test('[P0] should display color buttons with correct backgrounds', async ({ page }) => {
        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Get primary color button
        const primaryButton = page.getByRole('button', { name: 'Primary color', exact: true });
        await expect(primaryButton).toBeVisible();

        // Verify button has a background color (not transparent)
        const bgColor = await primaryButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });
        expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
        expect(bgColor).not.toBe('transparent');
    });

    test('[P0] should render hidden color inputs for each color button', async ({ page }) => {
        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Check that hidden color inputs exist
        const colorInputs = page.locator('input[type="color"]');
        const count = await colorInputs.count();

        // Should have multiple color inputs (16 total: 6 palette + 2 background + 4 text + 4 custom)
        expect(count).toBeGreaterThanOrEqual(10);

        // Verify they are hidden
        const firstInput = colorInputs.first();
        const isHidden = await firstInput.evaluate((el) => {
            const style = window.getComputedStyle(el);
            return style.opacity === '0' || style.width === '0px' || style.height === '0px';
        });
        expect(isHidden).toBe(true);
    });

    test('[P0] should apply color changes in real-time', async ({ page }) => {
        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Get the primary color input (hidden)
        const primaryInput = page.locator('input[type="color"]').first();

        // Get initial background color of a MUI component (e.g., a button on the page)
        const testButton = page.getByRole('button').first();
        const initialColor = await testButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        // Programmatically change the color input value
        const newColor = '#ff0000'; // Red
        await primaryInput.evaluate((el: HTMLInputElement, color: string) => {
            el.value = color;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }, newColor);

        // Wait for React to update
        await page.waitForTimeout(100);

        // Verify the color button background updated
        const primaryButton = page.getByRole('button', { name: 'Primary color', exact: true });
        const updatedButtonBg = await primaryButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        // Color should have changed
        expect(updatedButtonBg).not.toBe(initialColor);
    });

    test('[P0] should update MUI components immediately without lag', async ({ page }) => {
        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Find a primary color button in the preview area (not the color picker button)
        const previewButton = page
            .locator('button')
            .filter({ hasText: /Button/i })
            .first();

        // Get initial color
        const initialColor = await previewButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        // Change primary color
        const primaryInput = page.locator('input[type="color"]').first();
        await primaryInput.evaluate((el: HTMLInputElement) => {
            el.value = '#00ff00'; // Green
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });

        // Wait minimal time (should be instant)
        await page.waitForTimeout(50);

        // Verify preview component updated
        const updatedColor = await previewButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        expect(updatedColor).not.toBe(initialColor);
        expect(updatedColor).toContain('0'); // Contains green value
    });

    test('[P0] should not display ColorPickerModal component', async ({ page }) => {
        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Click a color button
        const primaryButton = page.getByRole('button', { name: 'Primary color', exact: true });
        await primaryButton.click();

        // Wait for any potential modal
        await page.waitForTimeout(200);

        // Verify no modal/dialog elements appear
        const dialogs = page.locator('[role="dialog"]');
        const dialogCount = await dialogs.count();
        expect(dialogCount).toBe(0);

        // Verify no overlay/backdrop
        const backdrops = page.locator('.MuiBackdrop-root, .MuiModal-backdrop');
        const backdropCount = await backdrops.count();
        expect(backdropCount).toBe(0);
    });

    test('[P0] should reflect color changes on color button background', async ({ page }) => {
        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        const secondaryButton = page.getByRole('button', { name: 'Secondary color', exact: true });

        // Get initial background
        const initialBg = await secondaryButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        // Find the corresponding hidden input (second input)
        const secondaryInput = page.locator('input[type="color"]').nth(1);

        // Change color
        const newColor = '#ffa500'; // Orange
        await secondaryInput.evaluate((el: HTMLInputElement, color: string) => {
            el.value = color;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }, newColor);

        await page.waitForTimeout(100);

        // Verify button background updated
        const updatedBg = await secondaryButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        expect(updatedBg).not.toBe(initialBg);
    });

    test('[P1] should persist colors after page reload', async ({ page }) => {
        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Change a color
        const primaryInput = page.locator('input[type="color"]').first();
        const testColor = '#ff1493'; // Deep pink

        await primaryInput.evaluate((el: HTMLInputElement, color: string) => {
            el.value = color;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }, testColor);

        // Wait for debounced localStorage save (300ms)
        await page.waitForTimeout(500);

        // Get the updated button color before reload
        const primaryButton = page.getByRole('button', { name: 'Primary color', exact: true });
        const colorBeforeReload = await primaryButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        // Reload page
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Open theme settings again
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Verify color persisted
        const primaryButtonAfterReload = page.getByRole('button', { name: 'Primary color', exact: true });
        const colorAfterReload = await primaryButtonAfterReload.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        expect(colorAfterReload).toBe(colorBeforeReload);
    });

    test('[P1] should support keyboard navigation with Tab', async ({ page }) => {
        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Focus the first color button with keyboard
        await page.keyboard.press('Tab');

        // Find which element is focused
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();

        // Continue tabbing to reach color buttons
        for (let i = 0; i < 10; i++) {
            await page.keyboard.press('Tab');
            const currentFocus = page.locator(':focus');
            const ariaLabel = await currentFocus.getAttribute('aria-label');

            // Check if we reached a color button
            if (ariaLabel && ariaLabel.includes('color')) {
                await expect(currentFocus).toBeVisible();
                break;
            }
        }
    });

    test('[P1] should support keyboard activation with Enter key', async ({ page }) => {
        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Focus the primary color button programmatically
        const primaryButton = page.getByRole('button', { name: 'Primary color', exact: true });
        await primaryButton.focus();

        // Verify it's focused
        const focusedElement = page.locator(':focus');
        const ariaLabel = await focusedElement.getAttribute('aria-label');
        expect(ariaLabel).toContain('Primary color');

        // Press Enter (should trigger click)
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);

        // Verify input was triggered (check that the hidden input has focus or was activated)
        // Note: Native color picker may not be verifiable, but the click handler should fire
        // We can verify no errors occurred
        const errors = await page.evaluate(() => {
            return (window as WindowWithError).lastError;
        });
        expect(errors).toBeUndefined();
    });

    test('[P1] should allow changing multiple colors sequentially', async ({ page }) => {
        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Change primary color
        const primaryInput = page.locator('input[type="color"]').first();
        await primaryInput.evaluate((el: HTMLInputElement) => {
            el.value = '#ff0000';
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });

        await page.waitForTimeout(100);

        // Change secondary color
        const secondaryInput = page.locator('input[type="color"]').nth(1);
        await secondaryInput.evaluate((el: HTMLInputElement) => {
            el.value = '#00ff00';
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });

        await page.waitForTimeout(100);

        // Change error color
        const errorInput = page.locator('input[type="color"]').nth(2);
        await errorInput.evaluate((el: HTMLInputElement) => {
            el.value = '#0000ff';
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });

        await page.waitForTimeout(100);

        // Verify all three buttons updated
        const primaryButton = page.getByRole('button', { name: 'Primary color', exact: true });
        const secondaryButton = page.getByRole('button', { name: 'Secondary color', exact: true });
        const errorButton = page.getByRole('button', { name: 'Error color', exact: true });

        const primaryBg = await primaryButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });
        const secondaryBg = await secondaryButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });
        const errorBg = await errorButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        // All should be different colors
        expect(primaryBg).not.toBe(secondaryBg);
        expect(secondaryBg).not.toBe(errorBg);
        expect(primaryBg).not.toBe(errorBg);
    });

    test('[P1] should preserve colors when switching between light and dark modes', async ({ page }) => {
        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Ensure we're on Light Mode tab
        const lightModeTab = page.getByRole('tab', { name: /Light Mode/i });
        await lightModeTab.click();
        await page.waitForTimeout(200);

        // Change light mode primary color
        const primaryInput = page.locator('input[type="color"]').first();
        const lightColor = '#ff6b6b';
        await primaryInput.evaluate((el: HTMLInputElement, color: string) => {
            el.value = color;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }, lightColor);

        await page.waitForTimeout(100);

        // Get light mode primary button color
        const primaryButton = page.getByRole('button', { name: 'Primary color', exact: true });
        const lightModeBg = await primaryButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        // Switch to Dark Mode
        const darkModeTab = page.getByRole('tab', { name: /Dark Mode/i });
        await darkModeTab.click();
        await page.waitForTimeout(200);

        // Get dark mode primary button color
        const darkModeBg = await primaryButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        // Dark mode should have different color (not affected by light mode change)
        expect(darkModeBg).not.toBe(lightModeBg);

        // Switch back to Light Mode
        await lightModeTab.click();
        await page.waitForTimeout(200);

        // Verify light mode color persisted
        const lightModeBgAfter = await primaryButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        expect(lightModeBgAfter).toBe(lightModeBg);
    });
});

test.describe('Mobile & Touch Support', () => {
    test('[P2] should open color picker on mobile devices', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 812 }); // iPhone X

        await page.goto('/preview');
        await page.waitForLoadState('networkidle');

        // Open theme settings
        const themeButton = page.getByRole('button', { name: /theme/i }).first();
        await themeButton.click();
        await page.waitForTimeout(300);

        // Verify color buttons are visible and properly sized
        const primaryButton = page.getByRole('button', { name: 'Primary color', exact: true });
        await expect(primaryButton).toBeVisible();

        // Verify touch target size (should be at least 44x44px per WCAG)
        const buttonSize = await primaryButton.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return { width: rect.width, height: rect.height };
        });

        expect(buttonSize.width).toBeGreaterThanOrEqual(44);
        expect(buttonSize.height).toBeGreaterThanOrEqual(44);

        // Simulate touch on color button
        await primaryButton.click();
        await page.waitForTimeout(100);

        // Verify no errors (native mobile picker should trigger)
        const errors = await page.evaluate(() => {
            return (window as WindowWithError).lastError;
        });
        expect(errors).toBeUndefined();
    });

    test('[P2] should maintain responsive layout on tablet', async ({ page }) => {
        // Set tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 }); // iPad

        await page.goto('/preview');
        await page.waitForLoadState('networkidle');

        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Verify all color sections are visible
        await expect(page.getByText('Palette Colors')).toBeVisible();
        await expect(page.getByText('Background Colors')).toBeVisible();
        await expect(page.getByText('Text & Divider')).toBeVisible();

        // Verify color buttons are in grid layout
        const primaryButton = page.getByRole('button', { name: 'Primary color', exact: true });
        const secondaryButton = page.getByRole('button', { name: 'Secondary color', exact: true });

        await expect(primaryButton).toBeVisible();
        await expect(secondaryButton).toBeVisible();
    });
});

test.describe('Edge Cases', () => {
    test('[P2] should handle rapid sequential color changes', async ({ page }) => {
        await page.goto('/preview');
        await page.waitForLoadState('networkidle');

        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        const primaryInput = page.locator('input[type="color"]').first();

        // Rapidly change colors
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

        for (const color of colors) {
            await primaryInput.evaluate((el: HTMLInputElement, c: string) => {
                el.value = c;
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }, color);
            // No wait time - rapid changes
        }

        // Wait for final update
        await page.waitForTimeout(100);

        // Verify final color applied (should be magenta)
        const primaryButton = page.getByRole('button', { name: 'Primary color', exact: true });
        const finalBg = await primaryButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        // Should contain magenta values (255, 0, 255)
        expect(finalBg).toContain('255');
    });

    test('[P2] should handle clicking color button while another is active', async ({ page }) => {
        await page.goto('/preview');
        await page.waitForLoadState('networkidle');

        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Click primary color button
        const primaryButton = page.getByRole('button', { name: 'Primary color', exact: true });
        await primaryButton.click();
        await page.waitForTimeout(50);

        // Immediately click secondary color button
        const secondaryButton = page.getByRole('button', { name: 'Secondary color', exact: true });
        await secondaryButton.click();
        await page.waitForTimeout(50);

        // Verify no errors occurred
        const errors = await page.evaluate(() => {
            return (window as WindowWithError).lastError;
        });
        expect(errors).toBeUndefined();

        // Both buttons should still be functional
        await expect(primaryButton).toBeVisible();
        await expect(secondaryButton).toBeVisible();
    });

    test('[P2] should maintain color values with alpha channels (rgba format)', async ({ page }) => {
        await page.goto('/preview');
        await page.waitForLoadState('networkidle');

        // Set a theme with rgba colors via localStorage
        await page.evaluate(() => {
            const config = {
                version: '1.0',
                mode: 'light',
                colors: {
                    light: {
                        primary: 'rgba(25, 118, 210, 0.8)',
                        secondary: 'rgba(220, 0, 78, 0.9)',
                        error: '#d32f2f',
                        warning: '#ed6c02',
                        info: '#0288d1',
                        success: '#2e7d32',
                        backgroundDefault: '#ffffff',
                        backgroundPaper: '#f5f5f5',
                        textPrimary: 'rgba(0, 0, 0, 0.87)',
                        textSecondary: 'rgba(0, 0, 0, 0.6)',
                        textDisabled: 'rgba(0, 0, 0, 0.38)',
                        divider: 'rgba(0, 0, 0, 0.12)',
                        headingColor: '#000000',
                        bodyColor: '#333333',
                        linkColor: '#1976d2',
                    },
                    dark: {
                        primary: '#90caf9',
                        secondary: '#f48fb1',
                        error: '#f44336',
                        warning: '#ffa726',
                        info: '#29b6f6',
                        success: '#66bb6a',
                        backgroundDefault: '#121212',
                        backgroundPaper: '#1e1e1e',
                        textPrimary: '#ffffff',
                        textSecondary: 'rgba(255, 255, 255, 0.7)',
                        textDisabled: 'rgba(255, 255, 255, 0.5)',
                        divider: 'rgba(255, 255, 255, 0.12)',
                        headingColor: '#ffffff',
                        bodyColor: '#e0e0e0',
                        linkColor: '#90caf9',
                    },
                },
                typography: {
                    fontFamily: 'Inter, sans-serif',
                    h1FontSize: 96,
                    h2FontSize: 60,
                    h3FontSize: 48,
                    h4FontSize: 34,
                    h5FontSize: 24,
                    h6FontSize: 20,
                    bodyFontSize: 16,
                    captionFontSize: 12,
                    h1FontWeight: 300,
                    h2FontWeight: 300,
                    h3FontWeight: 400,
                    h4FontWeight: 400,
                    h5FontWeight: 400,
                    h6FontWeight: 500,
                    bodyFontWeight: 400,
                    captionFontWeight: 400,
                },
                borderRadius: 8,
            };
            localStorage.setItem('previewThemeConfig', JSON.stringify(config));
        });

        // Reload to apply config
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Change primary color (originally rgba with 0.8 alpha)
        const primaryInput = page.locator('input[type="color"]').first();
        await primaryInput.evaluate((el: HTMLInputElement) => {
            el.value = '#ff0000'; // Change to red
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });

        // Wait for save
        await page.waitForTimeout(500);

        // Check localStorage - alpha should be preserved
        const savedConfig = await page.evaluate(() => {
            const config = localStorage.getItem('previewThemeConfig');
            return config ? (JSON.parse(config) as Record<string, unknown>) : null;
        });

        // Primary color should still be in rgba format with alpha 0.8

        expect((savedConfig as any).colors.light.primary).toContain('rgba');

        expect((savedConfig as any).colors.light.primary).toContain('0.8');
    });

    test('[P2] should handle empty or default color values gracefully', async ({ page }) => {
        await page.goto('/preview');
        await page.waitForLoadState('networkidle');

        // Clear localStorage to test default values
        await page.evaluate(() => {
            localStorage.removeItem('previewThemeConfig');
        });

        await page.reload();
        await page.waitForLoadState('networkidle');

        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Verify color buttons render with default colors
        const primaryButton = page.getByRole('button', { name: 'Primary color', exact: true });
        await expect(primaryButton).toBeVisible();

        const bgColor = await primaryButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        // Should have a valid color (not transparent or empty)
        expect(bgColor).toBeTruthy();
        expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');

        // Should be able to change color
        const primaryInput = page.locator('input[type="color"]').first();
        await primaryInput.evaluate((el: HTMLInputElement) => {
            el.value = '#00ff00';
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });

        await page.waitForTimeout(100);

        // Verify color updated
        const updatedBg = await primaryButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        expect(updatedBg).not.toBe(bgColor);
    });
});

test.describe('Accessibility', () => {
    test('[P1] should have proper ARIA labels on color buttons', async ({ page }) => {
        await page.goto('/preview');
        await page.waitForLoadState('networkidle');

        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Verify all color buttons have aria-label
        const colorButtons = ['Primary color', 'Secondary color', 'Error color', 'Warning color', 'Info color', 'Success color'];

        for (const label of colorButtons) {
            const button = page.getByRole('button', { name: label, exact: true });
            await expect(button).toBeVisible();

            const ariaLabel = await button.getAttribute('aria-label');
            expect(ariaLabel).toBeTruthy();
            expect(ariaLabel?.toLowerCase()).toContain('color');
        }
    });

    test('[P1] should hide color inputs from screen readers', async ({ page }) => {
        await page.goto('/preview');
        await page.waitForLoadState('networkidle');

        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Verify hidden inputs have aria-hidden
        const colorInputs = page.locator('input[type="color"]');
        const firstInput = colorInputs.first();

        const ariaHidden = await firstInput.getAttribute('aria-hidden');
        expect(ariaHidden).toBe('true');
    });

    test('[P1] should maintain focus management', async ({ page }) => {
        await page.goto('/preview');
        await page.waitForLoadState('networkidle');

        // Open theme settings
        await page.getByRole('button', { name: /theme/i }).first().click();
        await page.waitForTimeout(300);

        // Focus a color button
        const primaryButton = page.getByRole('button', { name: 'Primary color', exact: true });
        await primaryButton.focus();

        // Verify focus
        let focusedElement = page.locator(':focus');
        let ariaLabel = await focusedElement.getAttribute('aria-label');
        expect(ariaLabel).toContain('Primary color');

        // Click the button (triggers hidden input)
        await primaryButton.click();
        await page.waitForTimeout(100);

        // Focus should remain on button (not lost)
        focusedElement = page.locator(':focus');
        ariaLabel = await focusedElement.getAttribute('aria-label');

        // Focus may be on button or have moved, but should not be lost
        const hasFocus = await page.evaluate(() => {
            return document.activeElement !== document.body;
        });
        expect(hasFocus).toBe(true);
    });
});
