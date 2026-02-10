'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Building2, ChevronRight, BarChart3 } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';

const authoritiesData = [
    { name: 'Airport Authority of India', count: 124 },
    { name: 'Bharat Heavy Electricals Limited', count: 89 },
    { name: 'Central Public Works Department', count: 1432 },
    { name: 'Defense Research and Development Organization', count: 56 },
    { name: 'Employees State Insurance Corporation', count: 78 },
    { name: 'Food Corporation of India', count: 210 },
    { name: 'Gas Authority of India Limited', count: 45 },
    { name: 'Hindustan Aeronautics Limited', count: 34 },
    { name: 'Indian Oil Corporation Limited', count: 321 },
    { name: 'Jammu and Kashmir Bank', count: 12 },
    { name: 'Kendriya Vidyalaya Sangathan', count: 67 },
    { name: 'Life Insurance Corporation', count: 156 },
    { name: 'Ministry of Road Transport and Highways', count: 890 },
    { name: 'National Highways Authority of India', count: 2341 },
    { name: 'Oil and Natural Gas Corporation', count: 432 },
    { name: 'Public Works Department (PWD)', count: 5678 },
    { name: 'Reserve Bank of India', count: 23 },
    { name: 'State Bank of India', count: 198 },
    { name: 'Telecommunications Consultants India', count: 45 },
    { name: 'Union Public Service Commission', count: 5 },
    { name: 'Visakhapatnam Port Trust', count: 67 },
    { name: 'West Bengal State Electricity Distribution', count: 453 },
    { name: 'Yamuna Expressway Authority', count: 89 },
    { name: 'Zilla Parishad', count: 1200 }
];

export default function AuthorityDirectory() {
    const [searchTerm, setSearchTerm] = useState('');

    const groupedAuthorities = authoritiesData
        .filter(auth => auth.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .reduce((acc, auth) => {
            const letter = auth.name.charAt(0).toUpperCase();
            if (!acc[letter]) acc[letter] = [];
            acc[letter].push(auth);
            return acc;
        }, {} as Record<string, typeof authoritiesData>);

    const sortedLetters = Object.keys(groupedAuthorities).sort();

    return (
        <div className="bg-gray-50 min-h-screen py-8 font-sans">
            <div className="container mx-auto px-4">
                <Breadcrumb />

                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tender Authorities Directory</h1>
                        <p className="text-gray-600">Explore active tenders from over 500+ government departments and PSUs.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search Authority..."
                            className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-11 pr-4 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {sortedLetters.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-800 mb-1">No Authorities Found</h3>
                        <p className="text-gray-500">Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedLetters.map(letter => (
                            <div key={letter} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-3 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded bg-primary text-white text-sm font-bold shadow-sm">
                                        {letter}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        {groupedAuthorities[letter].length} Authorities Listed
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 relative">
                                    {groupedAuthorities[letter].map((auth) => (
                                        <Link
                                            key={auth.name}
                                            href={`/authority/${auth.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="group relative p-5 hover:bg-blue-50/30 transition-all duration-200 border-b md:border-b-0 md:border-r border-gray-100 last:border-0 hover:z-10"
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white group-hover:shadow-md transition-all duration-200">
                                                    <Building2 size={20} className="text-gray-500 group-hover:text-primary transition-colors" />
                                                </div>
                                                <span className="flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                                                    <BarChart3 size={10} />
                                                    {auth.count} Tenders
                                                </span>
                                            </div>

                                            <h3 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-primary transition-colors mb-1">
                                                {auth.name}
                                            </h3>

                                            <div className="flex items-center text-xs text-primary font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                View Active Tenders <ChevronRight size={12} />
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
