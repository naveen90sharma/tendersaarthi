'use client';

import { TrendingUp, Building2, MapPin, Bell } from 'lucide-react';

export default function StatsSection() {
    const stats = [
        { icon: TrendingUp, value: '10,000+', label: 'Active Tenders', color: 'bg-blue-50 text-blue-600' },
        { icon: Building2, value: '500+', label: 'Government Departments', color: 'bg-green-50 text-green-600' },
        { icon: MapPin, value: '28', label: 'States Covered', color: 'bg-purple-50 text-purple-600' },
        { icon: Bell, value: 'Daily', label: 'New Updates', color: 'bg-orange-50 text-orange-600' },
    ];

    return (
        <section className="py-12 bg-white border-y border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={28} />
                            </div>
                            <div className="text-3xl font-black text-gray-800">{stat.value}</div>
                            <div className="text-sm text-gray-500 font-medium mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
