'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, ChevronDown, MapPin, Tag, ShieldCheck, Zap, RefreshCw, Globe, Loader2 } from 'lucide-react';
import LocationDetector from './LocationDetector';
import StatsSection from './StatsSection';
import { supabase } from '@/services/supabase';

export default function Hero() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const states = [
        'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi',
        'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
        'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand',
        'West Bengal'
    ];

    const categories = [
        'Civil Works', 'Electrical', 'Roads & Highways', 'Bridges',
        'Water Supply', 'Drainage', 'Buildings', 'IT & Software',
        'Defense', 'Railway', 'Smart City', 'Healthcare', 'Education'
    ];

    const trendingTags = ["Highways & Roads", "Civil Infrastructure", "Defense Projects", "Smart Cities"];

    const [suggestions, setSuggestions] = useState<Array<{ text: string, type: string, slug?: string }>>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!searchQuery.trim() || searchQuery.trim().length < 2) {
                setSuggestions([]);
                setIsDropdownOpen(false);
                return;
            }

            setIsLoadingSuggestions(true);
            try {
                const kw = `%${searchQuery.trim()}%`;

                const [authRes, catRes] = await Promise.all([
                    supabase.from('authorities').select('authority_name, slug').ilike('authority_name', kw).limit(4),
                    supabase.from('tender_categories').select('name, slug').ilike('name', kw).limit(3)
                ]);

                const newSuggestions: Array<{ text: string, type: string, slug?: string }> = [];

                if (authRes.data) {
                    authRes.data.forEach(auth => {
                        newSuggestions.push({ text: auth.authority_name, type: 'Authority', slug: auth.slug });
                    });
                }

                if (catRes.data) {
                    catRes.data.forEach(cat => {
                        newSuggestions.push({ text: cat.name, type: 'Category', slug: cat.slug });
                    });
                }

                setSuggestions(newSuggestions);
                setIsDropdownOpen(true);
            } catch (err) {
                console.error("Error fetching suggestions:", err);
            } finally {
                setIsLoadingSuggestions(false);
            }
        };

        const timer = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('q', searchQuery.trim());
        if (selectedState) params.set('state', selectedState);
        if (selectedCategory) params.set('category', selectedCategory);
        router.push(`/active-tenders?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    // ── Step 4: Inline stat numbers ─────────────────────────────────────────
    const heroStats = [
        { value: '2.1M+', label: 'Live Tenders' },
        { value: '28', label: 'States Covered' },
        { value: '500+', label: 'Categories' },
        { value: 'Daily', label: 'Updated' },
    ];

    // ── Step 6: Trust badges ────────────────────────────────────────────────
    const trustBadges = [
        { icon: <ShieldCheck size={12} />, text: 'CPPP Verified' },
        { icon: <Globe size={12} />, text: 'GeM Portal Synced' },
        { icon: <RefreshCw size={12} />, text: 'Updated Hourly' },
        { icon: <Zap size={12} />, text: 'Free to Browse' },
    ];

    return (
        <section className="relative w-full bg-[#0B2C4A] overflow-hidden min-h-screen flex flex-col justify-center pt-14 pb-4 md:pt-24 md:pb-16">

            {/* ── Step 5: Enhanced Background ─────────────────────────────── */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Diagonal subtle gradient stripe */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d3459] via-[#0B2C4A] to-[#071e33]" />
                {/* Glow blobs */}
                <div className="absolute -top-[15%] -left-[10%] w-[70%] h-[55%] bg-tj-yellow/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] -right-[5%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-[30%] w-[40%] h-[30%] bg-primary/10 rounded-full blur-[80px]" />
                {/* Grid texture */}
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">

                {/* AI Badge */}
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 md:px-4 md:py-1.5 rounded-full mb-3 md:mb-6 text-tj-yellow">
                    <div className="w-1.5 h-1.5 bg-tj-yellow rounded-full animate-pulse" />
                    <span className="uppercase text-[8px] md:text-[10px] font-semibold tracking-[0.2em]">AI Intelligence · Updated Daily</span>
                </div>

                {/* ── Step 1: Headline ────────────────────────────────────── */}
                <h1 className="text-2xl md:text-5xl lg:text-[3rem] font-black text-white mb-2 md:mb-4 leading-tight tracking-tight px-2">
                    India's #1 Platform to
                    <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-tj-yellow via-yellow-200 to-tj-yellow italic"> Win Government Tenders</span>
                </h1>

                <p className="text-[9px] md:text-sm text-blue-100/50 mb-3 md:mb-6 max-w-xl mx-auto px-6 leading-relaxed">
                    Search <span className="text-white font-semibold">2.1M+</span> live tenders across 28 states, 500+ categories — filtered for your business.
                </p>

                {/* ── Step 4: Inline Stats Row ─────────────────────────────── */}
                <div className="hidden md:flex items-center justify-center gap-6 mb-8">
                    {heroStats.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                            {i > 0 && <div className="w-px h-4 bg-white/10" />}
                            <span className="text-sm font-bold text-white">{s.value}</span>
                            <span className="text-xs text-blue-200/40 font-medium">{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* ── Step 2: Search Bar with State + Category Dropdowns ────── */}
                <div className="relative max-w-3xl mx-auto mb-3 md:mb-8 px-2" ref={wrapperRef}>
                    <div className="bg-white/8 backdrop-blur-xl p-1 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                        <div className="bg-white rounded-xl flex flex-col md:flex-row items-stretch md:items-center relative">

                            {/* Keyword Search */}
                            <div className="flex-1 flex items-center gap-2.5 px-4 py-3 md:py-0 md:min-h-[52px]">
                                <Search size={15} className="text-slate-300 shrink-0" strokeWidth={2} />
                                <input
                                    type="text"
                                    placeholder="Keyword, project, department..."
                                    className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-300 text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => { if (searchQuery.trim().length >= 2) setIsDropdownOpen(true); }}
                                />
                            </div>

                            {/* Autocomplete Dropdown */}
                            {isDropdownOpen && (searchQuery.trim().length >= 2) && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 text-left">
                                    {isLoadingSuggestions ? (
                                        <div className="p-4 flex items-center justify-center text-slate-400 gap-2">
                                            <Loader2 size={16} className="animate-spin" />
                                            <span className="text-sm font-medium">Searching...</span>
                                        </div>
                                    ) : suggestions.length > 0 ? (
                                        <div className="max-h-[300px] overflow-y-auto w-full no-scrollbar">
                                            {suggestions.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-start gap-3 transition-colors"
                                                    onClick={() => {
                                                        setSearchQuery(item.text);
                                                        setIsDropdownOpen(false);
                                                        // Option to auto-search upon selection
                                                        // router.push(`/active-tenders?q=${encodeURIComponent(item.text)}`);
                                                    }}
                                                >
                                                    <Search size={15} className="text-slate-300 shrink-0 mt-0.5" />
                                                    <div className="flex flex-col flex-1">
                                                        <span className="text-sm font-semibold text-slate-800 line-clamp-1">{item.text}</span>
                                                        <span className="text-[11px] font-medium text-blue-600/80 uppercase tracking-wider mt-0.5">in {item.type}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-slate-500 text-sm">
                                            No matches found for "{searchQuery}"
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* State Dropdown */}
                            <div className="relative flex items-center border-t md:border-t-0 md:border-l border-slate-100 px-3 py-2.5 md:py-0 md:min-w-[130px]">
                                <MapPin size={12} className="text-slate-300 mr-2 shrink-0" />
                                <select
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                    className="appearance-none w-full bg-transparent outline-none text-xs text-slate-500 cursor-pointer font-medium pr-5"
                                >
                                    <option value="">All States</option>
                                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <ChevronDown size={11} className="absolute right-2 text-slate-300 pointer-events-none" />
                            </div>

                            {/* Category Dropdown */}
                            <div className="relative flex items-center border-t md:border-t-0 md:border-l border-slate-100 px-3 py-2.5 md:py-0 md:min-w-[140px]">
                                <Tag size={11} className="text-slate-300 mr-2 shrink-0" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="appearance-none w-full bg-transparent outline-none text-xs text-slate-500 cursor-pointer font-medium pr-5"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <ChevronDown size={11} className="absolute right-2 text-slate-300 pointer-events-none" />
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={handleSearch}
                                className="m-1 bg-[#0B2C4A] hover:bg-tj-yellow hover:text-[#0B2C4A] text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all group/btn text-sm shrink-0"
                            >
                                Search Tenders
                                <ArrowRight size={15} className="group-hover/btn:translate-x-0.5 transition-transform" strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Step 3: Trending Tags — Mobile + Desktop ─────────────── */}
                <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar px-2 pb-1 mb-2 md:mb-0">
                    <span className="text-[9px] text-white/20 uppercase tracking-widest shrink-0 hidden md:inline">Trending:</span>
                    {trendingTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => {
                                setSearchQuery(tag);
                                router.push(`/active-tenders?q=${encodeURIComponent(tag)}`);
                            }}
                            className="bg-white/8 hover:bg-tj-yellow hover:text-[#0B2C4A] border border-white/10 rounded-full px-3 py-1.5 text-white/70 transition-all flex items-center gap-1.5 shrink-0"
                        >
                            <span className="text-[10px] font-medium whitespace-nowrap">{tag}</span>
                            <ArrowRight size={10} className="opacity-30" />
                        </button>
                    ))}
                </div>

                {/* ── Step 6: Trust Badges ─────────────────────────────────── */}
                <div className="hidden md:flex items-center justify-center gap-4 mt-5 mb-2">
                    {trustBadges.map((badge, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-blue-200/30">
                            {i > 0 && <div className="w-px h-3 bg-white/10 mr-2" />}
                            <span className="text-emerald-400/60">{badge.icon}</span>
                            <span className="text-[10px] font-medium">{badge.text}</span>
                        </div>
                    ))}
                </div>

                {/* Location + Stats */}
                <div className="mt-3 md:mt-14 -mx-4">
                    <LocationDetector />
                </div>
                <div className="mt-2 md:mt-16">
                    <StatsSection isDark={true} />
                </div>
            </div>
        </section>
    );
}
