import { Suspense } from 'react';
import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import TenderSection from '@/components/TenderSection';
import HowItWorks from '@/components/HowItWorks';
import CTASection from '@/components/CTASection';
import NewsSection from '@/components/NewsSection';
import QuickLinks from '@/components/QuickLinks';
import TrustSection from '@/components/TrustSection';
import FloatingAssistant from '@/components/FloatingAssistant';

export default function Home() {
  return (
    <main className="overflow-hidden relative bg-white">
      <div className="relative z-10">
        <Hero />
        <TrustSection />

        <div className="bg-white">
          <TenderSection title="Top Market Opportunities" />
        </div>

        <div className="bg-slate-50">
          <Suspense fallback={
            <div className="py-10 md:py-16 bg-[#F8FAFC] flex justify-center">
              <div className="animate-pulse w-10 h-10 bg-slate-200 rounded-full" />
            </div>
          }>
            <CategoryGrid />
          </Suspense>
        </div>

        <HowItWorks />

        <div className="bg-white">
          <TenderSection title="Critical: Closing Soon" />
        </div>

        <CTASection />
        <NewsSection />

        <Suspense fallback={<div className="h-32 bg-white" />}>
          <QuickLinks />
        </Suspense>

        <FloatingAssistant />
      </div>
    </main>
  );
}
