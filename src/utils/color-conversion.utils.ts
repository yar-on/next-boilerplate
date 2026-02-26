/**
 * Color Conversion Utilities
 *
 * Utilities for converting between color formats (hex, rgba) to support
 * native HTML5 color picker integration while preserving original formats.
 */

/**
 * Detects whether a color string is in hex or rgba format
 *
 * @param color - Color string to analyze
 * @returns 'hex' if color is in hex format (#RGB or #RRGGBB), 'rgba' if in rgba/rgb format
 *
 * @example
 * detectColorFormat('#1976d2') // → 'hex'
 * detectColorFormat('rgba(25, 118, 210, 0.8)') // → 'rgba'
 * detectColorFormat('rgb(25, 118, 210)') // → 'rgba'
 */
export function detectColorFormat(color: string): 'hex' | 'rgba' {
    const trimmed = color.trim().toLowerCase();
    if (trimmed.startsWith('rgba(') || trimmed.startsWith('rgb(')) {
        return 'rgba';
    }
    if (trimmed.startsWith('#')) {
        return 'hex';
    }
    // Default to hex if unclear
    return 'hex';
}

/**
 * Extracts alpha value from rgba color string
 *
 * Native color picker only supports RGB (no alpha), so we extract and preserve
 * the alpha channel separately to reapply it after color selection.
 *
 * @param rgbaColor - Color string in rgba or rgb format
 * @returns Alpha value between 0 and 1 (returns 1.0 for rgb without alpha or invalid formats)
 *
 * @example
 * extractAlpha('rgba(25, 118, 210, 0.8)') // → 0.8
 * extractAlpha('rgb(25, 118, 210)') // → 1.0
 * extractAlpha('rgba(255, 0, 0, 0.5)') // → 0.5
 */
export function extractAlpha(rgbaColor: string): number {
    const match = rgbaColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return 1.0;

    const alpha = match[4];
    return alpha !== undefined ? parseFloat(alpha) : 1.0;
}

/**
 * Converts any color format to hex for native color picker
 *
 * Native <input type="color"> only accepts #RRGGBB format (6-digit hex).
 * This function converts rgba to hex and normalizes 3-digit hex to 6-digit.
 *
 * @param color - Color in hex or rgba format
 * @returns Hex color in #RRGGBB format
 *
 * @example
 * toHexForPicker('#1976d2') // → '#1976d2'
 * toHexForPicker('#f00') // → '#ff0000'
 * toHexForPicker('rgba(25, 118, 210, 0.8)') // → '#1976d2'
 */
export function toHexForPicker(color: string): string {
    const format = detectColorFormat(color);

    if (format === 'hex') {
        // Ensure 6-digit format (#RGB → #RRGGBB)
        const cleaned = color.replace('#', '');
        if (cleaned.length === 3) {
            const r = cleaned[0] ?? '0';
            const g = cleaned[1] ?? '0';
            const b = cleaned[2] ?? '0';
            return `#${r}${r}${g}${g}${b}${b}`;
        }
        return color;
    }

    // Convert rgba to hex
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) {
        // Fallback to default blue if invalid
        return '#1976d2';
    }

    const r = parseInt(match[1] ?? '0', 10);
    const g = parseInt(match[2] ?? '0', 10);
    const b = parseInt(match[3] ?? '0', 10);

    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts hex color from picker back to original format
 *
 * Preserves the original color format after native picker selection.
 * If original was rgba, converts hex back to rgba and reapplies preserved alpha.
 *
 * @param hexColor - Hex color from native picker (#RRGGBB)
 * @param originalFormat - Original format of the color ('hex' or 'rgba')
 * @param alpha - Alpha value to apply if converting to rgba (default: 1.0)
 * @returns Color in original format
 *
 * @example
 * fromPickerToOriginalFormat('#ff0000', 'hex') // → '#ff0000'
 * fromPickerToOriginalFormat('#ff0000', 'rgba', 0.8) // → 'rgba(255, 0, 0, 0.8)'
 * fromPickerToOriginalFormat('#1976d2', 'rgba', 1.0) // → 'rgba(25, 118, 210, 1)'
 */
export function fromPickerToOriginalFormat(hexColor: string, originalFormat: 'hex' | 'rgba', alpha: number = 1.0): string {
    if (originalFormat === 'hex') {
        return hexColor;
    }

    // Convert hex to rgba with preserved alpha
    const cleaned = hexColor.replace('#', '');
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
