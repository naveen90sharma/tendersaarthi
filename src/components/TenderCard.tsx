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
        <div className="group relative bg-white border border-[#e2e8f0]/60 rounded-3xl p-0 mb-6 transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(16,62,104,0.12)] flex flex-col overflow-hidden w-full max-w-[400px] mx-auto lg:max-w-none">
            {/* Index Badge & Save Button */}
            <div className="absolute top-0 left-0 z-20">
                <div className="bg-[#103e68] text-white px-4 py-2.5 rounded-br-2xl rounded-tl-3xl flex items-center justify-center border-b-2 border-r-2 border-white/10 shadow-sm">
                    <span className="text-[14px] font-black tracking-tighter">#{index}</span>
                </div>
            </div>

            <div className="absolute top-5 right-5 z-20">
                <SaveTenderButton
                    tenderId={tender.id.toString()}
                    variant="icon"
                    className="!bg-white !border-[#e2e8f0]/80 !p-3 shadow-sm shadow-[#103e68]/5 !rounded-full text-[#94a3b8]"
                />
            </div>

            {/* Top Container: Identification & Authority */}
            <div className="bg-[#f8fafc]/50 p-6 pt-16 border-b border-[#e2e8f0]/40">
                {/* ID / REF Section */}
                <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0]/50 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mb-5">
                    <span className="block text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-1.5 leading-none">ID / REF</span>
                    <span className="block text-[14px] font-black text-[#103e68] truncate leading-none">
                        {tender.reference_no || `TS-${tender.id.toString().slice(0, 8).toUpperCase()}`}
                    </span>
                </div>

                {/* Authority */}
                <div className="flex items-center gap-2.5 px-0.5">
                    <div className="text-[#94a3b8] shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 21h18" /><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3" /><path d="M11 21V11" /><path d="M15 21V11" />
                        </svg>
                    </div>
                    <span className="text-[13px] font-black text-[#64748b] truncate uppercase tracking-tight">
                        {tender.authority || 'Contracting Authority'}
                    </span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-7 flex flex-col h-full bg-white">
                {/* Type & Category Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                    <span className="px-3 py-1.5 bg-[#f8fafc] text-[#103e68] text-[10px] font-black rounded-lg border border-[#e2e8f0] uppercase tracking-wider leading-none shadow-sm">
                        {tender.tender_type || 'EPC'}
                    </span>
                    <span className="px-3 py-1.5 bg-white text-[#64748b] text-[10px] font-black rounded-lg border border-[#e2e8f0] uppercase tracking-wider leading-none shadow-sm">
                        {tender.tender_category || 'PROJECT'}
                    </span>
                </div>

                {/* Title */}
                <Link href={`/tenders/${tender.slug || tender.id}`} className="block group/title mb-4">
                    <h3 className="text-[20px] font-black text-[#103e68] group-hover/title:text-primary transition-colors leading-[1.3] tracking-tight">
                        {tender.title}
                    </h3>
                </Link>

                {/* Summary (More compact) */}
                <p className="text-[14px] text-[#94a3b8] font-medium line-clamp-2 leading-relaxed mb-8">
                    {tender.summary || `Strategic project requiring expert solutions. Targeted completion within timelines.`}
                </p>

                {/* Value & Location Grid */}
                <div className="grid grid-cols-2 gap-8 mt-auto pt-6 border-t border-[#f1f5f9]">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[#94a3b8]">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] pt-0.5">Estimated Value</span>
                        </div>
                        <p className="text-[17px] font-black text-[#1e293b] leading-none">
                            {formatDisplayAmount(tender.tender_value || tender.value)}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[#94a3b8]">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] pt-0.5">Job Location</span>
                        </div>
                        <p className="text-[17px] font-black text-[#1e293b] leading-none">
                            {tender.state || 'India'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Redesigned Bottom Action Bar (Docked) */}
            <div className="p-6 pt-2 pb-6 flex items-center justify-between gap-3 bg-white">
                {/* Main Action - Blue Rounded Rect */}
                <Link
                    href={`/tenders/${tender.slug || tender.id}`}
                    className="flex-[1.8] h-[52px] bg-[#103e68] text-white flex items-center justify-center rounded-2xl hover:bg-[#0a2742] active:scale-[0.98] transition-all shadow-lg shadow-[#103e68]/20 group/btn"
                >
                    <ChevronRight size={24} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Link>

                {/* Share Action */}
                <button className="flex-1 h-[52px] bg-white text-[#94a3b8] border-2 border-[#f1f5f9] flex items-center justify-center rounded-2xl hover:text-[#103e68] hover:border-[#103e68]/30 hover:bg-[#f8fafc] transition-all active:scale-[0.98]">
                    <Share2 size={20} strokeWidth={2.5} />
                </button>

                {/* Document Action */}
                <button className="flex-1 h-[52px] bg-white text-[#94a3b8] border-2 border-[#f1f5f9] flex items-center justify-center rounded-2xl hover:text-[#103e68] hover:border-[#103e68]/30 hover:bg-[#f8fafc] transition-all active:scale-[0.98]">
                    <FileCheck size={20} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}
