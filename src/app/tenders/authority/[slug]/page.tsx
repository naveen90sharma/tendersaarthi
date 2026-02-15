
import { Suspense } from 'react';
import TenderListing from '@/components/TenderListing';
import { RefreshCw, Building2, FileText, CheckCircle2, TrendingUp, MapPin } from 'lucide-react';
import { Metadata } from 'next';
import { supabase } from '@/services/supabase';

async function getAuthorityDetails(slug: string) {
    const { data } = await supabase
        .from('authorities')
        .select('*')
        .eq('slug', slug)
        .single();
    return data;
}

async function getAuthorityStats(niceName: string) {
    const now = new Date().toISOString();

    // Total Active
    const { count: activeCount } = await supabase
        .from('tenders')
        .select('*', { count: 'exact', head: true })
        .ilike('authority', `%${niceName}%`)
        .gt('bid_end_ts', now);

    // Total Closed
    const { count: closedCount } = await supabase
        .from('tenders')
        .select('*', { count: 'exact', head: true })
        .ilike('authority', `%${niceName}%`)
        .lt('bid_end_ts', now);

    // High Value Tender
    const { data: highValue } = await supabase
        .from('tenders')
        .select('tender_value')
        .ilike('authority', `%${niceName}%`)
        .order('tender_value_numeric', { ascending: false })
        .limit(1)
        .single();

    return [
        { label: 'Active Tenders', value: activeCount || 0, icon: <FileText size={20} />, color: 'text-blue-600 bg-blue-600' },
        { label: 'Closed Tenders', value: closedCount || 0, icon: <CheckCircle2 size={20} />, color: 'text-green-600 bg-green-600' },
        { label: 'Avg Success', value: '88%', icon: <TrendingUp size={20} />, color: 'text-purple-600 bg-purple-600' },
        { label: 'Max Value', value: highValue?.tender_value?.split(' ')[0] || 'N/A', icon: <Building2 size={20} />, color: 'text-orange-600 bg-orange-600' }
    ];
}

async function getTopCategoriesForAuthority(authorityName: string) {
    const { data } = await supabase
        .from('tenders')
        .select('tender_category')
        .ilike('authority', `%${authorityName}%`)
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

async function getTopStatesForAuthority(authorityName: string) {
    const { data } = await supabase
        .from('tenders')
        .select('state')
        .ilike('authority', `%${authorityName}%`)
        .limit(200);

    const counts: Record<string, number> = {};
    data?.forEach(t => {
        if (t.state) {
            counts[t.state] = (counts[t.state] || 0) + 1;
        }
    });

    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([name]) => ({
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const authority = await getAuthorityDetails(slug);
    const niceName = authority?.authority_name || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: authority?.meta_title || `Tenders from ${niceName} | Latest Projects & Bids – 2026`,
        description: authority?.meta_description || `Browse all active tenders and bidding opportunities published by ${niceName}. Stay updated with daily listings and project requirements.`,
        alternates: {
            canonical: `/tenders/authority/${slug}`
        }
    };
}

export default async function AuthorityTendersPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const authority = await getAuthorityDetails(slug);
    const niceName = authority?.authority_name || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const [stats, topCategories, topStates] = await Promise.all([
        getAuthorityStats(niceName),
        getTopCategoriesForAuthority(niceName),
        getTopStatesForAuthority(niceName)
    ]);

    const faqs = Array.isArray(authority?.faq_json) ? authority.faq_json : [];

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin text-[#103e68]" /></div>}>
            <TenderListing
                initialQuery={niceName}
                titleOverride={`Tenders by ${niceName} – Latest Projects`}
                seoContent={authority?.seo_content}
                sideStats={stats}
                topCategories={topCategories}
                faqs={faqs}
                relatedStates={topStates}
            />
        </Suspense>
    );
}

export const revalidate = 3600; // ISR
