'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Globe2, ChevronRight, BarChart3 } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';

const countriesData = [
    { name: 'Australia', count: 120 },
    { name: 'Bangladesh', count: 450 },
    { name: 'Belarus', count: 80 },
    { name: 'Bosnia and Herzegovina', count: 60 },
    { name: 'Brazil', count: 560 },
    { name: 'Canada', count: 320 },
    { name: 'Chile', count: 110 },
    { name: 'China', count: 2100 },
    { name: 'Egypt', count: 230 },
    { name: 'France', count: 410 },
    { name: 'Germany', count: 520 },
    { name: 'Japan', count: 670 },
    { name: 'Morocco', count: 90 },
    { name: 'Philippines', count: 180 },
    { name: 'Poland', count: 240 },
    { name: 'Russia', count: 890 },
    { name: 'South Africa', count: 340 },
    { name: 'Spain', count: 290 },
    { name: 'Ukraine', count: 150 },
    { name: 'United Kingdom', count: 760 },
    { name: 'United States', count: 1500 },
    { name: 'Vietnam', count: 310 },
];

export default function CountryDirectory() {
    const [searchTerm, setSearchTerm] = useState('');

    const groupedCountries = countriesData
        .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .reduce((acc, c) => {
            const letter = c.name.charAt(0).toUpperCase();
            if (!acc[letter]) acc[letter] = [];
            acc[letter].push(c);
            return acc;
        }, {} as Record<string, typeof countriesData>);

    const sortedLetters = Object.keys(groupedCountries).sort();

    return (
        <div className="bg-gray-50 min-h-screen py-8 font-sans">
            <div className="container mx-auto px-4">
                <Breadcrumb />

                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Global Tenders by Country</h1>
                        <p className="text-gray-600">Access international tender opportunities from across the globe.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search Country..."
                            className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-11 pr-4 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {sortedLetters.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Globe2 size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-800 mb-1">No Countries Found</h3>
                        <p className="text-gray-500">Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedLetters.map(letter => (
                            <div key={letter} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-3 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded bg-green-600 text-white text-sm font-bold shadow-sm">
                                        {letter}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        {groupedCountries[letter].length} Countries Listed
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 relative">
                                    {groupedCountries[letter].map((country) => (
                                        <Link
                                            key={country.name}
                                            href={`/country/${country.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="group relative p-5 hover:bg-green-50/30 transition-all duration-200 border-b md:border-b-0 md:border-r border-gray-100 last:border-0 hover:z-10"
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white group-hover:shadow-md transition-all duration-200">
                                                    <Globe2 size={20} className="text-gray-500 group-hover:text-green-600 transition-colors" />
                                                </div>
                                                <span className="flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                                                    <BarChart3 size={10} />
                                                    {country.count}
                                                </span>
                                            </div>

                                            <h3 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-green-700 transition-colors mb-1">
                                                {country.name}
                                            </h3>

                                            <div className="flex items-center text-xs text-green-600 font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                View Country Tenders <ChevronRight size={12} />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
