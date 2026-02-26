import { logger } from '@/utils/logger/logger.utils';

/**
 * Format date according to locale
 *
 * @param date - Date to format
 * @param locale - Locale code
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date(), 'en'); // "1/15/2025"
 * formatDate(new Date(), 'he'); // "15.1.2025"
 * formatDate(new Date(), 'en', { dateStyle: 'long' }); // "January 15, 2025"
 */
export function formatDate(date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
    try {
        // If no options provided, use default numeric format
        const defaultOptions: Intl.DateTimeFormatOptions = options
            ? options
            : {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
              };

        const formatter = new Intl.DateTimeFormat(locale, defaultOptions);
        return formatter.format(date);
    } catch (error) {
        void logger.error({ message: 'Date formatting error', error });
        const iso = date.toISOString().split('T')[0];
        return iso || ''; // Fallback: YYYY-MM-DD
    }
}

/**
 * Format number according to locale
 *
 * @param value - Number to format
 * @param locale - Locale code
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234.56, 'en'); // "1,234.56"
 * formatNumber(1234.56, 'he'); // "1,234.56"
 * formatNumber(0.95, 'en', { style: 'percent' }); // "95%"
 */
export function formatNumber(value: number, locale: string, options?: Intl.NumberFormatOptions): string {
    try {
        const formatter = new Intl.NumberFormat(locale, options);
        return formatter.format(value);
    } catch (error) {
        void logger.error({ message: 'Number formatting error', error });
        return value.toString(); // Fallback: raw number
    }
}

/**
 * Format currency according to locale
 *
 * @param amount - Amount to format
 * @param locale - Locale code
 * @param currency - Currency code (ISO 4217)
 * @param options - Additional Intl.NumberFormat options
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56, 'en', 'USD'); // "$1,234.56"
 * formatCurrency(1234.56, 'he', 'ILS'); // "1,234.56"
 */
export function formatCurrency(amount: number, locale: string, currency: string, options?: Intl.NumberFormatOptions): string {
    try {
        const defaultOptions: Intl.NumberFormatOptions = {
            style: 'currency',
            currency,
            ...options,
        };

        return new Intl.NumberFormat(locale, defaultOptions).format(amount);
    } catch (error) {
        void logger.error({ message: 'Currency formatting error', error });
        const fixed = amount.toFixed(2);
        return `${currency} ${fixed}`; // Fallback: "USD 1234.56"
    }
}
