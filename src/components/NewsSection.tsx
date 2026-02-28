'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw, Newspaper } from 'lucide-react';
import NewsCard from './NewsCard';
import { supabase } from '@/services/supabase';

export default function NewsSection() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('news')
                    .select('id, title, slug, category, content, image_url, created_at')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (error) throw error;
                setNews(data || []);
            } catch (err) {
                console.error('Error fetching news:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
        <section className="py-20 bg-slate-50/50 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-1 w-10 bg-primary rounded-full" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Market Intelligence</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tender Insights</h2>
                        <p className="text-slate-500 text-xs font-medium max-w-lg mt-2">
                            Stay updated with the latest policy changes, large-scale infrastructure investments, and industry movements across the nation.
                        </p>
                    </div>

                    <Link
                        href="/news"
                        className="group flex items-center gap-2.5 bg-white text-slate-800 hover:text-white hover:bg-primary border border-slate-200 hover:border-primary px-6 py-3 rounded-full font-bold text-xs transition-all duration-300 shadow-sm hover:shadow-md w-fit"
                    >
                        View All Stories
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* News Cards Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <RefreshCw className="animate-spin text-primary" size={32} />
                    </div>
                ) : news.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {news.map((item) => (
                            <Link
                                href={`/news/${item.slug || item.id}`}
                                key={item.id}
                                className="block h-full"
                            >
                                <NewsCard
                                    title={item.title}
                                    category={item.category}
                                    date={new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    image={item.image_url}
                                    description={item.content} // Using content as description reveal
                                />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <Newspaper className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-slate-700">No News Available</h3>
                        <p className="text-sm text-slate-500">Check back later for latest tender insights.</p>
                    </div>
                )}
            </div>
        </section>
    );
}


