'use client';

import { useState, useEffect } from 'react';
import { Bookmark, RefreshCw } from 'lucide-react';
import { toggleSaveTender, isTenderSaved } from '@/services/tenderService';
import { getCurrentUser } from '@/services/auth';
import { useRouter } from 'next/navigation';

interface SaveTenderButtonProps {
    tenderId: string;
    variant?: 'full' | 'icon';
}

export default function SaveTenderButton({ tenderId, variant = 'full' }: SaveTenderButtonProps) {
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function checkStatus() {
            const { user } = await getCurrentUser();
            if (user) {
                setUserId(user.id);
                const saved = await isTenderSaved(tenderId, user.id);
                setIsSaved(saved);
            }
            setLoading(false);
        }
        checkStatus();
    }, [tenderId]);

    const handleToggle = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!userId) {
            router.push('/login?redirect=' + window.location.pathname);
            return;
        }

        setActionLoading(true);
        const result = await toggleSaveTender(tenderId, userId);
        if (result.success) {
            setIsSaved(!!result.saved);
        }
        setActionLoading(false);
    };

    if (loading) {
        if (variant === 'icon') return <div className="p-2 animate-pulse text-gray-200"><Bookmark size={20} /></div>;
        return (
            <button disabled className="w-full bg-gray-100 text-gray-400 py-3 font-extrabold text-sm flex items-center justify-center gap-2 rounded shadow-sm opacity-50">
                <RefreshCw size={16} className="animate-spin" />
                LOADING...
            </button>
        );
    }

    if (variant === 'icon') {
        return (
            <button
                onClick={handleToggle}
                disabled={actionLoading}
                className={`p-2 rounded-full transition-all active:scale-90 ${isSaved ? 'text-primary bg-blue-50' : 'text-gray-300 hover:text-primary hover:bg-blue-50'}`}
                title={isSaved ? "Remove from saved" : "Save tender"}
            >
                <Bookmark size={22} fill={isSaved ? "currentColor" : "none"} className={actionLoading ? 'animate-spin' : ''} />
            </button>
        );
    }

    return (
        <button
            onClick={handleToggle}
            disabled={actionLoading}
            className={`w-full ${isSaved ? 'bg-blue-50 text-primary border-2 border-primary/20' : 'bg-primary text-white'} py-3 font-extrabold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all rounded shadow-sm active:scale-95`}
        >
            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} className={actionLoading ? 'animate-pulse' : ''} />
            {actionLoading ? 'PROCESSING...' : isSaved ? 'TENDER SAVED' : 'SAVE TENDER'}
        </button>
    );
}
