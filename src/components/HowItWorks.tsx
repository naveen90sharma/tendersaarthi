'use client';

import React from 'react';
import { Search, BrainCircuit, FileCheck } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            title: 'Smart Search',
            desc: 'Our AI indexes 2.1 million tenders to find the exact match for your business capacity.',
            icon: Search,
            isHighlight: false,
        },
        {
            title: 'AI Analysis',
            desc: 'Instant feasibility reports, competition mapping, and eligibility checks powered by LLMs.',
            icon: BrainCircuit,
            isHighlight: true,
        },
        {
            title: 'One-Click Apply',
            desc: 'Direct links to tender documents and portals with pre-filled documentation assistance.',
            icon: FileCheck,
            isHighlight: false,
        }
    ];

    return (
        <section className="py-10 md:py-16 bg-[#0B2C4A] relative overflow-hidden">
            {/* Subtle background rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="max-w-xl mx-auto text-center mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-tj-yellow text-[9px] font-semibold uppercase tracking-widest mb-3">
                        Seamless Onboarding
                    </div>
                    <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight mb-3">
                        How <span className="text-tj-yellow italic">TenderSaarthi</span> Works
                    </h2>
                    <p className="text-blue-100/50 text-sm leading-relaxed">
                        Precision engineering meets business procurement. Our three-step engine is designed to land you the right contracts, faster.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto">
                    {steps.map((step, index) => (
                        <div key={index} className="relative group text-center p-6 rounded-3xl transition-all duration-300 hover:bg-white/5">
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-[60px] left-[70%] w-[60%] h-px bg-gradient-to-r from-tj-yellow/50 to-transparent z-0 opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
                            )}

                            <div className="relative z-10 flex flex-col items-center">
                                {/* Icon */}
                                <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] ${step.isHighlight ? 'bg-tj-yellow text-[#0B2C4A]' : 'bg-white/5 text-white/70 border border-white/10'} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl`}>
                                    <step.icon size={step.isHighlight ? 44 : 36} strokeWidth={1} />
                                    {step.isHighlight && (
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full animate-ping opacity-20" />
                                    )}
                                </div>

                                {/* Step badge */}
                                <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-black text-tj-yellow uppercase tracking-[0.2em] mb-6 border border-white/5">
                                    Step 0{index + 1}
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-tj-yellow transition-colors">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-blue-100/40 text-[15px] leading-relaxed max-w-[280px]">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
