'use client';

import { Copy } from 'lucide-react';

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-3 border-2 border-slate-100 hover:bg-slate-50 text-slate-600 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all"
        >
            <Copy size={18} className="text-slate-400" />
            Print / Save PDF
        </button>
    );
}
