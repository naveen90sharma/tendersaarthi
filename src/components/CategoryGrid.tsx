'use client';

import Link from 'next/link';
import { Briefcase, Laptop, Heart, Truck, GraduationCap, Wrench, ShoppingBag, Zap, ArrowUpRight } from 'lucide-react';

export default function CategoryGrid() {
    const categories = [
        { name: 'Infrastructure & Civil', icon: Briefcase, count: '2,500+', color: 'text-blue-600', hue: 'blue' },
        { name: 'Technology & IT', icon: Laptop, count: '1,200+', color: 'text-purple-600', hue: 'purple' },
        { name: 'Healthcare & Biotech', icon: Heart, count: '800+', color: 'text-red-600', hue: 'red' },
        { name: 'Logistics & Supply', icon: Truck, count: '950+', color: 'text-emerald-600', hue: 'emerald' },
        { name: 'Education Systems', icon: GraduationCap, count: '600+', color: 'text-amber-600', hue: 'amber' },
        { name: 'Industrial Engg.', icon: Wrench, count: '1,100+', color: 'text-orange-600', hue: 'orange' },
        { name: 'Defense & Aerospace', icon: Zap, count: '700+', color: 'text-indigo-600', hue: 'indigo' },
        { name: 'Global Sourcing', icon: ShoppingBag, count: '900+', color: 'text-rose-600', hue: 'rose' },
    ];

    return (
        <section className="py-20 md:py-32 bg-[#F8FAFC] relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8 mb-12 md:mb-16">
                    <div className="max-w-2xl text-left">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-1 w-12 bg-primary rounded-full" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Industry Mapping</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-[#0f172a] tracking-tight mb-2">Explore by Category</h2>
                        <p className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-wider">AI-POWERED CLASSIFICATION FOR PRECISION MATCHING</p>
                    </div>

                    <Link href="/active-tenders" className="group flex items-center gap-3 bg-white hover:bg-primary text-primary hover:text-white px-6 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all duration-300 border border-slate-200 shadow-sm w-fit">
                        View All Categories
                        <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            href={`/active-tenders?category=${encodeURIComponent(category.name)}`}
                            className="group relative bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 border border-slate-100 hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-[0_30px_60px_rgba(15,23,42,0.08)] flex flex-col items-center text-center"
                        >
                            {/* Accent Glow */}
                            <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none
                                ${category.hue === 'blue' ? 'bg-blue-600' : ''}
                                ${category.hue === 'purple' ? 'bg-purple-600' : ''}
                                ${category.hue === 'red' ? 'bg-red-600' : ''}
                                ${category.hue === 'emerald' ? 'bg-emerald-600' : ''}
                                ${category.hue === 'amber' ? 'bg-amber-600' : ''}
                                ${category.hue === 'orange' ? 'bg-orange-600' : ''}
                                ${category.hue === 'indigo' ? 'bg-indigo-600' : ''}
                                ${category.hue === 'rose' ? 'bg-rose-600' : ''}
                            `} />

                            <div className={`inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-slate-50 ${category.color} mb-3 md:mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-inner`}>
                                <category.icon className="w-6 h-6 md:w-10 md:h-10" strokeWidth={1.2} />
                            </div>

                            <h3 className="text-[13px] md:text-xl font-black text-[#0B2C4A] leading-tight mb-1 md:mb-2 line-clamp-1">
                                {category.name}
                            </h3>

                            <div className="flex items-center gap-1.5 mb-4 md:mb-6">
                                <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{category.count} LIVE</span>
                            </div>

                            <div className="mt-auto hidden md:flex pt-4 w-full justify-center">
                                <div className="text-[11px] font-black text-primary opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest flex items-center gap-2">
                                    Explore Sector <ArrowUpRight size={14} strokeWidth={3} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
