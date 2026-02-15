import Link from 'next/link';

const linkGroups = [
    {
        title: 'TENDER BY STATES',
        viewAllPath: '/states',
        links: [
            { name: 'Uttar Pradesh', slug: 'uttar-pradesh' },
            { name: 'Maharashtra', slug: 'maharashtra' },
            { name: 'Madhya Pradesh', slug: 'madhya-pradesh' },
            { name: 'Bihar', slug: 'bihar' },
            { name: 'Rajasthan', slug: 'rajasthan' },
            { name: 'Gujarat', slug: 'gujarat' },
            { name: 'West Bengal', slug: 'west-bengal' },
            { name: 'Karnataka', slug: 'karnataka' },
            { name: 'Andhra Pradesh', slug: 'andhra-pradesh' },
            { name: 'Assam', slug: 'assam' },
            { name: 'Tamil Nadu', slug: 'tamil-nadu' },
            { name: 'Haryana', slug: 'haryana' },
            { name: 'Jharkhand', slug: 'jharkhand' },
            { name: 'Odisha', slug: 'odisha' },
            { name: 'Delhi', slug: 'delhi' },
            { name: 'Jammu And Kashmir', slug: 'jammu-and-kashmir' },
            { name: 'Telangana', slug: 'telangana' },
            { name: 'Chhattisgarh', slug: 'chhattisgarh' },
            { name: 'Himachal Pradesh', slug: 'himachal-pradesh' },
            { name: 'Uttarakhand', slug: 'uttarakhand' }
        ],
        baseUrl: '/tenders/state'
    },
    {
        title: 'TENDER BY CATEGORIES',
        viewAllPath: '/tenders/category/construction',
        links: [
            { name: 'Road Construction', slug: 'road-construction' },
            { name: 'Building Construction', slug: 'building-construction' },
            { name: 'Civil Works', slug: 'civil-works' },
            { name: 'Other Chemicals', slug: 'other-chemicals' },
            { name: 'Pipeline Projects', slug: 'pipeline-projects' },
            { name: 'Software Development', slug: 'development-software' },
            { name: 'Furniture', slug: 'furniture' },
            { name: 'Road Transportation', slug: 'road-transportation' },
            { name: 'Electrical Components', slug: 'electrical-components' }
        ],
        baseUrl: '/tenders/category'
    },
    {
        title: 'TENDER BY AUTHORITIES',
        viewAllPath: '/authorities',
        links: [
            { name: 'NHAI', slug: 'national-highway-authority-of-india' },
            { name: 'CPWD', slug: 'central-public-works-department' },
            { name: 'PWD', slug: 'public-works-department' },
            { name: 'ONGC', slug: 'oil-and-natural-gas-corporation-limited' },
            { name: 'BPCL', slug: 'bharat-petroleum-corporation-limited' },
            { name: 'BHEL', slug: 'bharat-heavy-electricals-limited' },
            { name: 'Ministry of Defence', slug: 'ministry-of-defence' }
        ],
        baseUrl: '/tenders/authority'
    }
];

export default function QuickLinks() {
    return (
        <section className="bg-white py-12 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                    {linkGroups.map((group, index) => (
                        <div key={index} className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 border-l-4 border-primary pl-3 uppercase">
                                {group.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 text-[13px] leading-relaxed text-gray-600">
                                {group.links.map((link: any, idx) => (
                                    <span key={idx} className="inline-block">
                                        <Link
                                            href={`${group.baseUrl}/${link.slug}`}
                                            className="hover:text-primary hover:underline transition-colors font-medium"
                                        >
                                            {link.name} Tenders
                                        </Link>
                                        <span className="text-gray-400 mx-1.5 font-light">|</span>
                                    </span>
                                ))}
                                <span className="inline-block">
                                    <Link
                                        href={group.viewAllPath}
                                        className="text-primary font-bold hover:underline transition-colors"
                                    >
                                        View All
                                    </Link>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
