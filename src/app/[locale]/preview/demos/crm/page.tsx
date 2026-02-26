import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { CrmDemo } from '@/components/preview/demos/crm-demo.components';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('preview.pageTitle');
    return {
        title: t('crm'),
    };
}

export default function CrmDemoPage() {
    return <CrmDemo />;
}
