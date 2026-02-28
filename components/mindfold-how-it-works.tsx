"use client"

import { Upload, Settings, CreditCard, Clock } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Upload Document",
    description: "Drag & drop your PDF, DOCX, or PPT files securely to our platform. No account needed to start.",
    step: 1,
  },
  {
    icon: Settings,
    title: "Select Specifications",
    description: "Choose color, paper size, single/double-sided, and number of copies for your print job.",
    step: 2,
  },
  {
    icon: CreditCard,
    title: "Pay Securely",
    description: "Complete your payment through our secure checkout process. Multiple payment methods supported.",
    step: 3,
  },
  {
    icon: Clock,
    title: "Pickup When Ready",
    description: "Get real-time updates and arrive exactly when your print is ready. No more waiting in queues.",
    step: 4,
  },
]

export function MindfoldHowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#f7f6f4] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0a1128] tracking-tight uppercase">
            How <span className="text-[#0a1128]/40">ZAPRINT</span> Works
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-[#5b637a] font-medium max-w-2xl mx-auto leading-relaxed">
            Get your prints in 4 simple steps. No more waiting in queues.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map((step) => (
            <div key={step.title} className="text-center group">
              {/* Step Icon Box */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white shadow-sm border border-black/5 text-[#0a1128] rounded-[2rem] mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                <step.icon className="h-8 w-8" strokeWidth={2.5} />
                {/* Step Number Badge */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#0a1128] text-white text-sm font-bold rounded-full flex items-center justify-center shadow-sm">
                  {step.step}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-[#0a1128] mb-3">{step.title}</h3>

              {/* Description */}
              <p className="text-[#5b637a] font-medium leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
