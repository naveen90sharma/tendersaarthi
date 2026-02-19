'use client';

import Link from 'next/link';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

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
        <section className="py-24 md:py-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-1 w-12 bg-primary rounded-full" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Market Intelligence</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-[#0f172a] tracking-tight mb-2">Tender Insights</h2>
                        <p className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-wider">LATEST POLICY CHANGES AND INDUSTRY MOVEMENTS</p>
                    </div>

                    <Link href="/news" className="group flex items-center gap-3 bg-white hover:bg-primary text-primary hover:text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all duration-500 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-primary/20 w-fit">
                        View All Stories
                        <ArrowRight size={18} className="group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {news.map((item) => (
                        <Link
                            href={`/news/${item.id}`}
                            key={item.id}
                            className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-primary/20 hover:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.1)] transition-all duration-500 h-full"
                        >
                            <div className="relative h-64 overflow-hidden bg-slate-100">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1454165833762-02617a92b219?q=80&w=2070&auto=format&fit=crop';
                                    }}
                                />
                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-2 bg-white ring-1 ring-slate-200 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest shadow-xl">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 md:p-10 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-slate-400 mb-6">
                                    <Calendar size={14} strokeWidth={2.5} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{item.date}</span>
                                </div>

                                <h3 className="text-xl md:text-2xl font-black text-[#0f172a] leading-tight mb-8 group-hover:text-primary transition-colors flex-1 line-clamp-3">
                                    {item.title}
                                </h3>

                                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">
                                        Read Full Article
                                    </span>
                                    <div className="w-11 h-11 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-lg">
                                        <ArrowRight size={20} strokeWidth={3} />
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
