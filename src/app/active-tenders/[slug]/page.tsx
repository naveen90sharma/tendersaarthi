import { Suspense } from 'react';
import TenderListing from '@/components/TenderListing';
import { RefreshCw } from 'lucide-react';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
    const { slug } = await params;
    const { page } = await searchParams;
    const pageNum = page ? ` (Page ${page})` : '';

    let title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    let description = `Explore the latest ${title} tenders and government contracts. Secure your next business opportunity with TenderSaarthi.`;

    if (slug === 'latest') {
        title = 'Latest Government Tenders';
        description = 'Stay updated with the most recently published government tenders in India. New opportunities updated every hour.';
    } else if (slug === 'closing-soon') {
        title = 'Tenders Closing Soon';
        description = 'Don\'t miss out! View active government tenders that are closing in the next 24-48 hours. Submit your bids now.';
    }

    return {
        title: `${title}${pageNum} | TenderSaarthi`,
        description: description,
        alternates: {
            canonical: `/active-tenders/${slug}${page ? `?page=${page}` : ''}`
        }
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
