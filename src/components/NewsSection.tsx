'use client';

import Link from 'next/link';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

const news = [
    {
        id: 1,
        title: 'Ministry of Road Transport announces new highway projects worth 5000 Cr',
        category: 'Infrastructure',
        date: '10 Feb 2026',
        image: 'https://images.unsplash.com/photo-1590348697171-27b0ec358481?q=80&w=2075&auto=format&fit=crop'
    },
    {
        id: 2,
        title: 'Changes in e-Procurement policies for MSMEs starting April 2026',
        category: 'Policy',
        date: '08 Feb 2026',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 3,
        title: 'Upcoming smart city tenders in Uttar Pradesh and Madhya Pradesh',
        category: 'Urban',
        date: '05 Feb 2026',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop'
    },
];

export default function NewsSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-soft-blue rounded-full blur-[120px] -mr-32 -mt-32 opacity-50" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
                    <div className="text-center md:text-left space-y-3">
                        <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10 mb-2">
                            <BookOpen size={14} className="text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Market Intelligence</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-[#103e68] tracking-tighter leading-none">
                            Tender <span className="text-tj-yellow font-black">Insights</span>
                        </h2>
                        <p className="text-slate-500 text-lg font-medium max-w-xl">
                            Stay ahead with the latest industry moves, policy changes, and procurement trends.
                        </p>
                    </div>
                    <Link href="/news" className="group h-12 px-8 bg-white border-2 border-[#f1f5f9] text-[#103e68] font-black text-xs uppercase tracking-widest flex items-center gap-3 rounded-2xl hover:bg-[#103e68] hover:text-white hover:border-[#103e68] transition-all shadow-sm">
                        View All Stories
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {news.map((item) => (
                        <Link
                            href={`/news/${item.id}`}
                            key={item.id}
                            className="group flex flex-col bg-white rounded-[32px] overflow-hidden border border-[#e2e8f0]/60 hover:shadow-[0_40px_80px_-20px_rgba(16,62,104,0.15)] transition-all duration-500 h-full"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-2 bg-white/95 backdrop-blur-md rounded-xl text-[10px] font-black text-[#103e68] uppercase tracking-widest shadow-lg shadow-black/5">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 md:p-10 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-[#94a3b8] mb-6">
                                    <Calendar size={15} strokeWidth={2.5} />
                                    <span className="text-[11px] font-black uppercase tracking-widest pt-0.5">{item.date}</span>
                                </div>

                                <h3 className="text-[22px] font-black text-[#103e68] leading-[1.3] mb-8 group-hover:text-primary transition-colors flex-1 line-clamp-3 tracking-tight">
                                    {item.title}
                                </h3>

                                <div className="pt-8 border-t border-[#f1f5f9] flex items-center justify-between">
                                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em] group-hover:text-[#103e68]">
                                        Read Article
                                    </span>
                                    <div className="w-10 h-10 rounded-xl bg-[#f8fafc] text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <ArrowRight size={20} />
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
