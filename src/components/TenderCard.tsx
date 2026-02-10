'use client';

import Link from 'next/link';
import type { Tender } from '../types';
import { MapPin, Clock, Share2, Heart, ArrowRight, Building2, FileText, CalendarDays, Tag, Wallet } from 'lucide-react';

interface TenderCardProps {
    tender: Tender;
    index?: number;
}

export default function TenderCard({ tender, index = 1 }: TenderCardProps) {
    // Helper to calculate days left based on tender.date (bid_submission_end)
    const calculateTimeLeft = (dateStr: string) => {
        if (!dateStr || dateStr === 'N/A') return null;
        try {
            // Format "19-Mar-2026 11:00 AM" -> "19 Mar 2026 11:00 AM"
            const dateParts = dateStr.replace(/-/g, ' ');
            const targetDate = new Date(dateParts);
            const now = new Date();

            if (isNaN(targetDate.getTime())) return 'Check Date';

            const diff = targetDate.getTime() - now.getTime();

            if (diff <= 0) return 'Expired';

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) return `${days} Days Left`;
            if (hours > 0) return `${hours} Hours Left`;
            if (minutes > 0) return `${minutes} Mins Left`;
            return 'Closing Now';
        } catch (e) {
            return null;
        }
    };

    const formatAmount = (amount: string | undefined) => {
        if (!amount || amount === 'N/A' || amount === '0') return 'N/A';
        const clean = amount.toString().trim();
        if (clean.startsWith('₹')) return clean;
        if (clean.toLowerCase().startsWith('rs')) return clean.replace(/rs\.?/i, '₹').trim();
        return `₹ ${clean}`;
    };

    const timeLeft = calculateTimeLeft(tender.date);

    // Mock EMD (Placeholder, should ideally come from DB if available)
    const emdValue = "₹ 1.5 Lakhs";

    return (
        <div className="group relative bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden font-sans mb-5">
            {/* Left Accent Decoration */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-opacity ${timeLeft === 'Expired' ? 'bg-[#EE3124]' : 'bg-tj-blue'} opacity-0 group-hover:opacity-100`}></div>

            <div className="p-6">
                {/* Header: Badges & Meta */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-1 rounded border border-gray-200">
                            #{index}
                        </span>
                        <span className="bg-[#f0f7ff] text-tj-blue text-[10px] font-black px-2 py-1 rounded border border-blue-100 flex items-center gap-1 uppercase">
                            <FileText size={12} />
                            {tender.referenceNo?.split(' ')[0] || 'REF-N/A'}
                        </span>
                        <span className="bg-purple-50 text-purple-700 text-[10px] font-black px-2 py-1 rounded border border-purple-100 flex items-center gap-1 uppercase">
                            <Tag size={12} />
                            {tender.category || 'General'}
                        </span>
                    </div>

                    {timeLeft && (
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full border flex items-center gap-1 uppercase ${timeLeft === 'Expired' ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-red-50 text-[#EE3124] border-red-100 animate-pulse'}`}>
                            <Clock size={12} />
                            {timeLeft}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="mb-3">
                    <Link
                        href={`/tender/${tender.id}`}
                        className="text-lg font-extrabold text-[#0f172a] leading-snug group-hover:text-tj-blue transition-colors line-clamp-2 uppercase"
                        title={tender.title}
                    >
                        {tender.title}
                    </Link>
                </h3>

                {/* Authority & Location */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-[#475569] mb-6">
                    <div className="flex items-center gap-1.5">
                        <Building2 size={15} className="text-tj-blue" />
                        <span className="font-bold truncate max-w-[200px] uppercase">{tender.authority || 'Unknown Authority'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin size={15} className="text-tj-blue" />
                        <span className="font-bold">{tender.location || 'India'}</span>
                    </div>
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] group-hover:border-blue-100 transition-colors">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#64748b] font-black mb-1">Tender Value</p>
                        <p className="text-tj-blue font-black text-base">{formatAmount(tender.value)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#64748b] font-black mb-1">EMD Amount</p>
                        <p className="text-gray-800 font-black text-base">{emdValue}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#64748b] font-black mb-1 flex items-center gap-1">
                            <Wallet size={12} /> Tender Fee
                        </p>
                        <p className="text-gray-800 font-black text-base">{formatAmount(tender.tenderFee)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#64748b] font-black mb-1 flex items-center gap-1">
                            <CalendarDays size={12} /> Closing Date
                        </p>
                        <p className="text-[#EE3124] font-black text-base">{tender.date}</p>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-1">
                        <button className="p-2 text-gray-400 hover:text-[#EE3124] hover:bg-red-50 rounded-full transition-all" title="Save">
                            <Heart size={20} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-tj-blue hover:bg-blue-50 rounded-full transition-all" title="Share">
                            <Share2 size={20} />
                        </button>
                    </div>

                    <Link
                        href={`/tender/${tender.id}`}
                        className="bg-tj-blue text-white text-[12px] font-black px-6 py-2.5 rounded-lg shadow-md hover:brightness-110 hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2 group/btn uppercase tracking-widest"
                    >
                        View Details
                        <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
