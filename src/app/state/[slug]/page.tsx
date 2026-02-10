
import { Suspense } from 'react';
import TenderListing from '@/components/TenderListing';
import { RefreshCw } from 'lucide-react';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const niceName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `${niceName} Tenders | TenderSaarthi`,
        description: `Find latest government tenders, contracts, and bid opportunities in ${niceName}.`
    };
}

export default async function StateTendersPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const niceName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin" /></div>}>
            <TenderListing initialQuery={niceName} titleOverride={`${niceName}`} />
        </Suspense>
    );
}
