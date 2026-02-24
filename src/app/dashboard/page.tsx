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
    MessageSquare
} from 'lucide-react';
import { getCurrentUser } from '@/services/auth';
import { getSavedTenders } from '@/services/tenderService';
import { useContractor } from '@/context/ContractorContext';
import type { Tender } from '@/types';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [savedTenders, setSavedTenders] = useState<Tender[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const { profile, loading: profileLoading, checkEligibility } = useContractor();

    const loading = loadingData || profileLoading;

    useEffect(() => {
        const loadData = async () => {
            setLoadingData(true);
            const { user } = await getCurrentUser();
            if (user) {
                setUser(user);
                const result = await getSavedTenders(user.id);
                if (result.success && result.data) {
                    setSavedTenders(result.data);
                }
            }
            // Artificial delay for premium skeleton feel
            setTimeout(() => setLoadingData(false), 800);
        };
        loadData();
    }, []);

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

    const getClosingSoonCount = () => {
        const now = new Date();
        const twoDaysFromNow = new Date(now.getTime() + (48 * 60 * 60 * 1000));
        return savedTenders.filter(t => {
            if (!t.bid_submission_end) return false;
            const end = new Date(t.bid_submission_end);
            return end > now && end <= twoDaysFromNow;
        }).length;
    };

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
        /* {
            title: 'Market Match',
            value: profile ? `${completion}%` : '0%',
            change: profile ? (completion > 50 ? 'High' : 'Low') : 'N/A',
            trend: profile ? (completion > 50 ? 'up' : 'down') : 'neutral',
            label: profile ? 'Profile readiness score' : 'Setup profile for score',
            icon: Search,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        }, */
        {
            title: 'My Watchlist',
            value: savedTenders.length.toString(),
            change: savedTenders.length > 0 ? `+${Math.ceil(savedTenders.length / 3)}` : '0',
            trend: 'up',
            label: 'saved opportunities',
            icon: Bookmark,
            color: 'text-tj-yellow',
            bg: 'bg-yellow-50'
        },
        {
            title: 'Pipeline Value',
            value: calculatePipeline(),
            change: savedTenders.length > 0 ? '+4%' : '0%',
            trend: savedTenders.length > 0 ? 'up' : 'neutral',
            label: 'potential bid value',
            icon: Wallet,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            title: 'Closing Soon',
            value: getClosingSoonCount().toString(),
            change: getClosingSoonCount() > 0 ? 'Critical' : 'Safe',
            trend: getClosingSoonCount() > 0 ? 'down' : 'neutral',
            label: 'within 48 hours',
            icon: Clock,
            color: 'text-rose-600',
            bg: 'bg-rose-50'
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Completion Tracker - Hidden for now
            {completion < 100 && !loading && (
                <div className="bg-gradient-to-r from-[#0a2742] to-[#164e85] p-6 rounded-[2rem] text-white shadow-xl shadow-blue-900/10 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-xl font-black tracking-tight mb-2 flex items-center gap-2">
                                    <Sparkles className="text-tj-yellow" size={20} />
                                    {completion === 0 ? 'Start Your Intelligence Profile' : 'Complete Your Profile'}
                                </h3>
                                <p className="text-blue-100 text-sm font-medium">
                                    {completion === 0
                                        ? 'Setup your profile to unlock AI-powered eligibility matching and market insights.'
                                        : `You are ${completion}% of the way there! Add your past projects to reach 100%.`}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-blue-300">
                                    <span>Profile Strength</span>
                                    <span>{completion}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-tj-yellow transition-all duration-1000"
                                        style={{ width: `${completion}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <Link href="/dashboard/profile" className="px-8 py-4 bg-tj-yellow text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.05] transition-all shadow-xl shadow-tj-yellow/10 active:scale-95 whitespace-nowrap flex items-center gap-2">
                            {completion === 0 ? 'Get Started' : 'Finish Setup'}
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            )}
            */}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 font-medium">Monitoring and market intelligence for {user?.user_metadata?.full_name?.split(' ')[0] || 'your profile'}.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/reports" className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        Generate Report
                    </Link>
                    <Link href="/active-tenders" className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                        Analyze New Tenders
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-pulse">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl mb-4" />
                            <div className="h-8 bg-slate-100 rounded-lg w-1/2 mb-2" />
                            <div className="h-4 bg-slate-50 rounded-lg w-3/4" />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {metrics.map((metric, i) => (
                            <div key={i} className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-2xl ${metric.bg} ${metric.color} group-hover:scale-110 transition-transform`}>
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
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{metric.title}</p>
                                <p className="text-[10px] text-slate-400 font-bold">{metric.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Visual Section - Analytics & AI Hub - Hidden for now
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        ...
                    </div>
                    */}

                    {/* Lower Section: Watchlist & Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Watchlist Preview */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">Dynamic Watchlist</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Recently tracked opportunities</p>
                                </div>
                                <Link href="/dashboard/watchlist" className="px-4 py-2 bg-slate-50 text-[10px] font-black text-primary uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all">
                                    See Full List
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {savedTenders.length === 0 ? (
                                    <div className="py-20 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                        <Bookmark size={48} className="mx-auto text-slate-200 mb-4" />
                                        <p className="text-slate-500 font-extrabold text-sm">Your watchlist is empty.</p>
                                        <p className="text-slate-400 text-xs mt-1">Saved tenders will appear here automatically.</p>
                                    </div>
                                ) : (
                                    savedTenders.slice(0, 4).map((tender, i) => (
                                        <Link key={i} href={`/tenders/${tender.slug || tender.id}`} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white border border-slate-100 transition-all shrink-0">
                                                <Briefcase size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[13px] font-black text-slate-800 truncate group-hover:text-primary transition-colors">{tender.title}</h4>
                                                <div className="flex gap-4 mt-1.5">
                                                    <span className="text-[9px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                                                        <MapPin size={10} /> {tender.state || 'India'}
                                                    </span>
                                                    <span className="text-[9px] font-black text-rose-500 flex items-center gap-1 uppercase tracking-wider bg-rose-50 px-2 rounded-md">
                                                        <Clock size={10} /> {tender.bid_submission_end || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-[13px] font-black text-slate-800">{tender.tender_value || 'TBA'}</p>
                                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-1.5 rounded">Active</span>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right: Upcoming Milestones */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">Upcoming Events</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Critical dates & deadlines</p>
                                </div>
                                <Filter size={18} className="text-slate-300" />
                            </div>

                            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                                {[
                                    { time: 'T-2 Days', event: 'Bid submission for NHAI Road project (Watchlist)', color: 'bg-rose-500', icon: <Clock size={12} /> },
                                    { time: 'T-3 Days', event: 'Technical bid opening for Smart City Jaipur', color: 'bg-primary', icon: <Briefcase size={12} /> },
                                    { time: 'Upcoming', event: 'Quarterly Market Intelligence Report release', color: 'bg-tj-yellow', icon: <TrendingUp size={12} /> },
                                    { time: 'Next Week', event: 'Subscription renewal for Pro Plan advantages', color: 'bg-emerald-500', icon: <Bookmark size={12} /> },
                                ].map((item, i) => (
                                    <div key={i} className="relative pl-10 group cursor-default">
                                        <div className={`absolute left-[-2px] top-1 w-5 h-5 rounded-lg border-[3px] border-white shadow-lg flex items-center justify-center text-white p-0.5 z-10 group-hover:scale-110 transition-transform ${item.color}`}>
                                            {item.icon}
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 group-hover:bg-white group-hover:border-slate-200 transition-all">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{item.time}</p>
                                            <p className="text-[13px] font-extrabold text-slate-700 leading-snug">{item.event}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
