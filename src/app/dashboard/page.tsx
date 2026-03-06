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
    Wallet,
    Sparkles,
    MessageSquare,
    CheckCircle2,
    Zap,
    History
} from 'lucide-react';
import { getCurrentUser } from '@/services/auth';
import { getSavedTenders, getRecommendedTenders } from '@/services/tenderService';
import { useContractor } from '@/context/ContractorContext';
import type { Tender } from '@/types';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [savedTenders, setSavedTenders] = useState<Tender[]>([]);
    const [recommendedTenders, setRecommendedTenders] = useState<Tender[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const { profile, loading: profileLoading } = useContractor();

    const loading = loadingData || profileLoading;

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoadingData(true);
            const { user } = await getCurrentUser();
            if (user) {
                setUser(user);

                // Fetch Saved Tenders
                const savedResult = await getSavedTenders(user.id);
                if (savedResult.success && savedResult.data) {
                    setSavedTenders(savedResult.data);
                }

                // Fetch Recommendations if profile exists
                if (profile) {
                    const recResult = await getRecommendedTenders(
                        profile.main_category || '',
                        profile.state,
                        3
                    );
                    if (recResult.success && recResult.data) {
                        setRecommendedTenders(recResult.data);
                    }
                }
            }
            // Smooth reveal
            setTimeout(() => setLoadingData(false), 800);
        };
        loadDashboardData();
    }, [profile]);

    // Logic for Pipeline Estimation
    const calculatePipeline = () => {
        let total = 0;
        savedTenders.forEach(t => {
            const val = t.tender_value || '0';
            const numeric = parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
            if (val.toLowerCase().includes('cr')) total += numeric * 10000000;
            else if (val.toLowerCase().includes('lakh')) total += numeric * 100000;
            else total += numeric;
        });

        if (total >= 10000000) return `₹ ${(total / 10000000).toFixed(2)} Cr`;
        if (total >= 100000) return `₹ ${(total / 100000).toFixed(1)} Lakh`;
        return `₹ ${total.toLocaleString('en-IN')}`;
    };

    const getClosingSoon = () => {
        const now = new Date();
        const twoDaysFromNow = new Date(now.getTime() + (48 * 60 * 60 * 1000));
        return savedTenders.filter(t => {
            if (!t.bid_submission_end) return false;
            const end = new Date(t.bid_submission_end);
            return end > now && end <= twoDaysFromNow;
        });
    };

    const closingSoonTenders = getClosingSoon();

    // Calculate profile completion percentage
    const calculateCompletion = () => {
        if (!profile) return 0;
        let points = 0;
        if (profile.org_name) points += 20;
        if (profile.turnover) points += 20;
        if (profile.main_category) points += 20;
        if (profile.contractor_projects?.length > 0) points += 40;
        return points;
    };

    const completion = calculateCompletion();

    const metrics = [
        {
            title: 'Active Watchlist',
            value: savedTenders.length.toString(),
            change: savedTenders.length > 0 ? `+${Math.ceil(savedTenders.length / 2)}` : '0',
            trend: 'up',
            label: 'Tracked tenders',
            icon: Bookmark,
            color: 'text-tj-yellow',
            bg: 'bg-yellow-50'
        },
        {
            title: 'Pipeline Value',
            value: calculatePipeline(),
            change: savedTenders.length > 0 ? 'Active' : 'No Data',
            trend: savedTenders.length > 0 ? 'up' : 'neutral',
            label: 'Potential bidding value',
            icon: Wallet,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            title: 'Critical Deadlines',
            value: closingSoonTenders.length.toString(),
            change: closingSoonTenders.length > 0 ? 'Priority' : 'Safe',
            trend: closingSoonTenders.length > 0 ? 'down' : 'neutral',
            label: 'Ending within 48h',
            icon: Clock,
            color: 'text-rose-600',
            bg: 'bg-rose-50'
        },
        {
            title: 'Intelligence Ready',
            value: `${completion}%`,
            change: completion === 100 ? 'Peak' : 'Needs Action',
            trend: completion > 50 ? 'up' : 'neutral',
            label: 'AI Matching Accuracy',
            icon: Sparkles,
            color: 'text-primary',
            bg: 'bg-blue-50'
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Health Bar / Profile CTA */}
            {completion < 100 && !loading && (
                <div className="bg-white border-2 border-primary/20 p-6 rounded-3xl relative overflow-hidden group shadow-sm transition-all hover:border-primary/40">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <Zap size={120} className="text-primary" />
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-tj-yellow rounded-lg">
                                    <Sparkles size={16} className="text-primary" />
                                </div>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight">Boost AI Matching Accuracy</h3>
                            </div>
                            <p className="text-slate-500 text-sm font-medium max-w-xl">
                                Your profile is only <span className="font-bold text-primary">{completion}%</span> complete. Adding your turnover and experience allows our AI to find tenders you are <span className="text-emerald-600 font-black">90%+ likely to win</span>.
                            </p>

                            <div className="mt-4 flex items-center gap-4">
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${completion}%` }} />
                                </div>
                                <span className="text-xs font-black text-primary">{completion}% COMPLETE</span>
                            </div>
                        </div>

                        <Link href="/dashboard/profile" className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 shrink-0">
                            Improve My Score
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            )}

            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
                        Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Sir'}
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        AI Intelligence Active • {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/active-tenders" className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-2">
                        <Search size={16} />
                        Discover Tenders
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white h-40 rounded-3xl border border-slate-100 shadow-sm animate-pulse" />
                    ))}
                </div>
            ) : (
                <>
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {metrics.map((metric, i) => (
                            <div key={i} className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-2xl ${metric.bg} ${metric.color} group-hover:rotate-12 transition-transform`}>
                                        <metric.icon size={24} />
                                    </div>
                                    <div className={`flex items-center gap-1 text-[10px] font-black rounded-full px-2 py-1 ${metric.trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
                                        metric.trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'
                                        }`}>
                                        {metric.trend === 'up' ? <ArrowUpRight size={12} /> : metric.trend === 'down' ? <ArrowDownRight size={12} /> : null}
                                        {metric.change}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-0.5">{metric.value}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.title}</p>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Sections */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                        {/* LEFT: Workload Reducers (8 cols) */}
                        <div className="xl:col-span-8 space-y-8">

                            {/* AI Recommendations */}
                            <div className="bg-[#103e68] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Sparkles className="text-tj-yellow" size={18} />
                                            <h3 className="text-xl font-black tracking-tight">Recommended for You</h3>
                                        </div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Opportunities matching your profile</p>
                                    </div>
                                    <Link href="/active-tenders" className="text-[10px] font-black text-tj-yellow uppercase tracking-[0.2em] hover:underline">
                                        View All AI Matches
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 relative z-10">
                                    {recommendedTenders.length === 0 ? (
                                        <div className="py-12 text-center bg-white/5 rounded-3xl border border-white/5">
                                            <p className="text-slate-500 font-bold mb-2">No recommendations yet.</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-black">Complete your profile to unlock intelligence</p>
                                        </div>
                                    ) : (
                                        recommendedTenders.map((tender, i) => (
                                            <Link key={i} href={`/tenders/${tender.slug}`} className="flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                                                <div className="p-3 bg-white/10 rounded-2xl text-tj-yellow group-hover:scale-110 transition-transform hidden md:block">
                                                    <Briefcase size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[8px] font-black bg-tj-yellow text-primary px-1.5 py-0.5 rounded uppercase">90% Match</span>
                                                        <h4 className="text-sm font-bold truncate text-white/90">{tender.title}</h4>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                            <MapPin size={10} /> {tender.state}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                            <Wallet size={10} /> {tender.tender_value || 'TBA'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right hidden md:block">
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deadline</p>
                                                        <p className="text-xs font-bold text-rose-400">{new Date(tender.bid_submission_end || '').toLocaleDateString('en-IN')}</p>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-tj-yellow text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-tj-yellow/20 translate-x-4 group-hover:translate-x-0">
                                                        <ArrowRight size={18} />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Watchlist Quick View */}
                            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Watchlist</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Recently tracked opportunities</p>
                                    </div>
                                    <Link href="/dashboard/watchlist" className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:gap-3 transition-all">
                                        Full Watchlist <ArrowRight size={14} />
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {savedTenders.length === 0 ? (
                                        <div className="py-20 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                            <Bookmark size={40} className="mx-auto text-slate-300 mb-4" />
                                            <p className="text-slate-500 font-black">Your watchlist is currently empty</p>
                                            <p className="text-slate-400 text-xs mt-1">Tenders you save will appear here automatically.</p>
                                        </div>
                                    ) : (
                                        savedTenders.slice(0, 3).map((tender, i) => (
                                            <Link key={i} href={`/tenders/${tender.slug}`} className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100 transition-all group">
                                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                                    <Briefcase size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-black text-slate-800 truncate mb-1">{tender.title}</h4>
                                                    <div className="flex flex-wrap gap-4">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                                                            <MapPin size={10} /> {tender.state}
                                                        </span>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                                                            <Calendar size={10} /> Bid: {new Date(tender.bid_submission_end || '').toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-slate-900">{tender.tender_value || 'TBA'}</p>
                                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${closingSoonTenders.some(t => t.id === tender.id) ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                        {closingSoonTenders.some(t => t.id === tender.id) ? 'Closing Soon' : 'Safe'}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Timeline & Critical Steps (4 cols) */}
                        <div className="xl:col-span-4 space-y-8">

                            {/* Dynamic Deadline Timeline */}
                            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                    <Clock size={160} />
                                </div>

                                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Bid Timeline</h3>

                                <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                                    {savedTenders.length === 0 ? (
                                        <div className="pl-10 relative">
                                            <div className="absolute left-0 top-1.5 w-7 h-7 bg-slate-100 rounded-full border-4 border-white flex items-center justify-center text-slate-300">
                                                <History size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue Empty</p>
                                                <p className="text-sm font-bold text-slate-500">Add tenders to see your critical timeline here.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        savedTenders
                                            .filter(t => t.bid_submission_end)
                                            .sort((a, b) => new Date(a.bid_submission_end!).getTime() - new Date(b.bid_submission_end!).getTime())
                                            .slice(0, 4)
                                            .map((tender, i) => {
                                                const diff = new Date(tender.bid_submission_end!).getTime() - new Date().getTime();
                                                const days = Math.ceil(diff / (1000 * 3600 * 24));
                                                return (
                                                    <div key={i} className="pl-10 relative group">
                                                        <div className={`absolute left-0 top-1.5 w-7 h-7 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-white p-1 z-10 transition-transform group-hover:scale-110 ${days <= 2 ? 'bg-rose-500' : 'bg-primary'}`}>
                                                            <Clock size={14} />
                                                        </div>
                                                        <div className="p-4 rounded-2xl bg-slate-50/50 group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                                                            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${days <= 2 ? 'text-rose-500' : 'text-primary'}`}>
                                                                {days <= 0 ? 'Expiring Today' : `T-minus ${days} Days`}
                                                            </p>
                                                            <p className="text-[13px] font-bold text-slate-700 leading-tight line-clamp-2">{tender.title}</p>
                                                            <p className="text-[10px] font-medium text-slate-400 mt-2 italic">Submission Deadline</p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                    )}
                                </div>
                            </div>

                            {/* Pro Benefits Section */}
                            <div className="bg-gradient-to-br from-[#103e68] to-[#0a2742] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-tj-yellow/10 rounded-full -mr-16 -mt-16 blur-2xl" />

                                <h3 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
                                    <Zap size={20} className="text-tj-yellow" />
                                    Pro-Bid Support
                                </h3>
                                <p className="text-blue-100/70 text-sm font-medium leading-relaxed mb-6">
                                    Struggling with technical documentation? Get 1-on-1 counseling for {savedTenders.length > 0 ? "your watched projects" : "upcoming tenders"}.
                                </p>
                                <Link href="/bid-support" className="flex items-center justify-center w-full bg-tj-yellow text-primary py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:translate-y-[-2px] transition-all shadow-xl shadow-tj-yellow/10 active:scale-95 gap-2">
                                    Talk to Expert
                                    <MessageSquare size={16} />
                                </Link>
                            </div>

                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
