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
        <section className="relative w-full min-h-[600px] bg-[#103E68] overflow-hidden flex items-center">
            {/* Background Decorative Circles */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <div className="text-white space-y-8">
                        <div className="inline-flex items-center gap-2 bg-[#ffffff15] backdrop-blur-md rounded-full px-5 py-2.5 text-sm font-bold border border-white/10 shadow-lg">
                            <TrendingUp size={18} className="text-tj-yellow" />
                            <span className="tracking-tight uppercase text-[12px]">10,000+ Active Tenders Updated Daily</span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter">
                                Find Government <br />
                                <span className="text-tj-yellow">Tenders</span> Easily
                            </h1>

                            <p className="text-xl text-blue-50/80 max-w-xl leading-relaxed font-medium">
                                Access thousands of active tenders from government departments across India.
                                Get instant alerts and never miss an opportunity.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-6 border-t border-white/10 pt-8">
                            <div className="flex items-center gap-3 group">
                                <div className="w-2.5 h-2.5 bg-[#4ade80] rounded-full shadow-[0_0_10px_#4ade80] group-hover:scale-125 transition-transform" />
                                <span className="text-sm font-bold text-white/90 uppercase tracking-wider">Updated Every Hour</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <div className="w-2.5 h-2.5 bg-[#4ade80] rounded-full shadow-[0_0_10px_#4ade80] group-hover:scale-125 transition-transform" />
                                <span className="text-sm font-bold text-white/90 uppercase tracking-wider">Free to Browse</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <div className="w-2.5 h-2.5 bg-[#4ade80] rounded-full shadow-[0_0_10px_#4ade80] group-hover:scale-125 transition-transform" />
                                <span className="text-sm font-bold text-white/90 uppercase tracking-wider">All States Covered</span>
                            </div>
                        </div>
                    </div>

                    {/* Search Box Card */}
                    <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 md:p-10 w-full max-w-[580px] ml-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-[#e8f2ff] rounded-full flex items-center justify-center border border-blue-50">
                                <Search className="text-[#3b82f6]" size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[#1e293b] leading-tight tracking-tight uppercase">Find Tenders</h2>
                                <p className="text-[#64748b] font-bold text-sm">Search from 10,000+ active listings</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-8 border-b border-[#f1f5f9] mb-8">
                            <button
                                onClick={() => setActiveTab('govt')}
                                className={`pb-4 text-[13px] font-black transition-all relative uppercase tracking-widest ${activeTab === 'govt'
                                    ? 'text-[#2563eb] border-b-[3px] border-[#2563eb]'
                                    : 'text-[#94a3b8] hover:text-[#475569]'
                                    }`}
                            >
                                Government
                            </button>
                            <button
                                onClick={() => setActiveTab('private')}
                                className={`pb-4 text-[13px] font-black transition-all relative uppercase tracking-widest ${activeTab === 'private'
                                    ? 'text-[#2563eb] border-b-[3px] border-[#2563eb]'
                                    : 'text-[#94a3b8] hover:text-[#475569]'
                                    }`}
                            >
                                Private
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-5">
                            <div className="relative group">
                                <select
                                    className="w-full bg-[#f8fafc] border-[2px] border-[#e2e8f0] rounded-xl px-5 py-4 text-sm text-[#334155] outline-none focus:border-[#3b82f6] focus:bg-white transition-all appearance-none font-bold cursor-pointer group-hover:border-[#cbd5e1]"
                                    onChange={(e) => setSearchParams({ ...searchParams, authority: e.target.value })}
                                    value={searchParams.authority}
                                >
                                    <option value="">Select Authority</option>
                                    {options.authorities.map(auth => <option key={auth} value={auth}>{auth}</option>)}
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8] group-hover:text-tj-blue transition-colors" size={20} />
                            </div>

                            <div className="relative group">
                                <select
                                    className="w-full bg-[#f8fafc] border-[2px] border-[#e2e8f0] rounded-xl px-5 py-4 text-sm text-[#334155] outline-none focus:border-[#3b82f6] focus:bg-white transition-all appearance-none font-bold cursor-pointer group-hover:border-[#cbd5e1]"
                                    onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
                                    value={searchParams.category}
                                >
                                    <option value="">Select Category</option>
                                    {options.categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8] group-hover:text-tj-blue transition-colors" size={20} />
                            </div>

                            <div className="relative group">
                                <select
                                    className="w-full bg-[#f8fafc] border-[2px] border-[#e2e8f0] rounded-xl px-5 py-4 text-sm text-[#334155] outline-none focus:border-[#3b82f6] focus:bg-white transition-all appearance-none font-bold cursor-pointer group-hover:border-[#cbd5e1]"
                                    onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                                    value={searchParams.location}
                                >
                                    <option value="">Select Location</option>
                                    {options.locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8] group-hover:text-tj-blue transition-colors" size={20} />
                            </div>

                            <button
                                onClick={handleSearch}
                                className="w-full bg-[#2563eb] text-white py-5 rounded-xl font-black uppercase tracking-[0.1em] hover:bg-[#1d4ed8] transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] text-base flex items-center justify-center gap-3 group active:scale-[0.98]"
                            >
                                <Search size={22} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                                Search Tenders
                            </button>

                            <div className="text-center pt-2">
                                <Link href="/active-tenders" className="text-[#2563eb] text-[13px] font-black hover:text-[#1d4ed8] transition-colors inline-flex items-center gap-2 group tracking-tight">
                                    Or browse all active tenders
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
