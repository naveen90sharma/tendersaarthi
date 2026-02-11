'use client';

import Link from 'next/link';
import { useLatestTenders } from '../hooks/useTenders';
import { RefreshCw, MapPin, Building2, ArrowRight, Clock, Wallet, ShieldCheck } from 'lucide-react';

export default function TenderSection({ title }: { title: string }) {
    const { tenders, loading } = useLatestTenders(8);

    // Duplicate tenders for infinite scroll effect
    const duplicatedTenders = [...tenders, ...tenders, ...tenders];

    return (
        <section className="py-24 bg-white overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-1 w-12 bg-primary rounded-full" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Verified Opportunities</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tighter leading-none">{title}</h2>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Premium business leads updated every 60 minutes</p>
                    </div>
                    <Link
                        href="/active-tenders"
                        className="group flex items-center gap-3 bg-primary/5 hover:bg-primary text-primary hover:text-white px-6 py-3 rounded-2xl font-black transition-all duration-300 uppercase text-[12px] tracking-widest border border-primary/10"
                    >
                        Explore All
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="text-center space-y-4">
                            <div className="relative">
                                <RefreshCw className="animate-spin text-primary mx-auto" size={48} strokeWidth={3} />
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                            </div>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Synchronizing Database...</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Gradient Masks */}
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/50 to-transparent z-20 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/50 to-transparent z-20 pointer-events-none" />

                        {/* Scrolling Wrapper */}
                        <div className="overflow-hidden py-8">
                            <div className="flex gap-8 animate-scroll-slow hover:pause-animation">
                                {duplicatedTenders.map((tender, index) => {
                                    const daysLeft = tender.bid_end_ts
                                        ? Math.ceil((new Date(tender.bid_end_ts).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                        : null;
                                    const isUrgent = daysLeft !== null && daysLeft <= 7;

                                    return (
                                        <div
                                            key={`${tender.id}-${index}`}
                                            className="group w-[380px] flex-shrink-0 bg-white rounded-[2rem] border border-slate-100 p-2 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(15,23,42,0.1)] hover:-translate-y-2 relative"
                                        >
                                            {/* Top Card Content */}
                                            <div className="bg-[#f8fafc] rounded-[1.8rem] p-6 h-full flex flex-col">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
                                                            <ShieldCheck size={12} className="text-green-500" />
                                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Verified</span>
                                                        </div>
                                                    </div>
                                                    {daysLeft !== null && (
                                                        <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${isUrgent ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-white text-slate-700 border border-slate-200'
                                                            }`}>
                                                            {daysLeft}d left
                                                        </div>
                                                    )}
                                                </div>

                                                <Link href={`/tender/${tender.id}`} className="block mb-4">
                                                    <h3 className="text-base font-bold text-[#1e293b] leading-snug line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                                                        {tender.title}
                                                    </h3>
                                                </Link>

                                                <div className="space-y-4 mt-auto">
                                                    <div className="flex items-center gap-3 text-slate-500">
                                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100 shrink-0">
                                                            <MapPin size={14} className="text-primary" />
                                                        </div>
                                                        <span className="text-xs font-bold truncate uppercase tracking-tight">{tender.location}</span>
                                                    </div>

                                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tender Value</span>
                                                            <span className="text-[15px] font-black text-primary">
                                                                {tender.tender_value || tender.value || 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                                            <ArrowRight size={20} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes scroll-slow {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-380px * ${tenders.length} - ${tenders.length * 32}px)); }
                }
                .animate-scroll-slow {
                    animation: scroll-slow 35s linear infinite;
                }
                .pause-animation {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
