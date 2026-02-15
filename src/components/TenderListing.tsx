'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import FilterSidebar from '@/components/FilterSidebar';
import TenderCard from '@/components/TenderCard';
import Breadcrumb from '@/components/Breadcrumb';
import { supabase } from '@/services/supabase';
import Image from 'next/image';
import { RefreshCw, ChevronLeft, ChevronRight, AlertCircle, Filter } from 'lucide-react';
import type { Tender } from '@/types';

interface TenderListingProps {
    initialQuery?: string;
    type?: string;
    titleOverride?: string;
    seoContent?: string;
    sideStats?: {
        label: string;
        value: string | number;
        icon: React.ReactNode;
        color: string;
    }[];
    topCategories?: { name: string; slug: string }[];
    topAuthorities?: { name: string; slug: string }[];
    faqs?: { question: string; answer: string }[];
    stateSlug?: string;
    relatedStates?: { name: string; slug: string }[];
    initialFilters?: {
        state?: string;
        category?: string;
        authority?: string;
    };
}

export default function TenderListing({
    initialQuery,
    type,
    titleOverride,
    seoContent,
    sideStats,
    topCategories,
    topAuthorities,
    faqs,
    stateSlug,
    relatedStates,
    initialFilters
}: TenderListingProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const urlQuery = searchParams.get('q');
    const page = Number(searchParams.get('page')) || 1;
    const itemsPerPage = 20;

    const effectiveQuery = urlQuery || initialQuery;
    const isArchive = type === 'archive';
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Filter Params
    const categoryParam = searchParams.get('category');
    const stateParam = searchParams.get('state');
    const locationParam = searchParams.get('location');
    const authorityParam = searchParams.get('authority');
    const tenderTypeParam = searchParams.get('tender_type');
    const valueParam = searchParams.get('value');
    const publishDateFrom = searchParams.get('publishDateFrom');
    const publishDateTo = searchParams.get('publishDateTo');
    const submissionDateFrom = searchParams.get('submissionDateFrom');
    const submissionDateTo = searchParams.get('submissionDateTo');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'newest';

    const handleSortChange = (newSort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', newSort);
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    };

    // Normalize display title (only if not an override or special type)
    let displayTitle = '';

    if (titleOverride) {
        displayTitle = titleOverride;
    } else if (urlQuery) {
        displayTitle = urlQuery.replace(' Tenders', '').replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    } else {
        const filters = [];
        if (categoryParam) filters.push(categoryParam);
        else if (initialFilters?.category) filters.push(initialFilters.category);

        if (stateParam) filters.push(stateParam);
        else if (initialFilters?.state) filters.push(initialFilters.state);

        if (locationParam) filters.push(locationParam);
        if (authorityParam) filters.push(authorityParam);
        else if (initialFilters?.authority) filters.push(initialFilters.authority);

        if (tenderTypeParam) filters.push(tenderTypeParam);

        if (filters.length > 0) {
            displayTitle = filters.join(' • ');
        } else if (initialQuery) {
            displayTitle = initialQuery.replace(' Tenders', '').replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        } else {
            displayTitle = isArchive ? 'Archive' : 'Active';
        }
    }

    const pageTitle = titleOverride
        ? `${titleOverride}`
        : effectiveQuery
            ? `Search Results: ${displayTitle}`
            : isArchive ? 'Archive Tenders' : `${displayTitle} Tenders`;

    const [tenders, setTenders] = useState<Tender[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchTenders = async () => {
            setLoading(true);
            setErrorMsg(null);
            try {
                let supabaseQuery = supabase
                    .from('tenders')
                    .select('*', { count: 'exact' });

                // 1. Sorting Logic
                if (sortBy === 'newest') {
                    supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
                } else if (sortBy === 'oldest') {
                    supabaseQuery = supabaseQuery.order('created_at', { ascending: true });
                } else if (sortBy === 'closing') {
                    supabaseQuery = supabaseQuery.order('bid_end_ts', { ascending: true });
                } else if (sortBy === 'value_high') {
                    supabaseQuery = supabaseQuery.order('tender_value_numeric', { ascending: false, nullsFirst: false });
                }

                // 1. Date/Status Logic based on Type
                const now = new Date().toISOString();

                if (type === 'archive') {
                    supabaseQuery = supabaseQuery.lt('bid_end_ts', now);
                } else if (type === 'latest') {
                    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
                    supabaseQuery = supabaseQuery.gt('created_at', yesterday).gt('bid_end_ts', now);
                } else if (type === 'closing-soon') {
                    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
                    supabaseQuery = supabaseQuery.gt('bid_end_ts', now).lt('bid_end_ts', tomorrow);
                } else {
                    // Default to active unless specifically searching (standard search often wants active results)
                    // If we have an effectiveQuery, we still mostly want active tenders by default
                    // unless the search is broad.
                    if (!effectiveQuery || type === 'active') {
                        supabaseQuery = supabaseQuery.gt('bid_end_ts', now);
                    }
                }

                // 1.5 Global Filters
                supabaseQuery = supabaseQuery.eq('status', 'published');

                // 2. Powerful Full-Text Search (FTS) with Exact Match Fallback
                if (effectiveQuery) {
                    // Normalize query for matching
                    const cleanQuery = effectiveQuery.trim();

                    // If it looks like a Tender ID or Ref (contains numbers/underscores), try exact match first
                    if (/[\d_]/.test(cleanQuery)) {
                        supabaseQuery = supabaseQuery.or(`tender_id.eq."${cleanQuery}",reference_no.eq."${cleanQuery}",title.ilike.%${cleanQuery}%`);
                    } else {
                        // Use textSearch for rank-based relevance
                        supabaseQuery = supabaseQuery.textSearch('search_vector', cleanQuery, {
                            config: 'english',
                            type: 'websearch'
                        });
                    }
                }

                // 3. Sidebar Filters
                const categories = categoryParam?.split(',').filter(Boolean) || [];
                const states = stateParam?.split(',').filter(Boolean) || [];
                const locations = locationParam?.split(',').filter(Boolean) || [];
                const authorities = authorityParam?.split(',').filter(Boolean) || [];
                const tenderTypes = tenderTypeParam?.split(',').filter(Boolean) || [];
                const values = valueParam?.split(',').filter(Boolean) || [];

                if (categories.length > 0) {
                    supabaseQuery = supabaseQuery.in('tender_category', categories);
                } else if (initialFilters?.category) {
                    supabaseQuery = supabaseQuery.eq('tender_category', initialFilters.category);
                }

                if (states.length > 0) {
                    supabaseQuery = supabaseQuery.in('state', states);
                } else if (initialFilters?.state) {
                    supabaseQuery = supabaseQuery.eq('state', initialFilters.state);
                }

                if (locations.length > 0) {
                    const orStr = locations.map((l: string) => `location.ilike.%${l}%`).join(',');
                    supabaseQuery = supabaseQuery.or(orStr);
                }

                if (authorities.length > 0) {
                    const orStr = authorities.map((a: string) => `authority.ilike.%${a}%`).join(',');
                    supabaseQuery = supabaseQuery.or(orStr);
                } else if (initialFilters?.authority) {
                    supabaseQuery = supabaseQuery.ilike('authority', `%${initialFilters.authority}%`);
                }

                if (tenderTypes.length > 0) {
                    supabaseQuery = supabaseQuery.in('tender_type', tenderTypes);
                }

                if (values.length > 0) {
                    const orStr = values.map((v: string) => `tender_value.ilike.%${v}%`).join(',');
                    supabaseQuery = supabaseQuery.or(orStr);
                }

                // 3.0 Price Range Filters (Using numeric values for exact filtering)
                if (minPrice && !isNaN(parseInt(minPrice))) {
                    supabaseQuery = supabaseQuery.gte('tender_value_numeric', parseInt(minPrice));
                }
                if (maxPrice && !isNaN(parseInt(maxPrice))) {
                    supabaseQuery = supabaseQuery.lte('tender_value_numeric', parseInt(maxPrice));
                }

                // 3.1 Date Range Filters
                if (publishDateFrom) {
                    supabaseQuery = supabaseQuery.gte('published_date', publishDateFrom);
                }
                if (publishDateTo) {
                    supabaseQuery = supabaseQuery.lte('published_date', publishDateTo);
                }
                if (submissionDateFrom) {
                    supabaseQuery = supabaseQuery.gte('bid_end_ts', submissionDateFrom);
                }
                if (submissionDateTo) {
                    supabaseQuery = supabaseQuery.lte('bid_end_ts', submissionDateTo);
                }

                // 4. Pagination
                const from = (page - 1) * itemsPerPage;
                const to = from + itemsPerPage - 1;
                supabaseQuery = supabaseQuery.range(from, to);

                const { data, count, error } = await supabaseQuery;

                if (error) {
                    console.error('Error fetching tenders:', error);
                    setErrorMsg(error.message);
                } else {
                    if (count !== null) setTotalCount(count);

                    const formattedTenders: Tender[] = (data || []).map((item: any) => ({
                        ...item,
                        id: item.id,
                        title: item.title,
                        authority: item.authority || 'Unknown Authority',
                        location: item.location || 'India',
                        tender_value: item.tender_value || 'N/A',
                        value: item.tender_value || 'N/A', // backwards compat
                        bid_submission_end: item.bid_submission_end || 'N/A',
                        date: item.bid_submission_end || 'N/A', // backwards compat
                        reference_no: item.reference_no,
                        referenceNo: item.reference_no, // backwards compat
                        tender_fee: item.tender_fee || 'N/A',
                        tenderFee: item.tender_fee || 'N/A', // backwards compat
                        emd_amount: item.emd_amount || 'N/A',
                        tender_category: item.tender_category || 'N/A',
                        category: item.tender_category || 'N/A', // backwards compat
                        state: item.state,
                        published_date: item.published_date,
                        summary: item.summary,
                    }));
                    setTenders(formattedTenders);
                }
            } catch (err: any) {
                console.error(err);
                setErrorMsg(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchTenders();
    }, [
        effectiveQuery,
        isArchive,
        type,
        page,
        categoryParam,
        stateParam,
        locationParam,
        authorityParam,
        tenderTypeParam,
        valueParam,
        publishDateFrom,
        publishDateTo,
        submissionDateFrom,
        submissionDateTo,
        sortBy,
        initialFilters,
        minPrice,
        maxPrice
    ]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div className="bg-gray-50 min-h-screen pb-16">
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 pt-4">
                    <Breadcrumb />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{pageTitle}</h1>
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600">Showing {tenders.length} results (Total: {totalCount}) for "{displayTitle}"</p>
                        <div className="hidden md:flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100 animate-pulse">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Live Updates: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                            <AlertCircle size={18} />
                            <span>Failed to load tenders: {errorMsg}</span>
                        </div>
                    )}
                </div>

                {sideStats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {sideStats.map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:border-[#103e68]/30 transition-all">
                                <div className={`${stat.color} p-3 rounded-xl bg-opacity-10 text-xl group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-xl font-black text-slate-800">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/4 space-y-8">
                        <div className="w-full">
                            <FilterSidebar open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} />
                        </div>

                        {/* Category Breakdown */}
                        {topCategories && topCategories.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hidden lg:block">
                                <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6 border-l-4 border-[#103e68] pl-3">Top Categories</h4>
                                <div className="space-y-2">
                                    {topCategories.map((cat, i) => (
                                        <Link
                                            key={i}
                                            href={stateSlug ? `/tenders/state/${stateSlug}/${cat.slug}` : `/tenders/category/${cat.slug}`}
                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-600 transition-all border border-transparent hover:border-gray-100"
                                        >
                                            {cat.name}
                                            <ChevronRight size={14} className="text-gray-300" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Top Authorities */}
                        {topAuthorities && topAuthorities.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hidden lg:block">
                                <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6 border-l-4 border-green-500 pl-3">Top Authorities</h4>
                                <div className="space-y-2">
                                    {topAuthorities.map((auth, i) => (
                                        <Link
                                            key={i}
                                            href={`/tenders/authority/${auth.slug}`}
                                            className="group flex flex-col p-3 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-600 transition-all border border-transparent hover:border-gray-100"
                                        >
                                            <span className="truncate">{auth.name}</span>
                                            <span className="text-[10px] text-gray-400 mt-1 uppercase group-hover:text-primary transition-colors">View All Tenders</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related States */}
                        {relatedStates && relatedStates.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hidden lg:block">
                                <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6 border-l-4 border-orange-500 pl-3">Nearby States</h4>
                                <div className="space-y-2">
                                    {relatedStates.map((st, i) => (
                                        <Link
                                            key={i}
                                            href={`/tenders/state/${st.slug}`}
                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-600 transition-all border border-transparent hover:border-gray-100"
                                        >
                                            {st.name}
                                            <ChevronRight size={14} className="text-gray-300" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-3/4">
                        {/* Mobile Filter & Sort Bar */}
                        <div className="lg:hidden flex items-center gap-3 mb-6 sticky top-[62px] z-30 bg-gray-50/95 backdrop-blur py-2">
                            <div className="flex-1 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 mask-fade-right">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleSortChange('newest')}
                                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap border transition-all ${sortBy === 'newest' ? 'bg-[#103e68] text-white border-[#103e68] shadow-md shadow-[#103e68]/20' : 'bg-white text-gray-500 border-gray-200'}`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => handleSortChange('closing')}
                                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap border transition-all ${sortBy === 'closing' ? 'bg-[#103e68] text-white border-[#103e68] shadow-md shadow-[#103e68]/20' : 'bg-white text-gray-500 border-gray-200'}`}
                                    >
                                        Closing Soon
                                    </button>
                                    <button
                                        onClick={() => handleSortChange('value_high')}
                                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap border transition-all ${sortBy === 'value_high' ? 'bg-[#103e68] text-white border-[#103e68] shadow-md shadow-[#103e68]/20' : 'bg-white text-gray-500 border-gray-200'}`}
                                    >
                                        High Value
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => setMobileFiltersOpen(true)}
                                className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-[#103e68] shrink-0 shadow-sm active:scale-95 transition-transform"
                            >
                                <Filter size={18} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Desktop Sort Header */}
                        <div className="hidden lg:flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                            <div className="text-sm font-medium text-gray-600">
                                Sorted by: <span className="font-bold text-gray-800 capitalize">{sortBy.replace('_', ' ')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    className="bg-gray-50 border border-gray-200 text-sm rounded px-3 py-1.5 outline-none focus:border-primary font-bold text-gray-700 cursor-pointer"
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                >
                                    {effectiveQuery && <option value="relevance">Relevance</option>}
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="closing">Closing (Soon First)</option>
                                    <option value="value_high">Value: High to Low (Numeric)</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <RefreshCw className="animate-spin text-primary" size={32} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {tenders.length > 0 ? (
                                    tenders.map((tender, index) => (
                                        <TenderCard key={tender.id} tender={tender} index={(page - 1) * itemsPerPage + index + 1} />
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
                                        <div className="flex justify-center mb-6">
                                            <Image
                                                src="/empty.svg"
                                                alt="No tenders found"
                                                width={200}
                                                height={200}
                                                className="opacity-90"
                                            />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Tenders Found</h3>
                                        <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">We couldn't find any tenders matching your current filters. Try resetting or adjusting your search.</p>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            <button onClick={() => router.push(pathname)} className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95">Reset All Filters</button>
                                            <button onClick={() => router.push('/')} className="bg-white border-2 border-gray-100 text-gray-700 px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all">Go to Homepage</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center gap-2 items-center">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page <= 1}
                                    className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <span className="mx-4 text-sm font-bold text-gray-700">
                                    Page {page} of {totalPages}
                                </span>

                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page >= totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}

                        {/* SEO Dynamic Content Section */}
                        {seoContent && (
                            <div className="mt-12 bg-white rounded-2xl p-10 border border-gray-100 shadow-sm prose prose-slate max-w-none">
                                <div
                                    className="text-gray-600 leading-relaxed font-medium"
                                    dangerouslySetInnerHTML={{ __html: seoContent }}
                                />
                            </div>
                        )}

                        {/* FAQ Section */}
                        <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-2xl font-black text-gray-800 mb-6 uppercase tracking-tight border-b-4 border-primary inline-block pb-1">Frequently Asked Questions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {faqs && faqs.length > 0 ? (
                                    faqs.map((faq, i) => (
                                        <div key={i} className="space-y-2">
                                            <h4 className="font-bold text-primary uppercase text-sm tracking-wide">{faq.question}</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed font-medium">{faq.answer}</p>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-primary uppercase text-sm tracking-wide">How can I apply for these tenders?</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed font-medium">Click on "View Details" to see the official link. Most government tenders in India are processed through the CPPP portal (eprocure.gov.in) or state-specific GeM portals.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-primary uppercase text-sm tracking-wide">Are these listings official?</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed font-medium">Yes, our system synchronizes with daily gazettes and official e-procurement portals every hour to ensure 100% data accuracy.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-primary uppercase text-sm tracking-wide">Can I get email alerts?</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed font-medium">Yes, registered users can set up customized "Tender Alerts" for specific categories or states to get instant notifications.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-primary uppercase text-sm tracking-wide">What is EMD in a tender?</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed font-medium">EMD (Earnest Money Deposit) is a security amount submitted along with the bid to ensure the bidder's commitment to the project.</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Structured Data (FAQ Schema) */}
                        {faqs && (
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{
                                    __html: JSON.stringify({
                                        "@context": "https://schema.org",
                                        "@type": "FAQPage",
                                        "mainEntity": faqs.map(faq => ({
                                            "@type": "Question",
                                            "name": faq.question,
                                            "acceptedAnswer": {
                                                "@type": "Answer",
                                                "text": faq.answer
                                            }
                                        }))
                                    })
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
