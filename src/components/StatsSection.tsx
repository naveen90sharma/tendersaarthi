'use client';

import { TrendingUp, Building2, MapPin, Bell, RefreshCw, BarChart3, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';

export default function StatsSection() {
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
        { icon: BarChart3, value: counts.tenders, label: 'Live Tenders', sub: 'Opportunities available today' },
        { icon: Building2, value: counts.authorities, label: 'Verified Org', sub: 'PSUs, Govt & Private' },
        { icon: Globe, value: counts.states, label: 'States Coverage', sub: 'All 28 States & UTs' },
        { icon: RefreshCw, value: '60 Min', label: 'Refresh Cycle', sub: 'Guaranteed data accuracy' },
    ];

    if (loading) {
        return (
            <div className="py-20 bg-white flex flex-col items-center justify-center border-b border-gray-50">
                <RefreshCw className="animate-spin text-primary/20 mb-4" size={40} />
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Loading Live Stats</p>
            </div>
        );
    }

    return (
        <section className="py-16 bg-white border-b border-gray-50 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center text-center group cursor-default">
                            <div className="relative mb-6">
                                <div className="p-5 rounded-3xl bg-[#f8fafc] text-primary border border-gray-100 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-gray-100 group-hover:shadow-primary/20">
                                    <stat.icon size={32} strokeWidth={2.5} />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FFC212] rounded-full border-4 border-white flex items-center justify-center">
                                    <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl md:text-4xl font-black text-primary tracking-tighter tabular-nums">{stat.value}</div>
                                <div className="text-[13px] font-black text-[#1e293b] uppercase tracking-wider">{stat.label}</div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{stat.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
