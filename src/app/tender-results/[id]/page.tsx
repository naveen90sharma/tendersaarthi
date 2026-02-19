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
    CheckCircle2,
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
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            // 1. Fetch Result Info
            const { data: resData, error: resError } = await supabase
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
                .eq('tender_id', id)
                .single();

            if (resError) throw resError;
            setResult(resData);

            // 2. Fetch Bidders
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
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="text-center space-y-4">
                    <Loader2 className="animate-spin text-primary mx-auto" size={48} />
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Loading Analysis...</p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-6 bg-[#f8fafc] px-6 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center">
                    <XCircle size={40} className="text-slate-300" />
                </div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Result Not Found</h1>
                <Link href="/tender-results" className="bg-primary text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-primary/20">Back to All Results</Link>
            </div>
        );
    }

    const { tenders } = result;
    const stats = {
        totalPrice: formatCurrency(result.winning_bid_amount),
        savings: "15%", // Placeholder for demonstration
        participants: result.bidder_count
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Elegant Top Header (Dark Modeish) */}
            <div className="bg-[#0B2C4A] pt-24 md:pt-32 pb-24 md:pb-32 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-tj-yellow/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <Link href="/tender-results" className="inline-flex items-center gap-2 text-blue-200/50 font-black text-[10px] uppercase tracking-[0.2em] mb-8 hover:text-white transition-all group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Intelligence Center
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className="bg-tj-yellow text-primary px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-tj-yellow/10">
                            <Award size={12} fill="currentColor" />
                            Final Contract Awarded
                        </div>
                        <div className="bg-white/10 text-blue-100 border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                            ID: {id.slice(0, 8).toUpperCase()}
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tighter leading-tight max-w-4xl">
                        {tenders?.title}
                    </h1>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-white/10">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-black tracking-widest text-blue-200/40">Issuing Authority</p>
                            <p className="font-bold text-white text-base truncate flex items-center gap-2">
                                <Building2 size={16} className="text-tj-yellow" />
                                {tenders?.authority}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-black tracking-widest text-blue-200/40">Work Location</p>
                            <p className="font-bold text-white text-base truncate flex items-center gap-2">
                                <ShieldCheck size={16} className="text-blue-400" />
                                {tenders?.location}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-black tracking-widest text-blue-200/40">Market Est. Value</p>
                            <p className="font-bold text-white text-base truncate flex items-center gap-2">
                                <Wallet size={16} className="text-emerald-400" />
                                {tenders?.tender_value}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-black tracking-widest text-blue-200/40">Award Date</p>
                            <p className="font-bold text-white text-base truncate flex items-center gap-2">
                                <CalendarDays size={16} className="text-tj-yellow" />
                                {formatDate(result.created_at)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analysis Dashboard */}
            <div className="max-w-6xl mx-auto px-4 -mt-16 md:-mt-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Winner Card */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none transition-all group-hover:bg-emerald-100/50" />

                            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-emerald-600 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                                    <Trophy size={56} fill="currentColor" className="relative z-10" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">L1 - Successful Bidder</span>
                                        <TrendingUp size={14} className="text-emerald-500" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter mb-4 leading-none">
                                        {result.winner_name}
                                    </h2>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-primary" />
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Verified Vendor</span>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2">
                                            <Clock size={14} className="text-slate-400" />
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest tracking-widest transition-all">72h SLA Ready</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-10 border-t border-slate-100 relative z-10">
                                <div className="bg-emerald-600 text-white rounded-[2rem] p-8 shadow-xl shadow-emerald-900/10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-60">Contract Value Final</p>
                                    <h3 className="text-3xl lg:text-4xl font-black tracking-tighter mb-2">{formatCurrency(result.winning_bid_amount)}</h3>
                                    <p className="text-emerald-100/70 text-sm font-medium">All taxes & duties included as per statutory norms.</p>
                                </div>
                                <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl">
                                    <div className="flex justify-between items-start mb-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Competition Index</p>
                                        <Users size={20} className="text-blue-400" />
                                    </div>
                                    <h3 className="text-3xl lg:text-4xl font-black tracking-tighter mb-2">{result.bidder_count}</h3>
                                    <p className="text-slate-400 text-sm font-medium">Participants contested in the final financial round.</p>
                                </div>
                            </div>
                        </div>

                        {/* Comparative Table */}
                        <div className="mt-12 bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
                                        <BarChart3 size={20} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Comparative Statement</h3>
                                </div>
                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-tj-blue transition-colors">
                                    <Download size={14} /> Download PDF
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[500px]">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendor Name</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Quote Amount</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {bidders.map((bidder, i) => (
                                            <tr key={i} className={`group hover:bg-slate-50/50 transition-colors ${bidder.rank === 1 ? 'bg-emerald-50/20' : ''}`}>
                                                <td className="px-8 py-6">
                                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${bidder.rank === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        L{bidder.rank}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <p className="font-bold text-slate-800 group-hover:text-primary transition-colors">{bidder.bidder_name}</p>
                                                        {bidder.rank === 1 && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right font-black text-slate-700">
                                                    {formatCurrency(bidder.quoted_amount)}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex justify-center">
                                                        {bidder.rank === 1 ? (
                                                            <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Success</div>
                                                        ) : (
                                                            <div className="bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Lost</div>
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

                    {/* Sidebar Actions */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-xl shadow-slate-200/50">
                            <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-6">Market Trends</h4>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-tj-yellow/10 text-tj-yellow rounded-xl flex items-center justify-center shrink-0">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500">Savings from Estimate</p>
                                        <p className="font-black text-slate-800">12.4% below par</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500">Industry Interest</p>
                                        <p className="font-black text-slate-800">High Engagement</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-50">
                                <button className="w-full bg-slate-900 text-white rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-slate-800 shadow-xl transition-all">
                                    <Share2 size={16} /> Share Intelligence
                                </button>
                            </div>
                        </div>

                        {/* Advertisement or Help card */}
                        <div className="bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                            <h4 className="text-2xl font-black tracking-tight mb-4 leading-tight">Need expert bid support?</h4>
                            <p className="text-blue-100/70 text-sm font-medium mb-8 leading-relaxed">Our consultants help you prepare competitive quotes to improve your winning chances.</p>
                            <Link href="/contact" className="inline-flex items-center gap-2 bg-tj-yellow text-primary px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:-translate-y-1 transition-all">
                                Talk to Expert
                                <ChevronRight size={14} />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
            {/* Bottom Safe Area */}
            <div className="h-20" />
        </div>
    );
}
