"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const pricingTiers = [
  {
    name: "Pay As You Go",
    description: "Perfect for occasional printing needs",
    price: "From $0.05",
    priceLabel: "per page",
    features: [
      "B&W printing from $0.05/page",
      "Color printing from $0.15/page",
      "A4 and A3 paper sizes",
      "Single & double-sided",
      "Real-time estimation",
      "Secure payments",
    ],
    cta: "Start Printing",
    popular: false,
  },
  {
    name: "Monthly Plan",
    description: "For regular printing with savings",
    price: "$29",
    priceLabel: "per month",
    features: [
      "100 B&W pages included",
      "50 color pages included",
      "Priority queue access",
      "20% off additional pages",
      "Email notifications",
      "Print history dashboard",
    ],
    cta: "Subscribe Now",
    popular: true,
  },
  {
    name: "Business",
    description: "For teams and high-volume printing",
    price: "$99",
    priceLabel: "per month",
    features: [
      "500 B&W pages included",
      "200 color pages included",
      "Express printing option",
      "30% off additional pages",
      "Team management",
      "Invoice & billing reports",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function ZaPrintPricing() {
  return (
    <section id="pricing-section" className="w-full px-5 py-16 md:py-24">
      <div className="max-w-[1320px] mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-foreground text-3xl md:text-5xl font-semibold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Choose the plan that works best for your printing needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-6 md:p-8 rounded-2xl border transition-all duration-300 ${
                tier.popular
                  ? "border-primary/40 bg-primary/5"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-foreground text-xl font-semibold mb-2">{tier.name}</h3>
                <p className="text-muted-foreground text-sm">{tier.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-foreground text-4xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground text-sm ml-2">{tier.priceLabel}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/signup" className="block">
                <Button
                  className={`w-full rounded-full font-medium ${
                    tier.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                      : "bg-white/10 text-foreground hover:bg-white/20"
                  }`}
                >
                  {tier.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
