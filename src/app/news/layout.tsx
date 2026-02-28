import { Metadata } from 'next';

const SITE_URL = 'https://tendersaarthi.com';

export const metadata: Metadata = {
    title: 'Tender News, Articles & Market Insights | TenderSaarthi',
    description: 'Stay updated with the latest government tender news, policy updates, infrastructure investments, and procurement insights across India. Read expert articles on NHAI, Smart City, Railway, and more.',
    keywords: 'government tender news India, tender updates 2026, NHAI tender news, infrastructure project news, smart city tender, railway tender, procurement news, tender policy update, TenderSaarthi',
    alternates: {
        canonical: `${SITE_URL}/news`,
    },
    openGraph: {
        type: 'website',
        title: 'Tender News & Market Insights | TenderSaarthi',
        description: 'Latest news, articles, and press releases on government tenders, infrastructure projects, and public procurement across India.',
        url: `${SITE_URL}/news`,
        siteName: 'TenderSaarthi',
        images: [
            {
                url: `${SITE_URL}/og-news.png`,
                width: 1200,
                height: 630,
                alt: 'TenderSaarthi News & Insights',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tender News & Market Insights | TenderSaarthi',
        description: 'Latest news, articles, and press releases on government tenders across India.',
        images: [`${SITE_URL}/og-news.png`],
        site: '@TenderSaarthi',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
        },
    },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* JSON-LD for news listing page */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: 'Tender News & Insights',
                        description: 'Latest government tender news, articles, and press releases across India.',
                        url: `${SITE_URL}/news`,
                        publisher: {
                            '@type': 'Organization',
                            name: 'TenderSaarthi',
                            url: SITE_URL,
                            logo: {
                                '@type': 'ImageObject',
                                url: `${SITE_URL}/logo.png`,
                            },
                        },
                        breadcrumb: {
                            '@type': 'BreadcrumbList',
                            itemListElement: [
                                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                                { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE_URL}/news` },
                            ],
                        },
                    }),
                }}
            />
            {children}
        </>
    );
}
