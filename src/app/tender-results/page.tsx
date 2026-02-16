'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowRight, Award, Trophy, Users, Briefcase, Loader2 } from 'lucide-react';
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

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const { data, error } = await supabase
                .from('tender_results')
                .select(`
                    *,
                    tenders (
                        title,
                        authority,
                        location,
                        tender_value
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setResults(data || []);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(amount);
    };

    const filteredResults = results.filter(r =>
        r.winner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tenders?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tenders?.authority.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header Section */}
            <div className="bg-[#103e68] pt-24 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-3 md:mb-4 tracking-tight">
                        Tender <span className="text-tj-yellow">Results</span>
                    </h1>
                    <p className="text-blue-100 text-sm md:text-lg max-w-2xl font-medium leading-relaxed">
                        Comprehensive list of awarded contracts, winning bidders, and financial comparisons.
                    </p>
                </div>
            </div>

            {/* Search & Stats Bar */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-6 md:-mt-8 relative z-20">
                <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search results..."
                            className="w-full pl-11 md:pl-12 pr-4 py-3 md:py-4 bg-slate-50 rounded-xl font-bold text-slate-700 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-12">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : filteredResults.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 font-bold">
                        No results found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                        {filteredResults.map((result) => (
                            <div key={result.id} className="group bg-white rounded-2xl md:rounded-3xl p-1 border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                                <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6">
                                    {/* Mobile: Top Row with Location & Status */}
                                    <div className="flex md:hidden items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                <Award size={12} /> Awarded
                                            </span>
                                        </div>
                                        <Link
                                            href={`/tender-results/${result.tender_id}`}
                                            className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center"
                                        >
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>

                                    {/* Desktop: Status Badge */}
                                    <div className="hidden md:flex flex-col items-center justify-center w-24 shrink-0 border-r border-slate-50 pr-6">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <Award size={24} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Awarded</span>
                                    </div>

                                    {/* Center: Tender Info */}
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                                {result.tenders?.location || 'India'}
                                            </span>
                                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                                {result.tenders?.authority || 'Authority'}
                                            </span>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-black text-slate-800 mb-4 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                            {result.tenders?.title || 'Untitled Tender'}
                                        </h3>

                                        {/* Mobile Grid Layout for Details */}
                                        <div className="grid grid-cols-2 md:flex md:items-center md:gap-6 gap-y-4 gap-x-2 bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl">
                                            <div className="col-span-2 md:col-span-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Winner</p>
                                                <p className="text-sm font-bold text-slate-700 flex items-center gap-2 truncate">
                                                    <Trophy size={14} className="text-tj-yellow shrink-0" />
                                                    <span className="truncate">{result.winner_name}</span>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Winning Bid</p>
                                                <p className="text-sm font-bold text-emerald-600">{formatCurrency(result.winning_bid_amount)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Participants</p>
                                                <p className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                                    <Users size={14} className="text-slate-400" />
                                                    {result.bidder_count}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop: Right Action */}
                                    <div className="hidden md:flex items-center border-l border-slate-50 pl-6">
                                        <Link
                                            href={`/tender-results/${result.tender_id}`}
                                            className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all group-hover:translate-x-1"
                                        >
                                            <ArrowRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
