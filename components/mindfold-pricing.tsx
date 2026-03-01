"use client"

import { Check } from "lucide-react"
import Link from "next/link"

const pricingPlans = [
  {
    name: "Pay As You Go",
    price: "$0.05",
    priceLabel: "/page",
    popular: false,
    features: [
      "B&W printing from $0.05/page",
      "Color printing from $0.15/page",
      "A4 and A3 paper sizes",
      "Single & double-sided",
      "Real-time estimation",
    ],
  },
  {
    name: "Monthly Plan",
    price: "$29",
    priceLabel: "/mo",
    popular: true,
    features: [
      "100 B&W pages included",
      "50 color pages included",
      "Priority queue access",
      "20% off additional pages",
      "Email notifications",
      "Print history dashboard",
    ],
  },
  {
    name: "Business",
    price: "$99",
    priceLabel: "/mo",
    popular: false,
    features: [
      "500 B&W pages included",
      "200 color pages included",
      "Express printing option",
      "30% off additional pages",
      "Team management",
      "Invoice & billing reports",
    ],
  },
]

export function MindfoldPricing() {
  return (
    <section id="pricing" className="bg-[#f7f6f4] relative py-24 overflow-hidden">
      {/* Absolute SVG Doodle Overlay from Canva */}
      <img src="/3-overlay.svg" alt="Pricing details" className="absolute top-0 left-0 w-full h-auto object-top pointer-events-none z-10 opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0a1128] tracking-tight uppercase">
            Simple, Transparent{" "}
            <span className="text-[#0a1128]/40">PRICING</span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-[#5b637a] font-medium max-w-2xl mx-auto leading-relaxed">
            Choose the plan that works best for your printing needs.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-end">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 lg:p-10 rounded-[2rem] transition-all duration-300 ${plan.popular
                ? "border-2 border-[#0a1128] bg-white shadow-2xl shadow-black/10 z-10 md:scale-105"
                : "border border-black/5 bg-white hover:border-black/20 hover:shadow-lg shadow-sm"
                }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0a1128] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-bold text-[#0a1128] mb-4">{plan.name}</h3>

              {/* Price */}
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tight text-[#0a1128]">
                  {plan.price}
                </span>
                <span className="text-[#5b637a] font-medium">{plan.priceLabel}</span>
              </div>

              {/* Features List */}
              <ul className="mb-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#0a1128]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-[#0a1128]" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-[#0a1128]">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link href="/signup" className="block">
                <button
                  className={`w-full py-3.5 rounded-full font-semibold transition-colors ${plan.popular
                    ? "bg-[#0a1128] text-white hover:bg-black"
                    : "bg-gray-100 text-[#0a1128] hover:bg-gray-200"
                    }`}
                >
                  Get Started
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
