import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { Env } from '@/libs/env.libs';
import { formatDate } from '@/utils/locale-formatter.utils';
import { Header } from '@/components/shared/header/header.components';
import { HomeContent } from './home-content.components';

/**
 * Home Page - Server-Side Rendered
 *
 * This page demonstrates:
 * - Server-side rendering (SSR) with async data fetching
 * - Metadata API for SEO
 * - TypeScript integration
 * - Component composition
 * - i18n localization with next-intl
 */

// Generate metadata for this page
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'metadata.home' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

// Async function to fetch server-side data
async function getServerData() {
    return {
        timestamp: new Date().toISOString(),
        environment: Env.NODE_ENV,
        nodeVersion: Env.NODE_VERSION,
        platform: Env.NODE_PLATFORM,
    };
}

// Server Component (default in App Router)
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    // Fetch data on the server
    const serverData = await getServerData();

    // Get translations
    const t = await getTranslations({ locale, namespace: 'pages.home' });
    const tFeatures = await getTranslations({ locale, namespace: 'pages.home.features.items' });
    const tFooter = await getTranslations({ locale, namespace: 'common.footer' });
    const tServerInfo = await getTranslations({ locale, namespace: 'components.serverInfo' });

    // Format server timestamp (use getLocale() for a validated locale string)
    const intlLocale = await getLocale();
    const renderedAt = formatDate(new Date(serverData.timestamp), intlLocale, {
        dateStyle: 'medium',
        timeStyle: 'medium',
    });

    return (
        <div>
            <Header />
            <HomeContent
                title={t('title')}
                description={t('description')}
                featuresTitle={t('features.title')}
                featureItems={[
                    tFeatures('nextjs'),
                    tFeatures('react'),
                    tFeatures('typescript'),
                    tFeatures('linting'),
                    tFeatures('testing'),
                    tFeatures('e2e'),
                    tFeatures('docker'),
                    tFeatures('ci'),
                ]}
                apiRoutesTitle={t('apiRoutes.title')}
                apiRoutesDescription={t('apiRoutes.description')}
                documentationTitle={t('documentation.title')}
                documentationDescription={t('documentation.description')}
                footerText={tFooter('builtWith')}
                serverData={serverData}
                renderedAt={renderedAt}
                serverInfoLabels={{
                    title: tServerInfo('title'),
                    timestamp: tServerInfo('timestamp'),
                    environment: tServerInfo('environment'),
                    nodeVersion: tServerInfo('nodeVersion'),
                    platform: tServerInfo('platform'),
                }}
            />
        </div>
    );
}
