'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, RefreshCw, Newspaper } from 'lucide-react';
import { supabase } from '@/services/supabase';
import NewsImage from '@/components/NewsImage';

const CATEGORIES = ['ALL', 'NEWS', 'ARTICLE', 'PRESS RELEASE'];

const getBadgeStyle = (cat: string) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('news')) return { bg: 'bg-[#2b507f]', text: 'text-white' };
    if (c.includes('article')) return { bg: 'bg-[#f48a3d]', text: 'text-white' };
    if (c.includes('press')) return { bg: 'bg-[#b8312f]', text: 'text-white' };
    return { bg: 'bg-primary', text: 'text-white' };
};

export default function NewsListing() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('ALL');

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            let query = supabase
                .from('news')
                .select('id, title, slug, category, content, image_url, created_at')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (activeCategory !== 'ALL') {
                query = query.eq('category', activeCategory);
            }

            const { data } = await query;
            setNews(data || []);
            setLoading(false);
        };
        fetch();
    }, [activeCategory]);

    const featured = news[0];
    const rest = news.slice(1);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ── Hero Banner ── */}
            <div className="relative bg-[#0B2C4A] overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0d3459] via-[#0B2C4A] to-[#071e33]" />
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px]" />
                    <div className="absolute top-10 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />
                    <div className="absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 py-20 md:py-28 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                        <span className="text-yellow-400 text-[10px] font-semibold uppercase tracking-[0.2em]">Market Intelligence</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
                        Tender Insights &<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 italic">Industry News</span>
                    </h1>
                    <p className="text-blue-200/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                        Stay ahead with real-time updates on policy changes, government tenders, and infrastructure investments across India.
                    </p>

                    {/* Category Filter Tabs */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-yellow-400 text-[#0B2C4A] border-yellow-400 shadow-lg shadow-yellow-400/30 scale-105'
                                    : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Wave separator */}
                <div className="relative h-12 -mb-1">
                    <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full" preserveAspectRatio="none">
                        <path d="M0 48L1440 48L1440 0C1200 40 960 48 720 40C480 32 240 0 0 0L0 48Z" fill="#f8fafc" />
                    </svg>
                </div>
            </div>

            {/* ── Content Area ── */}
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <RefreshCw className="animate-spin text-primary" size={40} />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading latest insights...</p>
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <Newspaper className="mx-auto text-slate-200 mb-4" size={64} />
                        <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No Articles Found</h3>
                        <p className="text-slate-400 text-sm mt-2">Check back soon for latest updates.</p>
                    </div>
                ) : (
                    <>
                        {/* ── Featured Article (First Card, BIG) ── */}
                        {featured && activeCategory === 'ALL' && (
                            <Link href={`/news/${featured.slug || featured.id}`} className="group mb-12 grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 block">
                                <div className="relative h-72 lg:h-full overflow-hidden">
                                    <NewsImage
                                        src={featured.image_url}
                                        alt={featured.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute top-6 left-6">
                                        <span className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-lg ${getBadgeStyle(featured.category).bg} ${getBadgeStyle(featured.category).text}`}>
                                            ★ Featured · {featured.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-10 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 text-slate-400 mb-4">
                                        <Calendar size={13} />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">{formatDate(featured.created_at)}</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-4 group-hover:text-primary transition-colors duration-300">
                                        {featured.title}
                                    </h2>
                                    {featured.content && (
                                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-4 mb-6">
                                            {featured.content}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                                        Read Full Article <ArrowRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* ── Results Count ── */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="h-1 w-8 bg-primary rounded-full" />
                                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">
                                    {activeCategory === 'ALL' ? 'All Stories' : activeCategory}
                                </h2>
                                <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                    {activeCategory === 'ALL' ? rest.length : news.length} articles
                                </span>
                            </div>
                        </div>

                        {/* ── Cards Grid ── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {(activeCategory === 'ALL' ? rest : news).map(item => {
                                const { bg, text } = getBadgeStyle(item.category);
                                return (
                                    <Link
                                        key={item.id}
                                        href={`/news/${item.slug || item.id}`}
                                        className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col"
                                    >
                                        {/* Image */}
                                        <div className="relative h-52 overflow-hidden">
                                            <NewsImage
                                                src={item.image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            {/* Category Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-md ${bg} ${text}`}>
                                                    {item.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-1.5 text-slate-400 mb-3">
                                                <Calendar size={12} />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">{formatDate(item.created_at)}</span>
                                            </div>
                                            <h3 className="text-base font-black text-slate-800 leading-snug mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2 flex-1">
                                                {item.title}
                                            </h3>
                                            {item.content && (
                                                <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed mb-4">
                                                    {item.content}
                                                </p>
                                            )}
                                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Read Article</span>
                                                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                                    <ArrowRight size={13} strokeWidth={3} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
