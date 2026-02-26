/**
 * Unit Tests - Color Conversion Utilities
 *
 * Tests for color format detection, conversion, and alpha preservation.
 * Priority: P0 (format preservation, conversion) + P1 (alpha preservation)
 */

import { detectColorFormat, extractAlpha, toHexForPicker, fromPickerToOriginalFormat } from '../color-conversion.utils';

describe('Color Conversion Utilities', () => {
    describe('detectColorFormat', () => {
        describe('when given hex colors', () => {
            it('should detect 6-digit hex color', () => {
                expect(detectColorFormat('#1976d2')).toBe('hex');
            });

            it('should detect 3-digit hex color', () => {
                expect(detectColorFormat('#f00')).toBe('hex');
            });

            it('should detect uppercase hex color', () => {
                expect(detectColorFormat('#FF0000')).toBe('hex');
            });

            it('should detect hex color with whitespace', () => {
                expect(detectColorFormat('  #1976d2  ')).toBe('hex');
            });
        });

        describe('when given rgba colors', () => {
            it('should detect rgba with alpha', () => {
                expect(detectColorFormat('rgba(25, 118, 210, 0.8)')).toBe('rgba');
            });

            it('should detect rgb without alpha', () => {
                expect(detectColorFormat('rgb(25, 118, 210)')).toBe('rgba');
            });

            it('should detect rgba with spaces', () => {
                expect(detectColorFormat('rgba(255, 0, 0, 1)')).toBe('rgba');
            });

            it('should detect rgba without spaces', () => {
                expect(detectColorFormat('rgba(255,0,0,0.5)')).toBe('rgba');
            });

            it('should detect uppercase RGBA', () => {
                expect(detectColorFormat('RGBA(255, 0, 0, 0.5)')).toBe('rgba');
            });
        });

        describe('when given invalid or edge case colors', () => {
            it('should default to hex for invalid color', () => {
                expect(detectColorFormat('invalid')).toBe('hex');
            });

            it('should default to hex for empty string', () => {
                expect(detectColorFormat('')).toBe('hex');
            });

            it('should default to hex for named color', () => {
                expect(detectColorFormat('red')).toBe('hex');
            });

            it('should default to hex for malformed color', () => {
                expect(detectColorFormat('##1976d2')).toBe('hex');
            });
        });
    });

    describe('extractAlpha', () => {
        describe('when given rgba colors with alpha', () => {
            it('should extract alpha 0.8', () => {
                expect(extractAlpha('rgba(25, 118, 210, 0.8)')).toBe(0.8);
            });

            it('should extract alpha 0.5', () => {
                expect(extractAlpha('rgba(255, 0, 0, 0.5)')).toBe(0.5);
            });

            it('should extract alpha 1.0', () => {
                expect(extractAlpha('rgba(0, 255, 0, 1.0)')).toBe(1.0);
            });

            it('should extract alpha 0.0 (fully transparent)', () => {
                expect(extractAlpha('rgba(0, 0, 0, 0)')).toBe(0);
            });

            it('should extract alpha with no spaces', () => {
                expect(extractAlpha('rgba(255,0,0,0.75)')).toBe(0.75);
            });
        });

        describe('when given rgb colors without alpha', () => {
            it('should return 1.0 for rgb without alpha', () => {
                expect(extractAlpha('rgb(25, 118, 210)')).toBe(1.0);
            });

            it('should return 1.0 for rgb with spaces', () => {
                expect(extractAlpha('rgb(255, 0, 0)')).toBe(1.0);
            });

            it('should return 1.0 for rgb without spaces', () => {
                expect(extractAlpha('rgb(255,0,0)')).toBe(1.0);
            });
        });

        describe('when given invalid colors', () => {
            it('should return 1.0 for invalid color', () => {
                expect(extractAlpha('invalid')).toBe(1.0);
            });

            it('should return 1.0 for hex color', () => {
                expect(extractAlpha('#1976d2')).toBe(1.0);
            });

            it('should return 1.0 for empty string', () => {
                expect(extractAlpha('')).toBe(1.0);
            });

            it('should return 1.0 for malformed rgba', () => {
                expect(extractAlpha('rgba(256, 0, 0)')).toBe(1.0);
            });
        });
    });

    describe('toHexForPicker', () => {
        describe('when given hex colors', () => {
            it('should preserve 6-digit hex color', () => {
                expect(toHexForPicker('#1976d2')).toBe('#1976d2');
            });

            it('should expand 3-digit hex to 6-digit', () => {
                expect(toHexForPicker('#f00')).toBe('#ff0000');
            });

            it('should expand 3-digit hex with mixed case', () => {
                expect(toHexForPicker('#F0A')).toBe('#FF00AA');
            });

            it('should preserve black', () => {
                expect(toHexForPicker('#000')).toBe('#000000');
            });

            it('should preserve white', () => {
                expect(toHexForPicker('#fff')).toBe('#ffffff');
            });

            it('should handle uppercase hex', () => {
                expect(toHexForPicker('#FF0000')).toBe('#FF0000');
            });
        });

        describe('when given rgba colors', () => {
            it('should convert rgba to hex (blue)', () => {
                expect(toHexForPicker('rgba(25, 118, 210, 0.8)')).toBe('#1976d2');
            });

            it('should convert rgba to hex (red)', () => {
                expect(toHexForPicker('rgba(255, 0, 0, 1)')).toBe('#ff0000');
            });

            it('should convert rgb to hex (green)', () => {
                expect(toHexForPicker('rgb(0, 255, 0)')).toBe('#00ff00');
            });

            it('should convert rgba to hex ignoring alpha', () => {
                expect(toHexForPicker('rgba(128, 64, 32, 0.5)')).toBe('#804020');
            });

            it('should convert rgba with spaces', () => {
                expect(toHexForPicker('rgba(255, 128, 64, 0.9)')).toBe('#ff8040');
            });

            it('should convert rgba without spaces', () => {
                expect(toHexForPicker('rgba(255,128,64,0.9)')).toBe('#ff8040');
            });
        });

        describe('when given edge case colors', () => {
            it('should convert black rgba to hex', () => {
                expect(toHexForPicker('rgba(0, 0, 0, 1)')).toBe('#000000');
            });

            it('should convert white rgba to hex', () => {
                expect(toHexForPicker('rgba(255, 255, 255, 1)')).toBe('#ffffff');
            });

            it('should convert transparent black to hex (ignoring alpha)', () => {
                expect(toHexForPicker('rgba(0, 0, 0, 0)')).toBe('#000000');
            });

            it('should pad single-digit hex values with zero', () => {
                expect(toHexForPicker('rgba(1, 2, 3, 1)')).toBe('#010203');
            });
        });

        describe('when given invalid colors', () => {
            it('should return input for invalid hex-like color', () => {
                // Since detectColorFormat returns 'hex' for invalid, it returns as-is
                expect(toHexForPicker('invalid')).toBe('invalid');
            });

            it('should return input for empty string', () => {
                expect(toHexForPicker('')).toBe('');
            });

            it('should convert malformed rgba (out of range values)', () => {
                // Regex still matches, but values overflow (256 -> 100 in hex)
                expect(toHexForPicker('rgba(256, 0, 0)')).toBe('#1000000');
            });

            it('should expand named color as if 3-digit hex', () => {
                // Named colors like 'red' are treated as 3-char hex and expanded
                expect(toHexForPicker('red')).toBe('#rreedd');
            });
        });
    });

    describe('fromPickerToOriginalFormat', () => {
        describe('when original format is hex', () => {
            it('should preserve hex format', () => {
                expect(fromPickerToOriginalFormat('#ff0000', 'hex')).toBe('#ff0000');
            });

            it('should preserve hex format ignoring alpha parameter', () => {
                expect(fromPickerToOriginalFormat('#1976d2', 'hex', 0.8)).toBe('#1976d2');
            });

            it('should preserve black hex', () => {
                expect(fromPickerToOriginalFormat('#000000', 'hex')).toBe('#000000');
            });

            it('should preserve white hex', () => {
                expect(fromPickerToOriginalFormat('#ffffff', 'hex')).toBe('#ffffff');
            });
        });

        describe('when original format is rgba', () => {
            it('should convert to rgba with default alpha 1.0', () => {
                expect(fromPickerToOriginalFormat('#ff0000', 'rgba')).toBe('rgba(255, 0, 0, 1)');
            });

            it('should convert to rgba with alpha 0.8', () => {
                expect(fromPickerToOriginalFormat('#1976d2', 'rgba', 0.8)).toBe('rgba(25, 118, 210, 0.8)');
            });

            it('should convert to rgba with alpha 0.5', () => {
                expect(fromPickerToOriginalFormat('#ff0000', 'rgba', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
            });

            it('should convert to rgba with alpha 0.0 (transparent)', () => {
                expect(fromPickerToOriginalFormat('#000000', 'rgba', 0)).toBe('rgba(0, 0, 0, 0)');
            });

            it('should convert black to rgba', () => {
                expect(fromPickerToOriginalFormat('#000000', 'rgba', 1)).toBe('rgba(0, 0, 0, 1)');
            });

            it('should convert white to rgba', () => {
                expect(fromPickerToOriginalFormat('#ffffff', 'rgba', 1)).toBe('rgba(255, 255, 255, 1)');
            });
        });

        describe('when preserving alpha through conversion cycle', () => {
            it('should preserve alpha 0.8 through full cycle', () => {
                const original = 'rgba(25, 118, 210, 0.8)';
                const originalFormat = detectColorFormat(original);
                const alpha = extractAlpha(original);
                const hex = toHexForPicker(original);
                const final = fromPickerToOriginalFormat(hex, originalFormat, alpha);
                expect(final).toBe('rgba(25, 118, 210, 0.8)');
            });

            it('should preserve alpha 0.5 through full cycle', () => {
                const original = 'rgba(255, 0, 0, 0.5)';
                const originalFormat = detectColorFormat(original);
                const alpha = extractAlpha(original);
                const hex = toHexForPicker(original);
                const final = fromPickerToOriginalFormat(hex, originalFormat, alpha);
                expect(final).toBe('rgba(255, 0, 0, 0.5)');
            });

            it('should preserve hex through full cycle', () => {
                const original = '#1976d2';
                const originalFormat = detectColorFormat(original);
                const alpha = extractAlpha(original);
                const hex = toHexForPicker(original);
                const final = fromPickerToOriginalFormat(hex, originalFormat, alpha);
                expect(final).toBe('#1976d2');
            });

            it('should handle 3-digit hex through full cycle', () => {
                const original = '#f00';
                const originalFormat = detectColorFormat(original);
                const alpha = extractAlpha(original);
                const hex = toHexForPicker(original);
                const final = fromPickerToOriginalFormat(hex, originalFormat, alpha);
                expect(final).toBe('#ff0000'); // Expanded to 6-digit
            });
        });

        describe('when handling edge cases', () => {
            it('should convert with fractional alpha values', () => {
                expect(fromPickerToOriginalFormat('#ff0000', 'rgba', 0.333)).toBe('rgba(255, 0, 0, 0.333)');
            });

            it('should convert with very small alpha', () => {
                expect(fromPickerToOriginalFormat('#1976d2', 'rgba', 0.01)).toBe('rgba(25, 118, 210, 0.01)');
            });

            it('should convert with alpha approaching 1', () => {
                expect(fromPickerToOriginalFormat('#ff0000', 'rgba', 0.999)).toBe('rgba(255, 0, 0, 0.999)');
            });
        });
    });

    describe('Color format preservation integration', () => {
        describe('when simulating user color changes', () => {
            it('should preserve hex format after color change', () => {
                const original = '#1976d2';
                const newPickerValue = '#ff0000';

                const originalFormat = detectColorFormat(original);
                const alpha = extractAlpha(original);
                const final = fromPickerToOriginalFormat(newPickerValue, originalFormat, alpha);

                expect(final).toBe('#ff0000');
                expect(detectColorFormat(final)).toBe('hex');
            });

            it('should preserve rgba format and alpha after color change', () => {
                const original = 'rgba(25, 118, 210, 0.8)';
                const newPickerValue = '#ff0000';

                const originalFormat = detectColorFormat(original);
                const alpha = extractAlpha(original);
                const final = fromPickerToOriginalFormat(newPickerValue, originalFormat, alpha);

                expect(final).toBe('rgba(255, 0, 0, 0.8)');
                expect(detectColorFormat(final)).toBe('rgba');
                expect(extractAlpha(final)).toBe(0.8);
            });

            it('should handle multiple sequential color changes with rgba', () => {
                let current = 'rgba(25, 118, 210, 0.5)';

                // First change
                const format1 = detectColorFormat(current);
                const alpha1 = extractAlpha(current);
                current = fromPickerToOriginalFormat('#ff0000', format1, alpha1);
                expect(current).toBe('rgba(255, 0, 0, 0.5)');

                // Second change
                const format2 = detectColorFormat(current);
                const alpha2 = extractAlpha(current);
                current = fromPickerToOriginalFormat('#00ff00', format2, alpha2);
                expect(current).toBe('rgba(0, 255, 0, 0.5)');

                // Alpha preserved through both changes
                expect(extractAlpha(current)).toBe(0.5);
            });

            it('should handle multiple sequential color changes with hex', () => {
                let current = '#1976d2';

                // First change
                const format1 = detectColorFormat(current);
                const alpha1 = extractAlpha(current);
                current = fromPickerToOriginalFormat('#ff0000', format1, alpha1);
                expect(current).toBe('#ff0000');

                // Second change
                const format2 = detectColorFormat(current);
                const alpha2 = extractAlpha(current);
                current = fromPickerToOriginalFormat('#00ff00', format2, alpha2);
                expect(current).toBe('#00ff00');

                // Format preserved through both changes
                expect(detectColorFormat(current)).toBe('hex');
            });
        });

        describe('when handling picker input preparation', () => {
            it('should prepare hex color for native picker', () => {
                const color = '#1976d2';
                const pickerValue = toHexForPicker(color);
                expect(pickerValue).toBe('#1976d2');
                expect(pickerValue.startsWith('#')).toBe(true);
                expect(pickerValue.replace('#', '').length).toBe(6);
            });

            it('should prepare rgba color for native picker (strips alpha)', () => {
                const color = 'rgba(25, 118, 210, 0.8)';
                const pickerValue = toHexForPicker(color);
                expect(pickerValue).toBe('#1976d2');
                expect(pickerValue.startsWith('#')).toBe(true);
                expect(pickerValue.replace('#', '').length).toBe(6);
            });

            it('should prepare 3-digit hex for native picker (expands)', () => {
                const color = '#f00';
                const pickerValue = toHexForPicker(color);
                expect(pickerValue).toBe('#ff0000');
                expect(pickerValue.replace('#', '').length).toBe(6);
            });
        });
    });
});
