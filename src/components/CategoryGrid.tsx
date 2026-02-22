'use client';

import Link from 'next/link';
import { Briefcase, Laptop, Heart, Truck, GraduationCap, Wrench, ShoppingBag, Zap, ArrowUpRight } from 'lucide-react';

export default function CategoryGrid() {
    const categories = [
        { name: 'Infrastructure & Civil', icon: Briefcase, count: '2,500+', color: 'text-blue-600', bg: 'bg-blue-50', slug: 'infrastructure' },
        { name: 'Technology & IT', icon: Laptop, count: '1,200+', color: 'text-purple-600', bg: 'bg-purple-50', slug: 'technology-it' },
        { name: 'Healthcare & Biotech', icon: Heart, count: '800+', color: 'text-red-500', bg: 'bg-red-50', slug: 'healthcare' },
        { name: 'Logistics & Supply', icon: Truck, count: '950+', color: 'text-emerald-600', bg: 'bg-emerald-50', slug: 'logistics' },
        { name: 'Education Systems', icon: GraduationCap, count: '600+', color: 'text-amber-600', bg: 'bg-amber-50', slug: 'education' },
        { name: 'Industrial Engg.', icon: Wrench, count: '1,100+', color: 'text-orange-600', bg: 'bg-orange-50', slug: 'industrial' },
        { name: 'Defense & Aerospace', icon: Zap, count: '700+', color: 'text-indigo-600', bg: 'bg-indigo-50', slug: 'defense' },
        { name: 'Global Sourcing', icon: ShoppingBag, count: '900+', color: 'text-rose-500', bg: 'bg-rose-50', slug: 'sourcing' },
    ];

    return (
        <section className="py-10 md:py-16 bg-[#F8FAFC]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="h-0.5 w-8 bg-primary rounded-full" />
                            <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">Industry Mapping</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] tracking-tight">Explore by Category</h2>
                        <p className="text-xs text-slate-400 mt-0.5">AI-powered classification for precision matching</p>
                    </div>

                    <Link
                        href="/active-tenders"
                        className="flex items-center gap-2 bg-white hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-lg font-semibold text-xs tracking-wide transition-all border border-slate-200 shadow-sm whitespace-nowrap"
                    >
                        View All
                        <ArrowUpRight size={13} />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            href={`/active-tenders?category=${encodeURIComponent(category.name)}`}
                            className="group bg-white rounded-xl p-4 border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center"
                        >
                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${category.bg} ${category.color} mb-3 group-hover:scale-105 transition-transform duration-200`}>
                                <category.icon className="w-5 h-5" strokeWidth={1.5} />
                            </div>

                            {/* Name */}
                            <h3 className="text-[13px] font-semibold text-[#0B2C4A] leading-tight mb-1.5 line-clamp-2">
                                {category.name}
                            </h3>

                            {/* Count */}
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[10px] font-medium text-slate-400">{category.count} live</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
