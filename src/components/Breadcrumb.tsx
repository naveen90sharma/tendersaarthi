'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
    const pathname = usePathname();
    const pathnames = pathname ? pathname.split('/').filter((x) => x) : [];

    return (
        <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider overflow-x-auto whitespace-nowrap scrollbar-hide mb-6 pb-2 md:pb-0">
            <Link href="/" className="hover:text-primary transition-colors flex-shrink-0">
                Home
            </Link>
            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const displayName = decodeURIComponent(name.replace(/-/g, ' ')).replace(/\b\w/g, l => l.toUpperCase());

                return (
                    <div key={name} className="flex items-center gap-2 flex-shrink-0">
                        <ChevronRight size={12} />
                        {isLast ? (
                            <span className="text-primary truncate max-w-[200px]">{displayName}</span>
                        ) : (
                            <Link href={routeTo} className="hover:text-primary transition-colors">
                                {displayName}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
