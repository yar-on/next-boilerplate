/**
 * Preview Utility Functions
 *
 * Helper functions for the theme preview feature.
 */

import type { ButtonPositionType } from '@/types/preview.types';

/**
 * Validates if a string is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
}

/**
 * Validates if a string is a valid rgba color
 */
export function isValidRgbaColor(color: string): boolean {
    const rgbaRegex = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(,\s*[\d.]+)?\)$/;
    return rgbaRegex.test(color);
}

/**
 * Clamps a position value between min and max
 */
export function clampPosition(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Checks if a position is within the viewport boundaries
 */
export function isPositionInViewport(position: ButtonPositionType, elementWidth: number = 56, elementHeight: number = 56): boolean {
    const { x, y } = position;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    return x >= 0 && y >= 0 && x + elementWidth <= viewportWidth && y + elementHeight <= viewportHeight;
}

/**
 * Adjusts position to be within viewport if it's outside
 */
export function constrainPositionToViewport(position: ButtonPositionType, elementWidth: number = 56, elementHeight: number = 56): ButtonPositionType {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    return {
        x: clampPosition(position.x, 0, viewportWidth - elementWidth),
        y: clampPosition(position.y, 0, viewportHeight - elementHeight),
    };
}

/**
 * Debounce function to limit execution rate
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

/**
 * Gets the default button position (bottom-right)
 */
export function getDefaultButtonPosition(): ButtonPositionType {
    if (typeof window === 'undefined') {
        return { x: 0, y: 0 };
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    return {
        x: viewportWidth - 72, // 56px FAB + 16px margin
        y: viewportHeight - 72, // 56px FAB + 16px margin
    };
}

/**
 * Converts hex color to rgba
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!result || !result[1] || !result[2] || !result[3]) {
        return `rgba(0, 0, 0, ${alpha})`;
    }

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
