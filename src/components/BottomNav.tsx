'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, MapPin, Bookmark, User, Bell, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLocating, setIsLocating] = useState(false);

    const isActive = (path: string) => pathname === path || (path !== '/' && pathname?.startsWith(path));

    if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')) return null;

    const handleNearMeClick = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!navigator.geolocation) {
            router.push('/active-tenders');
            return;
        }

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
                    const data = await response.json();
                    if (data.address) {
                        const city = data.address.city || data.address.town || data.address.village || data.address.suburb || '';
                        const state = data.address.state || '';

                        if (city) {
                            router.push(`/active-tenders?location=${encodeURIComponent(city)}`);
                        } else if (state) {
                            router.push(`/active-tenders?state=${encodeURIComponent(state)}`);
                        } else {
                            router.push('/active-tenders');
                        }
                    } else {
                        router.push('/active-tenders');
                    }
                } catch {
                    router.push('/active-tenders');
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                router.push('/active-tenders');
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-xl border-t border-slate-100/50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
                <div className="flex justify-around items-end h-[68px] px-2 relative">

                    {/* Left Items */}
                    <div className="flex justify-around items-center w-2/5 h-full pt-1 pb-2">
                        <Link href="/" className="flex flex-col items-center justify-center w-full h-full group">
                            <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive('/') ? 'bg-[#103e68]/10 text-[#103e68]' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                <Home size={22} className={isActive('/') ? 'fill-[#103e68]/20 stroke-2' : 'stroke-[1.8]'} />
                            </div>
                            <span className={`text-[9px] mt-0.5 font-bold transition-all ${isActive('/') ? 'text-[#103e68]' : 'text-slate-400'}`}>Home</span>
                        </Link>

                        <Link href="/my-tenders" className="flex flex-col items-center justify-center w-full h-full group">
                            <div className={`p-1.5 rounded-xl transition-all duration-300 relative ${isActive('/my-tenders') ? 'bg-[#103e68]/10 text-[#103e68]' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                <Bookmark size={22} className={isActive('/my-tenders') ? 'fill-[#103e68]/20 stroke-2' : 'stroke-[1.8]'} />
                            </div>
                            <span className={`text-[9px] mt-0.5 font-bold transition-all ${isActive('/my-tenders') ? 'text-[#103e68]' : 'text-slate-400'}`}>Saved</span>
                        </Link>
                    </div>

                    {/* Center Floating Button */}
                    <div className="relative w-1/5 h-full flex flex-col items-center justify-end pb-2">
                        <div className="absolute -top-5 flex items-center justify-center">
                            <button onClick={handleNearMeClick} disabled={isLocating} className="flex items-center justify-center w-[54px] h-[54px] rounded-full bg-[#103e68] text-white shadow-[0_8px_20px_rgba(16,62,104,0.3)] active:scale-95 transition-transform hover:bg-[#0a2742] border-[4px] border-white/95">
                                {isLocating ? <Loader2 size={24} className="animate-spin" strokeWidth={2.5} /> : <MapPin size={24} strokeWidth={2.5} />}
                            </button>
                        </div>
                        <span className={`text-[9px] mt-0.5 font-bold transition-all ${isLocating ? 'text-[#103e68]' : 'text-slate-400'}`}>
                            {isLocating ? 'Locating...' : 'Near Me'}
                        </span>
                    </div>

                    {/* Right Items */}
                    <div className="flex justify-around items-center w-2/5 h-full pt-1 pb-2">
                        <Link href="/alerts" className="flex flex-col items-center justify-center w-full h-full group">
                            <div className={`p-1.5 rounded-xl transition-all duration-300 relative ${isActive('/alerts') ? 'bg-[#103e68]/10 text-[#103e68]' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                <Bell size={22} className={isActive('/alerts') ? 'fill-[#103e68]/20 stroke-2' : 'stroke-[1.8]'} />
                                <span className="absolute top-1 right-1 w-2 h-2 rounded-full border-2 border-white bg-red-500"></span>
                            </div>
                            <span className={`text-[9px] mt-0.5 font-bold transition-all ${isActive('/alerts') ? 'text-[#103e68]' : 'text-slate-400'}`}>Alerts</span>
                        </Link>

                        <Link href="/profile" className="flex flex-col items-center justify-center w-full h-full group">
                            <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive('/profile') ? 'bg-[#103e68]/10 text-[#103e68]' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                <User size={22} className={isActive('/profile') ? 'fill-[#103e68]/20 stroke-2' : 'stroke-[1.8]'} />
                            </div>
                            <span className={`text-[9px] mt-0.5 font-bold transition-all ${isActive('/profile') ? 'text-[#103e68]' : 'text-slate-400'}`}>Profile</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Spacer */}
            <div className="h-[68px] md:hidden" />
        </>
    );
}
