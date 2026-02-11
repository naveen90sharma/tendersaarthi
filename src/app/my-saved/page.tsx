'use client';

import { useState, useEffect } from 'react';
import { IndianRupee, MapPin, Calendar, FileText, Loader2, Star, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';
import { getSavedTenders, toggleSaveTender } from '@/services/tenderService';

export default function MySavedTendersPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [tenders, setTenders] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        checkAuthAndLoadTenders();
    }, []);

    const checkAuthAndLoadTenders = async () => {
        const { user } = await getCurrentUser();
        if (!user) {
            router.push('/login?redirect=/my-saved');
            return;
        }
        setCurrentUser(user);
        await loadTenders(user.id);
    };

    const loadTenders = async (userId: string) => {
        setIsLoading(true);
        try {
            const result = await getSavedTenders(userId);
            if (result.success) {
                setTenders(result.data || []);
            }
        } catch (error) {
            console.error('Error loading saved tenders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnsave = async (tenderId: string) => {
        if (!confirm('Are you sure you want to remove this tender from your saved list?')) return;

        try {
            const result = await toggleSaveTender(tenderId, currentUser.id);
            if (result.success) {
                setTenders(tenders.filter(t => t.id !== tenderId));
            }
        } catch (error) {
            console.error('Error unsaving tender:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 font-sans">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-10 text-center lg:text-left">
                    <h1 className="text-4xl font-black text-gray-800 mb-2 flex items-center justify-center lg:justify-start gap-3 uppercase tracking-tight">
                        <Star className="text-tj-yellow" size={36} fill="#FFC107" />
                        Saved Tenders
                    </h1>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest pl-1">Your Personal Shortlist of Opportunities</p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="text-center">
                            <Loader2 size={48} className="animate-spin text-tj-blue mx-auto mb-4" />
                            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Loading shortlist...</p>
                        </div>
                    </div>
                ) : tenders.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-16 text-center max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Star size={48} className="text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-3 uppercase tracking-tight">No Saved Tenders</h3>
                        <p className="text-gray-500 mb-8 font-medium">Capture high-potential opportunities by clicking the 'Save Tender' button on any tender listing.</p>
                        <Link
                            href="/active-tenders"
                            className="inline-flex items-center gap-2 bg-tj-blue text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition shadow-lg shadow-blue-200 active:scale-95"
                        >
                            Browse Active Tenders
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tenders.map((tender) => (
                            <div key={tender.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-blue-50 text-tj-blue text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                                            {tender.authority || 'Government'}
                                        </div>
                                        <button
                                            onClick={() => handleUnsave(tender.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                            title="Remove from saved"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <Link href={`/tender/${tender.id}`} className="block">
                                        <h3 className="text-lg font-black text-gray-800 mb-4 line-clamp-2 leading-snug group-hover:text-tj-blue transition-colors h-14">
                                            {tender.title}
                                        </h3>
                                    </Link>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                                            <MapPin size={16} className="text-tj-blue" />
                                            <span className="truncate">{tender.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                                            <Calendar size={16} className="text-tj-blue" />
                                            <span>Closes: {tender.bid_submission_end ? new Date(tender.bid_submission_end).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-tj-blue font-black bg-blue-50/50 p-2 rounded-lg border border-blue-50">
                                            <IndianRupee size={16} />
                                            <span>{tender.tender_value || 'Contact for Value'}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-gray-50">
                                        <Link
                                            href={`/tender/${tender.id}`}
                                            className="flex-1 bg-tj-blue text-white text-center py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition group-hover:scale-[1.02]"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
