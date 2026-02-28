'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Send, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();

    if (pathname?.startsWith('/dashboard')) return null;

    return (
        <footer className="relative bg-[#0B2C4A] text-white overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FFC212]/5 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 pt-20 pb-10">
                {/* Newsletter Section */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent opacity-50" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
                        <div className="space-y-4 max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white leading-none">
                                Don't Miss a <span className="text-tj-yellow">Tender</span>
                            </h2>
                            <p className="text-blue-100 font-medium text-lg">
                                Subscribe to our weekly intelligence report. Trusted by 50,000+ businesses.
                            </p>
                        </div>
                        <div className="w-full max-w-md bg-white p-2 rounded-2xl flex shadow-2xl">
                            <input
                                type="email"
                                placeholder="Enter your email address..."
                                className="flex-1 bg-transparent border-none px-6 py-4 text-slate-800 font-bold outline-none placeholder:text-slate-400"
                            />
                            <button className="bg-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#0d345b] transition-colors flex items-center gap-2">
                                <Send size={18} />
                                <span className="hidden sm:inline">Subscribe</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 border-b border-white/10 pb-16 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="inline-block hover:opacity-90 transition">
                            <Image
                                src="/logo-light.svg"
                                alt="TenderSaarthi Logo"
                                width={200}
                                height={50}
                                className="h-10 md:h-12 w-auto"
                            />
                        </Link>
                        <p className="text-blue-100/70 text-sm leading-relaxed font-medium max-w-sm">
                            India's most trusted digital gateway for government and private procurement opportunities. We bridge the gap between businesses and opportunities with precision and speed.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-tj-yellow hover:text-primary transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-lg font-black text-white uppercase tracking-widest">Discover</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Active Tenders', href: '/active-tenders' },
                                { name: 'By Authority', href: '/authorities' },
                                { name: 'By Location', href: '/locations' },
                                { name: 'By Category', href: '/categories' },
                                { name: 'Live Auction', href: '/auctions' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-blue-100/70 hover:text-tj-yellow transition-colors text-sm font-bold flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-tj-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-lg font-black text-white uppercase tracking-widest">Services</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Bid Consultancy', href: '/consultancy' },
                                { name: 'Tender Financing', href: '/finance' },
                                { name: 'Joint Venture', href: '/jv' },
                                { name: 'Gem Registration', href: '/gem' },
                                { name: 'Digital Signature', href: '/dsc' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-blue-100/70 hover:text-tj-yellow transition-colors text-sm font-bold flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-tj-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <h4 className="text-lg font-black text-white uppercase tracking-widest">Contact Support</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-tj-yellow shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <span className="block text-xs font-black text-white/50 uppercase tracking-widest mb-1">Headquarters</span>
                                    <p className="text-sm font-bold text-white leading-relaxed">
                                        96th, 3rd Floor, Tower-5 Apna Ghar Shalimar, <br />
                                        Alwar, Rajasthan - 301001
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-tj-yellow shrink-0">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <span className="block text-xs font-black text-white/50 uppercase tracking-widest mb-1">Helpline (24/7)</span>
                                    <p className="text-lg font-black text-white">
                                        +91 9289751333
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-tj-yellow shrink-0">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <span className="block text-xs font-black text-white/50 uppercase tracking-widest mb-1">Email Support</span>
                                    <p className="text-sm font-bold text-white">
                                        support@tendersaarthi.com
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 text-[10px] font-black text-blue-100/40 uppercase tracking-[0.2em]">
                    <p>&copy; {new Date().getFullYear()} TenderSaarthi. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                        <Link href="/privacy-policy" className="hover:text-tj-yellow transition-colors">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="hover:text-tj-yellow transition-colors">Terms of Service</Link>
                        <Link href="/refund-policy" className="hover:text-tj-yellow transition-colors">Refund Policy</Link>
                        <Link href="/disclaimer" className="hover:text-tj-yellow transition-colors">Disclaimer</Link>
                        <Link href="/cookie-policy" className="hover:text-tj-yellow transition-colors text-blue-100/20">Cookies</Link>
                        <Link href="/contact" className="hover:text-tj-yellow transition-colors">Contact Us</Link>
                    </div>
                </div>
            </div>
            {/* Bottom Safe Area for Mobile Nav */}
            <div className="h-20 md:hidden" />
        </footer>
    );
}
