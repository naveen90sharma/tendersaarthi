'use client';

import Link from 'next/link';
import { ArrowRight, Mail, BellRing, Sparkles } from 'lucide-react';

export default function CTASection() {
    return (
        <section className="py-24 bg-primary relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFC212]/5 rounded-full blur-[100px] -ml-48 -mb-48" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] bg-[url('/grid.svg')] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-16 text-center shadow-2xl relative overflow-hidden group">
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="relative z-10 space-y-8">
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 rounded-full border border-white/10 text-tj-yellow font-black text-xs uppercase tracking-[0.2em]">
                            <Sparkles size={16} />
                            Ready to scale your business?
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-white px-4 leading-[1.1] tracking-tighter">
                            Your Next Big Contract <br className="hidden md:block" />
                            Starts With <span className="text-tj-yellow italic">One Search</span>
                        </h2>

                        <p className="text-blue-100/70 text-lg md:text-xl md:px-24 leading-relaxed font-bold">
                            Join 10,000+ contractors who receive real-time updates and win 40% more tenders using our platform.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                            <Link
                                href="/active-tenders"
                                className="group relative w-full sm:w-auto overflow-hidden bg-white text-primary px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3"
                            >
                                Get Started
                                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <button className="group relative w-full sm:w-auto overflow-hidden bg-tj-yellow text-primary px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3">
                                <BellRing size={20} className="group-hover:rotate-12 transition-transform" />
                                WhatsApp Alerts
                            </button>
                        </div>

                        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 pt-12 border-t border-white/10">
                            {[
                                'Zero Commission',
                                'Direct Govt Links',
                                'Cancel Anytime'
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-tj-yellow rounded-full flex items-center justify-center text-primary">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><path d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-white/80 font-black text-xs uppercase tracking-widest">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
