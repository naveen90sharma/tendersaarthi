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
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-1 w-12 bg-primary rounded-full" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Market Intelligence</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tighter leading-none">Tender Insights</h2>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Stay ahead with the latest industry moves and policy changes</p>
                    </div>
                    <Link href="/news" className="group text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:underline underline-offset-8 transition-all">
                        View All Stories
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {news.map((item) => (
                        <Link href={`/news/${item.id}`} key={item.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition-all duration-500">
                            <div className="relative h-60 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-slate-400 mb-4">
                                    <Calendar size={14} />
                                    <span className="text-[11px] font-bold uppercase tracking-widest">{item.date}</span>
                                </div>
                                <h3 className="text-xl font-black text-[#1e293b] leading-tight mb-6 group-hover:text-primary transition-colors flex-1 line-clamp-3">
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-2 text-primary text-[11px] font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                                    Read Article
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
