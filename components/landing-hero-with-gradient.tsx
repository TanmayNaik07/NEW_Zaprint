"use client";

import { useRouter } from "next/navigation";
import LiquidGradient from "@/components/ui/flow-gradient-hero-section";

export function LandingHeroWithGradient() {
  const router = useRouter();

  return (
    <LiquidGradient
      title="Print Smarter. Skip the Queue."
      showPauseButton={true}
      ctaText="Start Printing"
      onCtaClick={() => router.push("/signup")}
    />
  );
}
