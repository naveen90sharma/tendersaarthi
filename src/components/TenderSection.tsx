'use client';

import Link from 'next/link';
import { useLatestTenders } from '../hooks/useTenders';
import { RefreshCw, MapPin, Building2, Calendar, ArrowRight, TrendingUp, Clock } from 'lucide-react';

export default function TenderSection({ title }: { title: string }) {
    const { tenders, loading } = useLatestTenders(8); // Fetch more tenders for scrolling

    // Duplicate tenders for infinite scroll effect
    const duplicatedTenders = [...tenders, ...tenders, ...tenders];

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-800 mb-2">{title}</h2>
                        <p className="text-gray-500 text-sm">Explore opportunities matching your business profile</p>
                    </div>
                    <Link
                        href="/active-tenders"
                        className="group hidden md:flex items-center gap-2 text-tj-blue font-extrabold hover:gap-3 transition-all uppercase text-sm tracking-tight"
                    >
                        View All Tenders
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <RefreshCw className="animate-spin text-tj-blue mx-auto mb-3" size={40} />
                            <p className="text-gray-500 text-sm font-medium">Loading tenders...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Auto-scrolling container */}
                        <div className="relative">
                            {/* Gradient overlays for fade effect */}
                            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                            {/* Scrolling wrapper */}
                            <div className="overflow-hidden">
                                <div className="flex gap-6 animate-scroll-slow hover:pause-animation">
                                    {duplicatedTenders.map((tender, index) => {
                                        // Calculate days left
                                        const daysLeft = tender.bid_end_ts
                                            ? Math.ceil((new Date(tender.bid_end_ts).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                            : null;
                                        const isUrgent = daysLeft && daysLeft <= 7;

                                        return (
                                            <div
                                                key={`${tender.id}-${index}`}
                                                className="group bg-white rounded-2xl border-2 border-gray-100 hover:border-tj-blue/30 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col flex-shrink-0 w-[320px]"
                                            >
                                                {/* Header with gradient */}
                                                <div className="bg-gradient-to-br from-[#f0f7ff] to-[#e6f0ff] p-4 border-b border-blue-100">
                                                    <div className="flex items-start justify-between gap-2 mb-3">
                                                        <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm text-tj-blue text-[10px] font-black px-2.5 py-1.5 rounded-lg border border-blue-200 shadow-sm uppercase">
                                                            <Building2 size={11} />
                                                            <span className="truncate max-w-[100px]">
                                                                {tender.authority || tender.organisation_chain?.split('||')[0] || 'Government'}
                                                            </span>
                                                        </span>

                                                        {daysLeft !== null && (
                                                            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1.5 rounded-lg uppercase ${isUrgent
                                                                ? 'bg-red-100 text-red-700 border border-red-200'
                                                                : 'bg-green-100 text-green-700 border border-green-200'
                                                                }`}>
                                                                <Clock size={11} />
                                                                {daysLeft}d left
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Title */}
                                                    <Link
                                                        href={`/tender/${tender.id}`}
                                                        className="block font-extrabold text-gray-800 group-hover:text-tj-blue text-sm leading-tight line-clamp-2 min-h-[40px] transition-colors"
                                                    >
                                                        {tender.title}
                                                    </Link>
                                                </div>

                                                {/* Body */}
                                                <div className="p-4 flex-grow">
                                                    {/* Location */}
                                                    <div className="flex items-center gap-2 mb-4 text-gray-600">
                                                        <MapPin size={14} className="text-tj-blue shrink-0" />
                                                        <span className="text-xs font-bold truncate text-[#475569]">{tender.location}</span>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="space-y-2.5">
                                                        <div className="flex justify-between items-center pb-2.5 border-b border-gray-100">
                                                            <span className="text-[10px] text-gray-400 font-bold uppercase">Tender Value</span>
                                                            <span className="text-sm font-black text-tj-blue">
                                                                {tender.tender_value || tender.value || 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[10px] text-gray-400 font-bold uppercase">Closing Date</span>
                                                            <span className="text-xs font-black text-[#dc2626]">
                                                                {tender.bid_submission_end || tender.endDate || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Footer Button */}
                                                <div className="p-4 pt-0">
                                                    <Link
                                                        href={`/tender/${tender.id}`}
                                                        className="block w-full text-center bg-tj-blue text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md hover:brightness-110 group-hover:scale-[1.02]"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Mobile View All Button */}
                        <div className="mt-8 text-center">
                            <Link
                                href="/active-tenders"
                                className="inline-flex items-center gap-2 bg-tj-blue text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
                            >
                                View All Tenders
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                @keyframes scroll-slow {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(calc(-320px * ${tenders.length} - ${tenders.length * 24}px));
                    }
                }

                .animate-scroll-slow {
                    animation: scroll-slow 40s linear infinite;
                }

                .pause-animation {
                    animation-play-state: paused;
                }

                .hover\\:pause-animation:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
