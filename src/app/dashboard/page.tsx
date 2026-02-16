'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Bookmark,
    Briefcase,
    Clock,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    ArrowRight,
    MapPin,
    Calendar,
    Wallet
} from 'lucide-react';
import { getCurrentUser } from '@/services/auth';
import { getSavedTenders } from '@/services/tenderService';
import type { Tender } from '@/types';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [savedTenders, setSavedTenders] = useState<Tender[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const { user } = await getCurrentUser();
            if (user) {
                setUser(user);
                const result = await getSavedTenders(user.id);
                if (result.success && result.data) {
                    setSavedTenders(result.data);
                }
            }
            setLoading(false);
        };
        loadData();
    }, []);

    const metrics = [
        {
            title: 'Active Monitor',
            value: '24',
            change: '+12%',
            trend: 'up',
            label: 'new opportunities',
            icon: Search,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            title: 'Watchlist Items',
            value: savedTenders.length.toString(),
            change: '+2',
            trend: 'up',
            label: 'saved this week',
            icon: Bookmark,
            color: 'text-tj-yellow',
            bg: 'bg-yellow-50'
        },
        {
            title: 'Estimated Pipeline',
            value: '₹ 4.2 Cr',
            change: '-5%',
            trend: 'down',
            label: 'vs last month',
            icon: Wallet,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            title: 'Closing Soon',
            value: '5',
            change: 'Critical',
            trend: 'neutral',
            label: 'within 48 hours',
            icon: Clock,
            color: 'text-rose-600',
            bg: 'bg-rose-50'
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Analytics</h1>
                    <p className="text-slate-500 font-medium">Monitoring and market intelligence overview.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        Generate Report
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                        New Search Alert
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {metrics.map((metric, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${metric.bg} ${metric.color}`}>
                                <metric.icon size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-black rounded-full px-2 py-1 ${metric.trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
                                    metric.trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'
                                }`}>
                                {metric.trend === 'up' ? <ArrowUpRight size={14} /> : metric.trend === 'down' ? <ArrowDownRight size={14} /> : null}
                                {metric.change}
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 mb-1">{metric.value}</h3>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{metric.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{metric.label}</p>
                    </div>
                ))}
            </div>

            {/* Main Visual Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left: Activity Chart Mockup */}
                <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-800">Market Intelligence</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Tender frequency vs Value</p>
                        </div>
                        <div className="flex gap-2">
                            {['Daily', 'Weekly', 'Monthly'].map(period => (
                                <button key={period} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${period === 'Weekly' ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CSS Chart Mockup */}
                    <div className="h-64 flex items-end justify-between gap-2 px-2 border-b border-slate-50">
                        {[40, 70, 45, 90, 65, 85, 30, 60, 95, 55, 75, 50].map((h, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div
                                    className="bg-slate-100 group-hover:bg-primary transition-all duration-300 rounded-t-lg"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        ₹{h}M
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                    </div>
                </div>

                {/* Right: Quick Recommendations */}
                <div className="bg-gradient-to-br from-[#0F172A] to-[#1e293b] rounded-3xl p-8 text-white shadow-xl flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="text-tj-yellow" />
                        <h3 className="text-lg font-black italic tracking-tight">AI Predictions</h3>
                    </div>
                    <div className="space-y-6 flex-1">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                            <p className="text-xs font-black text-tj-yellow uppercase tracking-widest mb-2">High Probability</p>
                            <h4 className="font-bold text-sm mb-3">Road Infra project by NHAI in MH predicted to close with L1 margin under 3%.</h4>
                            <Link href="/active-tenders" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#94a3b8] hover:text-white transition-colors">
                                View Prediction <ArrowRight size={12} />
                            </Link>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                            <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Market Shift</p>
                            <h4 className="font-bold text-sm mb-3">Noticeable increase in Renewable Energy tenders in Southern states (24% YoY).</h4>
                            <Link href="/active-tenders" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#94a3b8] hover:text-white transition-colors">
                                Explore Trends <ArrowRight size={12} />
                            </Link>
                        </div>
                    </div>
                    <button className="mt-8 w-full py-4 bg-tj-yellow text-primary font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-lg shadow-tj-yellow/10 hover:translate-y-[-2px] transition-all">
                        Upgrade to Pro AI
                    </button>
                </div>
            </div>

            {/* Lower Section: Watchlist & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Watchlist Preview */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-slate-800">Recent Watchlist</h3>
                        <Link href="/dashboard/watchlist" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">
                            View All
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {savedTenders.length === 0 ? (
                            <div className="py-12 text-center">
                                <Bookmark size={40} className="mx-auto text-slate-200 mb-4" />
                                <p className="text-slate-400 font-bold">Your watchlist is empty.</p>
                            </div>
                        ) : (
                            savedTenders.slice(0, 4).map((tender, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-white border border-slate-100 transition-colors">
                                        <Briefcase size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-black text-slate-800 truncate">{tender.title}</h4>
                                        <div className="flex gap-4 mt-1">
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                                                <MapPin size={10} /> {tender.state}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                                                <Calendar size={10} /> {tender.bid_submission_end}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-slate-800">{tender.tender_value}</p>
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Timeline/Activity */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                    <h3 className="text-lg font-black text-slate-800 mb-8">Upcoming Events</h3>
                    <div className="space-y-8 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                        {[
                            { time: 'In 2 days', event: 'Bid submission deadline for NHAI Road project', color: 'bg-rose-500' },
                            { time: 'In 3 days', event: 'New Results to be published for Delhi Metro', color: 'bg-primary' },
                            { time: 'In 5 days', event: 'Joint Venture meeting - Construction category', color: 'bg-tj-yellow' },
                            { time: 'In 1 week', event: 'Document renewal for GEM registration', color: 'bg-slate-300' },
                        ].map((item, i) => (
                            <div key={i} className="relative pl-8 group">
                                <div className={`absolute left-[0px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ring-2 ring-slate-50 group-hover:scale-125 transition-transform ${item.color}`} />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.time}</p>
                                <p className="text-sm font-bold text-slate-700 leading-snug">{item.event}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
