import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { DashboardDemo } from '@/components/preview/demos/dashboard-demo.components';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('preview.pageTitle');
    return {
        title: t('dashboard'),
    };
}

export default function DashboardDemoPage() {
    return <DashboardDemo />;
}
