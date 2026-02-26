import type { Metadata } from 'next';
import { Inter, Heebo } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { WebVitals } from '@/components/web-vitals/web.vitals.components';
import { MuiThemeProvider } from '@/contexts/mui-theme.context';
import { loadThemeConfig } from '@/libs/theme-config.libs';
import { locales, localeDirections, type LocaleType } from '@/i18n/config';
import '../globals.css';

// Font optimization using Next.js font loader
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

const heebo = Heebo({
    subsets: ['hebrew'],
    display: 'swap',
    variable: '--font-heebo',
});

// Generate static params for all locales
export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

// Metadata API for SEO optimization
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.default' });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return {
        title: {
            default: t('title'),
            template: `%s | ${t('siteName')}`,
        },
        description: t('description'),
        keywords: ['Next.js', 'React', 'React 19', 'TypeScript', 'Server Components'],
        authors: [{ name: 'Your Name' }],
        creator: 'Your Name',
        alternates: {
            languages: {
                'x-default': `${baseUrl}/en`,
                en: `${baseUrl}/en`,
                he: `${baseUrl}/he`,
            },
            canonical: `${baseUrl}/${locale}`,
        },
        openGraph: {
            type: 'website',
            locale: locale === 'he' ? 'he_IL' : 'en_US',
            url: `${baseUrl}/${locale}`,
            title: t('title'),
            description: t('description'),
            siteName: t('siteName'),
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
            creator: '@yourusername',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    // Get messages for client-side
    const messages = await getMessages();

    // Load theme config from theme-config.json (if present)
    const themeConfig = loadThemeConfig();

    // Get locale direction
    const direction = localeDirections[locale as LocaleType] || 'ltr';

    // Select font based on locale
    const fontClasses = locale === 'he' ? heebo.className : inter.className;

    return (
        <html lang={locale} dir={direction} className={`${inter.variable} ${heebo.variable}`}>
            <body
                className={`antialiased ${fontClasses}`}
                style={{
                    fontFamily: locale === 'he' ? 'var(--font-heebo), sans-serif' : 'var(--font-inter), sans-serif',
                }}
            >
                <NextIntlClientProvider messages={messages}>
                    <MuiThemeProvider themeConfig={themeConfig}>
                        {children}
                        <WebVitals />
                    </MuiThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
