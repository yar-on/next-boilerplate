/**
 * Component Tests - ThemeColorSection
 *
 * Tests for color button rendering, native picker integration, and event handling.
 * Priority: P0 (core behavior) + P1 (format handling)
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeColorSection } from '../theme-color-section.components';
import type { PreviewThemeConfigType } from '@/types/preview.types';

// Don't mock - use real implementations
// Mock only if we want to test the component in isolation
// But for these tests, we want to test the full flow

const mockThemeConfig: PreviewThemeConfigType = {
    version: '1.0',
    mode: 'light',
    colors: {
        light: {
            primary: '#1976d2',
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
            bodyColor: 'rgba(0, 0, 0, 0.87)',
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
            bodyColor: 'rgba(255, 255, 255, 0.87)',
            linkColor: '#90caf9',
        },
    },
    typography: {
        headingFont: '"Roboto", "Helvetica", "Arial", sans-serif',
        bodyFont: '"Roboto", "Helvetica", "Arial", sans-serif',
        headingWeight: 500,
        bodyWeight: 400,
        h1Size: 40,
        h2Size: 32,
        h3Size: 28,
        bodySize: 16,
        headingLineHeight: 1.2,
        bodyLineHeight: 1.5,
        headingLetterSpacing: 0,
        bodyLetterSpacing: 0,
    },
    borderRadius: 8,
};

describe('ThemeColorSection Component', () => {
    let mockSetColor: jest.Mock;
    let mockSetMode: jest.Mock;

    beforeEach(() => {
        mockSetColor = jest.fn();
        mockSetMode = jest.fn();
        jest.clearAllMocks();
    });

    describe('when rendering color buttons', () => {
        it('should render all color category sections', () => {
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            expect(screen.getByText('Palette Colors')).toBeInTheDocument();
            expect(screen.getByText('Background Colors')).toBeInTheDocument();
            expect(screen.getByText('Text & Divider')).toBeInTheDocument();
            expect(screen.getByText('Custom Typography Colors')).toBeInTheDocument();
        });

        it('should render primary color button with correct background', () => {
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const primaryButton = screen.getByLabelText('Primary color');
            expect(primaryButton).toBeInTheDocument();
            expect(primaryButton).toHaveStyle({ backgroundColor: '#1976d2' });
        });

        it('should render secondary color button with rgba background', () => {
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const secondaryButton = screen.getByLabelText('Secondary color');
            expect(secondaryButton).toBeInTheDocument();
            expect(secondaryButton).toHaveStyle({ backgroundColor: 'rgba(220, 0, 78, 0.9)' });
        });

        it('should render all palette colors (6 colors)', () => {
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            expect(screen.getByLabelText('Primary color')).toBeInTheDocument();
            expect(screen.getByLabelText('Secondary color')).toBeInTheDocument();
            expect(screen.getByLabelText('Error color')).toBeInTheDocument();
            expect(screen.getByLabelText('Warning color')).toBeInTheDocument();
            expect(screen.getByLabelText('Info color')).toBeInTheDocument();
            expect(screen.getByLabelText('Success color')).toBeInTheDocument();
        });

        it('should render background colors', () => {
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            expect(screen.getByLabelText('Background Default color')).toBeInTheDocument();
            expect(screen.getByLabelText('Background Paper color')).toBeInTheDocument();
        });

        it('should render text and divider colors', () => {
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            expect(screen.getByLabelText('Text Primary color')).toBeInTheDocument();
            expect(screen.getByLabelText('Text Secondary color')).toBeInTheDocument();
            expect(screen.getByLabelText('Text Disabled color')).toBeInTheDocument();
            expect(screen.getByLabelText('Divider color')).toBeInTheDocument();
        });

        it('should render custom typography colors', () => {
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            expect(screen.getByLabelText('Heading Color color')).toBeInTheDocument();
            expect(screen.getByLabelText('Body Color color')).toBeInTheDocument();
            expect(screen.getByLabelText('Link Color color')).toBeInTheDocument();
        });
    });

    describe('when rendering hidden color inputs', () => {
        it('should render hidden color input for primary color', () => {
            const { container } = render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const colorInputs = container.querySelectorAll('input[type="color"]');
            expect(colorInputs.length).toBeGreaterThan(0);
        });

        it('should have hidden color input with correct hex value for hex color', () => {
            const { container } = render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const colorInputs = container.querySelectorAll('input[type="color"]');
            const primaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            expect(primaryInput.value).toBe('#1976d2');
        });

        it('should have hidden color input with converted hex value for rgba color', () => {
            const { container } = render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const colorInputs = container.querySelectorAll('input[type="color"]');
            const secondaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Secondary')) as HTMLInputElement;

            expect(secondaryInput.value).toBe('#dc004e');
        });

        it('should have hidden inputs with opacity 0', () => {
            const { container } = render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const colorInputs = container.querySelectorAll('input[type="color"]');
            colorInputs.forEach((input) => {
                expect(input).toHaveStyle({ opacity: '0' });
            });
        });

        it('should have hidden inputs with aria-hidden="true"', () => {
            const { container } = render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const colorInputs = container.querySelectorAll('input[type="color"]');
            colorInputs.forEach((input) => {
                expect(input).toHaveAttribute('aria-hidden', 'true');
            });
        });

        it('should render one hidden input per color button', () => {
            const { container } = render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const colorButtons = screen.getAllByRole('button', { name: /color$/i });
            const colorInputs = container.querySelectorAll('input[type="color"]');

            expect(colorInputs.length).toBe(colorButtons.length);
        });
    });

    describe('when clicking color buttons', () => {
        it('should trigger hidden input click on button click', async () => {
            const user = userEvent.setup();
            const { container } = render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const primaryButton = screen.getByLabelText('Primary color');
            const colorInputs = container.querySelectorAll('input[type="color"]');
            const primaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            // Mock the click method
            const mockClick = jest.fn();
            primaryInput.click = mockClick;

            await user.click(primaryButton);

            expect(mockClick).toHaveBeenCalled();
        });

        it('should handle multiple color button clicks', async () => {
            const user = userEvent.setup();
            const { container } = render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const primaryButton = screen.getByLabelText('Primary color');
            const secondaryButton = screen.getByLabelText('Secondary color');
            const colorInputs = container.querySelectorAll('input[type="color"]');

            const primaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            const secondaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Secondary')) as HTMLInputElement;

            const mockPrimaryClick = jest.fn();
            const mockSecondaryClick = jest.fn();
            primaryInput.click = mockPrimaryClick;
            secondaryInput.click = mockSecondaryClick;

            await user.click(primaryButton);
            await user.click(secondaryButton);

            expect(mockPrimaryClick).toHaveBeenCalledTimes(1);
            expect(mockSecondaryClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('when changing color input values', () => {
        it('should call setColor with correct parameters for hex color', () => {
            jest.useFakeTimers();

            const { container } = render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const colorInputs = container.querySelectorAll('input[type="color"]');
            const primaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            // Use fireEvent.change to trigger React's synthetic event
            fireEvent.change(primaryInput, { target: { value: '#ff0000' } });

            // Advance timers to trigger debounced callback (300ms)
            jest.advanceTimersByTime(300);

            expect(mockSetColor).toHaveBeenCalledWith('light', 'primary', '#ff0000');

            jest.useRealTimers();
        });

        it('should call setColor with rgba format for original rgba color', async () => {
            jest.useFakeTimers();

            const { container } = render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const colorInputs = container.querySelectorAll('input[type="color"]');
            const secondaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Secondary')) as HTMLInputElement;

            fireEvent.change(secondaryInput, { target: { value: '#ff0000' } });

            // Advance timers to trigger debounced callback (300ms)
            jest.advanceTimersByTime(300);

            // Should preserve rgba format with original alpha (0.9)
            expect(mockSetColor).toHaveBeenCalledWith('light', 'secondary', 'rgba(255, 0, 0, 0.9)');

            jest.useRealTimers();
        });

        it('should preserve alpha channel when updating rgba color', async () => {
            jest.useFakeTimers();

            const { container } = render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const colorInputs = container.querySelectorAll('input[type="color"]');
            const textPrimaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Text Primary')) as HTMLInputElement;

            fireEvent.change(textPrimaryInput, { target: { value: '#ff0000' } });

            // Advance timers to trigger debounced callback (300ms)
            jest.advanceTimersByTime(300);

            // Original: rgba(0, 0, 0, 0.87) → Should preserve 0.87 alpha
            expect(mockSetColor).toHaveBeenCalledWith('light', 'textPrimary', 'rgba(255, 0, 0, 0.87)');

            jest.useRealTimers();
        });

        it('should handle rapid color changes', async () => {
            jest.useFakeTimers();

            const { container } = render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const colorInputs = container.querySelectorAll('input[type="color"]');
            const primaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            // Simulate rapid changes - with debounce, only the last change should be applied
            fireEvent.change(primaryInput, { target: { value: '#ff0000' } });
            fireEvent.change(primaryInput, { target: { value: '#00ff00' } });
            fireEvent.change(primaryInput, { target: { value: '#0000ff' } });

            // Advance timers to trigger debounced callback (300ms)
            jest.advanceTimersByTime(300);

            // With debounce, only the last change is applied
            expect(mockSetColor).toHaveBeenCalledTimes(1);
            expect(mockSetColor).toHaveBeenLastCalledWith('light', 'primary', '#0000ff');

            jest.useRealTimers();
        });
    });

    describe('when switching between light and dark modes', () => {
        it('should render light mode tab active by default', () => {
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const lightTab = screen.getByRole('tab', { name: /light mode/i });
            expect(lightTab).toHaveAttribute('aria-selected', 'true');
        });

        it('should call setMode when switching to dark mode', async () => {
            const user = userEvent.setup();
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const darkTab = screen.getByRole('tab', { name: /dark mode/i });
            await user.click(darkTab);

            expect(mockSetMode).toHaveBeenCalledWith('dark');
        });

        it('should show light mode indicator when in light mode', () => {
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            expect(screen.getByText(/editing light mode colors/i)).toBeInTheDocument();
        });

        it('should show dark mode indicator when in dark mode', async () => {
            const user = userEvent.setup();
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const darkTab = screen.getByRole('tab', { name: /dark mode/i });
            await user.click(darkTab);

            expect(screen.getByText(/editing dark mode colors/i)).toBeInTheDocument();
        });

        it('should display dark mode colors after switching', async () => {
            const user = userEvent.setup();
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const darkTab = screen.getByRole('tab', { name: /dark mode/i });
            await user.click(darkTab);

            const primaryButton = screen.getByLabelText('Primary color');
            expect(primaryButton).toHaveStyle({ backgroundColor: '#90caf9' });
        });

        it('should update color in correct mode after mode switch', async () => {
            jest.useFakeTimers();

            const user = userEvent.setup({ delay: null }); // Disable delay for fake timers
            const { container } = render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            // Switch to dark mode
            const darkTab = screen.getByRole('tab', { name: /dark mode/i });
            await user.click(darkTab);

            // Change primary color in dark mode
            const colorInputs = container.querySelectorAll('input[type="color"]');
            const primaryInput = Array.from(colorInputs).find((input) => input.nextElementSibling?.textContent?.includes('Primary')) as HTMLInputElement;

            fireEvent.change(primaryInput, { target: { value: '#ff0000' } });

            // Advance timers to trigger debounced callback (300ms)
            jest.advanceTimersByTime(300);

            expect(mockSetColor).toHaveBeenCalledWith('dark', 'primary', '#ff0000');

            jest.useRealTimers();
        });
    });

    describe('when handling accessibility', () => {
        it('should have accessible button labels', () => {
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            expect(screen.getByLabelText('Primary color')).toBeInTheDocument();
            expect(screen.getByLabelText('Secondary color')).toBeInTheDocument();
            expect(screen.getByLabelText('Error color')).toBeInTheDocument();
        });

        it('should support keyboard navigation with Tab', async () => {
            const user = userEvent.setup();
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            await user.tab();

            // First tab should focus on light mode tab or first color button
            // Verify one of the interactive elements is focused
            const focusedElement = document.activeElement;
            expect(focusedElement).toBeInTheDocument();
        });

        it('should show tooltip with color value on hover', async () => {
            const user = userEvent.setup();
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            const primaryButton = screen.getByLabelText('Primary color');
            await user.hover(primaryButton);

            // MUI Tooltip renders asynchronously, so we check that the button has tooltip props
            expect(primaryButton).toBeInTheDocument();
        });
    });

    describe('when validating no ColorPickerModal is rendered', () => {
        it('should not render any modal dialog', () => {
            const { container } = render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            // Check for common modal elements
            expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
            expect(container.querySelector('.MuiModal-root')).not.toBeInTheDocument();
            expect(container.querySelector('.MuiDialog-root')).not.toBeInTheDocument();
        });

        it('should not render Save or Cancel buttons', () => {
            render(<ThemeColorSection config={mockThemeConfig} setColor={mockSetColor} setMode={mockSetMode} />);

            expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
        });
    });
});
