'use client';

import { Search, Filter, Bell, FileCheck, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            icon: Search,
            title: 'Search Database',
            description: 'Intelligent AI-powered search through 1M+ archived and 10k+ live tenders.',
            tag: 'Discovery'
        },
        {
            icon: Filter,
            title: 'Precision Filter',
            description: 'Narrow down by EMD, Value, Location, and Department in milliseconds.',
            tag: 'Filtering'
        },
        {
            icon: Bell,
            title: 'Smart Alerts',
            description: 'Get notified via WhatsApp and Email for tenders matching your DNA.',
            tag: 'Updates'
        },
        {
            icon: FileCheck,
            title: 'Download & Bid',
            description: 'Access BOQ, NIT, and Tender documents with single-click direct links.',
            tag: 'Success'
        },
    ];

    return (
        <section className="py-24 bg-[#f8fafc] relative overflow-hidden">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
                    <div className="inline-block px-4 py-1.5 bg-primary/5 rounded-full text-[11px] font-black text-primary uppercase tracking-[0.2em] border border-primary/10 mb-4">
                        Workflow Process
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-primary tracking-tighter leading-none">Simple Path to Success</h2>
                    <p className="text-slate-400 text-sm md:text-base font-bold uppercase tracking-wider">
                        From discovery to submission in four high-efficiency steps
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {steps.map((step, index) => (
                        <div key={index} className="relative group">
                            {/* Card Decorative Background */}
                            <div className="absolute inset-0 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 group-hover:shadow-primary/10 transition-all duration-500 scale-95 group-hover:scale-100" />

                            {/* Main Content */}
                            <div className="relative p-8 text-center flex flex-col items-center h-full min-h-[380px] justify-between z-10">
                                <div className="space-y-6 flex flex-col items-center">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-[#f8fafc] rounded-3xl flex items-center justify-center text-primary border border-slate-100 group-hover:bg-primary group-hover:text-white group-hover:rotate-12 transition-all duration-500">
                                            <step.icon size={32} strokeWidth={2.5} />
                                        </div>
                                        <div className="absolute -top-3 -left-3 w-10 h-10 bg-white rounded-2xl flex items-center justify-center font-black text-xs text-primary shadow-lg border border-slate-50">
                                            0{index + 1}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="text-[10px] font-black text-[#FFC212] uppercase tracking-[0.3em]">{step.tag}</div>
                                        <h3 className="text-2xl font-black text-primary tracking-tight">{step.title}</h3>
                                        <p className="text-sm text-slate-400 font-bold leading-relaxed">{step.description}</p>
                                    </div>
                                </div>

                                <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-200 group-hover:border-primary group-hover:text-primary transition-all">
                                    <ArrowRight size={18} />
                                </div>
                            </div>

                            {/* Connection Arrow (Except Last) */}
                            {index < 3 && (
                                <div className="hidden lg:flex absolute top-1/4 -right-4 w-8 h-8 items-center justify-center text-slate-200 z-0">
                                    <div className="w-full h-[2px] bg-slate-100" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
