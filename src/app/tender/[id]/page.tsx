
import { MapPin, Calendar, FileText, Download, Share2, Building2, Clock, Printer, BadgeAlert, Star, Bell, CheckCircle2, AlertTriangle, ShieldCheck, Briefcase, ExternalLink } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { Metadata } from 'next';
import Link from 'next/link';

interface TenderDetailProps {
    params: Promise<{ id: string }>;
}

// Fetch Tender Data
async function getTender(id: string) {
    const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return data;
}

// SEO Metadata
export async function generateMetadata({ params }: TenderDetailProps): Promise<Metadata> {
    const { id } = await params;
    const tender = await getTender(id);

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
    const tender = await getTender(id);

    if (!tender) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <BadgeAlert size={40} className="text-red-500 mb-4" />
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">Tender Not Found</h1>
                <p className="text-gray-500 mb-6 text-sm">The requested tender could not be found.</p>
                <Link href="/active-tenders" className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm">
                    Browse All Tenders
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

                    {/* MAIN CONTENT */}
                    <div className="bg-white border border-[#dbe1ea] rounded-lg shadow-sm overflow-hidden">

                        {/* Breadcrumb */}
                        <div className="text-[13px] text-[#64748b] px-[22px] py-[14px] border-b border-[#e5e9f0] flex items-center gap-1.5">
                            <Link href="/" className="hover:text-[#0b5ed7] transition-colors">Home</Link>
                            <span>&gt;</span>
                            <Link href="/active-tenders" className="hover:text-[#0b5ed7] transition-colors">{(tender.authority || (tender.organisation_chain && tender.organisation_chain.split('||')[0])) || 'Authority'} Tenders</Link>
                            <span>&gt;</span>
                            <span className="text-[#0f172a] line-clamp-1">{tender.title}</span>
                        </div>

                        {/* Title and Tags */}
                        <div className="p-[22px]">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="bg-[#e8f0ff] text-[#0b5ed7] text-[10px] uppercase font-bold px-2.5 py-1 rounded">
                                    {(tender.authority || (tender.organisation_chain && tender.organisation_chain.split('||')[0])) || 'N/A'}
                                </span>
                                <span className="bg-[#f1f5f9] text-[#475569] text-[10px] uppercase font-bold px-2.5 py-1 rounded border border-[#cbd5e1]">
                                    {tender.tender_category || 'N/A'}
                                </span>
                                {tender.state && (
                                    <span className="bg-[#ecfdf5] text-[#059669] text-[10px] uppercase font-bold px-2.5 py-1 rounded border border-[#a7f3d0]">
                                        📍 {tender.state}
                                    </span>
                                )}
                                <span className="bg-[#fff7ed] text-[#ea580c] text-[10px] uppercase font-bold px-2.5 py-1 rounded border border-[#fed7aa]">
                                    ID: {tender.tender_id || 'N/A'}
                                </span>
                            </div>

                            <h1 className="text-[26px] font-extrabold leading-tight mb-2 text-[#0f172a]">
                                {tender.title}
                            </h1>
                            <div className="text-sm text-[#475569] leading-relaxed">
                                {tender.description ? (
                                    tender.description.replace(/<[^>]*>?/gm, '').length > 250
                                        ? tender.description.replace(/<[^>]*>?/gm, '').substring(0, 250) + '...'
                                        : tender.description.replace(/<[^>]*>?/gm, '')
                                ) : 'No description provided.'}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-[#f8fafc] border-l-[5px] border-tj-blue px-[22px] py-[18px]">
                            <h3 className="text-xs font-black mb-2.5 uppercase tracking-widest text-[#64748b]">TENDER SUMMARY</h3>
                            <div
                                className="text-sm leading-relaxed prose prose-sm max-w-none text-gray-800"
                                dangerouslySetInnerHTML={{
                                    __html: tender.description?.includes('<')
                                        ? tender.description
                                        : tender.description?.replace(/\n/g, '<br/>') || 'No detailed summary available.'
                                }}
                            />
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 border-t border-b border-[#e5e9f0] bg-white text-tj-blue">
                            <div className="p-4 text-center border-r border-[#e5e9f0]">
                                <label className="text-[10px] font-bold text-[#64748b] uppercase block">Tender Value</label>
                                <strong className="block mt-1 text-sm md:text-base font-extrabold">{tender.tender_value || 'N/A'}</strong>
                            </div>
                            <div className="p-4 text-center border-r border-[#e5e9f0]">
                                <label className="text-[10px] font-bold text-[#64748b] uppercase block">Tender Fee</label>
                                <strong className="block mt-1 text-sm md:text-base font-extrabold">{tender.tender_fee || 'N/A'}</strong>
                            </div>
                            <div className="p-4 text-center border-r border-[#e5e9f0]">
                                <label className="text-[10px] font-bold text-[#64748b] uppercase block">EMD</label>
                                <strong className="block mt-1 text-sm md:text-base font-extrabold">{tender.emd_amount || 'N/A'}</strong>
                            </div>
                            <div className="p-4 text-center border-r lg:border-r border-[#e5e9f0]">
                                <label className="text-[10px] font-bold text-[#64748b] uppercase block">Bid Closing</label>
                                <strong className="block mt-1 text-sm md:text-base font-extrabold text-[#EE3124]">{tender.bid_submission_end || 'N/A'}</strong>
                            </div>
                            <div className="p-4 text-center">
                                <label className="text-[10px] font-bold text-[#64748b] uppercase block">Work Duration</label>
                                <strong className="block mt-1 text-sm md:text-base font-extrabold">{tender.period_of_work ? `${tender.period_of_work} Days` : 'N/A'}</strong>
                            </div>
                        </div>

                        {/* Critical Dates - Side-by-side Layout */}
                        <div className="p-[22px] border-b border-[#e5e9f0] bg-[#fdfdfd]">
                            <h3 className="text-sm font-black mb-4 uppercase tracking-widest text-[#64748b]">Critical Dates</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                                <DateRow label="Published Date" value={tender.published_date} />
                                <DateRow label="Bid Submission Start Date" value={tender.bid_submission_start} />
                                <DateRow label="Bid Submission End Date" value={tender.bid_submission_end} />
                                <DateRow label="Bid Opening Date" value={tender.bid_opening_date} />
                                <DateRow label="Bid Validity (Days)" value={tender.bid_validity || 'N/A'} />
                            </div>
                        </div>

                        {/* Eligibility Snapshot - Fixed Rendering for Rich Text */}
                        <div className="p-[22px] border-b border-[#e5e9f0]">
                            <h3 className="text-sm font-black mb-4 uppercase tracking-widest text-[#64748b]">Eligibility Snapshot</h3>
                            {tender.eligibility_requirements ? (
                                <div className="prose prose-sm max-w-none text-gray-800 bg-[#f9fafb] p-6 rounded-lg border border-gray-100 shadow-inner">
                                    <div
                                        className="eligibility-content"
                                        dangerouslySetInnerHTML={{
                                            __html: tender.eligibility_requirements.includes('<')
                                                ? tender.eligibility_requirements
                                                : tender.eligibility_requirements.split('\n').map((l: string) => l.trim() ? `• ${l}` : '').join('<br/>')
                                        }}
                                    />
                                    <style dangerouslySetInnerHTML={{
                                        __html: `
                                        .eligibility-content ul {
                                            list-style-type: disc !important;
                                            padding-left: 1.5rem !important;
                                            margin-bottom: 1rem !important;
                                        }
                                        .eligibility-content li {
                                            margin-bottom: 0.5rem !important;
                                            display: list-item !important;
                                        }
                                        .eligibility-content p {
                                            margin-bottom: 1rem !important;
                                        }
                                        .eligibility-content strong {
                                            font-weight: 700 !important;
                                            color: #1a202c !important;
                                        }
                                    ` }} />
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No eligibility details provided.</p>
                            )}
                        </div>

                        {/* Project Details */}
                        <div className="p-[22px] border-b border-[#e5e9f0]">
                            <h3 className="text-sm font-black mb-4 uppercase tracking-widest text-[#64748b]">Additional Details</h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                <InfoBox label="Authority" value={tender.authority || 'N/A'} />
                                <InfoBox label="Tender Type" value={tender.tender_type || 'N/A'} />
                                <InfoBox label="Form of Contract" value={tender.form_of_contract || 'N/A'} />
                                <InfoBox label="Tender Category" value={tender.tender_category || 'N/A'} />
                            </div>
                        </div>

                        {/* Documents & Official Links */}
                        <div className="p-[22px] border-b border-[#e5e9f0]">
                            <h3 className="text-sm font-black mb-4 uppercase tracking-widest text-[#64748b]">Documents & Links</h3>
                            <div className="space-y-3">
                                {tender.official_link && (
                                    <a
                                        href={tender.official_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex justify-between items-center p-4 border border-tj-blue bg-[#f0f7ff] text-tj-blue rounded-lg hover:bg-tj-blue hover:text-white transition-all group shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                                            <span className="font-extrabold text-sm uppercase tracking-tight">Visit Official Tender Page</span>
                                        </div>
                                        <ExternalLink size={16} />
                                    </a>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {tender.nit_document ? (
                                        <a href={tender.nit_document} target="_blank" rel="noopener noreferrer" className="flex flex-col p-3 border border-dashed border-[#64748b] rounded-lg hover:bg-gray-50 transition-colors">
                                            <span className="text-xs font-bold text-[#64748b] uppercase mb-1">NIT Document</span>
                                            <span className="text-sm font-semibold text-tj-blue flex items-center gap-2">
                                                <Download size={14} /> Download PDF
                                            </span>
                                        </a>
                                    ) : (
                                        <div className="flex flex-col p-3 border border-dashed border-gray-200 rounded-lg opacity-60">
                                            <span className="text-xs font-bold text-gray-400 uppercase mb-1">NIT Document</span>
                                            <span className="text-sm font-medium text-gray-400">Not Available</span>
                                        </div>
                                    )}

                                    {tender.boq_document ? (
                                        <a href={tender.boq_document} target="_blank" rel="noopener noreferrer" className="flex flex-col p-3 border border-dashed border-[#64748b] rounded-lg hover:bg-gray-50 transition-colors">
                                            <span className="text-xs font-bold text-[#64748b] uppercase mb-1">BOQ Document</span>
                                            <span className="text-sm font-semibold text-tj-blue flex items-center gap-2">
                                                <Download size={14} /> Download Excel/PDF
                                            </span>
                                        </a>
                                    ) : (
                                        <div className="flex flex-col p-3 border border-dashed border-gray-200 rounded-lg opacity-60">
                                            <span className="text-xs font-bold text-gray-400 uppercase mb-1">BOQ Document</span>
                                            <span className="text-sm font-medium text-gray-400">Not Available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="mt-4 text-[11px] text-[#64748b] leading-tight flex items-center gap-1.5 font-medium">
                                <AlertTriangle size={12} className="text-amber-500" />
                                Documents and links are sourced directly from the official government portal.
                            </p>
                        </div>

                        {/* Why this Tender Matters */}
                        <div className="p-[22px]">
                            <h3 className="text-base font-extrabold mb-3.5">Why this Tender Matters</h3>
                            <p className="text-sm leading-relaxed text-[#475569]">
                                High-value {tender.authority} highway rehabilitation project with long maintenance scope, offering stable execution opportunity for experienced EPC contractors.
                            </p>
                        </div>

                    </div>

                    {/* SIDEBAR */}
                    <aside className="flex flex-col gap-[18px]">

                        {/* Action Card */}
                        <div className="bg-[#f8fafc] border border-[#dbe1ea] rounded-lg shadow-sm p-4">
                            <button className="w-full bg-tj-blue text-white py-3 font-extrabold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all rounded shadow-sm">
                                <Star size={16} fill="white" />
                                SAVE TENDER
                            </button>
                            <button className="w-full mt-2.5 bg-white border border-tj-blue text-tj-blue py-2.5 font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-[#f0f7ff] transition-all rounded">
                                <Bell size={16} />
                                SET DEADLINE REMINDER
                            </button>
                            <p className="mt-2.5 text-xs text-[#64748b]">
                                Save this tender to track updates & deadline changes.
                            </p>
                        </div>

                        {/* Suitability Check */}
                        <div className="bg-white border border-[#dbe1ea] rounded-lg shadow-sm p-4">
                            <h4 className="text-[15px] font-extrabold mb-2.5 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-[#065f46]" />
                                Suitability Check
                            </h4>
                            <div className="space-y-1.5">
                                <div className="bg-[#ecfdf5] text-[#065f46] px-2.5 py-2 text-sm flex items-center gap-2">
                                    <CheckCircle2 size={14} />
                                    Highway EPC experience
                                </div>
                                <div className="bg-[#ecfdf5] text-[#065f46] px-2.5 py-2 text-sm flex items-center gap-2">
                                    <CheckCircle2 size={14} />
                                    Rigid & flexible pavement work
                                </div>
                                <div className="bg-[#fff7ed] text-[#9a3412] px-2.5 py-2 text-sm flex items-center gap-2">
                                    <AlertTriangle size={14} />
                                    Maintenance capability required
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-[#475569]">
                                Best suited for established EPC contractors.
                            </p>
                        </div>

                        {/* Similar Tenders */}
                        <div className="bg-white border border-[#dbe1ea] p-4">
                            <h4 className="text-[15px] font-extrabold mb-2.5 flex items-center gap-2">
                                <Briefcase size={16} className="text-tj-blue" />
                                Similar Tenders
                            </h4>
                            <div className="space-y-2">
                                <SimilarTenderLink title="NHAI Road Maintenance – MP" meta="₹120+ Cr" />
                                <SimilarTenderLink title="NH-44 Pavement Strengthening" meta="Closes in 18 days" />
                                <SimilarTenderLink title="MP PWD Road Project" meta="Item Rate" />
                            </div>
                        </div>

                    </aside>

                </div>

                {/* Footer */}
                <footer className="text-center py-[22px] text-[13px] text-[#64748b] mt-6">
                    Data sourced from official government portals
                </footer>

            </div>
        </div>
    );
}

// Helper Components
function DateRow({ label, value }: { label: string; value?: string }) {
    return (
        <div className="flex justify-between py-2.5 border-b border-dashed border-[#e5e9f0] last:border-0 text-sm">
            <span>{label}</span>
            <span>{value || 'N/A'}</span>
        </div>
    );
}

function InfoBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-[#f9fafb] border border-[#e5e9f0] p-3.5">
            <span className="text-xs text-[#64748b] block">{label}</span>
            <p className="mt-1 font-bold">{value}</p>
        </div>
    );
}

function SimilarTenderLink({ title, meta }: { title: string; meta: string }) {
    return (
        <Link href="#" className="flex justify-between items-center p-2.5 border border-[#e5e9f0] text-sm text-[#0f172a] hover:bg-[#f8fafc] transition-colors">
            <span>{title}</span>
            <span className="text-xs text-[#64748b]">{meta}</span>
        </Link>
    );
}
