"use client";

import GlassmorphismTrustHero from "@/components/ui/glassmorphism-trust-hero";

export function LandingHeroGlassmorphism() {
  return (
    <GlassmorphismTrustHero
      badgeText="Save time, skip the queue"
      headingLine1="Print Smarter."
      headingLine2="Skip the Queue."
      headingLine3=""
      description="Upload your documents, choose print settings, pay online, and pick up your prints exactly when they're ready. No more waiting in lines."
      primaryCtaText="Start Printing"
      primaryCtaHref="/signup"
      secondaryCtaText="How It Works"
      secondaryCtaHref="#how-it-works"
      statsProjects="10K+"
      statsSatisfaction="98%"
      useShaderBackground={true}
    />
  );
}
