import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ComponentsTab } from '@/components/preview/components-tab.components';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('preview.pageTitle');
    return {
        title: t('components'),
    };
}

export default function ComponentsPage() {
    return <ComponentsTab />;
}
