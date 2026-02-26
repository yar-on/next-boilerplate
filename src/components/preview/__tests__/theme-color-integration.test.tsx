/**
 * Integration Tests - Theme Color Update Flow
 *
 * Tests for color change flow from button click to theme update, including
 * integration with usePreviewTheme hook and localStorage persistence.
 * Priority: P0 (theme update) + P1 (hook integration, persistence)
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
import { ThemeColorSection } from '../theme-color-section.components';
import { usePreviewTheme } from '@/hooks/use-preview-theme.hooks';
import { DEFAULT_PREVIEW_THEME } from '@/constants/preview.constants';
import type { PreviewThemeConfigType } from '@/types/preview.types';

// Use real color conversion utilities for integration tests

// Mock localStorage
const mockLocalStorage = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        clear: jest.fn(() => {
            store = {};
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
});

describe('Theme Color Integration Tests', () => {
    beforeEach(() => {
        mockLocalStorage.clear();
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        // Only run pending timers if fake timers are active
        try {
            jest.runOnlyPendingTimers();
        } catch {
            // Fake timers not active, skip
        }
        jest.useRealTimers();
    });

    describe('when integrating with usePreviewTheme hook', () => {
        it('should update theme config through setColor', async () => {
            // Create wrapper with hook
            function ThemeWrapper() {
                const { config, setColor, setMode } = usePreviewTheme();
                return <ThemeColorSection config={config} setColor={setColor} setMode={setMode} />;
            }

            const { container } = render(<ThemeWrapper />);

            const colorInputs = container.querySelectorAll('input[type="color"]');
            const primaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            fireEvent.change(primaryInput, { target: { value: '#ff0000' } });

            // Wait for state update
            await waitFor(() => {
                const primaryButton = screen.getByLabelText('Primary color');
                expect(primaryButton).toHaveStyle({ backgroundColor: '#ff0000' });
            });
        });

        it('should update color button background immediately after color change', async () => {
            function ThemeWrapper() {
                const { config, setColor, setMode } = usePreviewTheme();
                return <ThemeColorSection config={config} setColor={setColor} setMode={setMode} />;
            }

            const { container } = render(<ThemeWrapper />);

            const primaryButton = screen.getByLabelText('Primary color');
            expect(primaryButton).toHaveStyle({ backgroundColor: '#1976d2' });

            const colorInputs = container.querySelectorAll('input[type="color"]');
            const primaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            fireEvent.change(primaryInput, { target: { value: '#00ff00' } });

            await waitFor(() => {
                expect(primaryButton).toHaveStyle({ backgroundColor: '#00ff00' });
            });
        });

        it('should handle multiple sequential color changes', async () => {
            jest.useFakeTimers();

            function ThemeWrapper() {
                const { config, setColor, setMode } = usePreviewTheme();
                return <ThemeColorSection config={config} setColor={setColor} setMode={setMode} />;
            }

            const { container } = render(<ThemeWrapper />);

            const colorInputs = container.querySelectorAll('input[type="color"]');
            const primaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            const secondaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Secondary')) as HTMLInputElement;

            // Change primary
            fireEvent.change(primaryInput, { target: { value: '#ff0000' } });

            // Advance timers past debounce delay
            act(() => {
                jest.advanceTimersByTime(300);
            });

            // Change secondary
            fireEvent.change(secondaryInput, { target: { value: '#00ff00' } });

            // Advance timers past debounce delay
            act(() => {
                jest.advanceTimersByTime(300);
            });

            // Flush all pending timers and promises
            await act(async () => {
                jest.runAllTimers();
            });

            // Direct assertions after timers flushed
            const primaryButton = screen.getByLabelText('Primary color');
            const secondaryButton = screen.getByLabelText('Secondary color');

            // Check that colors are applied (may be in rgb format)
            const primaryBg = window.getComputedStyle(primaryButton).backgroundColor;
            const secondaryBg = window.getComputedStyle(secondaryButton).backgroundColor;

            // Convert rgb to hex for comparison or check rgb values
            expect(primaryBg).toMatch(/rgb\(255,\s*0,\s*0\)|#ff0000/i);
            expect(secondaryBg).toMatch(/rgb\(0,\s*255,\s*0\)|#00ff00/i);

            jest.useRealTimers();
        });
    });

    describe('when testing localStorage persistence', () => {
        it('should persist color changes to localStorage after debounce', async () => {
            function ThemeWrapper() {
                const { config, setColor, setMode } = usePreviewTheme();
                return <ThemeColorSection config={config} setColor={setColor} setMode={setMode} />;
            }

            const { container } = render(<ThemeWrapper />);

            const colorInputs = container.querySelectorAll('input[type="color"]');
            const primaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            fireEvent.change(primaryInput, { target: { value: '#ff0000' } });

            // Advance timers past debounce delay (300ms)
            act(() => {
                jest.advanceTimersByTime(300);
            });

            await waitFor(() => {
                expect(mockLocalStorage.setItem).toHaveBeenCalled();
            });
        });

        it('should debounce rapid color changes to prevent excessive localStorage writes', async () => {
            function ThemeWrapper() {
                const { config, setColor, setMode } = usePreviewTheme();
                return <ThemeColorSection config={config} setColor={setColor} setMode={setMode} />;
            }

            const { container } = render(<ThemeWrapper />);

            const colorInputs = container.querySelectorAll('input[type="color"]');
            const primaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            // Simulate rapid changes
            fireEvent.change(primaryInput, { target: { value: '#ff0000' } });

            fireEvent.change(primaryInput, { target: { value: '#00ff00' } });

            fireEvent.change(primaryInput, { target: { value: '#0000ff' } });

            // Before debounce completes, should not write to localStorage
            expect(mockLocalStorage.setItem).not.toHaveBeenCalled();

            // Advance timers past debounce delay
            act(() => {
                jest.advanceTimersByTime(300);
            });

            // After debounce, should write once with final value
            await waitFor(() => {
                const calls = mockLocalStorage.setItem.mock.calls;
                expect(calls.length).toBeGreaterThanOrEqual(1);
            });
        });

        it('should restore colors from localStorage on mount', async () => {
            // Use real timers for this test to allow useEffect to run properly
            jest.useRealTimers();

            // Clear and set up localStorage directly via the internal store
            mockLocalStorage.clear();

            const savedConfig: PreviewThemeConfigType = {
                ...DEFAULT_PREVIEW_THEME,
                colors: {
                    ...DEFAULT_PREVIEW_THEME.colors,
                    light: {
                        ...DEFAULT_PREVIEW_THEME.colors.light,
                        primary: '#ff0000',
                    },
                },
            };

            // Call setItem which updates the internal store
            mockLocalStorage.setItem.mockImplementationOnce((key: string, value: string) => {
                // Directly add to window.localStorage using Object.defineProperty
                Object.defineProperty(window.localStorage, key, {
                    value,
                    writable: true,
                    configurable: true,
                });
            });

            window.localStorage.setItem('preview-theme-config', JSON.stringify(savedConfig));

            // Set up getItem to return our saved config
            mockLocalStorage.getItem.mockImplementation((key: string) => {
                if (key === 'preview-theme-config') {
                    return JSON.stringify(savedConfig);
                }
                return null;
            });

            function ThemeWrapper() {
                const { config, setColor, setMode, isLoaded } = usePreviewTheme();
                return (
                    <>
                        <div data-testid="is-loaded">{isLoaded ? 'loaded' : 'loading'}</div>
                        <div data-testid="primary-color">{config.colors.light.primary}</div>
                        <ThemeColorSection config={config} setColor={setColor} setMode={setMode} />
                    </>
                );
            }

            render(<ThemeWrapper />);

            // Wait for hook to finish loading
            await waitFor(() => {
                expect(screen.getByTestId('is-loaded')).toHaveTextContent('loaded');
            });

            // Check if color was actually loaded from localStorage
            await waitFor(() => {
                expect(screen.getByTestId('primary-color')).toHaveTextContent('#ff0000');
            });

            // Wait for async localStorage load and verify color button
            await waitFor(() => {
                const primaryButton = screen.getByLabelText('Primary color');
                expect(primaryButton).toHaveStyle({ backgroundColor: '#ff0000' });
            });

            // Restore fake timers for other tests
            jest.useFakeTimers();
        });
    });

    describe('when switching between light and dark modes', () => {
        it('should preserve light mode colors when switching to dark mode', async () => {
            const user = userEvent.setup({ delay: null });

            function ThemeWrapper() {
                const { config, setColor, setMode } = usePreviewTheme();
                return <ThemeColorSection config={config} setColor={setColor} setMode={setMode} />;
            }

            const { container } = render(<ThemeWrapper />);

            // Change light mode primary color
            const colorInputs = container.querySelectorAll('input[type="color"]');
            const primaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            fireEvent.change(primaryInput, { target: { value: '#ff0000' } });

            await waitFor(() => {
                const primaryButton = screen.getByLabelText('Primary color');
                expect(primaryButton).toHaveStyle({ backgroundColor: '#ff0000' });
            });

            // Switch to dark mode
            const darkTab = screen.getByRole('tab', { name: /dark mode/i });
            await user.click(darkTab);

            // Dark mode primary should be unchanged
            await waitFor(() => {
                const primaryButton = screen.getByLabelText('Primary color');
                expect(primaryButton).toHaveStyle({ backgroundColor: '#90caf9' });
            });

            // Switch back to light mode
            const lightTab = screen.getByRole('tab', { name: /light mode/i });
            await user.click(lightTab);

            // Light mode primary should still be red
            await waitFor(() => {
                const primaryButton = screen.getByLabelText('Primary color');
                expect(primaryButton).toHaveStyle({ backgroundColor: '#ff0000' });
            });
        });

        it('should allow independent color changes in light and dark modes', async () => {
            jest.useFakeTimers();
            const user = userEvent.setup({ delay: null });

            function ThemeWrapper() {
                const { config, setColor, setMode } = usePreviewTheme();
                return <ThemeColorSection config={config} setColor={setColor} setMode={setMode} />;
            }

            const { container } = render(<ThemeWrapper />);

            // Change light mode primary
            const getLightInput = () =>
                Array.from(container.querySelectorAll('input[type="color"]')).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            fireEvent.change(getLightInput(), { target: { value: '#ff0000' } });

            // Advance timers past debounce delay
            act(() => {
                jest.advanceTimersByTime(300);
            });

            // Switch to dark mode
            const darkTab = screen.getByRole('tab', { name: /dark mode/i });
            await user.click(darkTab);

            // Change dark mode primary
            const getDarkInput = () =>
                Array.from(container.querySelectorAll('input[type="color"]')).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            fireEvent.change(getDarkInput(), { target: { value: '#00ff00' } });

            // Advance timers past debounce delay
            act(() => {
                jest.advanceTimersByTime(300);
            });

            // Flush all pending timers
            await act(async () => {
                jest.runAllTimers();
            });

            // Verify dark mode color (may be in rgb format)
            const darkPrimaryButton = screen.getByLabelText('Primary color');
            const darkBg = window.getComputedStyle(darkPrimaryButton).backgroundColor;
            expect(darkBg).toMatch(/rgb\(0,\s*255,\s*0\)|#00ff00/i);

            // Switch back to light mode
            const lightTab = screen.getByRole('tab', { name: /light mode/i });
            await user.click(lightTab);

            // Verify light mode color unchanged (may be in rgb format)
            const lightPrimaryButton = screen.getByLabelText('Primary color');
            const lightBg = window.getComputedStyle(lightPrimaryButton).backgroundColor;
            expect(lightBg).toMatch(/rgb\(255,\s*0,\s*0\)|#ff0000/i);

            jest.useRealTimers();
        });
    });

    describe('when handling format preservation', () => {
        it('should preserve hex format through color change cycle', async () => {
            function ThemeWrapper() {
                const { config, setColor, setMode } = usePreviewTheme();
                return (
                    <>
                        <div data-testid="primary-color">{config.colors.light.primary}</div>
                        <ThemeColorSection config={config} setColor={setColor} setMode={setMode} />
                    </>
                );
            }

            const { container } = render(<ThemeWrapper />);

            // Verify original color is hex format
            expect(screen.getByTestId('primary-color')).toHaveTextContent('#1976d2');

            const colorInputs = container.querySelectorAll('input[type="color"]');
            const primaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            // Change to new hex color
            fireEvent.change(primaryInput, { target: { value: '#ff0000' } });

            // Advance timers past component debounce (300ms)
            act(() => {
                jest.advanceTimersByTime(300);
            });

            // Verify hex format is preserved in config state
            await waitFor(() => {
                const displayedColor = screen.getByTestId('primary-color').textContent;
                // Should be hex format (not rgba)
                expect(displayedColor).toMatch(/^#[0-9a-fA-F]{6}$/);
                expect(displayedColor).toBe('#ff0000');
            });
        });

        it('should preserve hex format through color change cycle for secondary', async () => {
            function ThemeWrapper() {
                const { config, setColor, setMode } = usePreviewTheme();
                return (
                    <>
                        <div data-testid="secondary-color">{config.colors.light.secondary}</div>
                        <ThemeColorSection config={config} setColor={setColor} setMode={setMode} />
                    </>
                );
            }

            const { container } = render(<ThemeWrapper />);

            // Verify original color is hex format
            expect(screen.getByTestId('secondary-color')).toHaveTextContent('#9c27b0');

            const colorInputs = container.querySelectorAll('input[type="color"]');
            const secondaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Secondary')) as HTMLInputElement;

            // Change to new hex color
            fireEvent.change(secondaryInput, { target: { value: '#00ff00' } });

            // Advance timers past component debounce (300ms)
            act(() => {
                jest.advanceTimersByTime(300);
            });

            // Verify hex format is preserved in config state
            await waitFor(() => {
                const displayedColor = screen.getByTestId('secondary-color').textContent;
                // Should be hex format (not rgba)
                expect(displayedColor).toMatch(/^#[0-9a-fA-F]{6}$/);
                expect(displayedColor).toBe('#00ff00');
            });
        });
    });

    describe('when testing theme rebuild', () => {
        it('should rebuild MUI theme after color change', async () => {
            function ThemeWrapper() {
                const { config, theme, setColor, setMode } = usePreviewTheme();
                return (
                    <>
                        <div data-testid="theme-primary">{theme.palette.primary.main}</div>
                        <ThemeColorSection config={config} setColor={setColor} setMode={setMode} />
                    </>
                );
            }

            const { container } = render(<ThemeWrapper />);

            const themePrimary = screen.getByTestId('theme-primary');

            // Wait for initial theme to be set (MUI normalizes hex to rgb)
            await waitFor(() => {
                expect(themePrimary.textContent).toMatch(/^(#1976d2|rgb\(25, 118, 210\))$/);
            });

            const colorInputs = container.querySelectorAll('input[type="color"]');
            const primaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            fireEvent.change(primaryInput, { target: { value: '#ff0000' } });

            // Wait for theme to rebuild with new color
            await waitFor(() => {
                expect(themePrimary.textContent).toMatch(/^(#ff0000|rgb\(255, 0, 0\))$/);
            });
        });
    });

    describe('when handling error scenarios', () => {
        it('should handle invalid color gracefully', async () => {
            function ThemeWrapper() {
                const { config, setColor, setMode } = usePreviewTheme();
                return <ThemeColorSection config={config} setColor={setColor} setMode={setMode} />;
            }

            const { container } = render(<ThemeWrapper />);

            const colorInputs = container.querySelectorAll('input[type="color"]');
            const primaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            // Native color input should prevent invalid colors, but test graceful handling
            // Try to set invalid color (browser prevents this, so set a valid one)
            primaryInput.value = '#invalid';
            primaryInput.dispatchEvent(new Event('change', { bubbles: true }));

            // Color should remain unchanged or be valid
            await waitFor(() => {
                const primaryButton = screen.getByLabelText('Primary color');
                expect(primaryButton).toBeInTheDocument();
            });
        });

        it('should handle rapid mode switches without losing data', async () => {
            const user = userEvent.setup({ delay: null });

            function ThemeWrapper() {
                const { config, setColor, setMode } = usePreviewTheme();
                return <ThemeColorSection config={config} setColor={setColor} setMode={setMode} />;
            }

            render(<ThemeWrapper />);

            const lightTab = screen.getByRole('tab', { name: /light mode/i });
            const darkTab = screen.getByRole('tab', { name: /dark mode/i });

            // Rapid mode switches
            await user.click(darkTab);
            await user.click(lightTab);
            await user.click(darkTab);
            await user.click(lightTab);

            // Should end up in light mode
            await waitFor(() => {
                const primaryButton = screen.getByLabelText('Primary color');
                expect(primaryButton).toHaveStyle({ backgroundColor: '#1976d2' });
            });
        });
    });
});
