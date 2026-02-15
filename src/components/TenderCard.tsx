'use client';

import Link from 'next/link';
import type { Tender } from '../types';
import { MapPin, Clock, Share2, Building2, CalendarDays, Wallet, ChevronRight, Gavel, FileCheck } from 'lucide-react';
import SaveTenderButton from './SaveTenderButton';

interface TenderCardProps {
    tender: Tender;
    index?: number;
}

export default function TenderCard({ tender, index = 1 }: TenderCardProps) {
    // Robust date parsing for "Time Left"
    const calculateDaysLeft = (dateStr?: string) => {
        if (!dateStr || dateStr === 'N/A') return null;
        try {
            const cleanDate = dateStr.replace(/-/g, '/');
            const targetDate = new Date(cleanDate);
            const now = new Date();
            if (isNaN(targetDate.getTime())) return null;
            const diff = targetDate.getTime() - now.getTime();
            if (diff <= 0) return 'Expired';
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            if (days < 0) return 'Expired';
            return days > 0 ? `${days} Days` : 'Closing Today';
        } catch (e) {
            return null;
        }
    };

    const formatDisplayAmount = (amount?: string) => {
        if (!amount || amount === 'N/A' || amount === '0') return 'N/A';
        const clean = amount.toString().trim();
        if (clean.startsWith('₹') || clean.toLowerCase().includes('crore') || clean.toLowerCase().includes('lakh')) {
            return clean.replace(/Rs\.?/i, '₹').trim();
        }
        return `₹ ${clean}`;
    };

    const daysLeft = calculateDaysLeft(tender.bid_submission_end);
    const isClosingSoon = daysLeft && (daysLeft === 'Closing Today' || (typeof daysLeft === 'string' && parseInt(daysLeft) <= 5));
    const isExpired = daysLeft === 'Expired';

    return (
        <div className="group relative bg-white border border-gray-300 rounded-[2rem] p-0 mb-4 transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(16,62,104,0.12)] flex flex-col lg:flex-row overflow-hidden w-full mx-auto lg:min-h-[200px]">
            {/* Index Badge */}
            <div className="absolute top-0 left-0 z-20">
                <div className="bg-[#103e68] text-white px-4 py-2 rounded-br-2xl rounded-tl-[1.8rem] flex items-center justify-center border-b-2 border-r-2 border-white/10 shadow-sm">
                    <span className="text-[12px] font-black tracking-tighter">#{index}</span>
                </div>
            </div>

            {/* Left Block: Identification (Shaded) */}
            <div className="bg-[#f8fafc]/50 lg:w-[260px] p-6 pt-12 lg:pt-6 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#e2e8f0]/40 shrink-0">
                <div className="bg-white rounded-xl p-3 border border-[#e2e8f0]/50 shadow-sm mb-4">
                    <span className="block text-[8px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-1 leading-none">ID / REF</span>
                    <span className="block text-[13px] font-black text-[#103e68] truncate leading-none">
                        {tender.reference_no || `TS-${tender.id.toString().slice(0, 8).toUpperCase()}`}
                    </span>
                </div>

                <div className="flex items-center gap-2 px-1">
                    <div className="text-[#94a3b8] shrink-0">
                        <Building2 size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-[12px] font-black text-[#64748b] truncate uppercase tracking-tight">
                        {tender.authority || 'Contracting Authority'}
                    </span>
                </div>
            </div>

            {/* Middle Block: Content */}
            <div className="flex-1 p-6 flex flex-col justify-center min-w-0">
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-[#f8fafc] text-[#103e68] text-[9px] font-black rounded-lg border border-[#e2e8f0] uppercase tracking-wider leading-none">
                        {tender.tender_type || 'EPC'}
                    </span>
                    <span className="px-2.5 py-1 bg-white text-[#64748b] text-[9px] font-black rounded-lg border border-[#e2e8f0] uppercase tracking-wider leading-none">
                        {tender.tender_category || 'PROJECT'}
                    </span>
                </div>

                <Link href={`/tenders/${tender.slug || tender.id}`} className="block group/title mb-2">
                    <h3 className="text-[18px] font-black text-[#103e68] group-hover/title:text-primary transition-colors leading-[1.3] line-clamp-2 tracking-tight">
                        {tender.title}
                    </h3>
                </Link>

                <p className="hidden lg:block text-[13px] text-[#94a3b8] font-medium line-clamp-2 leading-relaxed mb-6">
                    {tender.summary || `Strategic project requiring expert solutions. Targeted completion within timelines.`}
                </p>

                {/* Value & Location - Moved Here */}
                <div className="grid grid-cols-2 gap-8 pt-4 border-t border-[#f1f5f9] mt-auto">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[#94a3b8]">
                            <Wallet size={12} strokeWidth={3} />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Value</span>
                        </div>
                        <p className="text-[15px] font-black text-[#1e293b] leading-none">
                            {formatDisplayAmount(tender.tender_value || tender.value)}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[#94a3b8]">
                            <MapPin size={12} strokeWidth={3} />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Location</span>
                        </div>
                        <p className="text-[15px] font-black text-[#1e293b] leading-none truncate">
                            {tender.state || 'India'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Block: Actions Only */}
            <div className="lg:w-[200px] p-6 pt-2 lg:pt-6 flex flex-col justify-center bg-white border-t lg:border-t-0 lg:border-l border-[#f1f5f9] shrink-0">
                <div className="flex flex-col gap-3 h-full justify-center">
                    <Link
                        href={`/tenders/${tender.slug || tender.id}`}
                        className="w-full h-[46px] bg-[#103e68] text-white flex items-center justify-center rounded-xl hover:bg-[#0a2742] active:scale-[0.98] transition-all shadow-lg shadow-[#103e68]/20 group/btn"
                    >
                        <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    <div className="flex gap-2">
                        <button className="flex-1 h-[46px] bg-white text-[#94a3b8] border-2 border-[#f1f5f9] flex items-center justify-center rounded-xl hover:text-[#103e68] hover:border-primary/20 transition-all">
                            <Share2 size={18} strokeWidth={2.5} />
                        </button>

                        <div className="flex-1">
                            <SaveTenderButton
                                tenderId={tender.id.toString()}
                                variant="icon"
                                className="!bg-white !border-2 !border-[#f1f5f9] !p-0 !h-[46px] !w-full !rounded-xl text-[#94a3b8] hover:!text-[#103e68] hover:!border-primary/20 flex items-center justify-center shadow-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
