/**
 * Test utility for rendering components with NextIntlClientProvider
 */

import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { NextIntlClientProvider } from 'next-intl';
import type { LocaleType } from '@/i18n/config';

interface RenderWithLocaleOptionsType extends Omit<RenderOptions, 'wrapper'> {
    locale?: LocaleType;
    messages?: Record<string, unknown>;
}

/**
 * Render component with NextIntlClientProvider and ThemeProvider
 *
 * @param ui - Component to render
 * @param options - Render options including locale and messages
 * @returns Render result from @testing-library/react
 *
 * @example
 * renderWithLocale(<MyComponent />, {
 *   locale: 'he',
 *   messages: mockHeTranslations
 * });
 */
export function renderWithLocale(ui: ReactElement, { locale = 'en', messages = {}, ...renderOptions }: RenderWithLocaleOptionsType = {}) {
    const theme = createTheme({
        direction: locale === 'he' ? 'rtl' : 'ltr',
    });

    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <NextIntlClientProvider messages={messages} locale={locale}>
                <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </NextIntlClientProvider>
        );
    }

    return render(ui, { wrapper: Wrapper, ...renderOptions });
}
