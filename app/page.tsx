import { ZaPrintHero } from "@/components/zaprint-hero"
import { ZaPrintHowItWorks } from "@/components/zaprint-how-it-works"
import { ZaPrintFeatures } from "@/components/zaprint-features"
import { ZaPrintPricing } from "@/components/zaprint-pricing"
import { ZaPrintCTA } from "@/components/zaprint-cta"
import { ZaPrintFooter } from "@/components/zaprint-footer"
import { AnimatedSection } from "@/components/animated-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-0">
      <div className="relative z-10">
        <main className="max-w-[1320px] mx-auto relative">
          <ZaPrintHero />
        </main>

        <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto" delay={0.1}>
          <ZaPrintHowItWorks />
        </AnimatedSection>

        <AnimatedSection id="features-section" className="relative z-10 max-w-[1320px] mx-auto" delay={0.2}>
          <ZaPrintFeatures />
        </AnimatedSection>

        <AnimatedSection id="pricing-section" className="relative z-10 max-w-[1320px] mx-auto" delay={0.2}>
          <ZaPrintPricing />
        </AnimatedSection>

        <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto" delay={0.2}>
          <ZaPrintCTA />
        </AnimatedSection>

        <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto" delay={0.2}>
          <ZaPrintFooter />
        </AnimatedSection>
      </div>
    </div>
  )
}
