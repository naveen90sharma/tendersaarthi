
import { Suspense } from 'react';
import TenderListing from '@/components/TenderListing';
import { RefreshCw } from 'lucide-react';
import { Metadata } from 'next';
import { supabase } from '@/services/supabase';

async function getAuthorityAndCategoryNames(authSlug: string, categorySlug: string) {
    const [authRes, categoryRes] = await Promise.all([
        supabase.from('authorities').select('authority_name').eq('slug', authSlug).single(),
        supabase.from('tender_categories').select('name').eq('slug', categorySlug).single()
    ]);

    const authorityName = authRes.data?.authority_name || authSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const categoryName = categoryRes.data?.name || categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return { authorityName, categoryName };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, categorySlug: string }> }): Promise<Metadata> {
    const { slug, categorySlug } = await params;
    const { authorityName, categoryName } = await getAuthorityAndCategoryNames(slug, categorySlug);

    return {
        title: `${categoryName} Tenders by ${authorityName} | Latest 2026 Projects`,
        description: `Browse active ${categoryName} tenders published by ${authorityName}. View bidding details, project values, and submission deadlines for ${categoryName} works.`,
        alternates: {
            canonical: `/tenders/authority/${slug}/${categorySlug}`
        }
    };
}

export default async function AuthorityCategoryTendersPage({ params }: { params: Promise<{ slug: string, categorySlug: string }> }) {
    const { slug, categorySlug } = await params;
    const { authorityName, categoryName } = await getAuthorityAndCategoryNames(slug, categorySlug);

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin text-[#103e68]" /></div>}>
            <TenderListing
                initialQuery={`${categoryName} ${authorityName}`}
                titleOverride={`${categoryName} Tenders published by ${authorityName}`}
                initialFilters={{
                    authority: authorityName,
                    category: categoryName
                }}
            />
        </Suspense>
    );
}

export const revalidate = 3600; // ISR
