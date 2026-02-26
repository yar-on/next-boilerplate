import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type LocaleType } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Ensure valid locale
    if (!locale || !locales.includes(locale as LocaleType)) {
        locale = defaultLocale;
    }

    return {
        locale,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        messages: (await import(`@/locales/${locale}.json`)).default,
    };
});
