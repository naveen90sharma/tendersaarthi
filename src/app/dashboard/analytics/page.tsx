'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, BarChart3, Loader2 } from 'lucide-react';
import { getCurrentUser } from '@/services/auth';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const { user } = await getCurrentUser();
            if (!user) {
                router.push('/login?redirect=/dashboard/analytics');
            } else {
                setLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-[#103e68]" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-[#103e68]/10 rounded-xl text-[#103e68]">
                            <TrendingUp size={24} />
                        </div>
                        Analytics
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Track your tender performance and win rates.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-12 shadow-sm text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="text-slate-300" size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Analytics Coming Soon</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                    We are building powerful insights to help you analyze your past bids, understand market trends, and improve your winning chances.
                </p>
            </div>
        </div>
    );
}
