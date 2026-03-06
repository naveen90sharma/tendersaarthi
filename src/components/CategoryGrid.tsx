'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { useEffect, useState } from 'react';

// Helper to get fallback images if URL is missing
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400&h=400';

export default function CategoryGrid() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const { data, error } = await supabase
                    .from('tender_categories')
                    .select('name, slug, image_url, status')
                    .eq('status', true)
                    .order('name')
                    .limit(12);

                if (!error && data) setCategories(data);
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -350 : 350,
                behavior: 'smooth'
            });
        }
    };

    if (!loading && categories.length === 0) return null;

    return (
        <section className={`py-10 md:py-16 bg-white overflow-hidden relative border-t border-slate-50 ${loading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-500`}>
            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="h-0.5 w-8 bg-[#103E68] rounded-full" />
                            <span className="text-[10px] font-semibold text-[#103E68] uppercase tracking-widest">Industry Mapping</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] tracking-tight">Explore by Category</h2>
                        <p className="text-xs text-slate-400 mt-1">AI-powered classification for precision matching</p>
                    </div>

                    {!loading && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => scroll('left')}
                                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#103E68] hover:border-[#103E68] transition-all shadow-sm"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#103E68] hover:border-[#103E68] transition-all shadow-sm"
                            >
                                <ChevronRight size={20} />
                            </button>
                            <Link
                                href="/active-tenders"
                                className="flex items-center gap-2 bg-[#103E68]/5 hover:bg-[#103E68] text-[#103E68] hover:text-white px-5 py-2.5 rounded-xl font-bold transition-all text-xs tracking-wide border border-[#103E68]/10 ml-2"
                            >
                                View All Sectors
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Horizontal Scroll Area */}
                <div
                    ref={scrollContainerRef}
                    className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-5 pb-6"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="w-[280px] md:w-[320px] h-64 shrink-0 bg-slate-50 animate-pulse rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                                <div className="h-4 bg-slate-100 w-1/2 rounded" />
                            </div>
                        ))
                    ) : (
                        categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/tenders/category/${category.slug}`}
                                className="group relative w-[280px] md:w-[320px] h-64 shrink-0 rounded-[2rem] overflow-hidden snap-center transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-1"
                            >
                                {/* Background Image */}
                                <img
                                    src={category.image_url || FALLBACK_IMAGE}
                                    alt={category.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

                                {/* Content Layer */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-tj-yellow animate-pulse" />
                                        <span className="text-[9px] font-black text-tj-yellow uppercase tracking-widest">Active Market</span>
                                    </div>
                                    <h3 className="text-xl font-black text-white leading-tight">
                                        {category.name}
                                    </h3>
                                    <div className="h-0.5 w-0 group-hover:w-full bg-tj-yellow transition-all duration-500 mt-2" />
                                </div>

                                {/* Floating Icon */}
                                <div className="absolute top-5 right-5 w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                                    <ArrowRight size={20} />
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
