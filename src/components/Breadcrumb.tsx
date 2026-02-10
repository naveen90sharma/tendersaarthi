'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
    const pathname = usePathname();
    const pathnames = pathname ? pathname.split('/').filter((x) => x) : [];

    return (
        <nav className="flex items-center text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
            <Link href="/" className="hover:text-primary flex items-center gap-1">
                <Home size={14} />
                Home
            </Link>
            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const displayName = decodeURIComponent(name.replace(/-/g, ' ')).replace(/\b\w/g, l => l.toUpperCase());

                return (
                    <span key={name} className="flex items-center">
                        <ChevronRight size={14} className="mx-2 text-gray-400" />
                        {isLast ? (
                            <span className="font-semibold text-gray-800">{displayName}</span>
                        ) : (
                            <Link href={routeTo} className="hover:text-primary transition-colors">
                                {displayName}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
