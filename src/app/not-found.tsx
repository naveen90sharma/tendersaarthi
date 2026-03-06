'use client';

import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <h1 className="relative text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary-dark">
                    404
                </h1>
            </div>

            <h2 className="text-2xl font-bold mb-4">Oops! Page not found</h2>
            <p className="text-gray-600 mb-10 max-w-md">
                The tender or information you're looking for might have been moved, archived, or deleted.
                Try searching for it instead.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/25"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>
                <Link
                    href="/search"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full font-semibold hover:border-primary hover:text-primary transition-all duration-300"
                >
                    <Search size={18} />
                    Search Tenders
                </Link>
            </div>
        </div>
    );
}
