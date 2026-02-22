'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useLatestTenders } from '../hooks/useTenders';
import { MapPin, Building2, ArrowRight, Clock, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TenderSection({ title }: { title: string }) {
    const { tenders, loading } = useLatestTenders(8);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -320 : 320,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-10 md:py-16 bg-white overflow-hidden relative">
            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="h-0.5 w-8 bg-primary rounded-full" />
                            <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">Verified Opportunities</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] tracking-tight">{title}</h2>
                        <p className="text-xs text-slate-400 mt-1">Updated every 60 minutes</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                        <Link
                            href="/active-tenders"
                            className="flex items-center gap-2 bg-primary/5 hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-lg font-semibold transition-all text-xs tracking-wide border border-primary/10"
                        >
                            Explore All
                            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Cards */}
                {loading ? (
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-[280px] h-[280px] shrink-0 bg-slate-50 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div
                        ref={scrollContainerRef}
                        className="overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
                    >
                        <div className="flex gap-4 w-max">
                            {tenders.map((tender, index) => {
                                const daysLeft = tender.bid_end_ts
                                    ? Math.ceil((new Date(tender.bid_end_ts).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                    : null;
                                const isUrgent = daysLeft !== null && daysLeft <= 5;

                                const aiTags = ['High Success Rate', 'Limited Competition', 'MSME Eligible', 'Top Tier Authority'];
                                const randomTag = aiTags[Math.floor((tender.id.length + index) % aiTags.length)];

                                return (
                                    <div
                                        key={`${tender.id}-${index}`}
                                        className="group w-[260px] sm:w-[290px] shrink-0 bg-white rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300 snap-center flex flex-col overflow-hidden"
                                    >
                                        {/* Card Top */}
                                        <div className="p-4 flex-1 flex flex-col">
                                            {/* Top row: AI Tag + Verified */}
                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[9px] font-semibold uppercase tracking-wide">
                                                    <span className="w-1 h-1 bg-primary rounded-full" />
                                                    {randomTag}
                                                </span>
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-white rounded-full shadow-sm border border-slate-100 shrink-0">
                                                    <ShieldCheck size={9} className="text-green-500" />
                                                    <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wide">Verified</span>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <Link href={`/tenders/${tender.slug || tender.id}`} className="block mb-3">
                                                <h3 className="text-sm font-semibold text-[#0B2C4A] leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                                                    {tender.title}
                                                </h3>
                                            </Link>

                                            {/* Meta */}
                                            <div className="space-y-1.5 mt-auto">
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <MapPin size={11} strokeWidth={2} className="text-primary/50 shrink-0" />
                                                    <span className="truncate font-medium text-slate-500">{tender.location || 'Pan India'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Building2 size={11} strokeWidth={2} className="text-primary/50 shrink-0" />
                                                    <span className="truncate font-medium text-slate-500">{tender.authority_name || 'Govt Department'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Bottom: Value + CTA */}
                                        <div className="bg-[#0B2C4A] p-3 relative overflow-hidden">
                                            {/* Progress strip */}
                                            <div className="absolute top-0 left-0 h-[2px] bg-yellow-400/20 w-full" />
                                            <div
                                                className={`absolute top-0 left-0 h-[2px] bg-yellow-400 transition-all ${isUrgent ? 'animate-pulse' : ''}`}
                                                style={{ width: `${Math.max(10, 100 - (daysLeft || 0) * 5)}%` }}
                                            />

                                            <div className="flex items-center justify-between gap-2 relative z-10">
                                                <div>
                                                    <span className="text-[8px] font-semibold text-blue-200/40 uppercase tracking-widest block mb-0.5">Est. Value</span>
                                                    <div className="text-sm font-bold text-white leading-none">
                                                        {tender.tender_value || tender.value || '—'}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {daysLeft !== null && (
                                                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 text-[9px] font-semibold ${isUrgent ? 'text-yellow-400' : 'text-white/60'}`}>
                                                            <Clock size={8} className={isUrgent ? 'animate-pulse' : ''} />
                                                            {daysLeft}d
                                                        </div>
                                                    )}
                                                    <Link
                                                        href={`/tenders/${tender.slug || tender.id}`}
                                                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary hover:scale-110 active:scale-95 transition-all shadow-lg"
                                                    >
                                                        <ArrowRight size={14} strokeWidth={2.5} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
}
