'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    ArrowRight,
    Award,
    Trophy,
    Users,
    Loader2,
    TrendingUp,
    Calendar,
    ChevronDown,
    ArrowUpDown,
    CheckCircle,
    LayoutGrid,
    List as ListIcon,
    History,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/services/supabase';

interface TenderResult {
    id: number;
    tender_id: string;
    winner_name: string;
    winning_bid_amount: number;
    bidder_count: number;
    created_at: string;
    tenders: {
        title: string;
        authority: string;
        location: string;
        tender_value: string;
    };
}

export default function TenderResultsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<TenderResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');
    const [selectedYear, setSelectedYear] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    const [stats, setStats] = useState({ totalAmount: 0, totalCount: 0, avgBidders: 0 });

    useEffect(() => {
        fetchResults();
    }, [sortBy, selectedYear]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            let query = supabase.from('tender_results').select(`*, tenders (title, authority, location, tender_value)`);

            if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
            if (sortBy === 'oldest') query = query.order('created_at', { ascending: true });
            if (sortBy === 'value-high') query = query.order('winning_bid_amount', { ascending: false });
            if (sortBy === 'value-low') query = query.order('winning_bid_amount', { ascending: true });

            if (selectedYear !== 'all') {
                query = query.gte('created_at', `${selectedYear}-01-01T00:00:00Z`).lte('created_at', `${selectedYear}-12-31T23:59:59Z`);
            }

            const { data, error } = await query;
            if (error) throw error;
            const resData = data || [];
            setResults(resData);

            const total = resData.reduce((acc, curr) => acc + (curr.winning_bid_amount || 0), 0);
            const count = resData.length;
            const avgBidders = count > 0 ? resData.reduce((acc, curr) => acc + (curr.bidder_count || 0), 0) / count : 0;
            setStats({ totalAmount: total, totalCount: count, avgBidders: Math.round(avgBidders * 10) / 10 });

        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lac`;
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    const filteredResults = results.filter(r =>
        r.winner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tenders?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tenders?.authority.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-16 font-sans">
            {/* Compact Header */}
            <div className="bg-[#0B2C4A] pt-20 pb-14 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-tj-yellow text-[9px] font-medium uppercase tracking-wider mb-3">
                                <History size={10} />
                                Market Intelligence
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                                Tender <span className="text-tj-yellow">Results</span>
                            </h1>
                            <p className="text-blue-100/50 text-sm mt-1 max-w-md">
                                Analyze winning bids, awarded vendors, and financial trends.
                            </p>
                        </div>

                        {/* Compact Stats */}
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-3">
                            <div className="text-center border-r border-white/10 pr-4">
                                <p className="text-[9px] text-blue-200/40 uppercase tracking-wider">Awarded</p>
                                <p className="text-lg font-bold text-white">{stats.totalCount}</p>
                            </div>
                            <div className="text-center border-r border-white/10 pr-4">
                                <p className="text-[9px] text-blue-200/40 uppercase tracking-wider">Net Value</p>
                                <p className="text-lg font-bold text-tj-yellow">{formatCurrency(stats.totalAmount)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[9px] text-blue-200/40 uppercase tracking-wider">Avg Bidders</p>
                                <p className="text-lg font-bold text-white">{stats.avgBidders}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls - overlapping header */}
            <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-20">
                <div className="bg-white rounded-xl p-3 shadow-md border border-slate-100 flex flex-col lg:flex-row gap-3 items-center">
                    {/* Search */}
                    <div className="relative w-full lg:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                        <input
                            type="text"
                            placeholder="Search by Vendor, Department or Work..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-transparent focus:border-primary/20 focus:bg-white rounded-lg text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto lg:ml-auto">
                        {/* Year filter */}
                        <div className="relative">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="appearance-none pl-8 pr-8 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-600 cursor-pointer outline-none"
                            >
                                <option value="all">All Years</option>
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                            </select>
                            <Calendar size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none pl-8 pr-8 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-600 cursor-pointer outline-none"
                            >
                                <option value="newest">Latest Results</option>
                                <option value="oldest">Oldest First</option>
                                <option value="value-high">High Value</option>
                                <option value="value-low">Low Value</option>
                            </select>
                            <ArrowUpDown size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* View Toggle */}
                        <div className="hidden md:flex bg-slate-100 p-0.5 rounded-lg">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>
                                <LayoutGrid size={15} />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>
                                <ListIcon size={15} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick filter tags */}
                <div className="flex flex-wrap gap-1.5 mt-4 overflow-x-auto pb-1 scrollbar-hide">
                    {['All Results', 'Last 30 Days', 'High Value', 'Construction', 'Services', 'Government'].map((tag) => (
                        <button key={tag} className="px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-medium text-slate-500 hover:border-primary hover:text-primary transition-all whitespace-nowrap">
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 mt-6">
                {loading ? (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 animate-pulse">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
                                    <div className="flex-1">
                                        <div className="h-2 bg-slate-100 rounded w-1/4 mb-2" />
                                        <div className="h-4 bg-slate-100 rounded w-3/4" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-3 bg-slate-50 rounded w-24" />
                                    <div className="h-3 bg-slate-50 rounded w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredResults.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                        <Search size={28} className="text-slate-200 mx-auto mb-3" />
                        <h2 className="text-base font-semibold text-slate-600">No Matching Results</h2>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">Try adjusting filters or search terms.</p>
                        <button onClick={() => setSearchTerm('')} className="mt-4 text-primary font-medium text-xs hover:underline">Clear Search</button>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                        {filteredResults.map((result, idx) => (
                            viewMode === 'list' ? (
                                /* LIST VIEW - horizontal row style */
                                <div key={result.id} className="bg-white rounded-xl border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all p-4 flex flex-col md:flex-row md:items-center gap-4">
                                    {/* Icon */}
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 shrink-0">
                                        <Award size={18} />
                                    </div>

                                    {/* Title + Authority */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-slate-400 mb-0.5">{result.tenders?.authority}</p>
                                        <Link href={`/tender-results/${result.tender_id}`}>
                                            <h3 className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors line-clamp-1 leading-snug">
                                                {result.tenders?.title}
                                            </h3>
                                        </Link>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                                <Trophy size={10} className="text-amber-400" />
                                                {result.winner_name}
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                                <Users size={10} />
                                                {result.bidder_count} bidders
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                                <Calendar size={10} />
                                                {new Date(result.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Amount + CTA */}
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="text-right">
                                            <p className="text-[9px] text-slate-400 uppercase tracking-wide">Winning Bid</p>
                                            <p className="text-sm font-bold text-primary">{formatCurrency(result.winning_bid_amount)}</p>
                                        </div>
                                        <Link href={`/tender-results/${result.tender_id}`} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all whitespace-nowrap">
                                            Analysis <ArrowRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                /* GRID VIEW - compact card */
                                <div key={result.id} className="bg-white rounded-xl border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all overflow-hidden">
                                    {result.winning_bid_amount > 50000000 && (
                                        <div className="bg-tj-yellow text-primary text-[9px] font-bold uppercase tracking-wider px-3 py-1">
                                            High Value
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <p className="text-[10px] text-slate-400 mb-1 truncate">{result.tenders?.authority}</p>
                                        <Link href={`/tender-results/${result.tender_id}`}>
                                            <h3 className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors line-clamp-2 leading-snug mb-3">
                                                {result.tenders?.title}
                                            </h3>
                                        </Link>
                                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="text-[9px] text-emerald-600 uppercase tracking-wide mb-0.5">Winner</p>
                                                    <p className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                                        <Trophy size={10} className="text-amber-400" />
                                                        {result.winner_name}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-0.5">Amount</p>
                                                    <p className="text-xs font-bold text-primary">{formatCurrency(result.winning_bid_amount)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                                                <span className="text-[10px] text-slate-400">{result.bidder_count} bidders</span>
                                                <span className="text-[10px] text-slate-400">
                                                    {new Date(result.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                        <Link href={`/tender-results/${result.tender_id}`} className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                            View Full Analysis <ArrowRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && filteredResults.length > 0 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-semibold shadow-sm shadow-primary/20">
                            1
                        </button>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
