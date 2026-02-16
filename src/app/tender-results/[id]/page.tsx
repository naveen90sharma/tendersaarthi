'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Building2, CalendarDays, Wallet, Award, CheckCircle2, XCircle, BarChart3, Loader2 } from 'lucide-react';
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
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-slate-50 px-6 text-center">
                <h1 className="text-2xl font-black text-slate-800">Result Not Found</h1>
                <Link href="/tender-results" className="text-primary font-bold hover:underline">Back to Results</Link>
            </div>
        );
    }

    // Determine location/authority safely
    // @ts-ignore
    const location = result.tenders?.location || 'India';
    // @ts-ignore
    const authority = result.tenders?.authority || 'Authority';
    // @ts-ignore
    const title = result.tenders?.title || 'Tender Detail';
    // @ts-ignore
    const tenderValue = result.tenders?.tender_value || 'N/A';


    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-[#103e68] pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="max-w-5xl mx-auto relative z-10">
                    <Link href="/tender-results" className="inline-flex items-center gap-2 text-blue-200 font-bold text-xs uppercase tracking-widest mb-6 hover:text-white transition-colors">
                        <ArrowLeft size={16} /> Back to All Results
                    </Link>
                    <div className="flex flex-wrap gap-3 mb-4">
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 size={12} /> Awarded
                        </span>
                        <span className="bg-white/10 text-blue-100 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {location}
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-white mb-6 leading-tight">
                        {title}
                    </h1>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-blue-100/80 border-t border-white/10 pt-6">
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest mb-1 opacity-60">Authority</p>
                            <p className="font-bold text-white flex items-center gap-2 text-sm md:text-base"><Building2 size={16} /> {authority}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest mb-1 opacity-60">Est. Value</p>
                            <p className="font-bold text-white flex items-center gap-2 text-sm md:text-base"><Wallet size={16} /> {tenderValue}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest mb-1 opacity-60">Result Date</p>
                            <p className="font-bold text-white flex items-center gap-2 text-sm md:text-base"><CalendarDays size={16} /> {formatDate(result.created_at)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Winner Card */}
            <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-8 md:-mt-12 relative z-20 mb-8 md:mb-12">
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-tj-yellow/10 rounded-bl-full pointer-events-none" />

                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Trophy size={32} fill="currentColor" className="md:w-10 md:h-10" />
                    </div>
                    <div className="flex-1 text-center md:text-left w-full">
                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Winning Bidder (L1)</p>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 leading-tight">{result.winner_name}</h2>
                        <p className="text-slate-500 font-medium text-sm md:text-base">
                            Secured the contract at <span className="text-slate-900 font-bold">{formatCurrency(result.winning_bid_amount)}</span>
                        </p>
                    </div>
                    <div className="text-center md:text-right shrink-0 w-full md:w-auto">
                        <div className="inline-block px-6 py-3 bg-slate-900 text-white rounded-xl w-full md:w-auto">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Final Contract Value</p>
                            <p className="text-xl md:text-2xl font-black text-tj-yellow">{formatCurrency(result.winning_bid_amount)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bidders Table */}
            <div className="max-w-5xl mx-auto px-4 md:px-6">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <BarChart3 className="text-slate-400" />
                    <h3 className="text-lg md:text-xl font-black text-slate-800">Bid Comparison Table</h3>
                </div>

                <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-4 md:px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest w-16 md:w-20">Rank</th>
                                    <th className="px-4 md:px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Bidder Name</th>
                                    <th className="px-4 md:px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Quoted Amount</th>
                                    <th className="px-4 md:px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bidders.map((bidder, index) => (
                                    <tr key={index} className={`hover:bg-slate-50/50 transition-colors ${bidder.status === 'Winner' ? 'bg-emerald-50/30' : ''}`}>
                                        <td className="px-4 md:px-6 py-4">
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black ${bidder.rank === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                L{bidder.rank}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 font-bold text-slate-700 text-sm md:text-base">
                                            {bidder.bidder_name}
                                            {bidder.status === 'Winner' && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">Winner</span>}
                                        </td>
                                        <td className="px-4 md:px-6 py-4 font-black text-slate-800 text-right text-sm md:text-base">
                                            {formatCurrency(bidder.quoted_amount)}
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-center">
                                            {bidder.status === 'Winner' ? (
                                                <Award size={20} className="text-emerald-500 mx-auto" />
                                            ) : bidder.status === 'Tech Disqualified' || bidder.status === 'Rejected' ? (
                                                <XCircle size={20} className="text-red-400 mx-auto" />
                                            ) : (
                                                <span className="text-xs font-bold text-slate-400">--</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400 font-medium px-4">
                    * Financial bids are only opened for technically qualified bidders.
                </p>
            </div>
        </div>
    );
}
