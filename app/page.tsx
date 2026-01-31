import { ZaPrintHeader } from "@/components/zaprint-header"
import { LandingHeroGlassmorphism } from "@/components/landing-hero-glassmorphism"
import { ZaPrintHowItWorks } from "@/components/zaprint-how-it-works"
import { ZaPrintFeatures } from "@/components/zaprint-features"
import { ZaPrintPricing } from "@/components/zaprint-pricing"
import { ZaPrintCTA } from "@/components/zaprint-cta"
import { ZaPrintFooter } from "@/components/zaprint-footer"
import { AnimatedSection } from "@/components/animated-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-0">
      {/* Hero: glassmorphism trust hero with header overlay */}
      <section className="relative min-h-screen">
        <div className="absolute top-0 left-0 right-0 z-20">
          <ZaPrintHeader />
        </div>
        <LandingHeroGlassmorphism />
      </section>

      <div className="relative z-10">
        <AnimatedSection id="how-it-works" className="relative z-10 max-w-[1320px] mx-auto" delay={0.1}>
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
