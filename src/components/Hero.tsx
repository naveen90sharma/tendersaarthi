'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, ArrowRight } from 'lucide-react';
import LocationDetector from './LocationDetector';
import StatsSection from './StatsSection';

export default function Hero() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/active-tenders?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const suggestions = [
        "Highways & Roads",
        "Civil Infrastructure",
        "Defense Projects",
        "Smart Cities"
    ];

    return (
        <section className="relative w-full bg-[#0B2C4A] overflow-hidden min-h-screen flex flex-col justify-center pt-14 pb-4 md:pt-40 md:pb-32">
            {/* Advanced Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Mesh Gradient / Light Blobs */}
                <div className="absolute -top-[10%] -left-[10%] w-[80%] h-[50%] bg-tj-yellow/5 rounded-full blur-[100px] opacity-60" />
                <div className="absolute top-[10%] -right-[10%] w-[60%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] opacity-40" />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] grayscale invert" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center max-w-6xl">
                {/* Micro AI Badge */}
                <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-3xl border border-white/10 px-3 py-0.5 md:px-6 md:py-2.5 rounded-full mb-2 md:mb-12 animate-fade-in text-tj-yellow">
                    <div className="w-1 md:w-2 h-1 md:h-2 bg-tj-yellow rounded-full animate-pulse shadow-[0_0_10px_rgba(255,194,18,0.8)]" />
                    <span className="uppercase text-[7px] md:text-sm font-black tracking-[0.2em] md:tracking-[0.25em]">AI Intelligence v4.0</span>
                </div>

                <h1 className="text-xl md:text-7xl lg:text-8xl font-black text-white mb-1 md:mb-8 leading-[1.1] md:leading-[0.95] tracking-tight md:tracking-tighter px-2">
                    Connect with <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-tj-yellow via-yellow-200 to-tj-yellow inline-block italic">Opportunities</span>
                </h1>

                <p className="text-[9px] md:text-2xl text-blue-100/60 mb-2 md:mb-16 max-w-3xl mx-auto font-medium px-6 leading-relaxed">
                    India's largest database of <span className="text-white font-bold text-xs md:text-3xl">2.1M+</span> Tenders.
                </p>

                {/* Ultimate Search Interface */}
                <div className="relative max-w-4xl mx-auto mb-2 md:mb-16 animate-fade-in-up px-2">
                    <div className="bg-white/5 backdrop-blur-3xl p-1 md:p-3 rounded-[1.8rem] md:rounded-full border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] group transition-all duration-700">
                        <div className="bg-white rounded-[1.4rem] md:rounded-full p-1 md:p-2 flex flex-col md:flex-row items-center gap-1">
                            {/* Search Context (Desktop Only) */}
                            <div className="hidden md:flex items-center gap-4 px-8 border-r-2 border-slate-100 mr-2 py-4">
                                <Search size={22} className="text-primary" strokeWidth={3} />
                                <div className="flex flex-col items-start leading-none gap-1">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Database</span>
                                    <span className="text-sm font-black text-primary uppercase">Global</span>
                                </div>
                            </div>

                            {/* Main Input */}
                            <div className="flex-1 w-full px-4 md:px-4 flex items-center py-2 md:py-0">
                                <Search size={16} className="md:hidden text-slate-300 mr-2 shrink-0" strokeWidth={2.5} />
                                <input
                                    type="text"
                                    placeholder="Keywords, Projects..."
                                    className="w-full bg-transparent border-none focus:ring-0 outline-none p-0 text-slate-800 font-bold md:font-black placeholder:text-slate-200 text-sm md:text-2xl tracking-tight"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            {/* Massive Action Button */}
                            <button
                                onClick={handleSearch}
                                className="w-full md:w-auto bg-[#0B2C4A] hover:bg-tj-yellow hover:text-tj-blue text-white px-6 md:px-14 py-2.5 md:py-5 rounded-[1.1rem] md:rounded-full font-black flex items-center justify-center gap-2 transition-all group/btn shadow-xl relative overflow-hidden"
                            >
                                <span className="relative z-10 tracking-widest uppercase text-[9px] md:text-xs font-black">Analyze</span>
                                <ArrowRight className="w-3.5 h-3.5 md:w-5 md:h-5 group-hover/btn:translate-x-1.5 transition-transform relative z-10" strokeWidth={3} />
                                <div className="absolute inset-0 bg-gradient-to-r from-tj-yellow to-yellow-300 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Intelligent Tags - Hidden on mobile to save vertical space */}
                <div className="hidden md:flex flex-wrap justify-center gap-3 md:gap-4 px-2">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mr-2 hidden md:inline-block pt-3">Trending:</span>
                    {suggestions.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => {
                                setSearchQuery(tag);
                                router.push(`/active-tenders?q=${encodeURIComponent(tag)}`);
                            }}
                            className="bg-white/10 hover:bg-tj-yellow hover:text-tj-blue border border-white/10 rounded-xl md:rounded-2xl px-4 py-2.5 md:px-5 md:py-3 text-white transition-all backdrop-blur-md group flex items-center gap-2"
                        >
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{tag}</span>
                            <ArrowRight size={12} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                    ))}
                </div>

                {/* Combined Location Feature */}
                <div className="mt-3 md:mt-20 -mx-4">
                    <LocationDetector />
                </div>

                {/* Integrated Stats Section */}
                <div className="mt-2 md:mt-24">
                    <StatsSection isDark={true} />
                </div>
            </div>
        </section>
    );
}
