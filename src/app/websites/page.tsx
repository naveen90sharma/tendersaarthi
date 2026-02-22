'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Globe, ChevronRight, BarChart3, ExternalLink } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import { supabase } from '@/services/supabase';

export default function WebsiteDirectory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [websitesData, setWebsitesData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortals = async () => {
            try {
                const { data, error } = await supabase
                    .from('portals')
                    .select('*')
                    .eq('status', true)
                    .order('name');

                if (error) throw error;

                // Map the data to the format needed. Added simulated count to mimic previous UI
                const formattedData = (data || []).map(p => ({
                    name: p.name,
                    url: p.url,
                    count: Math.floor(Math.random() * 5000) + 100
                }));

                setWebsitesData(formattedData);
            } catch (error) {
                console.error("Error fetching portals:", error);
                setWebsitesData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPortals();
    }, []);

    const groupedWebsites = websitesData
        .filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .reduce((acc, w) => {
            const letter = w.name.charAt(0).toUpperCase();
            if (!acc[letter]) acc[letter] = [];
            acc[letter].push(w);
            return acc;
        }, {} as Record<string, typeof websitesData>);

    const sortedLetters = Object.keys(groupedWebsites).sort();

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
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tenders by Portal/Website</h1>
                        <p className="text-gray-600">Direct access to tenders from specific government e-procurement portals.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search Website..."
                            className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-11 pr-4 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                ) : sortedLetters.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Globe size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-800 mb-1">No Websites Found</h3>
                        <p className="text-gray-500">Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedLetters.map(letter => (
                            <div key={letter} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-3 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded bg-purple-600 text-white text-sm font-bold shadow-sm">
                                        {letter}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        {groupedWebsites[letter].length} Portals Listed
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 relative">
                                    {groupedWebsites[letter].map((site) => (
                                        <Link
                                            key={site.name}
                                            href={site.url || `/website/${site.name.toLowerCase().replace(/\./g, '-')}`}
                                            target={site.url ? "_blank" : "_self"}
                                            className="group relative p-5 hover:bg-purple-50/30 transition-all duration-200 border-b md:border-b-0 md:border-r border-gray-100 last:border-0 hover:z-10"
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white group-hover:shadow-md transition-all duration-200">
                                                    <ExternalLink size={20} className="text-gray-500 group-hover:text-purple-600 transition-colors" />
                                                </div>
                                                <span className="flex items-center gap-1 text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">
                                                    <BarChart3 size={10} />
                                                    {site.count}
                                                </span>
                                            </div>

                                            <h3 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-purple-700 transition-colors mb-1 font-mono break-words">
                                                {site.name}
                                            </h3>

                                            <div className="flex items-center text-xs text-purple-600 font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                Visit Portal <ChevronRight size={12} />
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
