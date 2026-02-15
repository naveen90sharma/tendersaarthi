
import { Suspense } from 'react';
import TenderListing from '@/components/TenderListing';
import { RefreshCw, Briefcase, MapPin, FileText, CheckCircle2, TrendingUp } from 'lucide-react';
import { Metadata } from 'next';
import { supabase } from '@/services/supabase';

async function getCategoryDetails(slug: string) {
    const { data } = await supabase
        .from('tender_categories')
        .select('*')
        .eq('slug', slug)
        .single();
    return data;
}

async function getCategoryStats(niceName: string) {
    const now = new Date().toISOString();

    // Total Active in Category
    const { count: activeCount } = await supabase
        .from('tenders')
        .select('*', { count: 'exact', head: true })
        .eq('tender_category', niceName)
        .gt('bid_end_ts', now);

    // High Value in Category
    const { data: highValue } = await supabase
        .from('tenders')
        .select('tender_value')
        .eq('tender_category', niceName)
        .order('tender_value_numeric', { ascending: false })
        .limit(1)
        .single();

    return [
        { label: 'Live Projects', value: activeCount || 0, icon: <FileText size={20} />, color: 'text-blue-600 bg-blue-600' },
        { label: 'Demand Rank', value: '#1', icon: <TrendingUp size={20} />, color: 'text-purple-600 bg-purple-600' },
        { label: 'Growth', value: '+12%', icon: <Briefcase size={20} />, color: 'text-green-600 bg-green-600' },
        { label: 'Top Grant', value: highValue?.tender_value?.split(' ')[0] || 'N/A', icon: <CheckCircle2 size={20} />, color: 'text-orange-600 bg-orange-600' }
    ];
}

async function getTopStatesForCategory(categoryName: string) {
    const { data } = await supabase
        .from('tenders')
        .select('state')
        .eq('tender_category', categoryName)
        .limit(200);

    const counts: Record<string, number> = {};
    data?.forEach(t => {
        if (t.state) {
            counts[t.state] = (counts[t.state] || 0) + 1;
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

async function getRelatedCategories(currentSlug: string) {
    const { data } = await supabase
        .from('tender_categories')
        .select('name, slug')
        .neq('slug', currentSlug)
        .limit(6);
    return data || [];
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
    const { slug } = await params;
    const { page } = await searchParams;
    const pageNum = page ? ` (Page ${page})` : '';

    const category = await getCategoryDetails(slug);
    const niceName = category?.name || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `${category?.meta_title || `${niceName} Tenders | Latest Govt Contracts for ${niceName} – 2026`}${pageNum}`,
        description: category?.meta_description || `Find latest government tenders, contracts, and bidding opportunities for ${niceName}. View active projects across all states in India.`,
        alternates: {
            canonical: `/tenders/category/${slug}${page ? `?page=${page}` : ''}`
        }
    };
}

export default async function CategoryTendersPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const category = await getCategoryDetails(slug);
    const niceName = category?.name || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const [stats, topStates, relatedCategories] = await Promise.all([
        getCategoryStats(niceName),
        getTopStatesForCategory(niceName),
        getRelatedCategories(slug)
    ]);

    const faqs = Array.isArray(category?.faq_json) ? category.faq_json : [];

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin text-[#103e68]" /></div>}>
            <TenderListing
                initialQuery={niceName}
                titleOverride={`Latest ${niceName} Tenders & Contracts – 2026`}
                seoContent={category?.seo_content}
                sideStats={stats}
                topCategories={relatedCategories}
                faqs={faqs}
            />
        </Suspense>
    );
}

export const revalidate = 3600; // ISR
