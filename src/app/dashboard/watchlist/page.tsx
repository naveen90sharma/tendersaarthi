'use client';

import { useEffect, useState } from 'react';
import { Bookmark, Loader2, ArrowLeft, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/services/auth';
import { getSavedTenders } from '@/services/tenderService';
import TenderCard from '@/components/TenderCard';
import type { Tender } from '@/types';

export default function WatchlistPage() {
    const [savedTenders, setSavedTenders] = useState<Tender[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadData = async () => {
            const { user } = await getCurrentUser();
            if (user) {
                const result = await getSavedTenders(user.id);
                if (result.success && result.data) {
                    setSavedTenders(result.data);
                }
            }
            setLoading(false);
        };
        loadData();
    }, []);

    const filteredTenders = savedTenders.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.authority?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.state?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUnsave = (id: string) => {
        setSavedTenders(prev => prev.filter(t => t.id.toString() !== id));
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    My Watchlist
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-lg font-black">{savedTenders.length} Items</span>
                </h1>
                <p className="text-slate-500 font-medium">Keep track of your bookmarked opportunities.</p>
            </div>

            {/* Filters bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search within watchlist..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                    <Filter size={16} /> Filters
                </button>
            </div>

            {/* Content */}
            {savedTenders.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-200 border-dashed">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Bookmark size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Watchlist is Empty</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">You haven't saved any tenders yet. Explore the marketplace and bookmark tenders you're interested in.</p>
                    <Link href="/active-tenders" className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all inline-block uppercase tracking-widest text-xs">
                        Browse Active Tenders
                    </Link>
                </div>
            ) : filteredTenders.length === 0 ? (
                <div className="py-20 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">No Matches Found</p>
                    <button onClick={() => setSearchQuery('')} className="text-primary font-black text-sm hover:underline">Clear Search</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredTenders.map((tender, index) => (
                        <TenderCard key={tender.id} tender={tender} index={index + 1} onUnsave={handleUnsave} />
                    ))}
                </div>
            )}
        </div>
    );
}
