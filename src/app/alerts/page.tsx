'use client';

import { Suspense } from 'react';
import WhatsAppAlertSection from '@/components/WhatsAppAlertSection';
import { Bell, ShieldCheck, Zap } from 'lucide-react';

export default function AlertsPage() {
    return (
        <div className="min-h-screen bg-[#fcfdfe] py-12 font-sans">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Hero Header */}
                <div className="flex flex-col lg:flex-row items-center gap-10 mb-16">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-green-50 text-[#128C7E] px-4 py-2 rounded-full border border-green-100 mb-6 group animate-bounce">
                            <Zap size={16} fill="currentColor" />
                            <span className="text-xs font-black uppercase tracking-widest">Instant Notifications</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-[1.1] uppercase tracking-tighter">
                            Don't Miss a <span className="text-[#25D366] underline decoration-wavy decoration-8 underline-offset-8">Tender</span> Again
                        </h1>
                        <p className="text-lg text-gray-500 font-medium max-w-xl mb-8 leading-relaxed">
                            Subscribe to our WhatsApp Alert service and receive customized tender notifications directly on your phone. Save time and stay ahead of the competition.
                        </p>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-[#25D366]">
                                    <ShieldCheck size={20} />
                                </div>
                                <span className="text-sm font-black text-gray-700 uppercase tracking-tight">100% Secure</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-tj-blue">
                                    <Bell size={20} />
                                </div>
                                <span className="text-sm font-black text-gray-700 uppercase tracking-tight">Real-time alerts</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        <WhatsAppAlertSection />
                    </div>
                </div>

                {/* How it works */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-gray-100">
                    <div className="text-center">
                        <div className="text-4xl font-black text-gray-100 mb-4 tracking-tighter">01.</div>
                        <h4 className="text-xl font-black text-gray-800 mb-2 uppercase tracking-tight">Set Preferences</h4>
                        <p className="text-sm text-gray-500 font-medium">Choose your business categories and target states to receive only relevant data.</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-gray-100 mb-4 tracking-tighter">02.</div>
                        <h4 className="text-xl font-black text-gray-800 mb-2 uppercase tracking-tight">Verify Number</h4>
                        <p className="text-sm text-gray-500 font-medium">Add your WhatsApp number and toggle the alerts to 'Active' status.</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-gray-100 mb-4 tracking-tighter">03.</div>
                        <h4 className="text-xl font-black text-gray-800 mb-2 uppercase tracking-tight">Stay Updated</h4>
                        <p className="text-sm text-gray-500 font-medium">Receive direct links to new government tenders within minutes of publication.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
