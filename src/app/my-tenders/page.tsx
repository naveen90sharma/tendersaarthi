'use client';

import { useState, useEffect } from 'react';
import { FileText, Calendar, MapPin, IndianRupee, Trash2, Edit, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';
import { supabase } from '@/services/supabase';

export default function MyTendersPage() {
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
            router.push('/login');
            return;
        }
        setCurrentUser(user);
        await loadTenders(user.id);
    };

    const loadTenders = async (userId: string) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('tenders')
                .select('*')
                .eq('user_id', userId)
                .neq('status', 'Draft')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTenders(data || []);
        } catch (error) {
            console.error('Error loading tenders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (tenderId: string) => {
        if (!confirm('Are you sure you want to delete this tender?')) return;

        try {
            const { error } = await supabase
                .from('tenders')
                .delete()
                .eq('id', tenderId);

            if (error) throw error;

            setTenders(tenders.filter(t => t.id !== tenderId));
            alert('Tender deleted successfully');
        } catch (error) {
            console.error('Error deleting tender:', error);
            alert('Failed to delete tender');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 font-sans">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Tenders</h1>
                    <p className="text-gray-600">Manage all your published tenders</p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={40} className="animate-spin text-primary" />
                    </div>
                ) : tenders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Tenders Yet</h3>
                        <p className="text-gray-600 mb-6">You haven't published any tenders yet.</p>
                        <Link
                            href="/post-tender"
                            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
                        >
                            Post Your First Tender
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {tenders.map((tender) => (
                            <div key={tender.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            {tender.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <FileText size={16} className="text-primary" />
                                                {tender.tender_id}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin size={16} className="text-primary" />
                                                {tender.location}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar size={16} className="text-primary" />
                                                Due: {new Date(tender.bid_submission_end).toLocaleDateString()}
                                            </div>
                                            {tender.tender_value && (
                                                <div className="flex items-center gap-1">
                                                    <IndianRupee size={16} className="text-primary" />
                                                    {tender.tender_value}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/tender/${tender.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                            title="View Tender"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <Link
                                            href={`/edit-tender/${tender.id}`}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                                            title="Edit Tender"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(tender.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                            title="Delete Tender"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {tender.description && (
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                        {tender.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex gap-2">
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {tender.tender_type}
                                        </span>
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                            {tender.tender_category}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        Posted {new Date(tender.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
