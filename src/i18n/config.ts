export const locales = ['en', 'he'] as const;
export type LocaleType = (typeof locales)[number];
export const defaultLocale: LocaleType = 'he';
export const localePrefix = 'as-needed' as const; // Hide default locale from URL

export const localeLabels: Record<LocaleType, string> = {
    en: 'English',
    he: 'עברית',
};

export const localeDirections: Record<LocaleType, 'ltr' | 'rtl'> = {
    en: 'ltr',
    he: 'rtl',
};
