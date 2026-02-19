'use client';

import { Mail, Phone, MapPin, Send, MessageSquare, clock, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setTimeout(() => setStatus('success'), 1500);
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-[#0B2C4A] py-24 md:py-32 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tj-yellow/5 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-tj-yellow text-xs font-black uppercase tracking-widest mb-6 animate-fade-in">
                        <MessageSquare size={14} />
                        Get In Touch
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
                        How can we <span className="text-tj-yellow">help you?</span>
                    </h1>
                    <p className="text-blue-100/70 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Have questions about a tender? Need technical support? Our intelligence team is ready to assist you 24/7.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-20 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Contact Info Cards */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 group hover:border-primary/20 transition-all duration-500">
                            <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Phone size={28} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">Call Us</h3>
                            <p className="text-slate-500 font-bold mb-4 text-sm">Mon-Sat from 9am to 7pm.</p>
                            <a href="tel:+919289751333" className="text-2xl font-black text-primary hover:text-tj-blue transition-colors">+91 92897 51333</a>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 group hover:border-primary/20 transition-all duration-500">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Mail size={28} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">Email Us</h3>
                            <p className="text-slate-500 font-bold mb-4 text-sm">Our friendly team is here to help.</p>
                            <a href="mailto:support@tendersaarthi.com" className="text-lg font-black text-slate-800 hover:text-primary transition-colors">support@tendersaarthi.com</a>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 group hover:border-primary/20 transition-all duration-500">
                            <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <MapPin size={28} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">Visit Office</h3>
                            <p className="text-slate-500 font-bold mb-4 text-sm">Come say hello at our HQ.</p>
                            <p className="text-sm font-bold text-slate-800 leading-relaxed">
                                96th, 3rd Floor, Tower-5 Apna Ghar Shalimar,<br />
                                Alwar, Rajasthan - 301001
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-slate-50">
                            {status === 'success' ? (
                                <div className="py-20 text-center animate-in zoom-in duration-500">
                                    <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tighter">Message Sent Successfully!</h2>
                                    <p className="text-slate-500 font-bold max-w-sm mx-auto mb-10">
                                        Thank you for reaching out. One of our experts will get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:shadow-xl transition-all active:scale-95"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-10 text-center md:text-left">
                                        <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tighter uppercase">Send a Message</h2>
                                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Required fields are marked with *</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. John Doe"
                                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address *</label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="john@example.com"
                                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                placeholder="+91 00000 00000"
                                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                            <select className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-800 appearance-none cursor-pointer">
                                                <option>General Inquiry</option>
                                                <option>Tender Support</option>
                                                <option>Billing Issues</option>
                                                <option>Technical Support</option>
                                                <option>Partnerships</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message *</label>
                                            <textarea
                                                required
                                                rows={5}
                                                placeholder="How can we help you?"
                                                className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 resize-none"
                                            ></textarea>
                                        </div>
                                        <div className="md:col-span-2 pt-4">
                                            <button
                                                disabled={status === 'submitting'}
                                                className="w-full md:w-auto bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_20px_40px_rgba(16,62,104,0.3)] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
                                            >
                                                {status === 'submitting' ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send size={20} />
                                                        Send Message
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section Placeholder */}
            <div className="container mx-auto px-4 pb-24">
                <div className="bg-slate-100 h-[400px] rounded-[3rem] overflow-hidden relative group">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3548.7478!2d76.6091!3d27.5609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDMzJzM5LjIiTiA3NsKwMzYnMzIuOCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'grayscale(1) contrast(1.2) opacity(0.8)' }}
                        loading="lazy"
                    ></iframe>
                    <div className="absolute inset-0 pointer-events-none border-[12px] border-white rounded-[3rem]" />
                </div>
            </div>
        </div>
    );
}
