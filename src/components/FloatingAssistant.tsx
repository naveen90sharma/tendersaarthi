'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Sparkles, ArrowRight, Bell } from 'lucide-react';

export default function FloatingAssistant() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[100] hidden md:block">
            {/* Pop-up Menu */}
            <div className={`absolute bottom-20 right-0 w-[350px] bg-[#0B2C4A] rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden transition-all duration-500 transform ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-tj-yellow flex items-center justify-center text-primary shadow-lg shadow-tj-yellow/20">
                            <Sparkles size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h4 className="text-white font-black text-lg leading-none">AI Assistant</h4>
                            <p className="text-[10px] font-black text-tj-yellow uppercase tracking-widest mt-1">v4.0 Live Analyze</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl text-left transition-all group">
                            <p className="text-[10px] font-black text-blue-100/40 uppercase tracking-widest mb-1">Recent Insight</p>
                            <p className="text-sm text-white font-bold leading-snug group-hover:text-tj-yellow transition-colors">Road construction tenders in Rajasthan are up by 24% this week.</p>
                        </button>

                        <button className="w-full bg-tj-yellow hover:bg-yellow-400 p-4 rounded-2xl text-left transition-all group flex items-center justify-between shadow-xl shadow-tj-yellow/10">
                            <span className="text-sm text-primary font-black uppercase tracking-wider">Ask AI Anything</span>
                            <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="bg-white/5 p-4 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black text-blue-100/60 uppercase tracking-widest">Server Active</span>
                    </div>
                </div>
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-white text-primary rotate-90 scale-90' : 'bg-tj-yellow text-primary hover:scale-110'}`}
            >
                {isOpen ? <X size={28} strokeWidth={3} /> : <MessageSquare size={28} strokeWidth={2.5} />}

                {/* Ping notification */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-[#0B2C4A] flex items-center justify-center text-[10px] font-black text-white">1</span>
                    </span>
                )}
            </button>
        </div>
    );
}
