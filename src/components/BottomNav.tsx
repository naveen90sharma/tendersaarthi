'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, FileText, User, Menu } from 'lucide-react';
import { useState } from 'react';

export default function BottomNav() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-50 md:hidden pb-safe">
                <div className="flex justify-around items-center h-16 px-2">
                    <Link
                        href="/"
                        className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive('/') ? 'text-primary scale-110' : 'text-slate-400 opacity-70'}`}
                    >
                        <div className="relative">
                            <Home className="w-[22px] h-[22px]" strokeWidth={isActive('/') ? 2.5 : 2} />
                            {isActive('/') && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-tj-yellow rounded-full"></div>}
                        </div>
                        <span className={`text-[10px] uppercase tracking-widest mt-1 font-black transition-all ${isActive('/') ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>Home</span>
                    </Link>

                    <Link
                        href="/active-tenders"
                        className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive('/active-tenders') ? 'text-primary scale-110' : 'text-slate-400 opacity-70'}`}
                    >
                        <div className="relative">
                            <Search className="w-[22px] h-[22px]" strokeWidth={isActive('/active-tenders') ? 2.5 : 2} />
                            {isActive('/active-tenders') && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-tj-yellow rounded-full"></div>}
                        </div>
                        <span className={`text-[10px] uppercase tracking-widest mt-1 font-black transition-all ${isActive('/active-tenders') ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>Tenders</span>
                    </Link>

                    <Link
                        href="/my-tenders"
                        className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive('/my-tenders') ? 'text-primary scale-110' : 'text-slate-400 opacity-70'}`}
                    >
                        <div className="relative">
                            <FileText className="w-[22px] h-[22px]" strokeWidth={isActive('/my-tenders') ? 2.5 : 2} />
                            {isActive('/my-tenders') && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-tj-yellow rounded-full"></div>}
                        </div>
                        <span className={`text-[10px] uppercase tracking-widest mt-1 font-black transition-all ${isActive('/my-tenders') ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>My Bids</span>
                    </Link>

                    <Link
                        href="/login"
                        className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive('/login') || isActive('/profile') ? 'text-primary scale-110' : 'text-slate-400 opacity-70'}`}
                    >
                        <div className="relative">
                            <User className="w-[22px] h-[22px]" strokeWidth={isActive('/login') || isActive('/profile') ? 2.5 : 2} />
                            {(isActive('/login') || isActive('/profile')) && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-tj-yellow rounded-full"></div>}
                        </div>
                        <span className={`text-[10px] uppercase tracking-widest mt-1 font-black transition-all ${isActive('/login') || isActive('/profile') ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>User</span>
                    </Link>
                </div>
            </div>

            {/* Safe area spacer */}
            <div className="h-16 md:hidden" />
        </>
    );
}
