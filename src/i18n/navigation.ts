import { createNavigation } from 'next-intl/navigation';
import { locales, localePrefix, defaultLocale } from './config';

export const { Link, redirect, usePathname, useRouter } = createNavigation({
    locales,
    localePrefix,
    defaultLocale,
});
