'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import FilterSidebar from '@/components/FilterSidebar';
import TenderCard from '@/components/TenderCard';
import Breadcrumb from '@/components/Breadcrumb';
import { supabase } from '@/services/supabase';
import { RefreshCw, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import type { Tender } from '@/types';

interface TenderListingProps {
    initialQuery?: string;
    type?: string;
    titleOverride?: string;
}

export default function TenderListing({ initialQuery, type, titleOverride }: TenderListingProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const urlQuery = searchParams.get('q');
    const page = Number(searchParams.get('page')) || 1;
    const itemsPerPage = 20;

    // Filter Params
    const categoryParam = searchParams.get('category');
    const locationParam = searchParams.get('location');
    const authorityParam = searchParams.get('authority');
    const publishDateFrom = searchParams.get('publishDateFrom');
    const publishDateTo = searchParams.get('publishDateTo');
    const submissionDateFrom = searchParams.get('submissionDateFrom');
    const submissionDateTo = searchParams.get('submissionDateTo');

    const effectiveQuery = urlQuery || initialQuery;
    const isArchive = type === 'archive';

    // Normalize display title (only if not an override or special type)
    let displayTitle = '';

    if (titleOverride) {
        displayTitle = titleOverride;
    } else if (effectiveQuery) {
        displayTitle = effectiveQuery.replace(' Tenders', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    } else {
        const filters = [];
        if (categoryParam) filters.push(categoryParam);
        if (locationParam) filters.push(locationParam);
        if (authorityParam) filters.push(authorityParam);

        if (filters.length > 0) {
            displayTitle = filters.join(' • ');
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
                    .select('*', { count: 'exact' })
                    .order('created_at', { ascending: false });

                // 1. Date/Status Logic based on Type
                const now = new Date().toISOString();

                if (type === 'archive') {
                    // Show Expired Tenders
                    supabaseQuery = supabaseQuery.lt('bid_end_ts', now);
                } else if (type === 'latest') {
                    // Added in last 24 hours AND Active
                    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
                    supabaseQuery = supabaseQuery.gt('created_at', yesterday).gt('bid_end_ts', now);
                } else if (type === 'closing-soon') {
                    // Closing in next 24 hours
                    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
                    supabaseQuery = supabaseQuery.gt('bid_end_ts', now).lt('bid_end_ts', tomorrow);
                } else {
                    // Default: Show Only Active Tenders
                    supabaseQuery = supabaseQuery.gt('bid_end_ts', now);
                }

                // 2. General Search (from Search Bar or URL Path)
                if (effectiveQuery) {
                    supabaseQuery = supabaseQuery.or(`title.ilike.%${effectiveQuery}%,reference_no.ilike.%${effectiveQuery}%,location.ilike.%${effectiveQuery}%,organisation_chain.ilike.%${effectiveQuery}%`);
                }

                // 3. Sidebar Filters
                const categories = categoryParam?.split(',').filter(Boolean) || [];
                const locations = locationParam?.split(',').filter(Boolean) || [];
                const authorities = authorityParam?.split(',').filter(Boolean) || [];

                if (categories.length > 0) {
                    const orStr = categories.map(c => `tender_category.ilike.%${c}%`).join(',');
                    supabaseQuery = supabaseQuery.or(orStr);
                }

                if (locations.length > 0) {
                    const orStr = locations.map(l => `location.ilike.%${l}%`).join(',');
                    supabaseQuery = supabaseQuery.or(orStr);
                }

                if (authorities.length > 0) {
                    const orStr = authorities.map(a => `organisation_chain.ilike.%${a}%`).join(',');
                    supabaseQuery = supabaseQuery.or(orStr);
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
                        id: item.id,
                        title: item.title,
                        authority: item.organisation_chain?.split('||')[0] || item.authority || 'Unknown Authority',
                        location: item.location || 'India',
                        tender_value: item.tender_value || 'N/A',
                        value: item.tender_value || 'N/A',
                        bid_submission_end: item.bid_submission_end || 'N/A',
                        date: item.bid_submission_end || 'N/A',
                        referenceNo: item.reference_no,
                        status: item.status,
                        organisation_chain: item.organisation_chain,
                        tenderFee: item.tender_fee || 'N/A',
                        category: item.tender_category || 'N/A'
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
        locationParam,
        authorityParam,
        publishDateFrom,
        publishDateTo,
        submissionDateFrom,
        submissionDateTo
    ]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="mb-6">
                    <Breadcrumb />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{pageTitle}</h1>
                    <p className="text-gray-600">Showing {tenders.length} results (Total: {totalCount}) for "{displayTitle}"</p>

                    {errorMsg && (
                        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                            <AlertCircle size={18} />
                            <span>Failed to load tenders: {errorMsg}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-1/4">
                        <FilterSidebar />
                    </div>

                    <div className="w-full lg:w-3/4">
                        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                            <div className="text-sm font-medium text-gray-600">
                                Sorted by: <span className="font-bold text-gray-800 cursor-pointer">Relevance</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <select className="bg-gray-50 border border-gray-200 text-sm rounded px-3 py-1.5 outline-none focus:border-tj-blue">
                                    <option>Relevance</option>
                                    <option>Date: Newest First</option>
                                    <option>Value: High to Low</option>
                                    <option>Closing Soon</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <RefreshCw className="animate-spin text-tj-blue" size={32} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {tenders.length > 0 ? (
                                    tenders.map((tender, index) => (
                                        <TenderCard key={tender.id} tender={tender} index={(page - 1) * itemsPerPage + index + 1} />
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                                        No tenders found matching your criteria.
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
                    </div>
                </div>
            </div>
        </div>
    );
}
