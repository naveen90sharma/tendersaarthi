'use client';

import React from 'react';

export default function TrustSection() {
    const brands = [
        'NHAI', 'CPWD', 'MES', 'Indian Railways', 'BHEL', 'NTPC', 'ONGC', 'GAIL'
    ];

    return (
        <section className="py-12 bg-slate-50 border-y border-slate-100 overflow-hidden">
            <div className="container mx-auto px-4 mb-8">
                <p className="text-center text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Aggregating Tenders From 500+ Authorities</p>
            </div>

            <div className="relative flex overflow-x-hidden">
                <div className="flex animate-marquee whitespace-nowrap gap-12 md:gap-24 items-center">
                    {[...brands, ...brands].map((brand, i) => (
                        <span key={i} className="text-2xl md:text-4xl font-black text-slate-200 hover:text-primary transition-colors cursor-default uppercase tracking-tighter">
                            {brand}
                        </span>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </section>
    );
}
