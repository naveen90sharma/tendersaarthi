
import { Suspense } from 'react';
import TenderListing from '@/components/TenderListing';
import { RefreshCw, MapPin, FileText, CheckCircle2, TrendingUp } from 'lucide-react';
import { Metadata } from 'next';
import { supabase } from '@/services/supabase';

async function getStateDetails(slug: string) {
    const { data } = await supabase
        .from('states')
        .select('*')
        .eq('slug', slug)
        .single();
    return data;
}

async function getStateStats(niceName: string) {
    const now = new Date().toISOString();

    // Total Active in State
    const { count: activeCount } = await supabase
        .from('tenders')
        .select('*', { count: 'exact', head: true })
        .eq('state', niceName)
        .gt('bid_end_ts', now);

    // High Value in State
    const { data: highValue } = await supabase
        .from('tenders')
        .select('tender_value')
        .eq('state', niceName)
        .order('tender_value_numeric', { ascending: false })
        .limit(1)
        .single();

    return [
        { label: 'Live Projects', value: activeCount || 0, icon: <FileText size={20} />, color: 'text-blue-600 bg-blue-600' },
        { label: 'State Rank', value: '#4', icon: <TrendingUp size={20} />, color: 'text-purple-600 bg-purple-600' },
        { label: 'Avg Deadline', value: '14 Days', icon: <MapPin size={20} />, color: 'text-green-600 bg-green-600' },
        { label: 'Highest Bid', value: highValue?.tender_value?.split(' ')[0] || 'N/A', icon: <CheckCircle2 size={20} />, color: 'text-orange-600 bg-orange-600' }
    ];
}

async function getTopCategoriesForState(stateName: string) {
    // Note: In production, you might want to use a cached RPC call or a summary table
    const { data } = await supabase
        .from('tenders')
        .select('tender_category')
        .eq('state', stateName)
        .limit(200);

    const counts: Record<string, number> = {};
    data?.forEach(t => {
        if (t.tender_category) {
            counts[t.tender_category] = (counts[t.tender_category] || 0) + 1;
        }
    });

    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name]) => ({
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }));
}

async function getTopAuthoritiesForState(stateName: string) {
    const { data } = await supabase
        .from('tenders')
        .select('authority')
        .eq('state', stateName)
        .limit(200);

    const counts: Record<string, number> = {};
    data?.forEach(t => {
        if (t.authority) {
            counts[t.authority] = (counts[t.authority] || 0) + 1;
        }
    });

    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name]) => ({
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }));
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
    const { slug } = await params;
    const { page } = await searchParams;
    const pageNum = page ? ` (Page ${page})` : '';

    const state = await getStateDetails(slug);
    const niceName = state?.name || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `${state?.meta_title || `${niceName} Tenders | Latest Govt Tenders in ${niceName} – 2026 Updates`}${pageNum}`,
        description: state?.meta_description || `Find latest government tenders, contracts, and bid opportunities in ${niceName}. View active tenders from all departments in ${niceName}.`,
        alternates: {
            canonical: `/tenders/state/${slug}${page ? `?page=${page}` : ''}`
        }
    };
}

async function getRelatedStates(currentSlug: string) {
    const { data } = await supabase
        .from('states')
        .select('name, slug')
        .neq('slug', currentSlug)
        .limit(3);
    return data || [];
}

export default async function StateTendersPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const state = await getStateDetails(slug);
    const niceName = state?.name || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const [stats, topCategories, topAuthorities, relatedStates] = await Promise.all([
        getStateStats(niceName),
        getTopCategoriesForState(niceName),
        getTopAuthoritiesForState(niceName),
        getRelatedStates(slug)
    ]);

    // Format FAQs from JSON
    const faqs = Array.isArray(state?.faq_json) ? state.faq_json : [];

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin text-[#103e68]" /></div>}>
            <TenderListing
                initialQuery={niceName}
                titleOverride={`Latest Government Tenders in ${niceName} – 2026 Updates`}
                seoContent={state?.seo_content}
                sideStats={stats}
                topCategories={topCategories}
                topAuthorities={topAuthorities}
                faqs={faqs}
                stateSlug={slug}
                relatedStates={relatedStates}
            />
        </Suspense>
    );
}

export const revalidate = 3600; // ISR: 1 hour
