import { formatDate, formatNumber, formatCurrency } from '../locale-formatter.utils';

describe('Locale Formatters', () => {
    describe('formatDate', () => {
        const testDate = new Date('2025-01-15T10:30:00Z');

        it('formats date for English locale', () => {
            const result = formatDate(testDate, 'en');
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result).toMatch(/1.*15.*2025/);
        });

        it('formats date for Hebrew locale', () => {
            const result = formatDate(testDate, 'he');
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result).toMatch(/15.*1.*2025/);
        });

        it('respects custom options', () => {
            const result = formatDate(testDate, 'en', { dateStyle: 'long' });
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
    });

    describe('formatNumber', () => {
        it('formats number for English locale', () => {
            const result = formatNumber(1234.56, 'en');
            expect(result).toBe('1,234.56');
        });

        it('formats number for Hebrew locale', () => {
            const result = formatNumber(1234.56, 'he');
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result).toMatch(/1.*234.*56/);
        });

        it('formats percentage', () => {
            const result = formatNumber(0.95, 'en', { style: 'percent' });
            expect(result).toBe('95%');
        });
    });

    describe('formatCurrency', () => {
        it('formats USD for English locale', () => {
            const result = formatCurrency(1234.56, 'en', 'USD');
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result).toContain('$');
            expect(result).toMatch(/1.*234.*56/);
        });

        it('formats ILS for Hebrew locale', () => {
            const result = formatCurrency(1234.56, 'he', 'ILS');
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });

        it('handles invalid input gracefully', () => {
            const result = formatCurrency(NaN, 'en', 'USD');
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
    });
});
