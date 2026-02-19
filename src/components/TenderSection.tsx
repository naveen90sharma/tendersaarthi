'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useLatestTenders } from '../hooks/useTenders';
import { RefreshCw, MapPin, Building2, ArrowRight, Clock, Wallet, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TenderSection({ title }: { title: string }) {
    const { tenders, loading } = useLatestTenders(8);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400; // Approximate card width + gap
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

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
                    <div className="flex items-center gap-3">
                        {/* Desktop Navigation Buttons */}
                        <div className="hidden md:flex items-center gap-2 mr-4">
                            <button
                                onClick={() => scroll('left')}
                                className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:shadow-lg transition-all"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:shadow-lg transition-all"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                        <Link
                            href="/active-tenders"
                            className="group flex items-center gap-3 bg-primary/5 hover:bg-primary text-primary hover:text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-black transition-all duration-300 uppercase text-[10px] md:text-[12px] tracking-widest border border-primary/10"
                        >
                            Explore All
                            <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px] group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="flex gap-4 md:gap-8 overflow-hidden py-10">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-[300px] md:w-[400px] h-[450px] shrink-0 bg-slate-50 animate-pulse rounded-[2.5rem]" />
                        ))}
                    </div>
                ) : (
                    <div className="relative">
                        {/* Custom Navigation (Desktop) */}
                        <div className="absolute top-1/2 -left-6 -translate-y-1/2 z-30 hidden xl:block">
                            <button onClick={() => scroll('left')} className="w-14 h-14 rounded-full bg-white shadow-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all -translate-x-4 group">
                                <ChevronLeft size={28} strokeWidth={3} className="group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                        <div className="absolute top-1/2 -right-6 -translate-y-1/2 z-30 hidden xl:block">
                            <button onClick={() => scroll('right')} className="w-14 h-14 rounded-full bg-white shadow-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all translate-x-4 group">
                                <ChevronRight size={28} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>

                        {/* Scrolling Wrapper */}
                        <div
                            ref={scrollContainerRef}
                            className="overflow-x-auto py-6 md:py-12 scrollbar-hide snap-x snap-mandatory"
                        >
                            <div className="flex gap-6 md:gap-10 w-max px-4">
                                {tenders.map((tender, index) => {
                                    const daysLeft = tender.bid_end_ts
                                        ? Math.ceil((new Date(tender.bid_end_ts).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                        : null;
                                    const isUrgent = daysLeft !== null && daysLeft <= 5;

                                    // Simulated AI Sentiment tags
                                    const aiTags = ['High Success Rate', 'Limited Competition', 'MSME Eligible', 'Top Tier Authority'];
                                    const randomTag = aiTags[Math.floor((tender.id.length + index) % aiTags.length)];

                                    return (
                                        <div
                                            key={`${tender.id}-${index}`}
                                            className="group w-[280px] sm:w-[320px] md:w-[420px] shrink-0 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-3 md:p-4 transition-all duration-700 hover:shadow-[0_40px_100_rgba(15,23,42,0.12)] hover:-translate-y-3 snap-center relative"
                                        >
                                            {/* Verified Badge - Repositioned for mobile */}
                                            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
                                                <div className={`flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 bg-white rounded-full shadow-sm border border-slate-100 group-hover:border-tj-yellow transition-colors`}>
                                                    <ShieldCheck size={10} className="text-green-500 md:w-3 md:h-3" />
                                                    <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Verified</span>
                                                </div>
                                            </div>

                                            <div className="h-full flex flex-col pt-6 md:pt-10">
                                                {/* Header AI Intel */}
                                                <div className="px-2 md:px-5 mb-4 md:mb-6">
                                                    <div className="inline-flex items-center gap-2 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-3 md:mb-4 max-w-[180px] md:max-w-none">
                                                        <RefreshCw size={8} className="animate-spin-slow md:w-2.5 md:h-2.5" />
                                                        <span className="truncate">AI Prediction: {randomTag}</span>
                                                    </div>

                                                    <Link href={`/tender/${tender.id}`} className="block">
                                                        <h3 className="text-[15px] md:text-2xl font-black text-[#0B2C4A] leading-tight tracking-tight line-clamp-3 min-h-[3.8rem] md:min-h-[4rem] group-hover:text-primary transition-colors">
                                                            {tender.title}
                                                        </h3>
                                                    </Link>
                                                </div>

                                                <div className="px-2 md:px-5 space-y-3 md:space-y-4">
                                                    <div className="flex items-center gap-2 md:gap-3 text-slate-400">
                                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center text-primary shadow-inner">
                                                            <MapPin size={16} strokeWidth={2.5} />
                                                        </div>
                                                        <span className="text-[11px] md:text-sm font-bold uppercase tracking-tight truncate">{tender.location || 'Pan India'}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 md:gap-3 text-slate-400">
                                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center text-primary shadow-inner">
                                                            <Building2 size={16} strokeWidth={2.5} />
                                                        </div>
                                                        <span className="text-[11px] md:text-sm font-bold uppercase tracking-tight truncate max-w-[180px] md:max-w-[200px]">{tender.authority_name || 'Govt Department'}</span>
                                                    </div>
                                                </div>

                                                {/* Timeline & Value - Premium Block */}
                                                <div className="mt-auto px-0.5 md:px-1 pt-8 md:pt-10">
                                                    <div className="bg-[#0B2C4A] rounded-[1.8rem] md:rounded-[2rem] p-4 md:p-6 text-white relative overflow-hidden group-hover:shadow-2xl transition-all duration-700">
                                                        {/* Visual Progress Bar Overlay */}
                                                        <div className="absolute top-0 left-0 h-1 bg-tj-yellow/20 w-full" />
                                                        <div className={`absolute top-0 left-0 h-1 bg-tj-yellow transition-all duration-1000 ${isUrgent ? 'animate-pulse' : ''}`} style={{ width: `${Math.max(10, 100 - (daysLeft || 0) * 5)}%` }} />

                                                        <div className="flex justify-between items-end gap-2 md:gap-4 relative z-10">
                                                            <div className="space-y-1">
                                                                <span className="text-[8px] md:text-[9px] font-black text-blue-100/40 uppercase tracking-[0.2em]">Estimated Value</span>
                                                                <div className="text-lg md:text-2xl font-black text-white tabular-nums tracking-tight">
                                                                    {tender.tender_value || tender.value || 'Reserved'}
                                                                </div>
                                                            </div>

                                                            <div className="text-right flex flex-col items-end gap-1.5">
                                                                <div className="flex items-center gap-1 md:gap-1.5 px-2 py-0.5 rounded-md bg-white/10 border border-white/5 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-0.5 md:mb-1">
                                                                    <Clock size={10} className={isUrgent ? 'text-tj-yellow animate-pulse' : ''} />
                                                                    {daysLeft ? `${daysLeft} Days` : 'Closing Soon'}
                                                                </div>
                                                                <Link
                                                                    href={`/tender/${tender.id}`}
                                                                    className="w-9 h-9 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-primary hover:scale-110 active:scale-95 transition-all shadow-xl"
                                                                >
                                                                    <ArrowRight size={20} strokeWidth={3} />
                                                                </Link>
                                                            </div>
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
