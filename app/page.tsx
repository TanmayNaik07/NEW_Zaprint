import { ZaprintHeader } from "@/components/Zaprint-header"
import { LandingHeroGlassmorphism } from "@/components/landing-hero-glassmorphism"
import { ZaprintHowItWorks } from "@/components/Zaprint-how-it-works"
import { ZaprintFeatures } from "@/components/Zaprint-features"
import { ZaprintPricing } from "@/components/Zaprint-pricing"
import { ZaprintCTA } from "@/components/Zaprint-cta"
import { ZaprintFooter } from "@/components/Zaprint-footer"
import { AnimatedSection } from "@/components/animated-section"
import { FooterWithDotShader } from "@/components/footer-with-dot-shader"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-0">
      {/* Hero: glassmorphism trust hero with header overlay */}
      <section className="relative min-h-screen">
        <div className="absolute top-0 left-0 right-0 z-20">
          <ZaprintHeader />
        </div>
        <LandingHeroGlassmorphism />
      </section>

      <div className="relative z-10">
        <AnimatedSection id="how-it-works" className="relative z-10 max-w-[1320px] mx-auto" delay={0.1}>
          <ZaprintHowItWorks />
        </AnimatedSection>

        <AnimatedSection id="features-section" className="relative z-10 max-w-[1320px] mx-auto" delay={0.2}>
          <ZaprintFeatures />
        </AnimatedSection>

        <AnimatedSection id="pricing-section" className="relative z-10 max-w-[1320px] mx-auto" delay={0.2}>
          <ZaprintPricing />
        </AnimatedSection>

        <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto" delay={0.2}>
          <ZaprintCTA />
        </AnimatedSection>

        <AnimatedSection className="relative z-10" delay={0.2}>
          <FooterWithDotShader />
        </AnimatedSection>
      </div>
    </div>
  )
}
