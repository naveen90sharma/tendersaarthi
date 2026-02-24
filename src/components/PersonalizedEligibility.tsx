'use client';

import { useContractor } from '@/context/ContractorContext';
import { Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Props {
    tenderValue: string | number | undefined;
    tenderCategory?: string;
}

export default function PersonalizedEligibility({ tenderValue, tenderCategory }: Props) {
    const { profile, loading, checkEligibility } = useContractor();

    if (loading) return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-slate-50 rounded"></div>
        </div>
    );

    if (!profile) {
        return (
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-800 mb-1">Check Your Eligibility</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                            Complete your Capability Profile to see if you qualify for this tender based on your expertise, turnover and experience.
                        </p>
                        <Link
                            href="/dashboard/profile"
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest hover:gap-3 transition-all"
                        >
                            Setup Profile <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const result = checkEligibility(tenderValue, tenderCategory);

    return (
        <div className={`rounded-3xl p-6 border-2 transition-all ${result.score > 70 ? 'bg-emerald-50/50 border-emerald-100' :
                result.score > 40 ? 'bg-amber-50/50 border-amber-100' :
                    result.score > 20 ? 'bg-orange-50/50 border-orange-100' :
                        'bg-rose-50/50 border-rose-100'
            }`}>
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${result.score > 70 ? 'bg-emerald-500 text-white' :
                        result.score > 40 ? 'bg-amber-500 text-white' :
                            result.score > 20 ? 'bg-orange-500 text-white' :
                                'bg-rose-500 text-white'
                    }`}>
                    {result.score > 40 ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-base font-black tracking-tight ${result.score > 70 ? 'text-emerald-900' :
                                result.score > 40 ? 'text-amber-900' :
                                    result.score > 20 ? 'text-orange-900' :
                                        'text-rose-900'
                            }`}>
                            {result.eligible}
                        </h4>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Personal Match</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {result.score > 70 ? "Excellent Match! Your past experience and category expertise strongly align with this tender." :
                            result.score > 40 ? "Good Potential. While some requirements might be tight, you have a strong chance with the right strategy." :
                                result.score > 20 ? "Stretch Opportunity. This tender might require a Joint Venture (JV) or significant expansion of capacity." :
                                    "High Risk. We recommend looking for smaller opportunities or building more experience in this category first."}
                    </p>

                    <div className="mt-4 flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${result.score > 70 ? 'bg-emerald-500' :
                                        result.score > 40 ? 'bg-amber-500' :
                                            result.score > 20 ? 'bg-orange-500' :
                                                'bg-rose-500'
                                    }`}
                                style={{ width: `${result.score}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-black text-slate-400">{result.score}% Match</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
