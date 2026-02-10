import Link from 'next/link';

const linkGroups = [
    {
        title: 'TENDER BY STATES',
        viewAllPath: '/states',
        links: [
            'Uttar Pradesh Tenders', 'Maharashtra Tenders', 'Madhya Pradesh Tenders', 'Bihar Tenders',
            'Rajasthan Tenders', 'Gujarat Tenders', 'Rajasthan Tenders', 'West Bengal Tenders',
            'Karnataka Tenders', 'Andhra Pradesh Tenders', 'Assam Tenders', 'Tamil Nadu Tenders',
            'Haryana Tenders', 'Jharkhand Tenders', 'Odisha Tenders', 'Delhi Tenders',
            'Jammu And Kashmir Tenders', 'Telangana Tenders', 'Chhattisgarh Tenders',
            'Himachal Pradesh Tenders', 'Uttarakhand Tenders'
        ]
    },
    {
        title: 'TENDER BY CATEGORIES',
        // Assuming generic search or a future Category directory. For now pointing to generic search or top level
        viewAllPath: '/search?q=Categories',
        links: [
            'Road Construction Tenders', 'Building Construction Tenders', 'Civil Works Tenders',
            'Other Chemicals Tenders', 'Pipeline Projects Tenders', 'Personal paper products Tenders',
            'Computers Tenders', 'Development Software Tenders', 'Furniture Tenders',
            'Road transportation Tenders', 'Electrical components Tenders'
        ]
    },
    {
        title: 'TENDER BY AUTHORITIES',
        viewAllPath: '/authorities',
        links: [
            'National Highway Authority of India Tenders', 'Central Public works Department Tenders',
            'Road And Building Department Tenders', 'Public Works Department Tenders',
            'Oil and natural Gas corporation Limited Tenders', 'Bharat Petroleum Corporation Limited Tenders',
            'Ministry of Road transport and highways Tenders', 'Bharat Heavy Electricals Limited Tenders',
            'Gas Authority of India Limited Tenders', 'Ministry Of Defence Tenders',
            'Public Health Engineering Department Tenders', 'National Board Of Examination Tenders'
        ]
    },
    {
        title: 'TENDER BY COUNTRIES',
        viewAllPath: '/countries',
        links: [
            'United States Tenders', 'Philippines Tenders', 'France Tenders', 'Russia Tenders',
            'Germany Tenders', 'Bangladesh Tenders', 'Canada Tenders', 'Bosnia and Herzegovina Tenders',
            'Poland Tenders', 'Spain Tenders', 'Brazil Tenders', 'South Africa Tenders',
            'Vietnam Tenders', 'Chile Tenders', 'Morocco Tenders', 'Belarus Tenders',
            'Morocco Tenders', 'China Tenders', 'Japan Tenders', 'United Kingdom Tenders',
            'Ukraine Tenders', 'Egypt Tenders'
        ]
    },
    {
        title: 'TENDER BY REGIONS',
        viewAllPath: '/regions',
        links: [
            'Africa Tenders', 'Asia Tenders', 'Australia Tenders', 'Europe Tenders',
            'Latin America Tenders', 'Middle East Tenders', 'MENA Tenders', 'North America Tenders',
            'SAARC Tenders'
        ]
    },
    {
        title: 'TENDER BY WEBSITE',
        viewAllPath: '/websites',
        links: [
            'ireps.gov.in Tenders', 'wbtenders.gov.in Tenders', 'mahatenders.gov.in Tenders',
            'bidplus.gem.gov.in Tenders', 'etenders.gov.in Tenders', 'tender.nprocure.com Tenders',
            'eproc.rajasthan.gov.in Tenders', 'eprocurentpc.nic.in Tenders', 'nbcc.enivida.com Tenders',
            'jktenders.gov.in Tenders', 'kppp.karnataka.gov.in Tenders', 'defproc.gov.in Tenders',
            'tntenders.gov.in Tenders', 'eproc.punjab.gov.in Tenders', 'tender.telangana.gov.in Tenders',
            'eprocure.gov.in Tenders', 'eproc.cgstate.gov.in Tenders', 'etender.cpwd.gov.in Tenders'
        ]
    }
];

export default function QuickLinks() {
    return (
        <section className="bg-white py-12 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                    {linkGroups.map((group, index) => (
                        <div key={index} className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 border-l-4 border-tj-blue pl-3 uppercase">
                                {group.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 text-[13px] leading-relaxed text-gray-600">
                                {group.links.map((link, idx) => (
                                    <span key={idx} className="inline-block">
                                        <Link
                                            href={`/search?q=${encodeURIComponent(link)}`}
                                            className="hover:text-primary hover:underline transition-colors"
                                        >
                                            {link}
                                        </Link>
                                        <span className="text-gray-300 mx-1.5">|</span>
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
