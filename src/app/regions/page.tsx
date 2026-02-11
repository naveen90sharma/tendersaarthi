'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Map, ChevronRight, BarChart3 } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';

const regionsData = [
    { name: 'Africa', count: 1240 },
    { name: 'Asia', count: 4500 },
    { name: 'Australia & Oceania', count: 320 },
    { name: 'Europe', count: 3100 },
    { name: 'Latin America', count: 890 },
    { name: 'ME (Middle East)', count: 1540 },
    { name: 'MENA (Middle East & North Africa)', count: 2100 },
    { name: 'North America', count: 1800 },
    { name: 'SAARC', count: 670 },
];

export default function RegionDirectory() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRegions = regionsData.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="bg-gray-50 min-h-screen pb-16 font-sans">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
                <div className="container mx-auto px-4 py-4">
                    <Breadcrumb />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tenders by Region</h1>
                        <p className="text-gray-600">Explore tenders categorized by major global regions.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search Region..."
                            className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-11 pr-4 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {filteredRegions.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Map size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-800 mb-1">No Regions Found</h3>
                        <p className="text-gray-500">Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRegions.map((region) => (
                            <Link
                                key={region.name}
                                href={`/region/${region.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Map size={24} />
                                    </div>
                                    <span className="flex items-center gap-1 text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                                        <BarChart3 size={12} />
                                        {region.count}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                                    {region.name}
                                </h3>

                                <div className="flex items-center text-sm text-gray-500 font-medium mt-4 group-hover:text-blue-600 transition-colors">
                                    Explore Active Tenders <ChevronRight size={16} className="ml-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
