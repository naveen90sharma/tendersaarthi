'use client';

import { Suspense, use } from 'react';
import TenderListing from '@/components/TenderListing';
import { RefreshCw } from 'lucide-react';

export default function ActiveTendersCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    let type = undefined;
    let initialQuery = undefined;
    let titleOverride = undefined;

    if (slug === 'latest') {
        type = 'latest';
        titleOverride = 'Latest Tenders';
    } else if (slug === 'closing-soon') {
        type = 'closing-soon';
        titleOverride = 'Closing Soon';
    } else {
        // Treat as generic search category
        initialQuery = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        titleOverride = initialQuery;
    }

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin" /></div>}>
            <TenderListing
                initialQuery={initialQuery}
                type={type}
                titleOverride={titleOverride}
            />
        </Suspense>
    );
}
