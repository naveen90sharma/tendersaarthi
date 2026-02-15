'use client';

import Link from 'next/link';
import { Briefcase, Laptop, Heart, Truck, GraduationCap, Wrench, ShoppingBag, Zap, ArrowUpRight } from 'lucide-react';

export default function CategoryGrid() {
    const categories = [
        { name: 'Construction & Infrastructure', icon: Briefcase, count: '2,500+', color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'IT & Software Solutions', icon: Laptop, count: '1,200+', color: 'text-purple-600', bg: 'bg-purple-50' },
        { name: 'Healthcare & Medical', icon: Heart, count: '800+', color: 'text-red-600', bg: 'bg-red-50' },
        { name: 'Logistics & Transport', icon: Truck, count: '950+', color: 'text-green-600', bg: 'bg-green-50' },
        { name: 'Education & Training', icon: GraduationCap, count: '600+', color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { name: 'Mechanical & Engineering', icon: Wrench, count: '1,100+', color: 'text-orange-600', bg: 'bg-orange-50' },
        { name: 'General Procurement', icon: ShoppingBag, count: '900+', color: 'text-pink-600', bg: 'bg-pink-50' },
        { name: 'Energy & Renewables', icon: Zap, count: '700+', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    return (
        <section className="py-12 md:py-24 bg-[#f8fafc]">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mb-8 md:mb-16 space-y-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <div className="h-1 w-12 bg-primary rounded-full" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Sectoral Catalog</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-[#1e293b] tracking-tighter leading-tight md:leading-none">Browse by Core Categories</h2>
                    <p className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-wider">Targeted opportunities specialized by industry excellence</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            href={`/active-tenders?category=${encodeURIComponent(category.name)}`}
                            className="group relative bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 border border-slate-100 hover:border-primary/20 hover:shadow-[0_30px_60px_rgba(15,23,42,0.1)] transition-all duration-500 overflow-hidden"
                        >
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className={`inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${category.bg} ${category.color} mb-4 md:mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                        <category.icon className="w-5 h-5 md:w-7 md:h-7" strokeWidth={2.5} />
                                    </div>
                                    <h3 className="font-extrabold text-[#1e293b] text-lg mb-2 group-hover:text-primary transition-colors leading-tight">
                                        {category.name}
                                    </h3>
                                    <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]">{category.count} Listings</p>
                                </div>

                                <div className="mt-8 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Explore</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                                        <ArrowUpRight size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Background Icon */}
                            <category.icon size={120} className={`absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 -rotate-12 ${category.color}`} />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
