'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FileText,
    Upload,
    Shield,
    Trash2,
    Download,
    AlertCircle,
    Search,
    Loader2,
    CheckCircle2,
    ExternalLink,
    FileCheck
} from 'lucide-react';
import { getCurrentUser } from '@/services/auth';
import { dashboardService } from '@/services/dashboardService';

export default function DocumentsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [documents, setDocuments] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState<string | null>(null);

    const fetchDocs = async (id: string) => {
        const docResult = await dashboardService.getDocuments(id);
        if (docResult.success && docResult.data) {
            setDocuments(docResult.data);
        }
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const { user } = await getCurrentUser();
            if (user) {
                setUser(user);
                await fetchDocs(user.id);
            }
            setLoading(false);
        };
        load();
    }, []);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, category: string) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;

        setIsUploading(category);
        try {
            const result = await dashboardService.uploadDocument(user.id, file, category, file.name);
            if (result.success) {
                await fetchDocs(user.id);
            } else {
                alert('Upload failed: ' + result.error);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsUploading(null);
        }
    };

    const handleDelete = async (docId: string, filePath: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return;

        try {
            const result = await dashboardService.deleteDocument(docId, filePath);
            if (result.success) {
                setDocuments(prev => prev.filter(d => d.id !== docId));
            } else {
                alert('Delete failed: ' + result.error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const categories = [
        { key: 'Statutory', title: 'Statutory Documents', description: 'PAN, GST, Registration Certificates' },
        { key: 'Experience', title: 'Experience Certificates', description: 'Completion letters, Work orders' },
        { key: 'Financial', title: 'Financial Documents', description: 'Audited Balance Sheets, ITRs' },
    ];

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <FileText size={24} />
                        </div>
                        Document Vault
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Your secure digital repository for bid-ready documents.</p>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-3xl flex items-start gap-4">
                <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm">
                    <Shield size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-blue-900 leading-none mb-1">Secure & Encrypted</h4>
                    <p className="text-xs text-blue-700 font-medium leading-relaxed">Your documents are protected with industry-standard encryption. Only used for your bid preparation.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {categories.map((category) => {
                    const catDocs = documents.filter(d => d.category === category.key);
                    const isCurrentUploading = isUploading === category.key;

                    return (
                        <div key={category.key} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">{category.title}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{category.description}</p>
                                </div>
                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100/50">
                                    {catDocs.length} FILES
                                </span>
                            </div>

                            <div className="mb-6">
                                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${isCurrentUploading ? 'bg-slate-50 border-[#103e68]/20 cursor-wait' : 'hover:bg-slate-50 border-slate-200 hover:border-[#103e68]/30'
                                    }`}>
                                    {isCurrentUploading ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="animate-spin text-[#103e68]" size={24} />
                                            <span className="text-[10px] font-black text-[#103e68] uppercase tracking-widest">Uploading...</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 rounded-2xl bg-[#103e68]/5 flex items-center justify-center text-[#103e68]">
                                                <Upload size={18} />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drop file or click to upload</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        disabled={!!isUploading}
                                        onChange={(e) => handleFileUpload(e, category.key)}
                                    />
                                </label>
                            </div>

                            <div className="space-y-3">
                                {catDocs.map((doc) => (
                                    <div key={doc.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-100 hover:bg-white transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#103e68] border border-slate-100">
                                            <FileCheck size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[13px] font-black text-slate-800 truncate">{doc.title}</h4>
                                            <div className="flex gap-3 mt-1 text-[10px] font-bold text-slate-400">
                                                <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full mt-1.5" />
                                                <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {doc.file_url && (
                                                <a
                                                    href={doc.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-slate-400 hover:text-[#103e68] hover:bg-[#103e68]/5 rounded-lg transition-all"
                                                    title="View/Download"
                                                >
                                                    <Download size={16} />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleDelete(doc.id, doc.file_path)}
                                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                <div className="lg:col-span-2 bg-gradient-to-br from-[#103e68] to-[#0a2742] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-[#103e68]/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-tj-yellow/10 rounded-full blur-3xl opacity-50" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                            <h3 className="text-2xl font-black italic tracking-tight mb-2 flex items-center gap-3">
                                <CheckCircle2 className="text-tj-yellow" />
                                One-Click Bid Packager
                            </h3>
                            <p className="text-white/70 text-sm font-medium max-w-xl">
                                Select a tender from your watchlist and let our AI assemble all required documents into a submission-ready ZIP file automatically.
                            </p>
                        </div>
                        <button className="px-8 py-4 bg-tj-yellow text-[#103e68] rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-tj-yellow/20 hover:scale-105 transition-all">
                            Start Packaging
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
