"use client"

import { Clock, Palette, Shield, Cloud, Bell, Zap } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Real-time Print Estimation",
    description: "Know exactly when your prints will be ready with live time updates that help you plan your day.",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Palette,
    title: "Multiple Print Options",
    description: "Color, B&W, various paper sizes, single or double-sided — choose exactly how you want your documents printed.",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your payment information is protected with industry-standard encryption for worry-free transactions.",
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    icon: Cloud,
    title: "Cloud Document Handling",
    description: "Upload from anywhere. Your documents are securely stored and processed until they're printed.",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    icon: Bell,
    title: "Pickup-Ready Notifications",
    description: "Get instant alerts when your prints are ready for collection. Never waste time waiting again.",
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description: "High-speed printing ensures your documents are ready in minutes, not hours. Speed when you need it.",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
]

export function MindfoldFeatures() {
  return (
    <section id="features" className="bg-[#f7f6f4] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#0a1128] tracking-tight uppercase">
            Everything You Need{" "}
            <span className="text-[#0a1128]/40">TO PRINT</span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-[#5b637a] font-medium max-w-2xl mx-auto leading-relaxed">
            Powerful features designed to make printing fast, easy, and stress-free.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6`}
              >
                <feature.icon className={`h-7 w-7 ${feature.iconColor}`} strokeWidth={2.5} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-[#0a1128] mb-3">{feature.title}</h3>

              {/* Description */}
              <p className="text-[#5b637a] font-medium leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
