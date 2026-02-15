
import { Suspense } from 'react';
import TenderListing from '@/components/TenderListing';
import { RefreshCw } from 'lucide-react';
import { Metadata } from 'next';
import { supabase } from '@/services/supabase';

async function getStateAndCategoryNames(stateSlug: string, categorySlug: string) {
    const [stateRes, categoryRes] = await Promise.all([
        supabase.from('states').select('name').eq('slug', stateSlug).single(),
        supabase.from('tender_categories').select('name').eq('slug', categorySlug).single()
    ]);

    const stateName = stateRes.data?.name || stateSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const categoryName = categoryRes.data?.name || categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return { stateName, categoryName };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, categorySlug: string }> }): Promise<Metadata> {
    const { slug, categorySlug } = await params;
    const { stateName, categoryName } = await getStateAndCategoryNames(slug, categorySlug);

    return {
        title: `${categoryName} Tenders in ${stateName} – 2026 Latest Reports | TenderSaarthi`,
        description: `Find active ${categoryName} tenders in ${stateName}. Browse latest government contracts and bid opportunities for ${categoryName} in ${stateName}.`,
        alternates: {
            canonical: `/tenders/state/${slug}/${categorySlug}`
        }
    };
}

export default async function StateCategoryTendersPage({ params }: { params: Promise<{ slug: string, categorySlug: string }> }) {
    const { slug, categorySlug } = await params;
    const { stateName, categoryName } = await getStateAndCategoryNames(slug, categorySlug);

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin text-[#103e68]" /></div>}>
            <TenderListing
                initialQuery={`${categoryName} in ${stateName}`}
                titleOverride={`Latest ${categoryName} Tenders in ${stateName}`}
                initialFilters={{
                    state: stateName,
                    category: categoryName
                }}
                stateSlug={slug}
            />
        </Suspense>
    );
}

export const revalidate = 3600; // ISR
