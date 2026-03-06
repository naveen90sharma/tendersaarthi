'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Rajesh Kumar",
        role: "Contractor, RK Infrastructures",
        content: "TenderSaarthi ki AI analysis ne mujhe wahi tenders dikhaye jo meri capacity ke liye best the. Pehle search karne mein ghanto lagte the, ab 10 minute mein analysis ready hoti hai.",
        stars: 5,
        location: "New Delhi"
    },
    {
        name: "Sanjay Verma",
        role: "MD, Verma Electricals",
        content: "Website ka automated alert system bahut kaam ka hai. Koi bhi naya tender mere category ka miss nahi hota. EMD aur tender value ka calculation bhi ekdum accurate hai.",
        stars: 5,
        location: "Mumbai"
    },
    {
        name: "Amit Singh",
        role: "Civil Engineer",
        content: "Maine pehle kai portals use kiye hain, par iska mobile experience aur clean interface sabse best hai. Tenders dhundna ab mobile se bhi easy hai.",
        stars: 4,
        location: "Lucknow"
    }
];

export default function TestimonialsSection() {
    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">What Our Clients Say</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto italic">
                        Real stories from registered contractors and business owners who transformed their procurement process with us.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((t, i) => (
                        <div key={i} className="relative p-8 rounded-2xl bg-[#F8FAFC] border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                            <Quote className="absolute top-6 right-8 text-gray-200 w-10 h-10 group-hover:text-tj-yellow/20 transition-colors" />

                            <div className="flex gap-1 mb-4">
                                {[...Array(t.stars)].map((_, idx) => (
                                    <Star key={idx} size={16} className="fill-tj-yellow text-tj-yellow" />
                                ))}
                            </div>

                            <p className="text-gray-700 mb-6 relative z-10 font-medium leading-relaxed">
                                "{t.content}"
                            </p>

                            <div className="mt-auto pt-6 border-t border-gray-200/50">
                                <h4 className="font-bold text-gray-900">{t.name}</h4>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider">{t.role}</span>
                                    <span className="text-[10px] text-gray-400 font-medium uppercase">{t.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
