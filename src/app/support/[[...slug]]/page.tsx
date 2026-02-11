'use client';

import { useState, use } from 'react';
import { CheckCircle, Phone, Mail, MessageSquare, Briefcase, FileText, TrendingUp } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';

export default function BidSupport({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug } = use(params);
    const service = slug ? slug[0] : undefined;

    // Determine content based on the URL parameter (service type)
    let title = "Bid Support Services";
    let description = "Get expert assistance for all your tendering needs. From bid preparation to financial support, we are here to help you win.";

    if (service === 'consultancy') {
        title = "Tender Consultancy Services";
        description = "Our experts help you analyze, prepare, and submit error-free bids to maximize your chances of winning government contracts.";
    } else if (service === 'financing') {
        title = "Tender Financing";
        description = "Don't let capital crunch stop you. We connect you with financial partners for EMD, Performance Guarantees, and Working Capital.";
    } else if (service === 'jv') {
        title = "Joint Venture & Consortium Support";
        description = "Find the right technical or financial partners to qualify for large-scale tenders and expand your business capabilities.";
    }

    const [formData, setFormData] = useState({
        name: '', company: '', phone: '', email: '', message: ''
    });

    // Handle typing for event
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Support request submitted. Our team will contact you shortly.");
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-16 font-sans">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
                <div className="container mx-auto px-4 py-4">
                    <Breadcrumb />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left Column: Info & Content */}
                    <div className="w-full lg:w-3/5">
                        <span className="text-primary font-bold tracking-wide uppercase text-sm mb-2 block">Premium Support</span>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{title}</h1>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                <FileText className="text-primary mb-3" size={28} />
                                <h3 className="font-bold text-gray-800 mb-2">Expert Documentation</h3>
                                <p className="text-sm text-gray-600">Complete assistance in preparing technical and financial bid documents.</p>
                            </div>
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                <TrendingUp className="text-green-600 mb-3" size={28} />
                                <h3 className="font-bold text-gray-800 mb-2">Bid Strategy</h3>
                                <p className="text-sm text-gray-600">Strategic pricing and competitor analysis to keep you ahead.</p>
                            </div>
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                <Briefcase className="text-blue-600 mb-3" size={28} />
                                <h3 className="font-bold text-gray-800 mb-2">Eligibility Check</h3>
                                <p className="text-sm text-gray-600">Thorough verification of tender requirements against your profile.</p>
                            </div>
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                <MessageSquare className="text-orange-500 mb-3" size={28} />
                                <h3 className="font-bold text-gray-800 mb-2">Dedicated Support</h3>
                                <p className="text-sm text-gray-600">24/7 assistance throughout the tender lifecycle.</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-tj-blue p-6 rounded-r-lg">
                            <h3 className="font-bold text-gray-800 mb-2">Why Choose TenderSaarthi Support?</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle size={16} className="text-green-600 mt-0.5" />
                                    <span>High Success Rate in Government Tenders</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle size={16} className="text-green-600 mt-0.5" />
                                    <span>Team of Retired Govt. Officials & Domain Experts</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <CheckCircle size={16} className="text-green-600 mt-0.5" />
                                    <span>Complete Confidentiality of your Bid Data</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="w-full lg:w-2/5">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8 sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Request a Callback</h2>
                            <p className="text-sm text-gray-500 mb-6">Fill the form below and our subject matter expert will contact you within 2 hours.</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 block mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 block mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                                        placeholder="Your Company Pvt Ltd"
                                        value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 block mb-1">Mobile No</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                                            placeholder="+91 98765..."
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 block mb-1">Email ID</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                                            placeholder="you@company.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 block mb-1"> Requirement Details</label>
                                    <textarea
                                        rows={3}
                                        className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none"
                                        placeholder="Briefly describe what help you need..."
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button type="submit" className="w-full bg-tj-blue text-white font-bold py-3 rounded hover:bg-blue-900 transition shadow-md mt-2">
                                    Submit Request
                                </button>

                                <p className="text-xs text-gray-400 text-center mt-4">
                                    By submitting, you agree to our Terms of Service. Your data is safe with us.
                                </p>
                            </form>
                        </div>

                        <div className="mt-6 flex flex-col items-center gap-4">
                            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Or Contact Us Directly</h4>
                            <div className="flex gap-4">
                                <a href="tel:+919999999999" className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm font-bold text-gray-700 hover:text-primary">
                                    <Phone size={16} className="text-green-600" /> +91 99999 99999
                                </a>
                                <a href="mailto:support@tendersaarthi.com" className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm font-bold text-gray-700 hover:text-primary">
                                    <Mail size={16} className="text-blue-600" /> support@tendersaarthi.com
                                </a>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
