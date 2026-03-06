'use client';

import { useEffect, useState } from 'react';
import { Bookmark, Loader2, Filter, Search, Clock, Zap, FolderOpen, ArrowDownUp } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/services/auth';
import { getSavedTenders } from '@/services/tenderService';
import TenderCard from '@/components/TenderCard';
import type { Tender } from '@/types';

export default function WatchlistPage() {
    const [savedTenders, setSavedTenders] = useState<Tender[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('deadline_asc');
    const [filterState, setFilterState] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        const loadData = async () => {
            const { user } = await getCurrentUser();
            if (user) {
                const result = await getSavedTenders(user.id);
                if (result.success && result.data) {
                    setSavedTenders(result.data);
                }
            }
            setTimeout(() => setLoading(false), 500); // Small delay for premium feel
        };
        loadData();
    }, []);

    const availableStates = Array.from(new Set(savedTenders.map(t => t.state).filter(Boolean)));

    const filteredAndSortedTenders = savedTenders
        .filter(t => {
            // Apply Search
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.authority?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.state?.toLowerCase().includes(searchQuery.toLowerCase());

            // Apply State Filter
            const matchesState = filterState === 'All' || t.state === filterState;

            // Apply Status Filter
            let matchesStatus = true;
            const now = new Date();
            const twoDaysFromNow = new Date(now.getTime() + (48 * 60 * 60 * 1000));

            if (filterStatus === 'Closing Soon') {
                if (!t.bid_submission_end) matchesStatus = false;
                else {
                    const end = new Date(t.bid_submission_end);
                    matchesStatus = end > now && end <= twoDaysFromNow;
                }
            } else if (filterStatus === 'Active') {
                if (!t.bid_submission_end) matchesStatus = true;
                else {
                    const end = new Date(t.bid_submission_end);
                    matchesStatus = end > now;
                }
            } else if (filterStatus === 'Closed') {
                if (!t.bid_submission_end) matchesStatus = false;
                else {
                    const end = new Date(t.bid_submission_end);
                    matchesStatus = end <= now;
                }
            }

            return matchesSearch && matchesState && matchesStatus;
        })
        .sort((a, b) => {
            if (sortOption === 'deadline_asc') {
                const dateA = a.bid_submission_end ? new Date(a.bid_submission_end).getTime() : Infinity;
                const dateB = b.bid_submission_end ? new Date(b.bid_submission_end).getTime() : Infinity;
                return dateA - dateB;
            }
            if (sortOption === 'deadline_desc') {
                const dateA = a.bid_submission_end ? new Date(a.bid_submission_end).getTime() : 0;
                const dateB = b.bid_submission_end ? new Date(b.bid_submission_end).getTime() : 0;
                return dateB - dateA;
            }

            const valA = parseValue(a.tender_value);
            const valB = parseValue(b.tender_value);

            if (sortOption === 'value_desc') return valB - valA;
            if (sortOption === 'value_asc') return valA - valB;

            return 0;
        });

    function parseValue(valStr: string | null | undefined) {
        if (!valStr) return 0;
        const numeric = parseFloat(valStr.replace(/[^0-9.]/g, '')) || 0;
        if (valStr.toLowerCase().includes('cr')) return numeric * 10000000;
        if (valStr.toLowerCase().includes('lakh')) return numeric * 100000;
        return numeric;
    }

    const handleUnsave = (id: string) => {
        setSavedTenders(prev => prev.filter(t => t.id.toString() !== id));
    };

    const getClosingSoonCount = () => {
        const now = new Date();
        const twoDaysFromNow = new Date(now.getTime() + (48 * 60 * 60 * 1000));
        return savedTenders.filter(t => {
            if (!t.bid_submission_end) return false;
            const end = new Date(t.bid_submission_end);
            return end > now && end <= twoDaysFromNow;
        }).length;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pb-20">
            {/* Header Section */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-tj-yellow/20 rounded-xl text-[#103e68]">
                                <Bookmark size={24} className="fill-[#103e68]/10" />
                            </div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                                My Watchlist
                            </h1>
                        </div>
                        <p className="text-slate-500 font-medium">Manage and track your bookmarked opportunities in one place.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Tracked</p>
                            <p className="text-2xl font-black text-[#103e68]">{savedTenders.length}</p>
                        </div>
                        <div className="w-px h-10 bg-slate-200 hidden md:block" />
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Closing Soon</p>
                            <p className="text-2xl font-black text-rose-500">{getClosingSoonCount()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#103e68] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search within watchlist..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#103e68]/20 focus:border-[#103e68]/30 outline-none transition-all shadow-sm placeholder-slate-400 text-slate-700"
                    />
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0 shrink-0 custom-scrollbar">
                    {/* Status Filter */}
                    <div className="relative shrink-0">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="appearance-none w-full flex items-center justify-between gap-2 px-6 pr-12 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[11px] uppercase tracking-widest text-[#103e68] hover:border-[#103e68]/30 transition-all shadow-sm outline-none cursor-pointer focus:ring-2 focus:ring-[#103e68]/20 min-w-[160px]"
                        >
                            <option value="All">Status: All</option>
                            <option value="Active">Status: Active</option>
                            <option value="Closing Soon">Status: Closing Soon</option>
                            <option value="Closed">Status: Closed</option>
                        </select>
                        <Filter size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    {/* State Filter */}
                    <div className="relative shrink-0">
                        <select
                            value={filterState}
                            onChange={(e) => setFilterState(e.target.value)}
                            className="appearance-none w-full flex items-center justify-between gap-2 px-6 pr-12 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[11px] uppercase tracking-widest text-[#103e68] hover:border-[#103e68]/30 transition-all shadow-sm outline-none cursor-pointer focus:ring-2 focus:ring-[#103e68]/20 min-w-[140px]"
                        >
                            <option value="All">State: All</option>
                            {availableStates.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                        <Filter size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative shrink-0">
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="appearance-none w-full flex items-center justify-between gap-2 px-6 pr-12 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[11px] uppercase tracking-widest text-[#103e68] hover:border-[#103e68]/30 transition-all shadow-sm outline-none cursor-pointer focus:ring-2 focus:ring-[#103e68]/20 min-w-[190px]"
                        >
                            <option value="deadline_asc">Sort: Deadline Soonest</option>
                            <option value="deadline_desc">Sort: Deadline Latest</option>
                            <option value="value_desc">Sort: Value High to Low</option>
                            <option value="value_asc">Sort: Value Low to High</option>
                        </select>
                        <ArrowDownUp size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="grid grid-cols-1 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-white rounded-3xl border border-slate-100 shadow-sm animate-pulse flex p-6 gap-6 items-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl" />
                            <div className="flex-1 space-y-4 py-2">
                                <div className="h-6 bg-slate-100 rounded-lg w-3/4" />
                                <div className="h-4 bg-slate-50 rounded-lg w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : savedTenders.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 border-dashed relative overflow-hidden">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 relative z-10">
                        <FolderOpen size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2 relative z-10">Watchlist is Empty</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium relative z-10">You haven't saved any tenders yet. Explore the marketplace and bookmark tenders you're interested in.</p>
                    <Link href="/active-tenders" className="px-8 py-4 bg-[#103e68] text-white font-black rounded-xl shadow-xl shadow-[#103e68]/20 hover:-translate-y-1 transition-all inline-block uppercase tracking-widest text-xs relative z-10">
                        Browse Active Tenders
                    </Link>
                </div>
            ) : filteredAndSortedTenders.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <Search className="mx-auto text-slate-300 mb-4" size={40} />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-2">No Matches Found</p>
                    <button onClick={() => setSearchQuery('')} className="text-[#103e68] font-black text-sm hover:underline">Clear Search</button>
                </div>
            ) : (
                <div className="space-y-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Showing {filteredAndSortedTenders.length} Tracking Item{filteredAndSortedTenders.length !== 1 && 's'}</p>
                    <div className="grid grid-cols-1 gap-6">
                        {filteredAndSortedTenders.map((tender, index) => (
                            <TenderCard key={tender.id} tender={tender} index={index + 1} onUnsave={handleUnsave} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
