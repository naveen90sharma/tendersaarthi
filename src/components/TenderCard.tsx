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
        <div className="group relative bg-white border border-gray-100 rounded-2xl p-0 mb-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(16,62,104,0.1)] hover:border-primary/20 overflow-hidden">
            {/* Index Badge & Floating Action */}
            <div className="absolute top-0 left-0 w-12 h-12 bg-gray-50 flex items-center justify-center rounded-br-2xl border-b border-r border-gray-100 group-hover:bg-primary group-hover:text-white transition-colors duration-500 z-10">
                <span className="text-xs font-black tracking-tighter">#{index}</span>
            </div>

            <div className="absolute top-4 right-4 z-10">
                <SaveTenderButton tenderId={tender.id.toString()} variant="icon" />
            </div>

            <div className="flex flex-col md:flex-row h-full">
                {/* Authority & Identification Column */}
                <div className="md:w-[220px] bg-[#f8fafc] p-6 pt-16 flex flex-col justify-between border-r border-gray-50">
                    <div className="space-y-4">
                        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-500">
                            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none">ID / Ref</span>
                            <span className="block text-[11px] font-black text-primary truncate">
                                {tender.reference_no?.split(' ')[0] || `TS-${tender.id.toString().slice(0, 8).toUpperCase()}`}
                            </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-gray-500">
                            <Building2 size={14} className="text-primary/60 shrink-0" />
                            <span className="text-[11px] font-bold uppercase tracking-tight line-clamp-2 leading-tight">
                                {tender.authority || 'Contracting Authority'}
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${isClosingSoon ? 'bg-red-50 text-red-600 border border-red-100' :
                                isExpired ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700 border border-green-100'
                            }`}>
                            <Clock size={12} className={isClosingSoon ? 'animate-pulse' : ''} />
                            {daysLeft || 'Active'}
                        </div>
                    </div>
                </div>

                {/* Main Content Column */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-white relative">
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-0.5 bg-primary/5 text-primary text-[9px] font-black rounded border border-primary/10 uppercase tracking-widest">
                                {tender.tender_type || 'Open Tender'}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[9px] font-black rounded border border-gray-200 uppercase tracking-widest">
                                {tender.tender_category || 'Procurement'}
                            </span>
                        </div>

                        <Link href={`/tender/${tender.id}`}>
                            <h3 className="text-xl font-extrabold text-[#1e293b] group-hover:text-primary transition-colors leading-tight mb-3 tracking-tight">
                                {tender.title}
                            </h3>
                        </Link>

                        <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed opacity-80">
                            {tender.summary || `Strategic project requiring expert ${tender.tender_category?.toLowerCase() || 'service'} solutions for ${tender.authority?.toLowerCase()}. Targeted completion within specified timelines.`}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-50">
                        {/* Value */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <Wallet size={13} strokeWidth={2.5} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Estimated Value</span>
                            </div>
                            <p className="text-[15px] font-black text-[#1e293b] truncate">
                                {formatDisplayAmount(tender.tender_value || tender.value)}
                            </p>
                        </div>

                        {/* Location */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <MapPin size={13} strokeWidth={2.5} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Job Location</span>
                            </div>
                            <p className="text-[15px] font-black text-[#1e293b] truncate">
                                {tender.state || 'Pan India'}
                            </p>
                        </div>

                        {/* End Date - Only on Large */}
                        <div className="space-y-1 hidden lg:block">
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <CalendarDays size={13} strokeWidth={2.5} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Closing Date</span>
                            </div>
                            <p className={`text-[15px] font-black truncate ${isClosingSoon ? 'text-red-600' : 'text-[#1e293b]'}`}>
                                {tender.bid_submission_end || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Action Column */}
                <div className="md:w-[80px] border-t md:border-t-0 md:border-l border-gray-100 flex md:flex-col items-center justify-center p-4 bg-gray-50/50 gap-4">
                    <Link
                        href={`/tender/${tender.id}`}
                        className="flex-1 md:w-12 md:h-12 bg-primary text-white flex items-center justify-center rounded-xl md:rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20 group/btn"
                    >
                        <ChevronRight size={24} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                    <button className="flex-1 md:w-12 md:h-12 bg-white text-gray-400 border border-gray-200 flex items-center justify-center rounded-xl md:rounded-full hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                        <Share2 size={18} />
                    </button>
                    <button className="flex-1 md:w-12 md:h-12 bg-white text-gray-400 border border-gray-200 flex items-center justify-center rounded-xl md:rounded-full hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                        <FileCheck size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
