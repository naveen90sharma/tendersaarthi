'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, ArrowRight } from 'lucide-react';

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
        <section className="relative w-full bg-[#f8fafc] overflow-hidden flex items-center py-10 md:py-20">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
                {/* Badge Component */}
                <div className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold text-primary shadow-sm border border-slate-100 mb-6 md:mb-8 animate-fade-in">
                    <TrendingUp size={14} className="text-primary" />
                    <span className="uppercase tracking-wider">AI Powered Search Engine v2.0</span>
                </div>

                <h1 className="text-[28px] md:text-6xl font-black text-slate-800 mb-4 md:mb-6 leading-[1.2] md:leading-tight tracking-tight px-2">
                    Search Any Tender <br className="hidden md:block" />
                    <span className="text-primary italic">Across Database</span>
                </h1>

                <p className="text-base md:text-lg text-slate-500 mb-8 md:mb-12 max-w-2xl mx-auto font-medium px-4">
                    India's most powerful tender discovery platform. Find government and private sector opportunities with instant AI extraction.
                </p>

                {/* New Search Bar Implementation - Responsive */}
                <div className="relative max-w-4xl mx-auto mb-8 animate-fade-in-up">
                    <div className="bg-white rounded-3xl md:rounded-full shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] p-2 md:p-3 flex flex-col md:flex-row items-stretch md:items-center border border-slate-100 group transition-all duration-500">
                        {/* Search Label Part */}
                        <div className="flex items-center gap-3 px-6 md:px-8 md:border-r-2 md:border-slate-100 md:mr-2 py-3 md:py-0">
                            <Search size={20} className="text-[#103e68]" strokeWidth={3} />
                            <span className="text-[10px] md:text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.25em]">Search</span>
                        </div>

                        {/* Input Field */}
                        <input
                            type="text"
                            placeholder="Tender ID, Authority, Keywords..."
                            className="flex-1 bg-transparent border-none focus:ring-0 outline-none px-6 md:px-4 py-3 md:py-4 text-slate-700 font-bold placeholder:text-slate-300 placeholder:font-medium text-lg md:text-xl shadow-none focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />

                        {/* Action Button */}
                        <button
                            onClick={handleSearch}
                            className="bg-[#103e68] hover:bg-[#0d3152] text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-full font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-[#103e68]/40 md:hover:-translate-y-1 active:translate-y-0 active:scale-95"
                        >
                            <span className="md:hidden">Search Database</span>
                            <span className="hidden md:inline">Analyze</span>
                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Suggestions Tags */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4 px-2">
                    {suggestions.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => {
                                setSearchQuery(tag);
                                router.push(`/active-tenders?q=${encodeURIComponent(tag)}`);
                            }}
                            className="bg-white hover:bg-slate-50 border border-slate-100 px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#103e68] rounded-full group-hover:scale-125 transition-transform"></div>
                            <span className="text-[11px] md:text-[13px] font-black text-slate-600">{tag}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

