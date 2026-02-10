import Link from 'next/link';

const news = [
    { id: 1, title: 'Ministry of Road Transport announces new highway projects worth 5000 Cr', date: 'Jan 28, 2026' },
    { id: 2, title: 'Changes in e-Procurement policies for MSMEs starting April 2026', date: 'Jan 25, 2026' },
    { id: 3, title: 'Upcoming smart city tenders in Uttar Pradesh and MP', date: 'Jan 20, 2026' },
];

export default function NewsSection() {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Latest Tender News</h2>
                    <Link href="/news" className="text-primary font-medium hover:underline">View All</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <Link href={`/news/${item.id}`} key={item.id} className="flex gap-4 group cursor-pointer">
                            <div className="w-24 h-24 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
                                <img src={`https://via.placeholder.com/100?text=News+${item.id}`} alt="News" className="w-full h-full object-cover opacity-80" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 leading-tight mb-2 group-hover:text-primary">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-gray-500">{item.date}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
