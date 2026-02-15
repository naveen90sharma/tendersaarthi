
import { MapPin, Calendar, FileText, Download, Building2, Clock, ShieldCheck, Briefcase, ExternalLink, MessageSquare, ChevronRight, FileCheck, IndianRupee, AlertCircle, Copy, Wallet, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { Metadata } from 'next';
import Link from 'next/link';
import SaveTenderButton from '@/components/SaveTenderButton';
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
        .select('id, slug, title, tender_value, bid_submission_end, state')
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
                    <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-blue-200/60 uppercase tracking-[0.2em] mb-6 md:mb-8 overflow-x-auto no-scrollbar">
                        <Link href="/" className="hover:text-tj-yellow transition-colors whitespace-nowrap">Home</Link>
                        <ChevronRight size={10} className="opacity-40" />
                        <Link href="/active-tenders" className="hover:text-tj-yellow transition-colors whitespace-nowrap">Tenders</Link>
                        <ChevronRight size={10} className="opacity-40" />
                        <span className="text-tj-yellow truncate">#{tender.tender_id || 'Detail'}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-[#FFC212]">
                            {tender.tender_category}
                        </div>
                        {tender.state && (
                            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-blue-200">
                                {tender.state}
                            </div>
                        )}
                    </div>

                    <h1 className="text-2xl md:text-5xl font-black leading-[1.2] md:leading-tight tracking-tight mb-8">
                        {tender.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 md:gap-10 text-[10px] md:text-sm font-black uppercase tracking-widest text-blue-100/60">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-tj-yellow" />
                            <span>Published: <span className="text-white">{tender.published_date || 'N/A'}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Building2 size={14} className="text-tj-yellow" />
                            <span className="truncate max-w-[200px]">{tender.authority}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                    <div className="space-y-8">
                        {/* Highlights Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            {[
                                { label: 'Tender Value', value: tender.tender_value, icon: <IndianRupee size={20} />, color: 'bg-white' },
                                { label: 'EMD Amount', value: tender.emd_amount, icon: <Wallet size={20} />, color: 'bg-white' },
                                { label: 'Tender Fee', value: tender.tender_fee, icon: <FileCheck size={20} />, color: 'bg-white' },
                                { label: 'Bid Deadline', value: tender.bid_submission_end, icon: <Clock size={20} />, color: isUrgent ? 'bg-red-50' : 'bg-white', text: isUrgent ? 'text-red-600' : 'text-primary' },
                            ].map((item, i) => (
                                <div key={i} className={`${item.color} p-5 md:p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col justify-between group transition-all`}>
                                    <div className={`mb-4 ${item.text || 'text-slate-400 group-hover:text-primary'}`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className={`text-base font-black truncate ${item.text || 'text-slate-800'}`}>{item.value || 'N/A'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* AI Powered Analysis Section */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                                <div className="space-y-1">
                                    <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                                        <Sparkles className="text-tj-yellow animate-pulse" />
                                        AI Tender Intelligence
                                    </h2>
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Automated opportunity assessment v3.4</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="bg-primary/5 text-primary text-[9px] font-black px-4 py-2 rounded-full border border-primary/10 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                        LIVE ANALYSIS
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                {[
                                    { label: 'Complexity', value: 'High Accuracy Extract', icon: <FileText size={16} /> },
                                    { label: 'Work Type', value: tender.tender_category, icon: <Briefcase size={16} /> },
                                    { label: 'Authority', value: tender.authority, icon: <Building2 size={16} /> },
                                    { label: 'Deadline Status', value: isExpired ? 'Expired' : 'Active Opportunity', icon: <Clock size={16} /> },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-primary/20 hover:bg-white transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                                            <p className="text-sm text-slate-700 font-bold truncate max-w-[200px]">{item.value || 'N/A'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {tender.eligibility_requirements && (
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3">
                                        <div className="w-8 h-[2px] bg-tj-yellow" />
                                        Eligibility & Key Requirements
                                    </h3>
                                    <div className="bg-slate-50 rounded-[2rem] p-6 md:p-10 border border-slate-100 shadow-inner">
                                        <div className="prose prose-slate prose-sm max-w-none text-slate-600 font-medium leading-loose">
                                            <div dangerouslySetInnerHTML={{
                                                __html: tender.eligibility_requirements.includes('<')
                                                    ? tender.eligibility_requirements
                                                    : `<ul class="space-y-4">${tender.eligibility_requirements.split('\n').map((l: string) => l.trim() ? `<li class="flex items-start gap-3"><span class="w-1.5 h-1.5 rounded-full bg-tj-yellow mt-2 shrink-0"></span> <span class="flex-1">${l}</span></li>` : '').join('')}</ul>`
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Detailed Description */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] px-2 flex items-center gap-3">
                                <FileCheck className="text-primary" size={18} />
                                Full Project Specification
                            </h3>
                            <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-sm prose prose-slate max-w-none text-slate-600 font-medium leading-[1.8]">
                                <div dangerouslySetInnerHTML={{
                                    __html: tender.description?.includes('<')
                                        ? tender.description
                                        : tender.description?.replace(/\n/g, '<br/>') || 'No detailed description provided by authority.'
                                }} />
                            </div>
                        </div>

                        {/* Procurement Context & Regional Intelligence */}
                        <div className="bg-slate-50/50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 relative overflow-hidden">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-primary">
                                    <MapPin size={24} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">
                                        Understanding <span className="text-primary">{tender.tender_category}</span> in {tender.location}
                                    </h3>
                                    <div className="prose prose-slate prose-sm max-w-none text-slate-600 font-medium leading-[1.8]">
                                        <p>
                                            This opportunity by <span className="font-bold text-slate-900">{tender.authority}</span> represents a significant procurement action in the <span className="font-bold text-slate-900">{tender.tender_category}</span> sector.
                                            Located in <span className="font-bold text-slate-900">{tender.location} {tender.state ? `(${tender.state})` : ''}</span>, this project is part of the regional development framework.
                                        </p>
                                        <p>
                                            As a <span className="text-primary font-bold uppercase tracking-wider text-[10px] bg-primary/5 px-2 py-1 rounded">{tender.tender_type}</span>, businesses
                                            specializing in this domain are encouraged to review the eligibility requirements carefully. TenderSaarthi provides full bid-preparedness support to help you navigate the
                                            complex submission process of {tender.authority} with confidence.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Same similar tenders section but with updated styling */}
                        {similar.length > 0 && (
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full blur-3xl -mr-16 -mt-16" />
                                <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3 mb-10">
                                    <div className="w-2 h-10 bg-orange-500 rounded-full" />
                                    Related Opportunities
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {similar.map((t: any) => (
                                        <Link key={t.slug} href={`/tenders/${t.slug}`} className="group p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-orange-100 hover:bg-white hover:shadow-xl transition-all duration-500">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-2 by-1 rounded-lg uppercase tracking-wider">AI MATCH</span>
                                                <span className="text-[10px] font-bold text-slate-400">{t.state || 'National'}</span>
                                            </div>
                                            <h4 className="text-sm font-black text-slate-700 group-hover:text-primary transition-colors line-clamp-2 mb-4 leading-normal">{t.title}</h4>
                                            <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-100/50">
                                                <span className="font-black text-slate-500">₹ {t.tender_value || 'N/A'}</span>
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Hidden on Mobile, Sticky on Desktop */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200 border border-slate-50">
                                <div className="text-center mb-8 pb-8 border-b border-slate-50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time to Decision</p>
                                    <p className={`text-4xl font-black tracking-tighter ${isExpired ? 'text-slate-300' : isUrgent ? 'text-red-500' : 'text-primary'}`}>
                                        {isExpired ? 'EXPIRED' : daysLeft ? `${daysLeft} DAYS` : 'TBD'}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <SaveTenderButton tenderId={tender.id.toString()} />
                                    <a
                                        href={tender.official_link || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl active:scale-95"
                                    >
                                        <ExternalLink size={18} />
                                        Official portal
                                    </a>
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(`Checkout this Tender: ${tender.title}\nValue: ${tender.tender_value}\nLink: ${currentUrl}`)}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-3 border-2 border-slate-100 hover:bg-slate-50 text-slate-600 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all"
                                    >
                                        <MessageSquare size={18} className="text-[#25D366]" />
                                        Share on WhatsApp
                                    </a>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-primary to-[#0d345b] rounded-[2rem] p-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                                <h3 className="text-lg font-black tracking-tight mb-2 relative z-10">Need Bid Support?</h3>
                                <p className="text-blue-100/60 text-xs font-bold mb-6 relative z-10">Our experts help you prepare flawless submissions for maximum success.</p>
                                <Link href="/bid-support" className="inline-flex items-center gap-2 text-tj-yellow font-black text-[10px] uppercase tracking-[0.2em] hover:gap-4 transition-all relative z-10">
                                    Expert Counseling <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Premium Mobile Sticky Bottom Action Bar */}
            <div className="fixed bottom-16 left-0 right-0 z-50 lg:hidden px-4 pb-6 pt-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="max-w-md mx-auto flex items-center gap-3 px-2">
                    <div className="flex-1">
                        <a
                            href={tender.official_link || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
                        >
                            Apply Now
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                        <SaveTenderButton
                            tenderId={tender.id.toString()}
                            variant="icon"
                            className="w-[52px] h-[52px] bg-slate-50 text-slate-400 rounded-2xl border border-slate-200/50 active:scale-95 transition-all"
                        />
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(`Check out this Tender: ${tender.title}\nValue: ${tender.tender_value}\nLink: ${currentUrl}`)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="w-[52px] h-[52px] flex items-center justify-center bg-[#25D366]/10 text-[#25D366] rounded-2xl border border-[#25D366]/20 active:scale-95 transition-all"
                        >
                            <MessageSquare size={22} fill="currentColor" strokeWidth={1} />
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
}

