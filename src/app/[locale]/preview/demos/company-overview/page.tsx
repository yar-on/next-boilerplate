import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { CompanyOverviewDemo } from '@/components/preview/demos/company-overview-demo.components';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('preview.pageTitle');
    return {
        title: t('companyOverview'),
    };
}

export default function CompanyOverviewDemoPage() {
    return <CompanyOverviewDemo />;
}
