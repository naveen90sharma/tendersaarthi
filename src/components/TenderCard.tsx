'use client';

import Link from 'next/link';
import type { Tender } from '../types';
import { MapPin, Share2, Building2, Wallet, ChevronRight, Clock } from 'lucide-react';
import SaveTenderButton from './SaveTenderButton';

interface TenderCardProps {
    tender: Tender;
    index?: number;
}

export default function TenderCard({ tender, index = 1 }: TenderCardProps) {
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
            return days > 0 ? `${days}d left` : 'Closing Today';
        } catch (e) {
            return null;
        }
    };

    const formatDisplayAmount = (amount?: string) => {
        if (!amount || amount === 'N/A' || amount === '0') return null;
        const clean = amount.toString().trim();
        if (clean.startsWith('₹') || clean.toLowerCase().includes('crore') || clean.toLowerCase().includes('lakh')) {
            return clean.replace(/Rs\.?/i, '₹').trim();
        }
        return `₹ ${clean}`;
    };

    const daysLeft = calculateDaysLeft(tender.bid_submission_end);
    const isClosingSoon = daysLeft && daysLeft !== 'Expired' && (daysLeft === 'Closing Today' || (typeof daysLeft === 'string' && parseInt(daysLeft) <= 5));
    const isExpired = daysLeft === 'Expired';
    const displayValue = formatDisplayAmount(tender.tender_value || tender.value);

    return (
        <div className="group relative bg-white border border-gray-200 rounded-xl mb-3 transition-all duration-200 hover:border-[#103e68]/30 hover:shadow-md flex flex-col lg:flex-row overflow-hidden w-full">

            {/* Serial Number - Left accent */}
            <div className="hidden lg:flex items-center justify-center w-10 shrink-0 bg-gray-50 border-r border-gray-100 text-gray-300 text-xs font-bold">
                {index}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 min-w-0">
                {/* Top Row: Badges + Days Left */}
                <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                        {tender.tender_type && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded border border-blue-100 uppercase tracking-wide">
                                {tender.tender_type}
                            </span>
                        )}
                        {tender.tender_category && (
                            <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-semibold rounded border border-gray-200 uppercase tracking-wide">
                                {tender.tender_category}
                            </span>
                        )}
                    </div>
                    {daysLeft && (
                        <span className={`hidden lg:flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${isExpired ? 'bg-red-50 text-red-500 border border-red-100' :
                            isClosingSoon ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                'bg-green-50 text-green-600 border border-green-100'
                            }`}>
                            <Clock size={10} strokeWidth={2.5} />
                            {daysLeft}
                        </span>
                    )}
                </div>

                {/* Title */}
                <Link href={`/tenders/${tender.slug || tender.id}`} className="block mb-2">
                    <h3 className="text-sm font-semibold text-[#103e68] group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                        {tender.title}
                    </h3>
                </Link>

                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    {tender.authority && (
                        <span className="flex items-center gap-1">
                            <Building2 size={11} strokeWidth={2} />
                            <span className="truncate max-w-[200px] font-medium text-gray-500">{tender.authority}</span>
                        </span>
                    )}
                    {tender.state && (
                        <span className="flex items-center gap-1">
                            <MapPin size={11} strokeWidth={2} />
                            <span className="font-medium text-gray-500">{tender.state}</span>
                        </span>
                    )}
                    {tender.reference_no && (
                        <span className="hidden md:inline font-mono text-[10px] text-gray-300 ml-auto">
                            {tender.reference_no}
                        </span>
                    )}
                </div>
            </div>

            {/* Right: Value + Actions */}
            <div className="flex items-center border-t lg:border-t-0 lg:border-l border-gray-100 shrink-0 min-h-[52px] lg:min-h-0">
                {/* Value Block */}
                {displayValue && (
                    <div className="px-4 py-2 lg:py-3 flex flex-col justify-center min-w-[120px] flex-1 lg:flex-none">
                        <span className="flex items-center gap-1 text-[9px] font-semibold text-gray-300 uppercase tracking-widest mb-0.5">
                            <Wallet size={9} strokeWidth={2.5} />
                            Value
                        </span>
                        <span className="text-sm font-bold text-slate-700 leading-none">
                            {displayValue}
                        </span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center border-l border-gray-100 self-stretch">
                    <button className="px-3 h-full text-gray-300 hover:text-[#103e68] hover:bg-gray-50 transition-all flex items-center justify-center">
                        <Share2 size={14} strokeWidth={2} />
                    </button>
                    <div className="h-full flex items-center border-l border-gray-100">
                        <SaveTenderButton
                            tenderId={tender.id.toString()}
                            variant="icon"
                            className="!bg-transparent !border-0 !rounded-none !h-full !px-3 !w-auto text-gray-300 hover:!text-[#103e68] hover:!bg-gray-50 shadow-none"
                        />
                    </div>
                    <Link
                        href={`/tenders/${tender.slug || tender.id}`}
                        className="h-full px-5 bg-[#103e68] text-white hover:bg-[#0a2742] transition-all flex items-center justify-center group/btn"
                    >
                        <ChevronRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
