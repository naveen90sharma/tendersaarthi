'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2, ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LocationDetector() {
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'detecting' | 'permission_denied' | 'success' | 'error'>('idle');
    const [locationData, setLocationData] = useState<{ city: string; state: string } | null>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Automatically check if we can suggest location after 2 seconds
        const timer = setTimeout(() => {
            const hasSeen = localStorage.getItem('location_dismissed');
            if (!hasSeen) setShowBanner(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setStatus('error');
            return;
        }

        setStatus('detecting');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Using OpenStreetMap's Nominatim (Free, no key required for low volume)
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
                    const data = await response.json();

                    if (data.address) {
                        const city = data.address.city || data.address.town || data.address.village || data.address.suburb || '';
                        const state = data.address.state || '';

                        setLocationData({ city, state });
                        setStatus('success');

                        // Small delay before redirecting for better UX
                        setTimeout(() => {
                            if (city) {
                                router.push(`/active-tenders?location=${encodeURIComponent(city)}`);
                            } else if (state) {
                                router.push(`/active-tenders?state=${encodeURIComponent(state)}`);
                            }
                        }, 1500);
                    }
                } catch (err) {
                    console.error('Geo error:', err);
                    setStatus('error');
                }
            },
            (error) => {
                console.error('Permission error:', error);
                if (error.code === 1) setStatus('permission_denied');
                else setStatus('error');
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    const dismissBanner = () => {
        setShowBanner(false);
        localStorage.setItem('location_dismissed', 'true');
    };

    if (!showBanner && status === 'idle') return null;

    return (
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[4rem] transition-all duration-700 bg-white/5 backdrop-blur-sm border border-white/10 mx-4 md:mx-0">
            {/* Visual Flair */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-tj-yellow/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

            <div className="relative p-4 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6 z-10">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
                    <div className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center shrink-0 transition-all duration-500 relative z-10 ${status === 'permission_denied' ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-tj-yellow border border-white/10'}`}>
                        {status === 'detecting' ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : status === 'permission_denied' ? (
                            <X size={24} />
                        ) : (
                            <MapPin size={24} className={status === 'success' ? 'scale-110 text-tj-yellow' : ''} />
                        )}
                    </div>

                    <div className="space-y-0.5 md:space-y-1">
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-tj-yellow text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 md:mb-1">
                            <Navigation size={8} className="animate-pulse" />
                            Market Scan
                        </div>
                        <h3 className={`text-lg md:text-3xl font-black tracking-tight leading-none ${status === 'permission_denied' ? 'text-red-400' : 'text-white'}`}>
                            {status === 'idle' && <>Find Tenders <span className="text-tj-yellow">Near You</span></>}
                            {status === 'detecting' && "Scanning Local..."}
                            {status === 'success' && <div className="text-sm md:text-3xl">Found in {locationData?.city || locationData?.state}!</div>}
                            {status === 'permission_denied' && "Location Blocked"}
                        </h3>
                        <p className={`text-[10px] md:text-base font-medium max-w-lg leading-tight md:leading-relaxed ${status === 'permission_denied' ? 'text-red-300' : 'text-blue-100/40'}`}>
                            {status === 'idle' && "Activate scanning for local regions."}
                            {status === 'detecting' && "Connecting servers..."}
                            {status === 'success' && "Market analysis complete."}
                            {status === 'permission_denied' && "Please enable location access in your browser to scan nearby tenders."}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
                    {status === 'idle' && (
                        <div className="flex gap-2 w-full">
                            <button
                                onClick={detectLocation}
                                className="flex-1 lg:flex-none bg-tj-yellow text-primary px-6 py-3 rounded-xl md:rounded-2xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 hover:-translate-y-1 transition-all shadow-xl shadow-tj-yellow/10"
                            >
                                SCAN AREA
                                <ArrowRight size={14} strokeWidth={3} />
                            </button>
                            <button
                                onClick={dismissBanner}
                                className="px-4 py-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors text-[8px] font-black uppercase tracking-widest"
                            >
                                CLOSE
                            </button>
                        </div>
                    )}

                    {(status === 'permission_denied' || status === 'error') && (
                        <button
                            onClick={() => setStatus('idle')}
                            className="w-full lg:w-auto px-10 py-4 bg-white/10 text-white rounded-xl font-black uppercase text-[10px] tracking-widest border border-white/10"
                        >
                            RE-SCAN
                        </button>
                    )}
                </div>
            </div>

            {/* Loading Progress Bar */}
            {status === 'detecting' && (
                <div className="absolute bottom-0 left-0 h-1 bg-tj-yellow animate-[shimmer_2s_infinite] opacity-50" style={{ width: '100%' }} />
            )}
        </div>
    );
}
