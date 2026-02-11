import { Suspense } from 'react';
import TenderListing from '@/components/TenderListing';
import { RefreshCw } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Active Government Tenders - Latest Opportunities | TenderSaarthi',
    description: 'Browse thousands of active government and private tenders across India. Filter by category, state, authority, and value.',
};

export default function ActiveTendersPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin text-tj-blue" /></div>}>
            <TenderListing />
        </Suspense>
    );
}
