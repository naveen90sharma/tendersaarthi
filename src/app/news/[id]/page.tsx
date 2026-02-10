
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { BadgeAlert, Calendar, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

const newsItems = [
    {
        id: 1,
        title: "Government Mandates E-Tendering for All Projects Above 5 Crores",
        date: "25 Jan 2026",
        category: "Policy Update",
        summary: "The Ministry of Finance has issued a new directive mandating e-tendering for all public procurement projects exceeding 5 Crores to ensure transparency.",
        content: "The Ministry of Finance has issued a new directive mandating e-tendering for all public procurement projects exceeding 5 Crores to ensure transparency. This move aims to reduce corruption and increase efficiency in government spending. The new rules will come into effect from April 1, 2026. All departments must update their portals to support the new standards.",
        image: "https://images.unsplash.com/photo-1586769852044-692d6e37d74e?auto=format&fit=crop&q=80&w=800&h=400"
    },
    {
        id: 2,
        title: "Major Highway Projects Announced in North-East India",
        date: "22 Jan 2026",
        category: "Infrastructure",
        summary: "NHAI has unveiled a plan to construct 500km of new highways in the North-East region to boost connectivity and trade.",
        content: "NHAI has unveiled a plan to construct 500km of new highways in the North-East region to boost connectivity and trade. The project is estimated to cost over 20,000 Crores and will be completed in phases over the next 3 years. This initiative is part of the 'Act East' policy.",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800&h=400"
    },
    {
        id: 3,
        title: "New Guidelines for Green Energy Tenders Released",
        date: "20 Jan 2026",
        category: "Energy",
        summary: "The Ministry of New and Renewable Energy (MNRE) has updated guidelines for solar and wind power tenders to attract more foreign investment.",
        content: "The Ministry of New and Renewable Energy (MNRE) has updated guidelines for solar and wind power tenders to attract more foreign investment. Key changes include relaxed bidding criteria and long-term PPA assurances. Experts believe this will accelerate India's transition to renewable energy.",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800&h=400"
    },
    {
        id: 4,
        title: "Smart City Tenders: Deadline Extended for Phase 3",
        date: "18 Jan 2026",
        category: "Urban Development",
        summary: "The deadline for submission of bids for the Smart City Phase 3 projects has been extended by two weeks due to technical reasons.",
        content: "The deadline for submission of bids for the Smart City Phase 3 projects has been extended by two weeks due to technical reasons. The new deadline is Feb 15, 2026. This extension applies to 12 cities currently under the program.",
        image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=800&h=400"
    }
];

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const newsItem = newsItems.find(item => item.id.toString() === id);
    if (!newsItem) {
        return {
            title: 'News Article Not Found | TenderSaarthi'
        };
    }
    return {
        title: `${newsItem.title} | TenderSaarthi News`,
        description: newsItem.summary,
        openGraph: {
            title: newsItem.title,
            description: newsItem.summary,
            images: [newsItem.image]
        }
    };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const newsItem = newsItems.find(item => item.id.toString() === id);

    if (!newsItem) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <BadgeAlert size={48} className="text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">News Article Not Found</h1>
                <Link href="/news" className="mt-4 bg-primary text-white px-6 py-2 rounded-lg font-bold">
                    Back to News
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8 font-sans">
            <div className="container mx-auto px-4 max-w-4xl">
                <Breadcrumb />

                <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <img
                        src={newsItem.image}
                        alt={newsItem.title}
                        className="w-full h-64 md:h-96 object-cover"
                    />

                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-4 text-sm">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold uppercase text-xs">
                                {newsItem.category}
                            </span>
                            <span className="text-gray-500 flex items-center gap-1">
                                <Calendar size={14} />
                                {newsItem.date}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                            {newsItem.title}
                        </h1>

                        <div className="prose max-w-none text-gray-600 leading-relaxed">
                            <p className="text-lg font-medium text-gray-800 mb-6 border-l-4 border-primary pl-4">
                                {newsItem.summary}
                            </p>
                            <p>
                                {newsItem.content}
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <Link href="/news" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                                <ArrowLeft size={16} />
                                Back to All News
                            </Link>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
