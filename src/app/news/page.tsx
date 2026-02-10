
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

// This could be fetched from DB later
const newsItems = [
    {
        id: 1,
        title: "Government Mandates E-Tendering for All Projects Above 5 Crores",
        date: "25 Jan 2026",
        category: "Policy Update",
        summary: "The Ministry of Finance has issued a new directive mandating e-tendering for all public procurement projects exceeding 5 Crores to ensure transparency.",
        image: "https://images.unsplash.com/photo-1586769852044-692d6e37d74e?auto=format&fit=crop&q=80&w=300&h=200"
    },
    {
        id: 2,
        title: "Major Highway Projects Announced in North-East India",
        date: "22 Jan 2026",
        category: "Infrastructure",
        summary: "NHAI has unveiled a plan to construct 500km of new highways in the North-East region to boost connectivity and trade.",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=300&h=200"
    },
    {
        id: 3,
        title: "New Guidelines for Green Energy Tenders Released",
        date: "20 Jan 2026",
        category: "Energy",
        summary: "The Ministry of New and Renewable Energy (MNRE) has updated guidelines for solar and wind power tenders to attract more foreign investment.",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=300&h=200"
    },
    {
        id: 4,
        title: "Smart City Tenders: Deadline Extended for Phase 3",
        date: "18 Jan 2026",
        category: "Urban Development",
        summary: "The deadline for submission of bids for the Smart City Phase 3 projects has been extended by two weeks due to technical reasons.",
        image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=300&h=200"
    }
];

export default function NewsListing() {
    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4">
                <Breadcrumb />
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Latest News & Updates</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {newsItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                            <div className="md:flex">
                                <div className="md:w-1/3">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-48 md:h-full object-cover"
                                    />
                                </div>
                                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-primary uppercase tracking-wide">{item.category}</span>
                                            <span className="text-xs text-gray-500">{item.date}</span>
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                                            <Link href={`/news/${item.id}`} className="hover:text-primary transition">{item.title}</Link>
                                        </h2>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.summary}</p>
                                    </div>
                                    <Link href={`/news/${item.id}`} className="text-sm font-bold text-primary hover:underline self-start">
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
