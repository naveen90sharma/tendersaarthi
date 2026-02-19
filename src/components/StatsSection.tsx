'use client';

import { TrendingUp, Building2, MapPin, Bell, RefreshCw, BarChart3, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';

export default function StatsSection({ isDark = false }: { isDark?: boolean }) {
    const [counts, setCounts] = useState({
        tenders: '0',
        authorities: '0',
        states: '0'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCounts() {
            try {
                const now = new Date().toISOString();
                const [tRes, aRes, lRes] = await Promise.all([
                    supabase.from('tenders').select('id', { count: 'exact', head: true }).gt('bid_end_ts', now),
                    supabase.from('authorities').select('id', { count: 'exact', head: true }),
                    supabase.from('tenders').select('state').not('state', 'is', null)
                ]);

                // Calculate unique states
                const uniqueStates = new Set(lRes.data?.map(item => item.state) || []);

                setCounts({
                    tenders: (tRes.count || 0).toLocaleString() + '+',
                    authorities: (aRes.count || 0).toLocaleString() + '+',
                    states: uniqueStates.size.toString()
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCounts();
    }, []);

    const stats = [
        { icon: BarChart3, value: counts.tenders, label: 'Live Tenders', sub: 'Today' },
        { icon: Building2, value: counts.authorities, label: 'Authorities', sub: 'Verified' },
        { icon: Globe, value: counts.states, label: 'States', sub: 'Coverage' },
        { icon: RefreshCw, value: '60 Min', label: 'Updates', sub: 'Every Hour' },
    ];

    if (loading) return null;

    return (
        <section className={`${isDark ? 'py-1 mt-1 bg-transparent border-none' : 'py-10 md:py-16 bg-white border-b border-gray-50'} relative overflow-hidden`}>
            <div className="container mx-auto px-2 md:px-4 relative z-10">
                <div className={`grid grid-cols-4 ${isDark ? 'gap-1' : 'gap-2'} md:gap-12`}>
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center text-center group cursor-default">
                            <div className={`relative ${isDark ? 'mb-1.5' : 'mb-2'} md:mb-6`}>
                                <div className={`${isDark ? 'p-2' : 'p-2.5'} md:p-5 rounded-xl md:rounded-3xl transition-all duration-500 ${isDark
                                        ? 'bg-white/5 text-tj-yellow border border-white/10'
                                        : 'bg-[#f8fafc] text-primary border border-gray-100 shadow-xl shadow-gray-100'
                                    } group-hover:bg-tj-yellow group-hover:text-primary group-hover:scale-110 transition-all`}>
                                    <stat.icon size={isDark ? 16 : 20} className="md:w-8 md:h-8" strokeWidth={2.5} />
                                </div>
                                {!isDark && (
                                    <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-[#FFC212] rounded-full border-2 md:border-4 border-white flex items-center justify-center">
                                        <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-0.5 md:space-y-1">
                                <div className={`text-xs md:text-4xl font-black tabular-nums tracking-tight ${isDark ? 'text-white' : 'text-primary uppercase'}`}>{stat.value}</div>
                                <div className={`text-[8px] md:text-[13px] font-black uppercase tracking-wider ${isDark ? 'text-tj-yellow/80' : 'text-[#1e293b]'}`}>{stat.label}</div>
                                <p className={`hidden md:block text-[9px] font-bold uppercase tracking-tight ${isDark ? 'text-blue-100/30' : 'text-gray-400'}`}>{stat.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
