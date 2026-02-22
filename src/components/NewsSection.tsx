'use client';

import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

const news = [
    {
        id: 1,
        title: 'NHAI invites bids for 8-lane expressway connecting Delhi-Jaipur with 12,000 Cr investment',
        category: 'Infrastructure',
        date: '18 Feb 2026',
        image: 'https://images.unsplash.com/photo-1590348697171-27b0ec358481?q=80&w=2075&auto=format&fit=crop'
    },
    {
        id: 2,
        title: 'Smart City Mission 2.0: 45 new urban transformation projects launched in South India',
        category: 'Urban',
        date: '17 Feb 2026',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 3,
        title: 'Rail Land Development Authority (RLDA) announces major station redevelopment tenders',
        category: 'Railways',
        date: '15 Feb 2026',
        image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 4,
        title: 'New Jal Jeevan Mission tenders worth 3,500 Cr released for rural water connectivity',
        category: 'Utilities',
        date: '14 Feb 2026',
        image: 'https://images.unsplash.com/photo-1541888941255-ed8136451be6?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 5,
        title: 'UP Government clears Land Acquisition for upcoming Noida International Airport Phase 2',
        category: 'Aviation',
        date: '12 Feb 2026',
        image: 'https://images.unsplash.com/photo-1517054415305-162256af7ec2?q=80&w=2070&auto=format&fit=crop'
    },
];

export default function NewsSection() {
    return (
        <section className="py-14 md:py-20 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="h-0.5 w-8 bg-primary rounded-full" />
                            <span className="text-[9px] font-semibold text-primary uppercase tracking-[0.25em]">Market Intelligence</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Tender Insights</h2>
                        <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider mt-0.5">
                            Latest policy changes and industry movements
                        </p>
                    </div>

                    <Link
                        href="/news"
                        className="group flex items-center gap-2 text-primary hover:text-white hover:bg-primary border border-slate-200 hover:border-primary px-4 py-2 rounded-lg font-medium text-xs transition-all w-fit"
                    >
                        View All Stories
                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {/* News Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {news.map((item) => (
                        <Link
                            href={`/news/${item.id}`}
                            key={item.id}
                            className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all duration-300 h-full"
                        >
                            {/* Image */}
                            <div className="relative h-40 overflow-hidden bg-slate-100 shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1454165833762-02617a92b219?q=80&w=2070&auto=format&fit=crop';
                                    }}
                                />
                                {/* Category badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="px-2 py-0.5 bg-white/95 backdrop-blur-sm rounded-md text-[9px] font-semibold text-primary uppercase tracking-wider shadow-sm">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                                    <Calendar size={11} strokeWidth={2} />
                                    <span className="text-[9px] font-medium uppercase tracking-wider">{item.date}</span>
                                </div>

                                <h3 className="text-sm font-semibold text-slate-700 leading-snug mb-3 group-hover:text-primary transition-colors flex-1 line-clamp-3">
                                    {item.title}
                                </h3>

                                <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-[9px] font-semibold text-primary uppercase tracking-wider">Read Article</span>
                                    <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                        <ArrowRight size={11} strokeWidth={2} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
