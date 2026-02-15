import { Suspense } from 'react';
import TenderListing from '@/components/TenderListing';
import { RefreshCw } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Archive Tenders - Past Government Tenders | TenderSaarthi',
    description: 'Browse the archive of past government and private tenders. Research historical tender data and bid results.',
};

export default function ArchiveTendersPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin" /></div>}>
            <TenderListing type="archive" />
        </Suspense>
    );
}
