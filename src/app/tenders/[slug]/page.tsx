
import { MapPin, Calendar, FileText, Download, Building2, Clock, ShieldCheck, Briefcase, ExternalLink, MessageSquare, ChevronRight, FileCheck, IndianRupee, AlertCircle, Copy, Wallet, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { Metadata } from 'next';
import Link from 'next/link';
import SaveTenderButton from '@/components/SaveTenderButton';
import PrintButton from '@/components/PrintButton';
import TenderIntelligence from '@/components/TenderIntelligence';
import PersonalizedEligibility from '@/components/PersonalizedEligibility';
import SmallTenderCard from '@/components/SmallTenderCard';
import { headers } from 'next/headers';

interface TenderDetailProps {
    params: Promise<{ slug: string }>;
}

// Fetch Tender Data by Slug
async function getTenderBySlug(slug: string) {
    const { data: tender, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !tender) return { tender: null, similar: [] };

    // Fetch 6 similar tenders from same category and state
    const { data: similar } = await supabase
        .from('tenders')
        .select('id, slug, title, tender_value, bid_submission_end, state, authority, location, tender_category')
        .eq('tender_category', (tender as any).tender_category)
        .neq('id', tender.id)
        .order('created_at', { ascending: false })
        .limit(6);

    return { tender, similar: similar || [] };
}

// SEO Metadata Optimized
export async function generateMetadata({ params }: TenderDetailProps): Promise<Metadata> {
    const { slug } = await params;
    const { tender } = await getTenderBySlug(slug);

    if (!tender) {
        return {
            title: 'Tender Not Found - TenderSaarthi',
            description: 'The requested tender could not be found.'
        };
    }

    return {
        title: `${tender.title} | TenderSaarthi`,
        description: `View details for tender: ${tender.title}. Authority: ${tender.authority}, Value: ${tender.tender_value}. Location: ${tender.state || 'India'}`,
        alternates: {
            canonical: `/tenders/${slug}`
        }
    };
}

// Format helpers
const formatCurrency = (amount: string | number | null | undefined) => {
    if (!amount) return 'N/A';
    // Remove non-numeric characters except dots
    const numStr = typeof amount === 'string' ? amount.replace(/[^0-9.]/g, '') : amount;
    const num = Number(numStr);

    if (isNaN(num) || num === 0) return amount.toString();

    if (num >= 10000000) {
        return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
        return `₹ ${(num / 100000).toFixed(2)} Lakh`;
    } else {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
    }
}

const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'N/A';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return new Intl.DateTimeFormat('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    } catch (e) {
        return dateStr;
    }
}

export default async function TenderDetailPage({ params }: TenderDetailProps) {
    const { slug } = await params;
    const { tender, similar } = await getTenderBySlug(slug);
    const headersList = await headers();
    const domain = headersList.get('host') || 'tendersaarthi.in';
    const protocol = domain.includes('localhost') ? 'http' : 'https';
    const currentUrl = `${protocol}://${domain}/tenders/${slug}`;

    if (!tender) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <AlertCircle size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Tender Not Found</h1>
                    <p className="text-gray-500 mb-8 font-medium">The requested tender opportunity is no longer available or could not be found.</p>
                    <Link href="/active-tenders" className="inline-flex items-center justify-center w-full bg-primary text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#0d345b] transition-all shadow-lg active:scale-95">
                        Browse Active Tenders
                    </Link>
                </div>
            </div>
        );
    }

    const daysLeft = tender.bid_submission_end
        ? Math.ceil((new Date(tender.bid_submission_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const isUrgent = daysLeft !== null && daysLeft <= 5;
    const isExpired = daysLeft !== null && daysLeft <= 0;

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-24 md:pb-16">
            {/* Immersive Header Section */}
            <div className="bg-[#1e293b] text-white pt-6 pb-20 md:py-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Modern Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-[10px] text-blue-200/50 mb-6 overflow-x-auto no-scrollbar flex-wrap">
                        <Link href="/" className="hover:text-tj-yellow transition-colors whitespace-nowrap">Home</Link>
                        <ChevronRight size={10} className="opacity-40" />
                        <Link href="/active-tenders" className="hover:text-tj-yellow transition-colors whitespace-nowrap">Tenders</Link>
                        {tender.state && (
                            <>
                                <ChevronRight size={10} className="opacity-40" />
                                <Link href={`/tenders/state/${tender.state.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-tj-yellow transition-colors whitespace-nowrap">
                                    {tender.state}
                                </Link>
                            </>
                        )}
                        {tender.tender_category && (
                            <>
                                <ChevronRight size={10} className="opacity-40" />
                                <Link href={`/tenders/category/${tender.tender_category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-tj-yellow transition-colors whitespace-nowrap">
                                    {tender.tender_category}
                                </Link>
                            </>
                        )}
                        <ChevronRight size={10} className="opacity-40" />
                        <span className="text-tj-yellow truncate max-w-[180px]">{tender.tender_id || 'Detail'}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                        <div className="px-2.5 py-0.5 bg-white/10 rounded-full border border-white/10 text-[9px] font-medium uppercase tracking-wide text-[#FFC212]">
                            {tender.tender_category}
                        </div>
                        {tender.state && (
                            <div className="px-2.5 py-0.5 bg-white/10 rounded-full border border-white/10 text-[9px] font-medium uppercase tracking-wide text-blue-200">
                                {tender.state}
                            </div>
                        )}
                    </div>

                    <h1 className="text-xl md:text-2xl font-semibold leading-snug tracking-tight mb-5">
                        {tender.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100/50">
                        <div className="flex items-center gap-1.5 bg-white/5 py-1.5 px-3 rounded-full border border-white/5">
                            <Calendar size={12} className="text-tj-yellow" />
                            <span>Published: <span className="text-white/80 font-medium ml-1">{formatDate(tender.published_date)}</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/5 py-1.5 px-3 rounded-full border border-white/5">
                            <Building2 size={12} className="text-tj-yellow" />
                            <span className="truncate max-w-[200px] text-white/80 font-medium">{tender.authority}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                    <div className="space-y-8">
                        {/* Highlights Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {[
                                { label: 'Tender Value', value: formatCurrency(tender.tender_value), icon: <IndianRupee size={15} />, color: 'bg-white' },
                                { label: 'EMD Amount', value: formatCurrency(tender.emd_amount), icon: <Wallet size={15} />, color: 'bg-white' },
                                { label: 'Tender Fee', value: formatCurrency(tender.tender_fee), icon: <FileCheck size={15} />, color: 'bg-white' },
                                { label: 'Bid Deadline', value: formatDate(tender.bid_submission_end), icon: <Clock size={15} />, color: isUrgent ? 'bg-red-50' : 'bg-white', text: isUrgent ? 'text-red-600' : 'text-primary' },
                            ].map((item, i) => (
                                <div key={i} className={`${item.color} p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2`}>
                                    <div className={`${item.text || 'text-slate-300'}`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">{item.label}</p>
                                        <p className={`text-sm font-semibold leading-tight break-words ${item.text || 'text-slate-700'}`}>
                                            {item.value || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Important Downloads Section */}
                        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Download className="text-primary" size={15} />
                                Official Documents
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="group bg-slate-50 hover:bg-white border border-slate-100 hover:border-primary/20 rounded-lg p-3 transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-red-50 text-red-400 p-2 rounded-lg shrink-0">
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-700 text-xs mb-0.5">Notice Inviting Tender (NIT)</p>
                                            <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-2">PDF • Official</p>
                                            <a href={tender.official_link || '#'} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:underline">
                                                Download <ArrowRight size={9} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="group bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-300/30 rounded-lg p-3 transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-emerald-50 text-emerald-500 p-2 rounded-lg shrink-0">
                                            <FileCheck size={16} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-700 text-xs mb-0.5">Bill of Quantities (BoQ)</p>
                                            <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-2">XLS • Financial</p>
                                            <a href={tender.official_link || '#'} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 hover:underline">
                                                Download <ArrowRight size={9} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Market Intelligence Logic - Shared Context */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PersonalizedEligibility
                                tenderValue={tender.tender_value_numeric || tender.tender_value}
                                tenderCategory={tender.tender_category}
                            />
                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pro Alerts</h4>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <MessageSquare size={20} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-700 leading-tight">Get similar tender alerts for <span className="text-primary">{tender.state}</span> directly on WhatsApp.</p>
                                </div>
                                <Link href="/dashboard/settings" className="block w-full text-center py-2.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100">
                                    Subscribe to WhatsApp Alerts
                                </Link>
                            </div>
                        </div>

                        <TenderIntelligence tender={tender} />

                        {/* Eligibility & Requirements Section - Separate */}
                        {(tender.eligibility_requirements || tender.similar_work_clause_exact_text || tender.turnover_requirement_exact_text || tender.net_worth_requirement_exact_text) && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-8 bg-gradient-to-b from-primary to-blue-400 rounded-full" />
                                        <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">
                                            Eligibility & Requirements
                                        </h3>
                                    </div>
                                    <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-200 to-transparent" />
                                </div>

                                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
                                    {tender.eligibility_requirements && (
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 mb-2">General Requirements</h4>
                                            <div
                                                className="eligibility-html-content prose prose-slate max-w-none text-sm text-slate-600"
                                                dangerouslySetInnerHTML={{ __html: tender.eligibility_requirements.replace(/\n/g, '<br/>') }}
                                            />
                                        </div>
                                    )}

                                    {tender.similar_work_clause_exact_text && (
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 mb-2">Similar Work Experience</h4>
                                            <div
                                                className="prose prose-slate max-w-none text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100"
                                                dangerouslySetInnerHTML={{ __html: tender.similar_work_clause_exact_text.replace(/\n/g, '<br/>') }}
                                            />
                                        </div>
                                    )}

                                    {(tender.turnover_requirement_exact_text || tender.net_worth_requirement_exact_text) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {tender.turnover_requirement_exact_text && (
                                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1.5">Turnover Requirement</h4>
                                                    <div className="text-sm text-blue-900 font-semibold whitespace-pre-wrap">{tender.turnover_requirement_exact_text}</div>
                                                </div>
                                            )}
                                            {tender.net_worth_requirement_exact_text && (
                                                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                                    <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1.5">Net Worth Requirement</h4>
                                                    <div className="text-sm text-emerald-900 font-semibold whitespace-pre-wrap">{tender.net_worth_requirement_exact_text}</div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Detailed Description */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-8 bg-gradient-to-b from-primary to-blue-400 rounded-full" />
                                    <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">
                                        Full Project Specification
                                    </h3>
                                </div>
                                <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-200 to-transparent" />
                            </div>

                            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                                {/* Render HTML description with improved styling */}
                                <div
                                    className="project-specification-content prose prose-slate max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: tender.description?.includes('<')
                                            ? tender.description
                                            : tender.description?.replace(/\n/g, '<br/>') || 'No detailed description provided by authority.'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Procurement Context & Regional Intelligence */}
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                            <div className="flex gap-4 items-start">
                                <div className="w-9 h-9 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center text-primary shrink-0">
                                    <MapPin size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-2">
                                        Understanding <span className="text-primary">{tender.tender_category}</span> in {tender.location}
                                    </h3>
                                    <div className="text-xs text-slate-500 leading-relaxed space-y-2">
                                        <p>
                                            This opportunity by <span className="font-semibold text-slate-700">{tender.authority}</span> represents a significant procurement action in the <span className="font-semibold text-slate-700">{tender.tender_category}</span> sector.
                                            Located in <span className="font-semibold text-slate-700">{tender.location} {tender.state ? `(${tender.state})` : ''}</span>, this project is part of the regional development framework.
                                        </p>
                                        <p>
                                            As a <span className="text-primary font-medium text-[10px] bg-primary/5 px-1.5 py-0.5 rounded">{tender.tender_type}</span>, businesses
                                            specializing in this domain are encouraged to review the eligibility requirements carefully.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Same similar tenders section but with updated styling */}
                        {similar.length > 0 && (
                            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm transition-all duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-tj-yellow rounded-full" />
                                        Related Opportunities
                                    </h3>
                                    <Link
                                        href="/active-tenders"
                                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-tj-blue transition-colors flex items-center gap-1 group"
                                    >
                                        View All
                                        <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {similar.map((t: any, index: number) => (
                                        <SmallTenderCard key={t.slug || t.id} tender={t} index={index} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Hidden on Mobile, Sticky on Desktop */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-white rounded-xl p-5 shadow-md border border-slate-100">
                                <div className="text-center mb-5 pb-5 border-b border-slate-50">
                                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider mb-1">Time to Decision</p>
                                    <p className={`text-2xl font-bold tracking-tight ${isExpired ? 'text-slate-300' : isUrgent ? 'text-red-500' : 'text-primary'}`}>
                                        {isExpired ? 'EXPIRED' : daysLeft ? `${daysLeft} Days` : 'TBD'}
                                    </p>
                                </div>
                                <div className="space-y-2.5">
                                    <SaveTenderButton tenderId={tender.id.toString()} />
                                    <a
                                        href={tender.official_link || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                                    >
                                        <ExternalLink size={14} />
                                        Official Portal
                                    </a>
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(`Checkout this Tender: ${tender.title}\nValue: ${tender.tender_value}\nLink: ${currentUrl}`)}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 border border-slate-100 hover:bg-slate-50 text-slate-500 py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider transition-all"
                                    >
                                        <MessageSquare size={14} className="text-[#25D366]" />
                                        Share on WhatsApp
                                    </a>
                                    <PrintButton />
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-primary to-[#0d345b] rounded-xl p-5 text-white">
                                <h3 className="text-sm font-semibold tracking-tight mb-1.5">Need Bid Support?</h3>
                                <p className="text-blue-100/60 text-xs mb-4">Our experts help you prepare flawless submissions for maximum success.</p>
                                <Link href="/bid-support" className="inline-flex items-center gap-1.5 text-tj-yellow font-semibold text-xs hover:gap-3 transition-all">
                                    Expert Counseling <ArrowRight size={12} />
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Premium Mobile Sticky Bottom Action Bar */}
            <div className="fixed bottom-16 left-0 right-0 z-50 lg:hidden px-4 pb-4 pt-3 bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-md mx-auto flex items-center gap-2">
                    <div className="flex-1">
                        <a
                            href={tender.official_link || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                            Apply Now
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                        <SaveTenderButton
                            tenderId={tender.id.toString()}
                            variant="icon"
                            className="w-[46px] h-[46px] bg-slate-50 text-slate-400 rounded-xl border border-slate-200 active:scale-95 transition-all"
                        />
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(`Check out this Tender: ${tender.title}\nValue: ${tender.tender_value}\nLink: ${currentUrl}`)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="w-[46px] h-[46px] flex items-center justify-center bg-[#25D366]/10 text-[#25D366] rounded-xl border border-[#25D366]/20 active:scale-95 transition-all"
                        >
                            <MessageSquare size={18} fill="currentColor" strokeWidth={1} />
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
}

