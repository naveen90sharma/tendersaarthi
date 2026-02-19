'use client';

import React from 'react';
import { MapPin, Zap } from 'lucide-react';

export default function TenderHotspots() {
    const hotspots = [
        { city: 'Delhi NCR', count: '450+', top: '25%', left: '45%' },
        { city: 'Mumbai', count: '320+', top: '65%', left: '35%' },
        { city: 'Bangalore', count: '280+', top: '80%', left: '42%' },
        { city: 'Kolkata', count: '150+', top: '55%', left: '75%' },
    ];

    return (
        <section className="py-20 md:py-32 bg-white relative overflow-hidden border-t border-slate-100">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Live Procurement Map
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-[#0B2C4A] tracking-tighter leading-tight mb-6">
                            Real-time <br />
                            <span className="text-primary italic">Hotspots</span>
                        </h2>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8 max-w-lg">
                            Monitor nationwide tender activities with our live geospatial tracking system.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {hotspots.map((spot, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all group">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <MapPin size={22} strokeWidth={2.5} />
                                        </div>
                                        <h4 className="font-black text-[#0B2C4A] text-lg">{spot.city}</h4>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <span className="text-2xl font-black text-primary">{spot.count}</span>
                                        <div className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative bg-slate-50/50 rounded-[3rem] p-8 md:p-12 border border-slate-100 overflow-hidden min-h-[500px] flex items-center justify-center">
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0B2C4A 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                        <div className="relative w-full h-[500px] flex items-center justify-center">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/f/f5/India_map.svg"
                                alt="India Map"
                                className="w-full h-full object-contain opacity-40 brightness-0"
                                style={{ filter: 'invert(0.1)' }} // Makes it a dark gray
                                onError={(e) => {
                                    e.currentTarget.src = "https://raw.githubusercontent.com/djaiss/mapsicon/67499696b9909241d720b080517441a129ef6653/all/in/vector.svg";
                                }}
                            />
                        </div>

                        {/* Pulsing Hotspots */}
                        {hotspots.map((spot, i) => (
                            <div
                                key={i}
                                className="absolute group/spot"
                                style={{ top: spot.top, left: spot.left }}
                            >
                                <div className="relative flex h-6 w-6 items-center justify-center">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-lg border-2 border-white"></span>
                                </div>
                                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-[#0B2C4A] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border border-slate-100">
                                    {spot.city}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
