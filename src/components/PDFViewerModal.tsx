'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Download, Loader2, FileText } from 'lucide-react';

interface PDFViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
}

export default function PDFViewerModal({ isOpen, onClose, url, title }: PDFViewerModalProps) {
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            setLoading(true);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-0 md:p-4 lg:p-8 animate-in fade-in duration-300">
            <div className="bg-white w-full h-full md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-white/20">
                {/* Header - High contrast for visibility */}
                <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-[1000000]">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                            <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-black text-sm md:text-lg truncate leading-tight text-slate-800">{title}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">Secure Preview • TenderSaarthi Intelligence</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors hidden md:flex"
                            title="Open in New Tab"
                        >
                            <ExternalLink size={20} />
                        </a>
                        <a
                            href={url}
                            download
                            className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
                            title="Download PDF"
                        >
                            <Download size={20} />
                        </a>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-red-500 text-white hover:bg-red-600 rounded-full transition-all ml-2 shadow-lg hover:rotate-90"
                            title="Close Preview"
                        >
                            <X size={24} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-slate-200 relative">
                    {loading && (
                        <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col items-center justify-center bg-slate-50/90 z-10">
                            <Loader2 className="animate-spin text-primary mb-3" size={40} />
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Loading Secure Document...</p>
                        </div>
                    )}

                    <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
                        className="w-full h-full border-none bg-white shadow-inner"
                        onLoad={() => setLoading(false)}
                        title="PDF Viewer"
                    />
                </div>

                {/* Footer Bar */}
                <div className="p-3 px-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span>Encrypted Preview Mode</span>
                    </div>
                    <span className="text-primary/40 font-black">Powered by TenderSaarthi Digital</span>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
