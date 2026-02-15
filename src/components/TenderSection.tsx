'use client';

import Link from 'next/link';
import { useLatestTenders } from '../hooks/useTenders';
import { RefreshCw, MapPin, Building2, ArrowRight, Clock, Wallet, ShieldCheck } from 'lucide-react';

export default function TenderSection({ title }: { title: string }) {
    const { tenders, loading } = useLatestTenders(8);

    // Duplicate tenders for infinite scroll effect
    const duplicatedTenders = [...tenders, ...tenders, ...tenders];

    return (
        <section className="py-12 md:py-24 bg-white overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-1 w-12 bg-primary rounded-full" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Verified Opportunities</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-[#0f172a] tracking-tighter leading-none">{title}</h2>
                        <p className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-wider">Premium business leads updated every 60 minutes</p>
                    </div>
                    <Link
                        href="/active-tenders"
                        className="group flex items-center gap-3 bg-primary/5 hover:bg-primary text-primary hover:text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-black transition-all duration-300 uppercase text-[10px] md:text-[12px] tracking-widest border border-primary/10"
                    >
                        Explore All
                        <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px] group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-16 md:py-24">
                        <div className="text-center space-y-4">
                            <div className="relative">
                                <RefreshCw className="animate-spin text-primary mx-auto w-9 h-9 md:w-12 md:h-12" strokeWidth={3} />
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                            </div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Synchronizing Database...</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Gradient Masks (only on desktop) */}
                        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/50 to-transparent z-20 pointer-events-none" />
                        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/50 to-transparent z-20 pointer-events-none" />

                        {/* Scrolling Wrapper */}
                        <div className="overflow-x-auto md:overflow-hidden py-4 md:py-8 scrollbar-hide snap-x snap-mandatory px-2 md:px-0">
                            <div className="flex gap-4 md:gap-8 md:animate-scroll-slow hover:pause-animation">
                                {duplicatedTenders.map((tender, index) => {
                                    const daysLeft = tender.bid_end_ts
                                        ? Math.ceil((new Date(tender.bid_end_ts).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                        : null;
                                    const isUrgent = daysLeft !== null && daysLeft <= 7;

                                    return (
                                        <div
                                            key={`${tender.id}-${index}`}
                                            className="group w-[280px] md:w-[380px] flex-shrink-0 bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 p-1.5 md:p-2 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(15,23,42,0.1)] md:hover:-translate-y-2 relative snap-center"
                                        >
                                            {/* Top Card Content */}
                                            <div className="bg-[#f8fafc] rounded-[1.3rem] md:rounded-[1.8rem] p-4 md:p-6 h-full flex flex-col">
                                                <div className="flex justify-between items-start mb-4 md:mb-6">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
                                                            <ShieldCheck className="text-green-500 w-2.5 h-2.5 md:w-3 md:h-3" />
                                                            <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-wider">Verified</span>
                                                        </div>
                                                    </div>
                                                    {daysLeft !== null && (
                                                        <div className={`px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider ${isUrgent ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-white text-slate-700 border border-slate-200'
                                                            }`}>
                                                            {daysLeft}d left
                                                        </div>
                                                    )}
                                                </div>

                                                <Link href={`/tender/${tender.id}`} className="block mb-3 md:mb-4">
                                                    <h3 className="text-sm md:text-base font-bold text-[#1e293b] leading-snug line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] group-hover:text-primary transition-colors">
                                                        {tender.title}
                                                    </h3>
                                                </Link>

                                                <div className="space-y-3 md:space-y-4 mt-auto">
                                                    <div className="flex items-center gap-2.5 md:gap-3 text-slate-500">
                                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center border border-slate-100 shrink-0">
                                                            <MapPin className="text-primary w-3 h-3 md:w-[14px] md:h-[14px]" />
                                                        </div>
                                                        <span className="text-[10px] md:text-xs font-bold truncate uppercase tracking-tight">{tender.location}</span>
                                                    </div>

                                                    <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                                                        <div className="flex flex-col">
                                                            <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Tender Value</span>
                                                            <span className="text-xs md:text-[15px] font-black text-primary">
                                                                {tender.tender_value || tender.value || 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/5 rounded-lg md:rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
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
                @media (min-width: 768px) {
                    .animate-scroll-slow {
                        animation: scroll-slow 35s linear infinite;
                    }
                }
                .pause-animation {
                    animation-play-state: paused;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
