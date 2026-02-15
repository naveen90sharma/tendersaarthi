
import { Suspense } from 'react';
import Link from 'next/link';
import { Building2, ChevronRight, BarChart3, Search } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import { supabase } from '@/services/supabase';

async function getAuthorities() {
    const { data } = await supabase
        .from('authorities')
        .select('*')
        .eq('status', true)
        .order('name');
    return data || [];
}

export default async function AuthorityDirectory() {
    const authoritiesData = await getAuthorities();

    const groupedAuthorities = authoritiesData.reduce((acc, auth) => {
        const letter = auth.name.charAt(0).toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(auth);
        return acc;
    }, {} as Record<string, any[]>);

    const sortedLetters = Object.keys(groupedAuthorities).sort();

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
                        <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight uppercase">Tender Authorities</h1>
                        <p className="text-gray-500 font-medium">Browse active tenders from over 500+ government departments, PSUs, and organizations.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {sortedLetters.map(letter => (
                        <div key={letter} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-slate-50 border-b border-gray-100 px-8 py-4 flex items-center gap-4">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 text-white text-lg font-black shadow-lg shadow-orange-500/20">
                                    {letter}
                                </span>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                                    {groupedAuthorities[letter].length} Departments Found
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-2">
                                {groupedAuthorities[letter].map((auth) => (
                                    <Link
                                        key={auth.slug}
                                        href={`/tenders/authority/${auth.slug}`}
                                        className="group flex flex-col p-5 rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-100"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                                                <Building2 size={18} className="text-blue-500" />
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg border border-emerald-100">
                                                <BarChart3 size={10} />
                                                LATEST
                                            </div>
                                        </div>

                                        <h3 className="text-[14px] font-black text-slate-700 group-hover:text-primary transition-colors leading-tight mb-2">
                                            {auth.name}
                                        </h3>

                                        <div className="flex items-center text-[11px] text-primary font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            EXPLORE CONTRACTS <ChevronRight size={12} className="ml-1" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* SEO Text Block for Authorities */}
                <div className="mt-16 bg-white rounded-3xl p-10 border border-gray-100 shadow-sm max-w-4xl mx-auto">
                    <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Consolidated Tenders from Major Departments</h2>
                    <div className="prose prose-slate max-w-none text-gray-500 font-medium leading-relaxed">
                        <p>
                            Finding tenders across different government bodies like <b>NHAI, CPWD, Railway Board, and BHEL</b> can be challenging.
                            TenderSaarthi aggregates all active notices from these authorities into a single, searchable database.
                        </p>
                        <p className="mt-4">
                            Whether you are looking for <b>National Highways Construction, Railway Track Maintenance, or PSU Supply Contracts</b>,
                            our authority directory helps you narrow down your search to specific departments. We cover central ministries,
                            state-level bodies, and municipal corporations across India.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const revalidate = 3600;
