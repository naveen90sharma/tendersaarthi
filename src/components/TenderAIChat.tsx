'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Sparkles, Send, Loader2, Bot, User, AlertCircle } from 'lucide-react';

interface DocumentInput {
    url: string;
    name: string;
}

interface TenderAIChatProps {
    tender: any;
}

export default function TenderAIChat({ tender }: TenderAIChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: `Hi! I've analyzed this tender: **"${tender.title}"**. Ask me anything about eligibility, EMD, or deadlines!` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        console.log("TenderAIChat mounted for tender:", tender.id || tender.slug);
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isLoading, tender.id, tender.slug]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userQuery = input.trim();
        const newMessages = [...messages, { role: 'user', content: userQuery } as const];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const docs: DocumentInput[] = [];
            if (tender.nit_document) {
                docs.push({ url: tender.nit_document, name: "NIT_Document.pdf" });
            }
            if (tender.documents && Array.isArray(tender.documents)) {
                tender.documents.forEach((d: any) => {
                    if (d.url && d.url.toLowerCase().endsWith('.pdf')) {
                        docs.push({ url: d.url, name: d.name || 'Additional_Doc.pdf' });
                    }
                });
            }

            const payload = {
                tender_id: tender.tender_id || tender.id.toString(),
                query: userQuery,
                documents: docs,
                history: newMessages.slice(-6), // Send last 3 exchanges
                provider: 'gemini' // Use Gemini for deep reasoning
            };

            const response = await fetch("http://localhost:8000/api/v1/chat-with-tender", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                throw new Error(errData?.detail || "Assistant is having trouble connecting.");
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error: any) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm sorry, I encountered an error while analyzing the document. Please ensure the AI backend is running."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const renderMessage = (content: string) => {
        // Basic Markdown-like formatter using regex
        const formatted = content
            .replace(/^### (.*$)/gim, '<h3 style="font-weight: 800; margin-top: 12px; margin-bottom: 4px; color: #0b2c4a;">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 style="font-weight: 800; font-size: 1.1em; margin-top: 16px; margin-bottom: 8px; color: #0b2c4a;">$2</h2>')
            .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 700; color: #000;">$1</strong>')
            .replace(/^\s*-\s+(.*$)/gim, '<li style="margin-left: 16px; margin-bottom: 4px;">$1</li>')
            .replace(/\n/g, '<br/>');

        return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
    };

    return (
        <div className="fixed bottom-24 left-6 md:bottom-8 md:left-8 z-[9999] no-print">
            {/* Chat Window */}
            <div className={`absolute bottom-20 left-0 w-[90vw] md:w-[400px] h-[500px] md:h-[600px] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden transition-all duration-500 transform ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>

                {/* Header */}
                <div className="p-6 bg-[#0B2C4A] text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-tj-yellow flex items-center justify-center text-primary shadow-lg shadow-tj-yellow/20">
                            <Sparkles size={20} fill="currentColor" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm leading-tight">Tender Assistant</h4>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[10px] text-green-400/80 font-bold uppercase tracking-widest">v4.0 Pro</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-slate-50/50">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white text-primary border border-slate-100'}`}>
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                    }`}>
                                    {msg.role === 'user' ? (
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                    ) : (
                                        renderMessage(msg.content)
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-xl bg-white text-primary border border-slate-100 flex items-center justify-center shrink-0 animate-pulse">
                                    <Bot size={14} />
                                </div>
                                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-2 shadow-sm min-w-[80px]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce delay-75" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce delay-150" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-slate-100">
                    <div className="relative group flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about NIT, EMD, Exemption..."
                            disabled={isLoading}
                            className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-2xl pl-5 pr-14 py-4 outline-none text-sm border border-slate-200 focus:border-primary focus:bg-white transition-all shadow-inner disabled:opacity-60"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 w-10 h-10 flex items-center justify-center bg-tj-yellow text-primary rounded-xl font-bold shadow-md hover:bg-yellow-400 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
                        </button>
                    </div>
                    <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4 flex items-center justify-center gap-1.5">
                        <AlertCircle size={10} />
                        AI responses are based on uploaded documents
                    </p>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)] transition-all duration-500 hover:scale-110 active:scale-95 ${isOpen
                    ? 'bg-red-500 text-white rotate-90 shadow-red-500/20'
                    : 'bg-primary text-white shadow-primary/20'
                    }`}
            >
                {isOpen ? <X size={28} strokeWidth={3} /> : (
                    <div className="relative">
                        <MessageSquare size={28} strokeWidth={2.5} />
                        <span className="absolute -top-3 -right-3 w-6 h-6 bg-tj-yellow text-primary text-[10px] font-black rounded-full border-4 border-primary flex items-center justify-center animate-bounce">
                            AI
                        </span>
                    </div>
                )}
            </button>
        </div>
    );
}
