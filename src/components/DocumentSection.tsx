'use client';

import { useState } from 'react';
import { FileText, Eye, Download, IndianRupee, AlertCircle, History, Clock, Loader2, PackageOpen } from 'lucide-react';
import PDFViewerModal from './PDFViewerModal';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface DocumentSectionProps {
    tender: any;
}

export default function DocumentSection({ tender }: DocumentSectionProps) {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [currentDoc, setCurrentDoc] = useState({ url: '', title: '' });
    const [isZipping, setIsZipping] = useState(false);
    const [zipProgress, setZipProgress] = useState('');

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

    const openViewer = (url: string, title: string) => {
        if (!url) return;
        setCurrentDoc({ url, title });
        setViewerOpen(true);
    };

    const handleDownloadAll = async () => {
        try {
            setIsZipping(true);
            setZipProgress('Starting...');
            const zip = new JSZip();

            const docsToDownload: { url: string, name: string }[] = [];

            // 1. Add NIT
            if (tender.nit_document) {
                docsToDownload.push({ url: tender.nit_document, name: 'Notice_Inviting_Tender.pdf' });
            }

            // 2. Add BOQ
            if (tender.boq_document) {
                const ext = tender.boq_document.toLowerCase().endsWith('.pdf') ? 'pdf' : 'xls';
                docsToDownload.push({ url: tender.boq_document, name: `BOQ_Pricing_Sheet.${ext}` });
            }

            // 3. Add S3 Documents
            if (tender.documents && Array.isArray(tender.documents)) {
                tender.documents.forEach((doc: any) => {
                    docsToDownload.push({ url: doc.url, name: doc.name || 'Document' });
                });
            }

            // 4. Add Corrigendums
            if (tender.corrigendums && Array.isArray(tender.corrigendums)) {
                tender.corrigendums.forEach((cor: any, idx: number) => {
                    const cleanName = (cor.name || `Corrigendum_${idx + 1}`).replace(/[^a-z0-9]/gi, '_').toLowerCase();
                    docsToDownload.push({ url: cor.url, name: `${cleanName}.pdf` });
                });
            }

            if (docsToDownload.length === 0) {
                alert("No documents found to download.");
                setIsZipping(false);
                return;
            }

            // Fetch each file as blob
            for (let i = 0; i < docsToDownload.length; i++) {
                const { url, name } = docsToDownload[i];
                setZipProgress(`Getting ${i + 1}/${docsToDownload.length}`);

                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error('Fetch failed');
                    const blob = await response.blob();
                    zip.file(name, blob);
                } catch (err) {
                    console.error(`Failed to fetch ${name}:`, err);
                }
            }

            setZipProgress('Packaging...');
            const content = await zip.generateAsync({ type: 'blob' });

            const zipName = `Tender_${tender.tender_id || 'Docs'}_Full_Package.zip`;
            saveAs(content, zipName);

            setZipProgress('Success!');
            setTimeout(() => {
                setIsZipping(false);
                setZipProgress('');
            }, 1500);

        } catch (error) {
            console.error('Bulk download error:', error);
            alert("Could not complete bulk download. This usually happens if the official site blocks automated downloads. Please download files individually.");
            setIsZipping(false);
        }
    };

    // Sort corrigendums by date (latest first)
    const sortedCorrigendums = [...(tender.corrigendums || [])].sort((a, b) => {
        return new Date(b.released_at || b.uploadedAt).getTime() - new Date(a.released_at || a.uploadedAt).getTime();
    });

    const hasCorrigendums = sortedCorrigendums.length > 0;

    return (
        <div className="space-y-6">
            {/* Main Documents Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <Download className="text-primary" size={20} />
                            Active Bid Documents
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">
                            {hasCorrigendums ? "Includes latest amendments" : "Original publication documents"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={isZipping}
                            onClick={handleDownloadAll}
                            className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm ${isZipping
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                : 'bg-tj-yellow text-slate-900 border border-tj-yellow/50 hover:bg-white hover:border-tj-yellow'
                                }`}
                        >
                            {isZipping ? (
                                <>
                                    <Loader2 className="animate-spin" size={14} />
                                    {zipProgress || 'Zipping...'}
                                </>
                            ) : (
                                <>
                                    <PackageOpen size={14} />
                                    Download All (ZIP)
                                </>
                            )}
                        </button>

                        {tender.official_link && (
                            <a href={tender.official_link} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 transition-all hover:bg-primary/10">
                                Open Official Portal
                            </a>
                        )}
                    </div>
                </div>

                {hasCorrigendums && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="text-xs font-bold text-amber-900">Tender Amendments (Corrigenda) found</p>
                            <p className="text-[10px] text-amber-700 leading-relaxed font-medium mt-0.5">
                                This tender has been updated {sortedCorrigendums.length} time(s). Please review the amendment history below for latest changes.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* NIT Document */}
                    {(tender.nit_document || tender.official_link) && (
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md hover:border-tj-yellow relative overflow-hidden">
                            <div className="flex items-start gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 mb-0.5 truncate">NIT Notice</p>
                                    <p className="text-[10px] text-slate-400 font-medium mb-3 uppercase tracking-widest">Notice Inviting Tender</p>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => openViewer(tender.nit_document || tender.official_link, "NIT Notice")}
                                            className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:gap-2.5 transition-all"
                                        >
                                            VIEW <Eye size={12} />
                                        </button>
                                        <a
                                            href={tender.nit_document || tender.official_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-slate-600 transition-all"
                                        >
                                            DOWNLOAD <Download size={12} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BOQ Document */}
                    {(tender.boq_document || tender.official_link) && (
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md hover:border-tj-yellow">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                    <IndianRupee size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 mb-0.5 truncate">BOQ Sheet</p>
                                    <p className="text-[10px] text-slate-400 font-medium mb-3 uppercase tracking-widest">Pricing Schedule</p>

                                    <div className="flex items-center gap-4">
                                        <a
                                            href={tender.boq_document || tender.official_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 hover:gap-2.5 transition-all"
                                        >
                                            DOWNLOAD <Download size={12} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Additional S3 Documents */}
                    {tender.documents && Array.isArray(tender.documents) && tender.documents.map((doc: any, i: number) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 mb-0.5 truncate">{doc.name}</p>
                                    <p className="text-[10px] text-slate-400 font-medium mb-3 uppercase tracking-widest">
                                        {doc.size ? `${(doc.size / 1024 / 1024).toFixed(1)} MB • ` : ""}Additional
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => openViewer(doc.url, doc.name)}
                                            className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:gap-2.5 transition-all"
                                        >
                                            VIEW <Eye size={12} />
                                        </button>
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-slate-600 transition-all"
                                        >
                                            DOWNLOAD <Download size={12} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Corrigendums (Timeline View) */}
            {hasCorrigendums && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-100/30" />

                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] mb-8 flex items-center gap-2 relative z-10">
                        <History className="text-red-500" size={14} />
                        Amendment History & Corrigenda
                    </h4>

                    <div className="space-y-8 relative z-10 ml-2">
                        {sortedCorrigendums.map((cor: any, i: number) => {
                            const isLatest = i === 0;
                            const isDateExt = cor.name?.toLowerCase().includes('date') || cor.name?.toLowerCase().includes('extension');

                            return (
                                <div key={i} className="relative pl-8 group">
                                    {/* Timeline Marker */}
                                    <div className={`absolute left-[-4.5px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${isLatest ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-300'} z-20 transition-all group-hover:scale-125`} />

                                    <div className={`p-5 rounded-2xl border transition-all ${isLatest ? 'bg-red-50/20 border-red-100 shadow-sm' : 'bg-slate-50/50 border-slate-100'} hover:shadow-md hover:bg-white hover:border-primary/20`}>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${isLatest ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                        {isLatest ? 'Latest Amendment' : `Version ${sortedCorrigendums.length - i}`}
                                                    </span>
                                                    {isDateExt && (
                                                        <span className="flex items-center gap-1 text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 uppercase tracking-tighter">
                                                            <Clock size={10} /> Date Extension
                                                        </span>
                                                    )}
                                                </div>
                                                <h5 className="text-sm font-bold text-slate-800">{cor.name}</h5>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                    Released on {formatDate(cor.released_at || cor.uploadedAt)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => openViewer(cor.url, cor.name)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-white text-primary text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 shadow-sm hover:border-primary transition-all active:scale-95"
                                                >
                                                    <Eye size={14} /> View
                                                </button>
                                                <a
                                                    href={cor.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center gap-2 px-4 py-2 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md transition-all active:scale-95 ${isLatest ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-slate-700 hover:bg-slate-800'}`}
                                                >
                                                    <Download size={14} /> Download
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Initial Launch Point */}
                        <div className="relative pl-8 pb-2">
                            <div className="absolute left-[-4.5px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-slate-200 z-20" />
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest pt-0.5">Original Tender Publication</p>
                        </div>
                    </div>
                </div>
            )}

            <PDFViewerModal
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
                url={currentDoc.url}
                title={currentDoc.title}
            />
        </div>
    );
}
