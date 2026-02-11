'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, ChevronDown } from 'lucide-react';
import { supabase } from '@/services/supabase';

export default function Hero() {
    const [activeTab, setActiveTab] = useState('govt');
    const router = useRouter();
    const [searchParams, setSearchParams] = useState({
        authority: '',
        category: '',
        location: ''
    });

    const [options, setOptions] = useState({
        authorities: [] as string[],
        categories: [] as string[],
        locations: [] as string[]
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                // Fetch Authorities
                const { data: authData } = await supabase.from('authorities').select('name').order('name');
                // Fetch Categories
                const { data: catData } = await supabase.from('tender_categories').select('name').order('name');
                // Fetch Locations from tenders table
                const { data: locData } = await supabase.from('tenders').select('state').not('state', 'is', null).order('state');

                setOptions({
                    authorities: authData?.map(a => a.name) || [],
                    categories: catData?.map(c => c.name) || [],
                    locations: Array.from(new Set(locData?.map(l => l.state || ''))).filter(Boolean) as string[]
                });
            } catch (error) {
                console.error('Error fetching search options:', error);
            }
        };
        fetchOptions();
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchParams.authority) params.set('authority', searchParams.authority);
        if (searchParams.category) params.set('category', searchParams.category);
        if (searchParams.location) params.set('location', searchParams.location);

        const queryString = params.toString();
        router.push(`/active-tenders${queryString ? `?${queryString}` : ''}`);
    };

    return (
        <section className="relative w-full min-h-[650px] bg-primary overflow-hidden flex items-center">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-[#FFC212]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <div className="text-white space-y-10">
                        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 text-sm font-black border border-white/20 shadow-2xl">
                            <TrendingUp size={18} className="text-tj-yellow animate-pulse" />
                            <span className="tracking-widest uppercase text-[11px]">10,000+ Active Tenders Updated Real-time</span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter">
                                Find Govt <br />
                                <span className="text-tj-yellow underline decoration-white/20 underline-offset-8">Tenders</span> Fast
                            </h1>

                            <p className="text-lg md:text-xl text-blue-50/70 max-w-xl leading-relaxed font-bold">
                                India&apos;s most comprehensive tender discovery platform.
                                Access thousands of daily opportunities across all states and departments.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-8 border-t border-white/10 pt-10">
                            {[
                                { label: 'Hourly Updates', color: 'bg-green-400' },
                                { label: 'Free Access', color: 'bg-green-400' },
                                { label: 'All 28 States', color: 'bg-green-400' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 ${item.color} rounded-full shadow-[0_0_15px_rgba(74,222,128,0.5)]`} />
                                    <span className="text-[12px] font-black text-white uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Search Box Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] p-8 md:p-12 w-full max-w-[600px] ml-auto border border-white/20 relative group">
                        {/* Decorative Badge */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-tj-yellow rounded-full flex items-center justify-center -rotate-12 shadow-2xl border-4 border-white hidden md:flex">
                            <span className="text-primary font-black text-xs text-center leading-none">START<br />FOR<br />FREE</span>
                        </div>

                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                <Search size={32} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-[#0f172a] leading-none tracking-tighter uppercase mb-1">Search Engine</h2>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Global Tender Database v2.0</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-10 border-b-2 border-slate-50 mb-10">
                            {['govt', 'private'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-5 text-[14px] font-black transition-all relative uppercase tracking-widest ${activeTab === tab
                                        ? 'text-primary border-b-[4px] border-primary -mb-[2px]'
                                        : 'text-slate-300 hover:text-slate-500'
                                        }`}
                                >
                                    {tab === 'govt' ? 'Government' : 'Private Sector'}
                                </button>
                            ))}
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                            {[
                                { name: 'authority', placeholder: 'Select Authority (NHAI, PWD...)', opts: options.authorities },
                                { name: 'category', placeholder: 'Select Category (Works, Goods...)', opts: options.categories },
                                { name: 'location', placeholder: 'Select Location (State/City)', opts: options.locations }
                            ].map((field) => (
                                <div key={field.name} className="relative group/field">
                                    <select
                                        className="w-full bg-[#f8fafc] border-2 border-[#f1f5f9] rounded-2xl px-6 py-5 text-[15px] text-[#1e293b] outline-none focus:border-primary focus:bg-white transition-all appearance-none font-bold cursor-pointer hover:border-slate-200"
                                        onChange={(e) => setSearchParams({ ...searchParams, [field.name]: e.target.value })}
                                        value={searchParams[field.name as keyof typeof searchParams]}
                                    >
                                        <option value="">{field.placeholder}</option>
                                        {field.opts.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover/field:text-primary transition-colors" size={20} />
                                </div>
                            ))}

                            <button
                                onClick={handleSearch}
                                className="w-full bg-primary text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-2xl shadow-primary/30 text-lg flex items-center justify-center gap-4 active:scale-[0.97]"
                            >
                                <Search size={24} strokeWidth={3} />
                                Find Opportunities
                            </button>

                            <div className="text-center pt-2">
                                <Link href="/active-tenders" className="text-primary text-[14px] font-black hover:underline underline-offset-4 transition-all inline-flex items-center gap-3 group tracking-tight uppercase">
                                    Browse All Active Tenders
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
