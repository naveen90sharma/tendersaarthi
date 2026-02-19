'use client';

import React from 'react';
import { Search, BrainCircuit, Rocket, FileCheck } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            title: 'Smart Search',
            desc: 'Our AI indexes 2.1 million tenders to find the exact match for your business capacity.',
            icon: Search,
            color: 'bg-blue-500'
        },
        {
            title: 'AI Analysis',
            desc: 'Instant feasibility reports, competition mapping, and eligibility checks powered by LLMs.',
            icon: BrainCircuit,
            color: 'bg-tj-yellow'
        },
        {
            title: 'One-Click Apply',
            desc: 'Direct links to tender documents and portals with pre-filled documentation assistance.',
            icon: FileCheck,
            color: 'bg-emerald-500'
        }
    ];

    return (
        <section className="py-20 md:py-32 bg-[#0B2C4A] relative overflow-hidden">
            {/* Background Decorative Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-white/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/5 rounded-full" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-tj-yellow text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        Seamless Onboarding
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
                        How <span className="text-tj-yellow italic">TenderSaarthi</span> Works
                    </h2>
                    <p className="text-blue-100/60 text-lg font-medium leading-relaxed">
                        Precision engineering meets business procurement. Our three-step engine is designed to land you the right contracts, faster.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                    {steps.map((step, index) => (
                        <div key={index} className="relative group text-center">
                            {/* Connector Line (Desktop Only) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-[60px] left-[60%] w-full h-px bg-gradient-to-r from-white/20 to-transparent z-0" />
                            )}

                            <div className="relative z-10">
                                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] ${step.icon === BrainCircuit ? 'bg-tj-yellow text-primary' : 'bg-white/5 text-white'} border border-white/10 mx-auto flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl group-hover:shadow-tj-yellow/20`}>
                                    <step.icon size={step.icon === BrainCircuit ? 48 : 40} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="text-blue-100/50 font-medium leading-relaxed px-4">
                                    {step.desc}
                                </p>
                            </div>

                            {/* Step Number Badge */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-tj-yellow text-primary font-black flex items-center justify-center text-sm shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                0{index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
