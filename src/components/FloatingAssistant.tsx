'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Sparkles, ArrowRight, Send, ChevronLeft, Loader2 } from 'lucide-react';

export default function FloatingAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'menu' | 'chat'>('menu');
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: 'Hi! I am your TenderSaarthi AI. How can I help you find and analyze tenders today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (view === 'chat') {
            scrollToBottom();
        }
    }, [messages, view, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        // Simulate AI processing & response
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { role: 'ai', text: `I am currently in demo mode! I have noted your request about "${userMsg}". Soon, I'll be connected directly to your tender database to answer this accurately.` }
            ]);
            setIsTyping(false);
        }, 1200);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] hidden md:block">
            {/* Pop-up Container */}
            <div className={`absolute bottom-20 right-0 w-[350px] bg-[#0B2C4A] rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden transition-all duration-500 transform ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>

                {/* ---------- MENU VIEW ---------- */}
                {view === 'menu' && (
                    <>
                        <div className="p-8 pb-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-tj-yellow flex items-center justify-center text-primary shadow-lg shadow-tj-yellow/20">
                                    <Sparkles size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-lg leading-none">AI Assistant</h4>
                                    <p className="text-[10px] font-black text-tj-yellow uppercase tracking-widest mt-1">v4.0 Live Analyze</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl text-left transition-all group">
                                    <p className="text-[10px] font-black text-blue-100/40 uppercase tracking-widest mb-1">Recent Insight</p>
                                    <p className="text-sm text-white font-bold leading-snug group-hover:text-tj-yellow transition-colors">Road construction tenders in Rajasthan are up by 24% this week.</p>
                                </button>

                                <button
                                    onClick={() => setView('chat')}
                                    className="w-full bg-tj-yellow hover:bg-yellow-400 p-4 rounded-2xl text-left transition-all group flex items-center justify-between shadow-xl shadow-tj-yellow/10"
                                >
                                    <span className="text-sm text-primary font-black uppercase tracking-wider">Ask AI Anything</span>
                                    <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 flex items-center justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-black text-blue-100/60 uppercase tracking-widest">Server Active</span>
                            </div>
                        </div>
                    </>
                )}

                {/* ---------- CHAT VIEW ---------- */}
                {view === 'chat' && (
                    <div className="flex flex-col h-[450px]">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                            <button
                                onClick={() => setView('menu')}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-tj-yellow flex items-center justify-center text-primary">
                                    <Sparkles size={16} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm leading-none">AI Assistant</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        <span className="text-[9px] text-green-400/80 font-semibold uppercase tracking-widest">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user'
                                            ? 'bg-tj-yellow text-primary font-medium rounded-br-sm shadow-md shadow-tj-yellow/10'
                                            : 'bg-white/10 text-white rounded-bl-sm font-light'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 h-10 w-16">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 bg-[rgba(255,255,255,0.03)] border-t border-white/10">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message..."
                                    className="w-full bg-white/10 text-white placeholder:text-white/40 rounded-xl pl-4 pr-12 py-3 outline-none text-sm focus:bg-white/20 transition-all border border-transparent focus:border-white/20"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-1.5 w-9 h-9 flex items-center justify-center bg-tj-yellow hover:bg-yellow-400 text-primary rounded-lg disabled:opacity-50 transition-all disabled:cursor-not-allowed disabled:hover:bg-tj-yellow"
                                >
                                    {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (isOpen) setView('menu'); // Reset to menu when closing
                }}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-white text-primary rotate-90 scale-90' : 'bg-tj-yellow text-primary hover:scale-110 shadow-tj-yellow/20'}`}
            >
                {isOpen ? <X size={28} strokeWidth={3} /> : <MessageSquare size={28} strokeWidth={2.5} />}

                {/* Ping notification */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-[#0B2C4A] flex items-center justify-center text-[10px] font-black text-white">1</span>
                    </span>
                )}
            </button>
        </div>
    );
}
