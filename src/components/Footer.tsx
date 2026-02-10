import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-secondary text-gray-300 pt-12 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* About */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">About TenderSaarthi</h3>
                        <p className="text-sm leading-relaxed mb-4">
                            TenderSaarthi is India's leading digital marketplace for government and private tenders. We help businesses find, bid, and win tenders across various sectors.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-white"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-white"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-white"><Linkedin size={20} /></a>
                            <a href="#" className="hover:text-white"><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Explore</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/active-tenders" className="hover:text-white transition">Active Tenders</Link></li>
                            <li><Link href="/archive-tenders" className="hover:text-white transition">Archived Tenders</Link></li>
                            <li><Link href="/authorities" className="hover:text-white transition">By Authority</Link></li>
                            <li><Link href="/locations" className="hover:text-white transition">By Location</Link></li>
                            <li><Link href="/news" className="hover:text-white transition">Tender News</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Services</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/bid-support" className="hover:text-white transition">Bid Support</Link></li>
                            <li><Link href="/financing" className="hover:text-white transition">Tender Financing</Link></li>
                            <li><Link href="/post-tender" className="hover:text-white transition">Post a Tender</Link></li>
                            <li><Link href="/joint-ventures" className="hover:text-white transition">Joint Ventures</Link></li>
                            <li><Link href="/subcontracting" className="hover:text-white transition">Subcontracting</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
                        <p className="text-sm mb-2">Email: support@tendersaarthi.com</p>
                        <p className="text-sm mb-2">Phone: +91 9770-974-974</p>
                        <div className="mt-4">
                            <button className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-red-600 transition w-full md:w-auto">
                                Download App
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-6 text-center text-xs">
                    <p>&copy; 2024 TenderSaarthi. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
