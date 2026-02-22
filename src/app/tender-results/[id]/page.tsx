'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Trophy,
    Building2,
    CalendarDays,
    Wallet,
    Award,
    XCircle,
    BarChart3,
    Loader2,
    ShieldCheck,
    Users,
    ChevronRight,
    Download,
    Share2,
    Clock,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/services/supabase';

interface TenderResultDetail {
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

interface Bidder {
    id: number;
    bidder_name: string;
    quoted_amount: number;
    rank: number;
    status: string;
    is_technical_qualified: boolean;
}

export default function TenderResultDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [result, setResult] = useState<TenderResultDetail | null>(null);
    const [bidders, setBidders] = useState<Bidder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const { data: resData, error: resError } = await supabase
                .from('tender_results')
                .select(`*, tenders (title, authority, location, tender_value)`)
                .eq('tender_id', id)
                .single();

            if (resError) throw resError;
            setResult(resData);

            const { data: bidData, error: bidError } = await supabase
                .from('tender_bidders')
                .select('*')
                .eq('tender_id', id)
                .order('rank', { ascending: true });

            if (bidError) throw bidError;
            setBidders(bidData || []);
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="text-center space-y-3">
                    <Loader2 className="animate-spin text-primary mx-auto" size={28} />
                    <p className="text-slate-400 text-xs">Loading Analysis...</p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-[#f8fafc] px-6 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center">
                    <XCircle size={28} className="text-slate-300" />
                </div>
                <h1 className="text-xl font-semibold text-slate-700">Result Not Found</h1>
                <Link href="/tender-results" className="bg-primary text-white px-5 py-2 rounded-lg font-medium text-sm shadow-md">Back to All Results</Link>
            </div>
        );
    }

    const { tenders } = result;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-16">
            {/* Compact Dark Header */}
            <div className="bg-[#0B2C4A] pt-20 pb-12 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 rounded-full blur-[100px] pointer-events-none -mr-40 -mt-40" />

                <div className="max-w-6xl mx-auto relative z-10">
                    {/* Back link */}
                    <Link href="/tender-results" className="inline-flex items-center gap-1.5 text-blue-200/40 text-xs mb-5 hover:text-white transition-all group">
                        <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                        Back to Intelligence Center
                    </Link>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <div className="bg-tj-yellow text-primary px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Award size={10} fill="currentColor" />
                            Final Contract Awarded
                        </div>
                        <div className="bg-white/10 text-blue-100 border border-white/10 px-3 py-1 rounded-full text-[9px] font-medium uppercase tracking-wider">
                            ID: {id.slice(0, 8).toUpperCase()}
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-xl md:text-2xl font-semibold text-white mb-6 leading-snug max-w-4xl">
                        {tenders?.title}
                    </h1>

                    {/* Meta row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-5 border-t border-white/10">
                        {[
                            { label: 'Issuing Authority', value: tenders?.authority, icon: <Building2 size={12} className="text-tj-yellow" /> },
                            { label: 'Work Location', value: tenders?.location, icon: <ShieldCheck size={12} className="text-blue-400" /> },
                            { label: 'Market Est. Value', value: tenders?.tender_value, icon: <Wallet size={12} className="text-emerald-400" /> },
                            { label: 'Award Date', value: formatDate(result.created_at), icon: <CalendarDays size={12} className="text-tj-yellow" /> },
                        ].map((item, i) => (
                            <div key={i}>
                                <p className="text-[9px] uppercase tracking-wider text-blue-200/30 mb-1">{item.label}</p>
                                <p className="text-xs font-medium text-white/80 flex items-center gap-1.5 truncate">
                                    {item.icon}
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                    {/* Left: Winner + Table */}
                    <div className="lg:col-span-8 space-y-4">

                        {/* Winner Card - compact */}
                        <div className="bg-white rounded-xl border border-slate-100 shadow-md p-5">
                            {/* Winner row */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                    <Trophy size={22} fill="currentColor" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-0.5 font-medium">L1 · Successful Bidder</p>
                                    <h2 className="text-lg font-bold text-slate-800 leading-tight">{result.winner_name}</h2>
                                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                        <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-md px-2 py-0.5 text-[10px] text-slate-500">
                                            <ShieldCheck size={10} className="text-primary" /> Verified Vendor
                                        </span>
                                        <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-md px-2 py-0.5 text-[10px] text-slate-500">
                                            <Clock size={10} /> 72h SLA Ready
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-50">
                                <div className="bg-emerald-600 text-white rounded-xl p-4">
                                    <p className="text-[9px] uppercase tracking-wider mb-1 opacity-60">Contract Value Final</p>
                                    <p className="text-xl font-bold tracking-tight">{formatCurrency(result.winning_bid_amount)}</p>
                                    <p className="text-emerald-100/60 text-[11px] mt-1">All taxes & duties included as per statutory norms.</p>
                                </div>
                                <div className="bg-slate-800 text-white rounded-xl p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-[9px] uppercase tracking-wider opacity-40">Competition Index</p>
                                        <Users size={14} className="text-blue-400" />
                                    </div>
                                    <p className="text-xl font-bold tracking-tight">{result.bidder_count}</p>
                                    <p className="text-slate-400 text-[11px] mt-1">Participants contested in the final financial round.</p>
                                </div>
                            </div>
                        </div>

                        {/* Comparative Statement Table */}
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 bg-blue-50 text-primary rounded-lg flex items-center justify-center">
                                        <BarChart3 size={14} />
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Comparative Statement</h3>
                                </div>
                                <button className="flex items-center gap-1.5 text-[10px] font-medium text-primary hover:underline">
                                    <Download size={12} /> Download PDF
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[460px]">
                                    <thead>
                                        <tr className="bg-slate-50/70">
                                            <th className="px-5 py-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider">Rank</th>
                                            <th className="px-5 py-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider">Vendor Name</th>
                                            <th className="px-5 py-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider text-right">Quote Amount</th>
                                            <th className="px-5 py-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {bidders.map((bidder, i) => (
                                            <tr key={i} className={`hover:bg-slate-50/50 transition-colors ${bidder.rank === 1 ? 'bg-emerald-50/20' : ''}`}>
                                                <td className="px-5 py-3.5">
                                                    <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold ${bidder.rank === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        L{bidder.rank}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium text-slate-700">{bidder.bidder_name}</p>
                                                        {bidder.rank === 1 && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-700">
                                                    {formatCurrency(bidder.quoted_amount)}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex justify-center">
                                                        {bidder.rank === 1 ? (
                                                            <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-wider">Success</span>
                                                        ) : (
                                                            <span className="bg-slate-100 text-slate-400 px-2.5 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-wider">Lost</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* Market Trends card */}
                        <div className="bg-white rounded-xl border border-slate-100 shadow-md p-5">
                            <h4 className="text-sm font-semibold text-slate-700 mb-4">Market Trends</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center shrink-0">
                                        <TrendingUp size={15} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Savings from Estimate</p>
                                        <p className="text-sm font-semibold text-slate-700">12.4% below par</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                        <Users size={15} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Industry Interest</p>
                                        <p className="text-sm font-semibold text-slate-700">High Engagement</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 pt-4 border-t border-slate-50">
                                <button className="w-full bg-slate-800 text-white rounded-lg py-2.5 text-xs font-medium flex items-center justify-center gap-2 hover:bg-slate-700 transition-all">
                                    <Share2 size={13} /> Share Intelligence
                                </button>
                            </div>
                        </div>

                        {/* Bid support CTA */}
                        <div className="bg-primary rounded-xl p-5 text-white">
                            <h4 className="text-base font-semibold mb-1.5">Need expert bid support?</h4>
                            <p className="text-blue-100/60 text-xs mb-4 leading-relaxed">Our consultants help you prepare competitive quotes to improve your winning chances.</p>
                            <Link href="/contact" className="inline-flex items-center gap-1.5 bg-tj-yellow text-primary px-4 py-2 rounded-lg font-semibold text-xs hover:-translate-y-0.5 transition-all">
                                Talk to Expert <ChevronRight size={12} />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
