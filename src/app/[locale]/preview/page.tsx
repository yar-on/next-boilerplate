/**
 * Theme Preview Page
 *
 * Redirects to the components showcase page.
 */

'use client';

import { useRouter } from '@/i18n/navigation';
import { useEffect } from 'react';

export default function PreviewPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/preview/components');
    }, [router]);

    return null;
}
