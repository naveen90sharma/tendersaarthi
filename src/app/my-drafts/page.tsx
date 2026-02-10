'use client';

import { useState, useEffect } from 'react';
import { FileText, Calendar, MapPin, IndianRupee, Trash2, Edit, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';
import { supabase } from '@/services/supabase';

export default function MyDraftsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [drafts, setDrafts] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        checkAuthAndLoadDrafts();
    }, []);

    const checkAuthAndLoadDrafts = async () => {
        const { user } = await getCurrentUser();
        if (!user) {
            router.push('/login');
            return;
        }
        setCurrentUser(user);
        await loadDrafts(user.id);
    };

    const loadDrafts = async (userId: string) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('tenders')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'Draft')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDrafts(data || []);
        } catch (error) {
            console.error('Error loading drafts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (draftId: string) => {
        if (!confirm('Are you sure you want to delete this draft?')) return;

        try {
            const { error } = await supabase
                .from('tenders')
                .delete()
                .eq('id', draftId);

            if (error) throw error;

            setDrafts(drafts.filter(d => d.id !== draftId));
            alert('Draft deleted successfully');
        } catch (error) {
            console.error('Error deleting draft:', error);
            alert('Failed to delete draft');
        }
    };

    const handlePublish = async (draftId: string) => {
        if (!confirm('Are you sure you want to publish this draft?')) return;

        try {
            const { error } = await supabase
                .from('tenders')
                .update({ status: 'Active' })
                .eq('id', draftId);

            if (error) throw error;

            setDrafts(drafts.filter(d => d.id !== draftId));
            alert('Draft published successfully!');
            router.push(`/tender/${draftId}`);
        } catch (error) {
            console.error('Error publishing draft:', error);
            alert('Failed to publish draft');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 font-sans">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Drafts</h1>
                    <p className="text-gray-600">Continue editing your saved tender drafts</p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={40} className="animate-spin text-primary" />
                    </div>
                ) : drafts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Drafts</h3>
                        <p className="text-gray-600 mb-6">You don't have any saved drafts.</p>
                        <Link
                            href="/post-tender"
                            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
                        >
                            Create New Tender
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {drafts.map((draft) => (
                            <div key={draft.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-gray-800">
                                                {draft.title || 'Untitled Draft'}
                                            </h3>
                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold">
                                                DRAFT
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            {draft.tender_id && (
                                                <div className="flex items-center gap-1">
                                                    <FileText size={16} className="text-primary" />
                                                    {draft.tender_id}
                                                </div>
                                            )}
                                            {draft.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={16} className="text-primary" />
                                                    {draft.location}
                                                </div>
                                            )}
                                            {draft.bid_submission_end && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={16} className="text-primary" />
                                                    Due: {new Date(draft.bid_submission_end).toLocaleDateString()}
                                                </div>
                                            )}
                                            {draft.tender_value && (
                                                <div className="flex items-center gap-1">
                                                    <IndianRupee size={16} className="text-primary" />
                                                    {draft.tender_value}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handlePublish(draft.id)}
                                            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium flex items-center gap-1"
                                            title="Publish Draft"
                                        >
                                            <Send size={16} />
                                            Publish
                                        </button>
                                        <Link
                                            href={`/edit-tender/${draft.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                            title="Edit Draft"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(draft.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                            title="Delete Draft"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {draft.description && (
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                        {draft.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex gap-2">
                                        {draft.tender_type && (
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {draft.tender_type}
                                            </span>
                                        )}
                                        {draft.tender_category && (
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                {draft.tender_category}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        Last saved {new Date(draft.updated_at || draft.created_at).toLocaleDateString()}
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
