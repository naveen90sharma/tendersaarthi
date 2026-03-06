'use client';

import Link from 'next/link';
import { MapPin, Building2, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

const formatCurrency = (amount: string | number | null | undefined) => {
    if (!amount) return '—';
    const numStr = typeof amount === 'string' ? amount.replace(/[^0-9.]/g, '') : amount.toString();
    const num = Number(numStr);

    if (isNaN(num) || num === 0) return amount.toString();

    if (num >= 10000000) {
        return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
        return `₹ ${(num / 100000).toFixed(2)} Lakh`;
    } else {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(num);
    }
}

interface SmallTenderCardProps {
    tender: {
        id: string | number;
        slug?: string;
        title: string;
        tender_value?: string | number;
        value?: string | number;
        location?: string;
        state?: string;
        authority_name?: string;
        authority?: string;
        bid_end_ts?: string;
        bid_submission_end?: string;
    };
    index?: number;
}

export default function SmallTenderCard({ tender, index = 0 }: SmallTenderCardProps) {
    const calculateDaysLeft = (dateStr?: string) => {
        if (!dateStr || dateStr === 'N/A') return null;
        try {
            const cleanDate = dateStr.replace(/-/g, '/');
            const targetDate = new Date(cleanDate);
            const now = new Date();
            if (isNaN(targetDate.getTime())) return null;
            const diff = targetDate.getTime() - now.getTime();
            if (diff <= 0) return 0;
            return Math.ceil(diff / (1000 * 60 * 60 * 24));
        } catch (e) {
            return null;
        }
    };

    const daysLeft = calculateDaysLeft(tender.bid_end_ts || tender.bid_submission_end);
    const isUrgent = daysLeft !== null && daysLeft <= 5;

    const aiTags = ['High Success Rate', 'Limited Competition', 'MSME Eligible', 'Top Tier Authority'];
    const safeId = tender.id?.toString() || '';
    const randomTag = aiTags[Math.floor((safeId.length + index) % aiTags.length)];

    return (
        <div className="group w-full bg-white rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden h-full">
            {/* Card Top */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Top row: AI Tag + Verified */}
                <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[9px] font-semibold uppercase tracking-wide">
                        <span className="w-1 h-1 bg-primary rounded-full" />
                        {randomTag}
                    </span>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-white rounded-full shadow-sm border border-slate-100 shrink-0">
                        <ShieldCheck size={9} className="text-green-500" />
                        <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wide">Verified</span>
                    </div>
                </div>

                {/* Title */}
                <Link href={`/tenders/${tender.slug || tender.id}`} className="block mb-3">
                    <h3 className="text-sm font-semibold text-[#0B2C4A] leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                        {tender.title}
                    </h3>
                </Link>

                {/* Meta */}
                <div className="space-y-1.5 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin size={11} strokeWidth={2} className="text-primary/50 shrink-0" />
                        <span className="truncate font-medium text-slate-500">{tender.location || tender.state || 'Pan India'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Building2 size={11} strokeWidth={2} className="text-primary/50 shrink-0" />
                        <span className="truncate font-medium text-slate-500">{tender.authority_name || tender.authority || 'Govt Department'}</span>
                    </div>
                </div>
            </div>

            {/* Card Bottom: Value + CTA */}
            <div className="bg-[#0B2C4A] p-3 relative overflow-hidden">
                {/* Progress strip */}
                <div className="absolute top-0 left-0 h-[2px] bg-yellow-400/20 w-full" />
                <div
                    className={`absolute top-0 left-0 h-[2px] bg-yellow-400 transition-all ${isUrgent ? 'animate-pulse' : ''}`}
                    style={{ width: `${Math.max(10, 100 - (daysLeft || 0) * 5)}%` }}
                />

                <div className="flex items-center justify-between gap-2 relative z-10">
                    <div>
                        <span className="text-[8px] font-semibold text-blue-200/40 uppercase tracking-widest block mb-0.5">Est. Value</span>
                        <div className="text-sm font-bold text-white leading-none">
                            {formatCurrency(tender.tender_value || tender.value)}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {daysLeft !== null && (
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 text-[9px] font-semibold ${isUrgent ? 'text-yellow-400' : 'text-white/60'}`}>
                                <Clock size={8} className={isUrgent ? 'animate-pulse' : ''} />
                                {daysLeft}d
                            </div>
                        )}
                        <Link
                            href={`/tenders/${tender.slug || tender.id}`}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary hover:scale-110 active:scale-95 transition-all shadow-lg"
                        >
                            <ArrowRight size={14} strokeWidth={2.5} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
