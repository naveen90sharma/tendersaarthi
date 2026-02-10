'use client';

import { Suspense } from 'react';
import TenderListing from '@/components/TenderListing';
import { RefreshCw } from 'lucide-react';

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin" /></div>}>
            <TenderListing />
        </Suspense>
    );
}
