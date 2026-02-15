'use client';

import { useState, useEffect } from 'react';
import { Bookmark, RefreshCw } from 'lucide-react';
import { toggleSaveTender, isTenderSaved } from '@/services/tenderService';
import { getCurrentUser } from '@/services/auth';
import { useRouter } from 'next/navigation';

interface SaveTenderButtonProps {
    tenderId: string;
    variant?: 'full' | 'icon';
    className?: string;
}

export default function SaveTenderButton({ tenderId, variant = 'full', className = '' }: SaveTenderButtonProps) {
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
        if (variant === 'icon') return <div className={`p-2 animate-pulse text-gray-200 ${className}`}><Bookmark size={20} /></div>;
        return (
            <button disabled className={`w-full bg-slate-50 text-slate-300 py-4 font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 rounded-2xl border border-slate-100 animate-pulse ${className}`}>
                <RefreshCw size={14} className="animate-spin" />
                Loading
            </button>
        );
    }

    if (variant === 'icon') {
        return (
            <button
                onClick={handleToggle}
                disabled={actionLoading}
                className={`flex items-center justify-center transition-all active:scale-90 ${isSaved ? 'text-primary bg-primary/5 border border-primary/20' : 'text-slate-400 hover:text-primary bg-slate-50 border border-slate-200/50'} ${className || 'p-3 rounded-full'}`}
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
            className={`w-full group ${isSaved
                    ? 'bg-tj-yellow/10 text-primary border-2 border-tj-yellow/30'
                    : 'bg-primary text-white border-2 border-transparent'
                } py-4 font-black text-[11px] uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all rounded-2xl shadow-sm hover:shadow-lg active:scale-95 ${className}`}
        >
            <Bookmark
                size={16}
                fill={isSaved ? "currentColor" : "none"}
                className={`${actionLoading ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`}
            />
            {actionLoading ? 'Processing' : isSaved ? 'Bookmarked' : 'Save Tender'}
        </button>
    );
}
