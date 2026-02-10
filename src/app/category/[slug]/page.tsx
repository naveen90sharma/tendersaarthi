'use client';

import { Suspense, use } from 'react';
import TenderListing from '@/components/TenderListing';
import { RefreshCw } from 'lucide-react';

export default function CategoryTendersPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const niceName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin" /></div>}>
            <TenderListing initialQuery={niceName} titleOverride={`${niceName} Tenders`} />
        </Suspense>
    );
}
