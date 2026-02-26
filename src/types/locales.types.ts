/**
 * Internationalization (i18n) Types
 */

/**
 * Supported locale codes
 */
export type SupportedLocaleType = 'en' | 'he';

/**
 * Locale direction (LTR or RTL)
 */
export type LocaleDirectionType = 'ltr' | 'rtl';

/**
 * Translation parameters for interpolation
 */
export type TranslationParamsType = Record<string, string | number>;

/**
 * Translation function type
 */
export type TranslationFunctionType = (key: string, params?: TranslationParamsType) => string;

/**
 * Locale configuration
 */
export interface LocaleConfigInterface {
    code: SupportedLocaleType;
    label: string;
    direction: LocaleDirectionType;
    flag?: string;
}

/**
 * Locale constants
 */
export const LOCALE_CONFIG: Record<SupportedLocaleType, LocaleConfigInterface> = {
    en: {
        code: 'en',
        label: 'English',
        direction: 'ltr',
    },
    he: {
        code: 'he',
        label: 'עברית',
        direction: 'rtl',
    },
};

/**
 * Cookie configuration
 */
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
export const LOCALE_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
