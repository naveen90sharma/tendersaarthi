'use client';

import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';

export default function CTASection() {
    return (
        <section className="py-16 bg-gradient-to-br from-tj-blue via-[#1a4a7a] to-[#0a2e50] relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tighter">
                        Ready to Find Your Next Tender?
                    </h2>
                    <p className="text-blue-100 text-lg mb-8 font-medium">
                        Join thousands of businesses finding and winning government tenders every day
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/active-tenders"
                            className="group inline-flex items-center gap-2 bg-white text-tj-blue px-8 py-4 rounded-lg font-black text-lg hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl uppercase tracking-widest"
                        >
                            Browse Tenders
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <button className="inline-flex items-center gap-2 bg-tj-yellow text-black border-2 border-tj-yellow px-8 py-4 rounded-lg font-black text-lg hover:brightness-105 transition-all uppercase tracking-widest shadow-lg">
                            <Mail size={20} />
                            Get Daily Alerts
                        </button>
                    </div>

                    <p className="text-blue-200 text-sm mt-6 font-bold uppercase tracking-tight">
                        ✓ Free to browse &nbsp; • &nbsp; ✓ No credit card required &nbsp; • &nbsp; ✓ Updated daily
                    </p>
                </div>
            </div>
        </section>
    );
}
