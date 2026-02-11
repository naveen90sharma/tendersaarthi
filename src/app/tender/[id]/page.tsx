
import { MapPin, Calendar, FileText, Download, Share2, Building2, Clock, Printer, BadgeAlert, Star, Bell, CheckCircle2, AlertTriangle, ShieldCheck, Briefcase, ExternalLink, MessageSquare, ChevronRight, FileCheck, IndianRupee, AlertCircle, Copy, Wallet } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { Metadata } from 'next';
import Link from 'next/link';
import SaveTenderButton from '@/components/SaveTenderButton';
import { headers } from 'next/headers';

interface TenderDetailProps {
    params: Promise<{ id: string }>;
}

// Fetch Tender Data
async function getTender(id: string) {
    const { data: tender, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !tender) return { tender: null, similar: [] };

    // Fetch 3 similar tenders from same category
    const { data: similar } = await supabase
        .from('tenders')
        .select('id, title, tender_value, bid_submission_end, state')
        .eq('tender_category', (tender as any).tender_category)
        .neq('id', id)
        .limit(3);

    return { tender, similar: similar || [] };
}

// SEO Metadata
export async function generateMetadata({ params }: TenderDetailProps): Promise<Metadata> {
    const { id } = await params;
    const { tender } = await getTender(id);

    if (!tender) {
        return {
            title: 'Tender Not Found - TenderSaarthi',
            description: 'The requested tender could not be found.'
        };
    }

    return {
        title: `${tender.title} | TenderSaarthi`,
        description: `View details for tender: ${tender.title}. Authority: ${tender.authority}, Value: ${tender.tender_value}.`,
    };
}

export default async function TenderDetailPage({ params }: TenderDetailProps) {
    const { id } = await params;
    const { tender, similar } = await getTender(id);
    const headersList = await headers();
    const domain = headersList.get('host') || 'tendersaarthi.in';
    const protocol = domain.includes('localhost') ? 'http' : 'https';
    const currentUrl = `${protocol}://${domain}/tender/${id}`;

    if (!tender) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <AlertTriangle size={32} />
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
        <div className="bg-[#f8fafc] min-h-screen pb-16">
            {/* Header / Breadcrumb Section */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <Link href="/" className="hover:text-primary transition-colors flex-shrink-0">Home</Link>
                        <ChevronRight size={12} className="flex-shrink-0" />
                        <Link href="/active-tenders" className="hover:text-primary transition-colors flex-shrink-0">Tenders</Link>
                        <ChevronRight size={12} className="flex-shrink-0" />
                        <span className="text-primary truncate max-w-[200px]">{tender.tender_id || 'Details'}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

                    {/* MAIN CONTENT */}
                    <div className="space-y-8">
                        {/* Title Card */}
                        <div className="bg-white rounded-[2rem] shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
                            {/* Accent Line */}
                            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-[#137fec] to-primary" />

                            <div className="p-8">
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-primary text-[10px] uppercase font-black px-3 py-1.5 rounded-lg border border-blue-100">
                                        <Building2 size={12} />
                                        {(tender.authority || (tender.organisation_chain && tender.organisation_chain.split('||')[0])) || 'N/A'}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-[10px] uppercase font-black px-3 py-1.5 rounded-lg border border-purple-100">
                                        <Briefcase size={12} />
                                        {tender.tender_category || 'N/A'}
                                    </span>
                                    {tender.state && (
                                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[10px] uppercase font-black px-3 py-1.5 rounded-lg border border-green-100">
                                            <MapPin size={12} />
                                            {tender.state}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 text-[10px] uppercase font-black px-3 py-1.5 rounded-lg border border-gray-100">
                                        ID: {tender.tender_id || 'N/A'}
                                    </span>
                                </div>

                                <h1 className="text-2xl md:text-3xl font-black text-[#1e293b] leading-[1.3] mb-6 tracking-tight">
                                    {tender.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500 border-t border-gray-50 pt-6">
                                    <div className="flex items-center gap-2" title="Published Date">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span>Posted: <span className="text-gray-900 font-bold">{tender.published_date || 'N/A'}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2" title="Reference Number">
                                        <FileText size={16} className="text-gray-400" />
                                        <span>Ref No: <span className="text-gray-900 font-bold">{tender.reference_no || 'N/A'}</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Critical Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-primary/30 transition-all">
                                <div className="mb-4 text-gray-400 group-hover:text-primary transition-colors">
                                    <IndianRupee size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tender Value</p>
                                    <p className="text-lg font-black text-[#1e293b] truncate" title={tender.tender_value}>{tender.tender_value || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-primary/30 transition-all">
                                <div className="mb-4 text-gray-400 group-hover:text-primary transition-colors">
                                    <Wallet size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">EMD Amount</p>
                                    <p className="text-lg font-black text-[#1e293b] truncate">{tender.emd_amount || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-primary/30 transition-all">
                                <div className="mb-4 text-gray-400 group-hover:text-primary transition-colors">
                                    <FileCheck size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tender Fee</p>
                                    <p className="text-lg font-black text-[#1e293b] truncate">{tender.tender_fee || 'N/A'}</p>
                                </div>
                            </div>

                            <div className={`p-6 rounded-2xl shadow-sm border flex flex-col justify-between transition-all ${isUrgent ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
                                <div className={`mb-4 ${isUrgent ? 'text-red-500' : 'text-gray-400'}`}>
                                    <Clock size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isUrgent ? 'text-red-400' : 'text-gray-400'}`}>Deadline</p>
                                    <p className={`text-lg font-black truncate ${isUrgent ? 'text-red-600' : 'text-[#1e293b]'}`}>{tender.bid_submission_end || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description & Summary */}
                        <div className="bg-white rounded-[2rem] shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 p-8 space-y-8">
                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-black text-[#1e293b] uppercase tracking-widest mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Project Description
                                </h3>
                                <div className="prose prose-slate max-w-none text-sm text-gray-600 font-medium leading-relaxed bg-[#f8fafc] p-6 rounded-2xl border border-gray-100">
                                    <div dangerouslySetInnerHTML={{
                                        __html: tender.description?.includes('<')
                                            ? tender.description
                                            : tender.description?.replace(/\n/g, '<br/>') || 'No detailed summary available.'
                                    }} />
                                </div>
                            </div>

                            {tender.eligibility_requirements && (
                                <div>
                                    <h3 className="flex items-center gap-2 text-sm font-black text-[#1e293b] uppercase tracking-widest mb-4">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        Eligibility Criteria
                                    </h3>
                                    <div className="prose prose-blue max-w-none text-sm bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 text-slate-700">
                                        <div dangerouslySetInnerHTML={{
                                            __html: tender.eligibility_requirements.includes('<')
                                                ? tender.eligibility_requirements
                                                : tender.eligibility_requirements.split('\n').map((l: string) => l.trim() ? `<li class="mb-1">${l}</li>` : '').join('')
                                        }} />
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-black text-[#1e293b] uppercase tracking-widest mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Important Dates
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { label: 'Published Date', value: tender.published_date },
                                        { label: 'Bid Submission Start', value: tender.bid_submission_start },
                                        { label: 'Bid Submission End', value: tender.bid_submission_end },
                                        { label: 'Bid Opening Date', value: tender.bid_opening_date },
                                        { label: 'Bid Validity', value: tender.bid_validity ? `${tender.bid_validity} Days` : null }
                                    ].map((date, i) => (
                                        date.value && (
                                            <div key={i} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl hover:border-primary/20 transition-all">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">{date.label}</span>
                                                <span className="text-sm font-black text-[#1e293b]">{date.value}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="bg-[#1e293b] rounded-[2rem] p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />

                            <h3 className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-widest mb-6 relative z-10">
                                <FileCheck className="text-tj-yellow" size={18} />
                                Official Documents
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                {tender.official_link && (
                                    <a
                                        href={tender.official_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="col-span-full group flex items-center justify-between bg-primary hover:bg-[#137fec] text-white p-5 rounded-xl transition-all border border-white/10"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                                <ExternalLink size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-sm uppercase tracking-wide">Official Portal</p>
                                                <p className="text-xs text-white/60 font-medium">Verify on source website</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                    </a>
                                )}

                                <DocumentButton
                                    label="NIT Document"
                                    url={tender.nit_document}
                                    type="pdf"
                                />
                                <DocumentButton
                                    label="BOQ Document"
                                    url={tender.boq_document}
                                    type="xls"
                                />
                            </div>

                            <p className="mt-6 text-[10px] text-white/40 font-bold uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck size={12} />
                                Documents sourced directly from government servers
                            </p>
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <aside className="space-y-6">
                        {/* Action Panel */}
                        <div className="bg-white rounded-[1.5rem] shadow-lg shadow-gray-200/50 border border-primary/10 p-6 sticky top-24">
                            <div className="space-y-4">
                                <div className="text-center mb-6">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Time Remaining</p>
                                    <p className={`text-2xl font-black ${isExpired ? 'text-gray-400' : isUrgent ? 'text-red-500' : 'text-primary'}`}>
                                        {isExpired ? 'EXPIRED' : daysLeft ? `${daysLeft} DAYS` : 'Calculating...'}
                                    </p>
                                </div>

                                <SaveTenderButton tenderId={tender.id.toString()} />

                                <a
                                    href={`https://wa.me/?text=${encodeURIComponent(`Check out this Tender: ${tender.title}\nValue: ${tender.tender_value}\nLink: ${currentUrl}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_4px_14px_rgba(37,211,102,0.2)] active:scale-95"
                                >
                                    <MessageSquare size={18} fill="currentColor" />
                                    Share on WhatsApp
                                </a>

                                <button className="flex items-center justify-center gap-3 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-gray-200">
                                    <Bell size={18} />
                                    Set Alert
                                </button>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Contractor Checklist</h4>
                                <div className="space-y-3">
                                    {[
                                        'Valid Digital Signature',
                                        'GST Registration',
                                        'Experience Certificates',
                                        'Solvency Certificate'
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                            <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Similar Tenders */}
                        {similar.length > 0 && (
                            <div className="bg-white border border-gray-100 rounded-[1.5rem] p-6">
                                <h4 className="text-xs font-black text-[#1e293b] uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Briefcase size={14} className="text-primary" />
                                    Similar Opportunities
                                </h4>
                                <div className="space-y-4">
                                    {similar.map((t: any) => (
                                        <Link
                                            key={t.id}
                                            href={`/tender/${t.id}`}
                                            className="group block p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md hover:border-primary/20 hover:scale-[1.02] transition-all border border-transparent duration-300"
                                        >
                                            <p className="text-xs font-bold text-gray-700 line-clamp-2 leading-relaxed mb-3 group-hover:text-primary transition-colors">
                                                {t.title}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-wider bg-white px-2 py-1 rounded shadow-sm">
                                                    <IndianRupee size={10} />
                                                    {t.tender_value || 'N/A'}
                                                </span>
                                                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                                                    End: {t.bid_submission_end?.split(' ')[0] || 'N/A'}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            <footer className="mt-12 text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                Verified Tender Data Sourced from Official Portals
            </footer>
        </div>
    );
}

// Helper Components
function DocumentButton({ label, url, type }: { label: string; url?: string | null; type: 'pdf' | 'xls' }) {
    if (!url) {
        return (
            <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5 opacity-50 cursor-not-allowed">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                    <AlertCircle size={20} className="text-gray-400" />
                </div>
                <div>
                    <p className="font-bold text-sm text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-[10px] text-gray-500 font-medium">Not Available</p>
                </div>
            </div>
        );
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/10 transition-colors group"
        >
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-tj-yellow group-hover:scale-110 transition-transform">
                <Download size={20} />
            </div>
            <div>
                <p className="font-bold text-sm text-white uppercase tracking-wide">{label}</p>
                <p className="text-[10px] text-white/60 font-medium uppercase">Download {type.toUpperCase()}</p>
            </div>
        </a>
    );
}
