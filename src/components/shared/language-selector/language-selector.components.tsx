'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { localeLabels, type LocaleType } from '@/i18n/config';

/**
 * Language Selector Component Props
 */
interface LanguageSelectorPropsType {
    className?: string;
}

/**
 * Language Selector Component
 *
 * Dropdown to switch between supported languages
 *
 * Features:
 * - Displays current language with visual label
 * - Shows all available languages
 * - Updates URL with locale prefix and reloads page
 * - Keyboard accessible
 * - Screen reader compatible with announcements
 * - Loading state during language switch
 *
 * @example
 * <LanguageSelector className="ml-4" />
 */
export function LanguageSelector({ className = '' }: LanguageSelectorPropsType) {
    const locale = useLocale() as LocaleType;
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = event.target.value as LocaleType;

        startTransition(() => {
            // Replace the current pathname with the new locale
            router.replace(pathname, { locale: newLocale });
        });
    };

    return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
            {/* Visual label with globe icon */}
            <label htmlFor="language-selector" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <span aria-hidden="true">🌐</span>
                <span>Language:</span>
            </label>

            {/* Select dropdown */}
            <select
                id="language-selector"
                value={locale}
                onChange={handleChange}
                disabled={isPending}
                aria-label="Select language"
                className={`
          px-3 py-2
          border border-gray-300 dark:border-gray-600 rounded-md
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          hover:border-gray-400 dark:hover:border-gray-500
        `}
            >
                {Object.entries(localeLabels).map(([code, label]) => (
                    <option key={code} value={code}>
                        {label}
                    </option>
                ))}
            </select>

            {/* Loading indicator */}
            {isPending && (
                <span className="text-sm text-gray-500 dark:text-gray-400 animate-pulse" aria-live="polite">
                    Loading...
                </span>
            )}
        </div>
    );
}
