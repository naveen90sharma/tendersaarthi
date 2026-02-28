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
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  return (
    <main className="overflow-hidden relative bg-white">
      <div className="relative z-10">
        <Hero />

        <ScrollReveal>
          <TrustSection />
        </ScrollReveal>

        <ScrollReveal className="bg-white" delay={100}>
          <TenderSection title="Top Market Opportunities" />
        </ScrollReveal>

        <ScrollReveal className="bg-slate-50" delay={200}>
          <Suspense fallback={
            <div className="py-10 md:py-16 bg-[#F8FAFC] flex justify-center">
              <div className="animate-pulse w-10 h-10 bg-slate-200 rounded-full" />
            </div>
          }>
            <CategoryGrid />
          </Suspense>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <HowItWorks />
        </ScrollReveal>

        <ScrollReveal className="bg-white" delay={200}>
          <TenderSection title="Critical: Closing Soon" />
        </ScrollReveal>

        <ScrollReveal>
          <CTASection />
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <NewsSection />
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <Suspense fallback={<div className="h-32 bg-white" />}>
            <QuickLinks />
          </Suspense>
        </ScrollReveal>

        <FloatingAssistant />
      </div>
    </main>
  );
}

