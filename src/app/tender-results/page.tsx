'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    ArrowRight,
    Award,
    Trophy,
    Users,
    Briefcase,
    Loader2,
    Filter,
    TrendingUp,
    Calendar,
    ChevronDown,
    ArrowUpDown,
    CheckCircle,
    LayoutGrid,
    List as ListIcon,
    History
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/services/supabase';

interface TenderResult {
    id: number;
    tender_id: string; // UUID
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

    // Stats
    const [stats, setStats] = useState({
        totalAmount: 0,
        totalCount: 0,
        avgBidders: 0
    });

    useEffect(() => {
        fetchResults();
    }, [sortBy, selectedYear]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('tender_results')
                .select(`
                    *,
                    tenders (
                        title,
                        authority,
                        location,
                        tender_value
                    )
                `);

            if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
            if (sortBy === 'oldest') query = query.order('created_at', { ascending: true });
            if (sortBy === 'value-high') query = query.order('winning_bid_amount', { ascending: false });
            if (sortBy === 'value-low') query = query.order('winning_bid_amount', { ascending: true });

            if (selectedYear !== 'all') {
                const start = `${selectedYear}-01-01T00:00:00Z`;
                const end = `${selectedYear}-12-31T23:59:59Z`;
                query = query.gte('created_at', start).lte('created_at', end);
            }

            const { data, error } = await query;

            if (error) throw error;
            const resData = data || [];
            setResults(resData);

            // Calculate basic stats
            const total = resData.reduce((acc, curr) => acc + (curr.winning_bid_amount || 0), 0);
            const count = resData.length;
            const avgBidders = count > 0 ? (resData.reduce((acc, curr) => acc + (curr.bidder_count || 0), 0) / count) : 0;

            setStats({
                totalAmount: total,
                totalCount: count,
                avgBidders: Math.round(avgBidders * 10) / 10
            });

        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)} Cr`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)} Lac`;
        }
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const filteredResults = results.filter(r =>
        r.winner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tenders?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tenders?.authority.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans">
            {/* Premium Header */}
            <div className="bg-[#0B2C4A] pt-24 pb-32 md:pt-32 md:pb-40 px-4 relative overflow-hidden">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none opacity-50" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-tj-yellow/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-tj-yellow text-[10px] font-black uppercase tracking-[0.2em] mb-2 animate-fade-in">
                                <History size={12} />
                                Market Intelligence
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
                                Tender <span className="text-tj-yellow">Results</span>
                            </h1>
                            <p className="text-blue-100/70 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                                Dive deep into procurement data. Analyze winning bids, awarded vendors, and financial trends across India.
                            </p>
                        </div>

                        {/* Summary Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 md:gap-6 bg-white/5 backdrop-blur-md p-4 md:p-6 rounded-[2rem] border border-white/10 w-full md:w-auto">
                            <div className="text-center md:text-left border-r border-white/10 pr-2 md:pr-6">
                                <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-widest mb-1">Awarded</p>
                                <p className="text-xl md:text-3xl font-black text-white tracking-tighter">{stats.totalCount}</p>
                            </div>
                            <div className="text-center md:text-left border-r border-white/10 px-2 md:px-6">
                                <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-widest mb-1">Net Value</p>
                                <p className="text-xl md:text-3xl font-black text-tj-yellow tracking-tighter">{formatCurrency(stats.totalAmount)}</p>
                            </div>
                            <div className="text-center md:text-left pl-2 md:pl-6">
                                <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-widest mb-1">Avg Bidders</p>
                                <p className="text-xl md:text-3xl font-black text-white tracking-tighter">{stats.avgBidders}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="max-w-7xl mx-auto px-4 -mt-16 md:-mt-20 relative z-20">
                <div className="bg-white rounded-[2.5rem] p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full lg:max-w-md">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by Vendor, Department or Work..."
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters & View Toggle */}
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-center md:justify-end">
                            {/* Sort Dropdown */}
                            <div className="relative group">
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="appearance-none pl-10 pr-10 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl font-black text-[11px] uppercase tracking-widest text-slate-600 cursor-pointer transition-all outline-none"
                                >
                                    <option value="all">All Years</option>
                                    <option value="2026">2026</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                </select>
                                <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative group">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none pl-10 pr-10 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl font-black text-[11px] uppercase tracking-widest text-slate-600 cursor-pointer transition-all outline-none"
                                >
                                    <option value="newest">Latest Results</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="value-high">High Value (Awarded)</option>
                                    <option value="value-low">Low Value (Awarded)</option>
                                </select>
                                <ArrowUpDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>

                            {/* View Switcher */}
                            <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <ListIcon size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tags / Quick Filters */}
                <div className="flex flex-wrap gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                    {['All Results', 'Last 30 Days', 'High Value', 'Construction', 'Services', 'Government'].map((tag) => (
                        <button key={tag} className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-primary hover:text-primary transition-all whitespace-nowrap shadow-sm">
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="relative">
                            <Loader2 className="animate-spin text-primary" size={48} strokeWidth={3} />
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                        </div>
                        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Accessing intelligence cloud...</p>
                    </div>
                ) : filteredResults.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Search size={32} className="text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">No Matching Results</h2>
                        <p className="text-slate-400 font-bold max-w-xs mx-auto mt-2">Try adjusting your filters or searching for specific vendor names.</p>
                        <button onClick={() => setSearchTerm('')} className="mt-8 text-primary font-black uppercase tracking-widest text-xs hover:underline">Clear Search</button>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                        {filteredResults.map((result, idx) => (
                            <div
                                key={result.id}
                                className={`group bg-white rounded-[2rem] border border-slate-100 hover:border-primary/20 hover:shadow-[0_30px_60px_rgba(15,23,42,0.08)] transition-all duration-500 overflow-hidden relative ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                {/* Decorative badge for value if high */}
                                {result.winning_bid_amount > 50000000 && (
                                    <div className="absolute top-0 right-0 py-1.5 px-4 bg-tj-yellow text-primary font-black text-[9px] uppercase tracking-widest rounded-bl-2xl z-20">
                                        High Value
                                    </div>
                                )}

                                {/* Left Section (for list view) or Top Image area */}
                                <div className={`aspect-[4/3] md:aspect-auto ${viewMode === 'list' ? 'w-full md:w-[240px] shrink-0' : 'w-full'} bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center p-12 relative overflow-hidden group/img`}>
                                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] grayscale" />

                                    {/* Animated background shape */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover/img:scale-150 transition-transform duration-700" />

                                    <div className={`w-24 h-24 rounded-[2rem] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex items-center justify-center text-primary group-hover/img:scale-110 group-hover/img:-rotate-3 transition-all duration-500 relative z-10 border border-slate-100`}>
                                        <Award size={48} strokeWidth={1.5} />
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-center">
                                        <span className="bg-white/95 backdrop-blur-md border border-slate-200/60 px-4 py-1.5 rounded-xl text-[10px] font-black text-slate-700 uppercase tracking-widest shadow-sm truncate max-w-full">
                                            {result.tenders?.location || 'India'}
                                        </span>
                                    </div>
                                </div>

                                {/* Main Content Section */}
                                <div className="p-6 md:p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-0.5 w-6 bg-primary/20 rounded-full" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[200px]">
                                            {result.tenders?.authority}
                                        </span>
                                    </div>

                                    <Link href={`/tender-results/${result.tender_id}`} className="block">
                                        <h3 className={`font-black text-slate-800 leading-tight tracking-tight mb-4 group-hover:text-primary transition-colors line-clamp-2 ${viewMode === 'grid' ? 'text-xl' : 'text-xl md:text-2xl'}`}>
                                            {result.tenders?.title}
                                        </h3>
                                    </Link>

                                    <div className="space-y-4 mt-auto">
                                        {/* Winner info block */}
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-primary/[0.02] transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Contract Winner</p>
                                                    <p className="text-sm font-black text-slate-800 flex items-center gap-2">
                                                        <Trophy size={14} className="text-tj-yellow" />
                                                        {result.winner_name}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Winning Amount</p>
                                                    <p className="text-base font-black text-primary tracking-tight">
                                                        {formatCurrency(result.winning_bid_amount)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                                                <div className="flex items-center gap-2">
                                                    <Users size={12} className="text-slate-400" />
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{result.bidder_count} Bidders Participated</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={12} className="text-slate-400" />
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{new Date(result.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action link */}
                                        <Link
                                            href={`/tender-results/${result.tender_id}`}
                                            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-slate-200 font-bold text-xs uppercase tracking-[0.2em] text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all group-hover:shadow-lg shadow-primary/20"
                                        >
                                            View Full Analysis
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination UI Placeholder */}
                {!loading && filteredResults.length > 0 && (
                    <div className="mt-16 flex items-center justify-center gap-4">
                        <button className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all">
                            <ChevronDown className="rotate-90" size={20} />
                        </button>
                        <div className="flex items-center gap-2">
                            {[1].map(p => (
                                <button key={p} className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black tracking-widest ${p === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                        <button className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all">
                            <ChevronDown className="-rotate-90" size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
