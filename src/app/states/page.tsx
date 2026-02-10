'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronRight, BarChart3 } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';

const statesData = [
    { name: 'Andhra Pradesh', count: 450 },
    { name: 'Arunachal Pradesh', count: 120 },
    { name: 'Assam', count: 340 },
    { name: 'Bihar', count: 890 },
    { name: 'Chhattisgarh', count: 420 },
    { name: 'Delhi', count: 1200 },
    { name: 'Goa', count: 150 },
    { name: 'Gujarat', count: 1100 },
    { name: 'Haryana', count: 560 },
    { name: 'Himachal Pradesh', count: 230 },
    { name: 'Jharkhand', count: 310 },
    { name: 'Karnataka', count: 980 },
    { name: 'Kerala', count: 450 },
    { name: 'Madhya Pradesh', count: 870 },
    { name: 'Maharashtra', count: 2100 },
    { name: 'Manipur', count: 110 },
    { name: 'Meghalaya', count: 90 },
    { name: 'Mizoram', count: 80 },
    { name: 'Nagaland', count: 70 },
    { name: 'Odisha', count: 650 },
    { name: 'Punjab', count: 540 },
    { name: 'Rajasthan', count: 920 },
    { name: 'Sikkim', count: 60 },
    { name: 'Tamil Nadu', count: 1050 },
    { name: 'Telangana', count: 780 },
    { name: 'Tripura', count: 130 },
    { name: 'Uttar Pradesh', count: 2500 },
    { name: 'Uttarakhand', count: 340 },
    { name: 'West Bengal', count: 1300 },
    { name: 'Jammu and Kashmir', count: 210 },
    { name: 'Ladakh', count: 45 },
    { name: 'Puducherry', count: 35 },
];

export default function StateDirectory() {
    const [searchTerm, setSearchTerm] = useState('');

    const groupedStates = statesData
        .filter(state => state.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .reduce((acc, state) => {
            const letter = state.name.charAt(0).toUpperCase();
            if (!acc[letter]) acc[letter] = [];
            acc[letter].push(state);
            return acc;
        }, {} as Record<string, typeof statesData>);

    const sortedLetters = Object.keys(groupedStates).sort();

    return (
        <div className="bg-gray-50 min-h-screen py-8 font-sans">
            <div className="container mx-auto px-4">
                <Breadcrumb />

                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tenders by State</h1>
                        <p className="text-gray-600">Find government tenders across all Indian States and Union Territories.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search State..."
                            className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-11 pr-4 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {sortedLetters.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-800 mb-1">No States Found</h3>
                        <p className="text-gray-500">Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedLetters.map(letter => (
                            <div key={letter} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-3 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded bg-orange-500 text-white text-sm font-bold shadow-sm">
                                        {letter}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        {groupedStates[letter].length} States Listed
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 relative">
                                    {groupedStates[letter].map((state) => (
                                        <Link
                                            key={state.name}
                                            href={`/state/${state.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="group relative p-5 hover:bg-orange-50/30 transition-all duration-200 border-b md:border-b-0 md:border-r border-gray-100 last:border-0 hover:z-10"
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white group-hover:shadow-md transition-all duration-200">
                                                    <MapPin size={20} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
                                                </div>
                                                <span className="flex items-center gap-1 text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                                                    <BarChart3 size={10} />
                                                    {state.count}
                                                </span>
                                            </div>

                                            <h3 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-orange-600 transition-colors mb-1">
                                                {state.name}
                                            </h3>

                                            <div className="flex items-center text-xs text-orange-600 font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                View State Tenders <ChevronRight size={12} />
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
