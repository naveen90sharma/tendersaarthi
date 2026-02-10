import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import CategoryGrid from '@/components/CategoryGrid';
import TenderSection from '@/components/TenderSection';
import HowItWorks from '@/components/HowItWorks';
import CTASection from '@/components/CTASection';
import NewsSection from '@/components/NewsSection';
import QuickLinks from '@/components/QuickLinks';

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <StatsSection />
      <CategoryGrid />
      <div className="bg-white">
        <TenderSection title="Latest Government Tenders" />
      </div>
      <HowItWorks />
      <div className="bg-gradient-to-b from-blue-50 to-white">
        <TenderSection title="Closing Soon" />
      </div>
      <CTASection />
      <NewsSection />
      <QuickLinks />
    </main>
  );
}
