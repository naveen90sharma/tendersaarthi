'use client';

'use client';

import Link from 'next/link';
import { ArrowRight, BellRing, CheckCircle2 } from 'lucide-react';

export default function CTASection() {
    const features = ['Zero Commission', 'Direct Govt Links', 'Cancel Anytime'];

    return (
        <section className="py-10 md:py-14 bg-primary relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] -mr-40 -mt-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFC212]/5 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto rounded-2xl bg-white/5 border border-white/10 px-6 py-8 md:px-12 md:py-10 text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-tj-yellow text-[9px] font-semibold uppercase tracking-widest mb-4">
                        <span className="w-1.5 h-1.5 bg-tj-yellow rounded-full animate-pulse" />
                        Ready to scale?
                    </div>

                    {/* Heading */}
                    <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight tracking-tight mb-3">
                        Your Next Big Contract <br className="hidden md:block" />
                        With <span className="text-tj-yellow italic">One Search</span>
                    </h2>

                    {/* Subtext */}
                    <p className="text-blue-100/60 text-sm leading-relaxed mb-6 max-w-md mx-auto">
                        Join 10,000+ contractors who receive real-time updates and win 40% more tenders.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
                        <Link
                            href="/active-tenders"
                            className="w-full sm:w-auto bg-white text-primary px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-all shadow-lg flex items-center justify-center gap-2 tracking-wide"
                        >
                            Get Started
                            <ArrowRight size={15} />
                        </Link>

                        <button className="w-full sm:w-auto bg-tj-yellow text-primary px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-yellow-400 transition-all shadow-lg flex items-center justify-center gap-2 tracking-wide">
                            <BellRing size={15} />
                            WhatsApp Alerts
                        </button>
                    </div>

                    {/* Trust signals */}
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-5 border-t border-white/10">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <CheckCircle2 size={12} className="text-tj-yellow" />
                                <span className="text-white/60 text-[10px] font-medium uppercase tracking-wider">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
