
import { Suspense } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronRight, BarChart3, RefreshCw } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import { supabase } from '@/services/supabase';

async function getStatesWithCount() {
    const { data: states } = await supabase
        .from('states')
        .select('name, slug')
        .eq('is_active', true)
        .order('name');

    // In a real app, you'd join with tender counts
    // For now, we'll return the states
    return states || [];
}

export default async function StateDirectory() {
    const statesData = await getStatesWithCount();

    const groupedStates = statesData.reduce((acc, state) => {
        const letter = state.name.charAt(0).toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(state);
        return acc;
    }, {} as Record<string, any[]>);

    const sortedLetters = Object.keys(groupedStates).sort();

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
                        <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight uppercase">Tenders by State</h1>
                        <p className="text-gray-500 font-medium">Find government tenders across all Indian States and Union Territories.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {sortedLetters.map(letter => (
                        <div key={letter} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-slate-50 border-b border-gray-100 px-8 py-4 flex items-center gap-4">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#103e68] text-white text-lg font-black shadow-lg shadow-blue-900/20">
                                    {letter}
                                </span>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                                    {groupedStates[letter].length} Regions Found
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-4 gap-2">
                                {groupedStates[letter].map((state) => (
                                    <Link
                                        key={state.slug}
                                        href={`/tenders/state/${state.slug}`}
                                        className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-100"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                                                <MapPin size={18} className="text-orange-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-[15px] font-black text-slate-700 group-hover:text-[#103e68] transition-colors leading-tight">
                                                    {state.name}
                                                </h3>
                                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tenders in {state.name}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* SEO Text Block for Directory */}
                <div className="mt-16 bg-white rounded-3xl p-10 border border-gray-100 shadow-sm max-w-4xl mx-auto">
                    <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Stay Updated with State-wise Government Tenders</h2>
                    <div className="prose prose-slate max-w-none text-gray-500 font-medium leading-relaxed">
                        <p>
                            Government procurement in India is distributed across various state portals and the GEM (Government e-Marketplace).
                            TenderSaarthi provides a unified interface to browse latest contracts from <b>Maharashtra PWD, Uttar Pradesh Irrigation Department,
                                Gujarat Power Corporation</b>, and thousands of other local bodies.
                        </p>
                        <p className="mt-4">
                            Select your state from the alphabetical directory above to view daily updated tender notifications, EMD requirements,
                            and official download links for bidding documents. Our system tracks over 5,000+ new listings every single day across
                            all 28 states and 8 Union Territories.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const revalidate = 3600;
