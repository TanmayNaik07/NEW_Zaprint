"use client"

import { Clock, Palette, Shield, Cloud, Bell, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { GlowCard } from "@/components/ui/spotlight-card"

const features = [
  {
    icon: Clock,
    title: "Real-time Print Estimation",
    description: "Know exactly when your prints will be ready with live time updates.",
    glowColor: "blue" as const,
  },
  {
    icon: Palette,
    title: "Multiple Print Options",
    description: "Color, B&W, various paper sizes, single or double-sided printing.",
    glowColor: "purple" as const,
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your payment information is protected with industry-standard encryption.",
    glowColor: "green" as const,
  },
  {
    icon: Cloud,
    title: "Cloud Document Handling",
    description: "Upload from anywhere. Your documents are securely stored until printed.",
    glowColor: "orange" as const,
  },
  {
    icon: Bell,
    title: "Pickup-Ready Notifications",
    description: "Get instant alerts when your prints are ready for collection.",
    glowColor: "red" as const,
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description: "High-speed printing ensures your documents are ready in minutes.",
    glowColor: "blue" as const,
  },
]

export function ZaPrintFeatures() {
  return (
    <section id="features-section" className="w-full px-5 py-16 md:py-24">
      <div className="max-w-[1320px] mx-auto">
        {/* Decorative blur */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 blur-[150px] -z-10" />

        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-foreground text-3xl md:text-5xl font-semibold mb-4">
            Everything You Need to Print
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Powerful features designed to make printing fast, easy, and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full min-w-0 flex justify-center"
            >
              <GlowCard
                glowColor={feature.glowColor}
                customSize
                className="w-full min-w-0 max-w-[360px] min-h-[240px] mx-auto"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1 flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-foreground text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
