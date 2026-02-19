'use client';

import Link from 'next/link';
import { ArrowRight, Mail, BellRing, Sparkles } from 'lucide-react';

export default function CTASection() {
    return (
        <section className="py-12 md:py-24 bg-primary relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFC212]/5 rounded-full blur-[100px] -ml-48 -mb-48" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] bg-[url('/grid.svg')] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto rounded-[2rem] md:rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 p-6 md:p-16 text-center shadow-2xl relative overflow-hidden group">
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="relative z-10 space-y-6 md:space-y-8">
                        <div className="inline-flex items-center gap-2 md:gap-3 px-4 py-1.5 md:px-6 md:py-2 bg-white/10 rounded-full border border-white/10 text-tj-yellow font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">
                            <Sparkles size={14} className="md:w-4 md:h-4" />
                            Ready to scale?
                        </div>

                        <h2 className="text-3xl md:text-6xl font-black text-white px-2 md:px-4 leading-[1.2] md:leading-[1.1] tracking-tight md:tracking-tighter">
                            Next Big Contract <br className="hidden md:block" />
                            With <span className="text-tj-yellow italic">One Search</span>
                        </h2>

                        <p className="text-blue-100/70 text-sm md:text-xl px-2 md:px-24 leading-relaxed font-bold">
                            Join 10,000+ contractors who receive real-time updates and win 40% more tenders.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center pt-4 md:pt-8">
                            <Link
                                href="/active-tenders"
                                className="group relative w-full sm:w-auto overflow-hidden bg-white text-primary px-8 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:scale-105 transition-all shadow-2xl active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3"
                            >
                                Get Started
                                <ArrowRight size={20} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <button className="group relative w-full sm:w-auto overflow-hidden bg-tj-yellow text-primary px-8 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:scale-105 transition-all shadow-2xl active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3">
                                <BellRing size={18} className="md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                                WhatsApp Alerts
                            </button>
                        </div>

                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 pt-8 md:pt-12 border-t border-white/10">
                            {[
                                'Zero Commission',
                                'Direct Govt Links',
                                'Cancel Anytime'
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-tj-yellow rounded-full flex items-center justify-center text-primary">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-2.5 h-2.5"><path d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-white/80 font-black text-[9px] md:text-xs uppercase tracking-widest">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
