'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
    value: string;
    label?: string;
}

export default function CopyButton({ value, label = 'Copy' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="text-[8px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter flex items-center gap-0.5 hover:underline"
        >
            {copied ? (
                <>
                    <Check size={8} className="text-green-500" />
                    <span className="text-green-600">Copied</span>
                </>
            ) : (
                <>
                    <Copy size={8} />
                    <span>{label}</span>
                </>
            )}
        </button>
    );
}
