import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import TenderSection from '@/components/TenderSection';
import HowItWorks from '@/components/HowItWorks';
import CTASection from '@/components/CTASection';
import NewsSection from '@/components/NewsSection';
import QuickLinks from '@/components/QuickLinks';
import TrustSection from '@/components/TrustSection';
import FloatingAssistant from '@/components/FloatingAssistant';
import TenderHotspots from '@/components/TenderHotspots';

export default function Home() {
  return (
    <main className="overflow-hidden relative bg-white">
      <div className="relative z-10">
        <Hero />
        <TrustSection />

        <div className="bg-white">
          <TenderSection title="Top Market Opportunities" />
        </div>

        {/* <TenderHotspots /> */}

        <div className="bg-slate-50">
          <CategoryGrid />
        </div>

        <HowItWorks />

        <div className="bg-white">
          <TenderSection title="Critical: Closing Soon" />
        </div>

        <CTASection />
        <NewsSection />
        <QuickLinks />
        <FloatingAssistant />
      </div>
    </main>
  );
}
