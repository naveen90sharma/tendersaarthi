'use client';

import Link from 'next/link';
import { Briefcase, Laptop, Heart, Truck, GraduationCap, Wrench, ShoppingBag, Zap } from 'lucide-react';

export default function CategoryGrid() {
    const categories = [
        { name: 'Construction & Infrastructure', icon: Briefcase, count: '2,500+', color: 'from-blue-500 to-blue-600' },
        { name: 'IT & Software', icon: Laptop, count: '1,200+', color: 'from-purple-500 to-purple-600' },
        { name: 'Healthcare & Medical', icon: Heart, count: '800+', color: 'from-red-500 to-red-600' },
        { name: 'Transportation', icon: Truck, count: '950+', color: 'from-green-500 to-green-600' },
        { name: 'Education', icon: GraduationCap, count: '600+', color: 'from-yellow-500 to-yellow-600' },
        { name: 'Engineering', icon: Wrench, count: '1,100+', color: 'from-orange-500 to-orange-600' },
        { name: 'Procurement', icon: ShoppingBag, count: '900+', color: 'from-pink-500 to-pink-600' },
        { name: 'Power & Energy', icon: Zap, count: '700+', color: 'from-indigo-500 to-indigo-600' },
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-gray-800 mb-2">Browse by Category</h2>
                    <p className="text-gray-500 text-sm">Find tenders across various sectors and industries</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            href={`/active-tenders?category=${encodeURIComponent(category.name)}`}
                            className="group bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent"
                        >
                            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br ${category.color} mb-4 group-hover:scale-110 transition-transform`}>
                                <category.icon size={24} className="text-white" />
                            </div>
                            <h3 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                                {category.name}
                            </h3>
                            <p className="text-xs text-gray-500 font-semibold">{category.count} tenders</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
