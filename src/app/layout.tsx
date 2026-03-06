import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TenderSaarthi - Find Government & Private Tenders Online",
    description: "India's leading digital marketplace for government and private tenders. Discover opportunities in Road, Railway, Solar, Building, and more.",
    keywords: ["Tenders", "Government Tenders", "Private Tenders", "TenderSaarthi", "India Tenders", "E-procurement"],
    icons: {
        icon: "/favicon.svg",
    },
    openGraph: {
        title: "TenderSaarthi - Tender Discovery Platform",
        description: "Explore thousands of active government and private tenders across India.",
        url: 'https://tendersaarthi.com',
        siteName: 'TenderSaarthi',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
            },
        ],
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'TenderSaarthi',
        description: 'India\'s digital marketplace for tenders.',
        images: ['/logo.png'],
    },
};

import { ContractorProvider } from "@/context/ContractorContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ContractorProvider>
                    <Header />
                    <main className="min-h-screen pb-16 md:pb-0">
                        {children}
                    </main>
                    <Footer />
                    <div className="md:hidden">
                        <BottomNav />
                    </div>
                </ContractorProvider>
            </body>
        </html>
    );
}
