'use client';

import { useState, useEffect } from 'react';
import { MapPin, Loader2, Navigation, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LocationDetector() {
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'detecting' | 'permission_denied' | 'success' | 'error'>('idle');
    const [locationData, setLocationData] = useState<{ city: string; state: string } | null>(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const hasSeen = localStorage.getItem('location_dismissed');
            if (!hasSeen) setShow(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const detectLocation = () => {
        if (!navigator.geolocation) { setStatus('error'); return; }
        setStatus('detecting');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
                    const data = await response.json();
                    if (data.address) {
                        const city = data.address.city || data.address.town || data.address.village || data.address.suburb || '';
                        const state = data.address.state || '';
                        setLocationData({ city, state });
                        setStatus('success');
                        setTimeout(() => {
                            if (city) router.push(`/active-tenders?location=${encodeURIComponent(city)}`);
                            else if (state) router.push(`/active-tenders?state=${encodeURIComponent(state)}`);
                        }, 1200);
                    }
                } catch {
                    setStatus('error');
                }
            },
            (error) => {
                if (error.code === 1) setStatus('permission_denied');
                else setStatus('error');
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    const dismiss = () => {
        setShow(false);
        localStorage.setItem('location_dismissed', 'true');
    };

    if (!show && status === 'idle') return null;

    return (
        <div className="flex items-center justify-center gap-2 flex-wrap">
            {/* Main pill button */}
            <button
                onClick={status === 'idle' || status === 'error' || status === 'permission_denied' ? detectLocation : undefined}
                disabled={status === 'detecting' || status === 'success'}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all
                    ${status === 'success'
                        ? 'bg-green-500/20 border-green-400/30 text-green-300 cursor-default'
                        : status === 'permission_denied' || status === 'error'
                            ? 'bg-red-500/10 border-red-400/20 text-red-300 hover:bg-red-500/20 cursor-pointer'
                            : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15 hover:border-white/30 cursor-pointer'
                    }
                `}
            >
                {status === 'detecting' ? (
                    <Loader2 size={13} className="animate-spin text-tj-yellow" />
                ) : status === 'success' ? (
                    <CheckCircle size={13} className="text-green-400" />
                ) : (
                    <MapPin size={13} className={status === 'permission_denied' ? 'text-red-400' : 'text-tj-yellow'} />
                )}

                <span>
                    {status === 'idle' && 'Find Tenders Near Me'}
                    {status === 'detecting' && 'Detecting location…'}
                    {status === 'success' && `Tenders in ${locationData?.city || locationData?.state}`}
                    {status === 'permission_denied' && 'Location blocked — retry'}
                    {status === 'error' && 'Could not detect — retry'}
                </span>

                {status === 'idle' && (
                    <Navigation size={11} className="opacity-50" />
                )}
            </button>

            {/* Dismiss — only in idle */}
            {status === 'idle' && (
                <button
                    onClick={dismiss}
                    className="text-white/20 hover:text-white/50 transition-colors text-[10px] font-medium"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
