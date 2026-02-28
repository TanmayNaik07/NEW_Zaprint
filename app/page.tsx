import { MindfoldNavbar } from "@/components/mindfold-navbar"
import { MindfoldHero } from "@/components/mindfold-hero"
import { MindfoldScrollAnimation } from "@/components/mindfold-scroll-animation"
import { MindfoldFeatures } from "@/components/mindfold-features"
import { MindfoldHowItWorks } from "@/components/mindfold-how-it-works"
import { MindfoldReviews } from "@/components/mindfold-reviews"
import { MindfoldPricing } from "@/components/mindfold-pricing"
import { MindfoldFooter } from "@/components/mindfold-footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f6f4] relative overflow-hidden">
      {/* Paper texture background overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.25]"
        style={{
          backgroundImage: "url('/images/paper-texture.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          mixBlendMode: "multiply",
        }}
      />

      {/* Fixed Navbar */}
      <MindfoldNavbar />

      {/* Hero Section */}
      <MindfoldHero />

      {/* Scroll Animation Section */}
      <MindfoldScrollAnimation />

      {/* Features Section */}
      <MindfoldFeatures />

      {/* How It Works Section */}
      <MindfoldHowItWorks />

      {/* Reviews / Testimonials Section */}
      <MindfoldReviews />

      {/* Pricing Section */}
      <MindfoldPricing />

      {/* Footer */}
      <MindfoldFooter />
    </div>
  )
}
