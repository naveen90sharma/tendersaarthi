'use client';

import { Search, Filter, Bell, FileCheck } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            icon: Search,
            title: 'Search Tenders',
            description: 'Browse through thousands of active government and private sector tenders',
            color: 'bg-blue-500',
        },
        {
            icon: Filter,
            title: 'Filter by Preference',
            description: 'Use advanced filters to find tenders matching your business criteria',
            color: 'bg-purple-500',
        },
        {
            icon: Bell,
            title: 'Get Instant Alerts',
            description: 'Set up notifications for new tenders in your categories of interest',
            color: 'bg-green-500',
        },
        {
            icon: FileCheck,
            title: 'Submit Your Bid',
            description: 'Access tender documents and submit bids directly through official portals',
            color: 'bg-orange-500',
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-gray-800 mb-2">How It Works</h2>
                    <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                        Simple and efficient process to find and bid on tenders
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {/* Connection Line - Hidden on mobile */}
                    <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-orange-200 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="text-center group">
                            {/* Icon Circle */}
                            <div className="relative inline-block mb-6">
                                <div className={`w-24 h-24 ${step.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                                    <step.icon size={36} className="text-white" />
                                </div>
                                {/* Step Number */}
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center font-black text-sm text-gray-700">
                                    {index + 1}
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
