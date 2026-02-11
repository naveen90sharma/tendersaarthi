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
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-50 md:hidden pb-safe">
                <div className="flex justify-around items-center h-16">
                    <Link
                        href="/"
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/') ? 'text-primary' : 'text-gray-400'}`}
                    >
                        <Home size={20} strokeWidth={isActive('/') ? 2.5 : 2} />
                        <span className="text-[10px] font-bold">Home</span>
                    </Link>

                    <Link
                        href="/active-tenders"
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/active-tenders') ? 'text-primary' : 'text-gray-400'}`}
                    >
                        <Search size={20} strokeWidth={isActive('/active-tenders') ? 2.5 : 2} />
                        <span className="text-[10px] font-bold">Search</span>
                    </Link>

                    <Link
                        href="/my-tenders"
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/my-tenders') ? 'text-primary' : 'text-gray-400'}`}
                    >
                        <div className="relative">
                            <FileText size={20} strokeWidth={isActive('/my-tenders') ? 2.5 : 2} />
                            {/* Optional: Add badge here if needed */}
                        </div>
                        <span className="text-[10px] font-bold">My Tenders</span>
                    </Link>

                    <Link
                        href="/login"
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/login') || isActive('/profile') ? 'text-primary' : 'text-gray-400'}`}
                    >
                        <User size={20} strokeWidth={isActive('/login') ? 2.5 : 2} />
                        <span className="text-[10px] font-bold">Account</span>
                    </Link>
                </div>
            </div>

            {/* Safe area spacer */}
            <div className="h-16 md:hidden" />
        </>
    );
}
