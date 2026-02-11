import { Suspense } from 'react';
import TenderListing from '@/components/TenderListing';
import { RefreshCw } from 'lucide-react';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `${title} Tenders - Latest Opportunities | TenderSaarthi`,
        description: `Explore the latest ${title} tenders and government contracts. Secure your next business opportunity with TenderSaarthi.`,
    };
}

export default async function ActiveTendersCategoryPage({ params }: Props) {
    const { slug } = await params;

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
        initialQuery = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        titleOverride = initialQuery;
    }

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin text-tj-blue" /></div>}>
            <TenderListing
                initialQuery={initialQuery}
                type={type}
                titleOverride={titleOverride}
            />
        </Suspense>
    );
}
