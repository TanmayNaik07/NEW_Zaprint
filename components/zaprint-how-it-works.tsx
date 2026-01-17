"use client"

import { Upload, Settings, CreditCard, Clock } from "lucide-react"
import { motion } from "framer-motion"

const steps = [
  {
    icon: Upload,
    title: "Upload Document",
    description: "Drag & drop your PDF, DOCX, or PPT files securely to our platform.",
    step: "01",
  },
  {
    icon: Settings,
    title: "Select Specifications",
    description: "Choose color, paper size, single/double-sided, and number of copies.",
    step: "02",
  },
  {
    icon: CreditCard,
    title: "Pay Securely",
    description: "Complete your payment through our secure checkout process.",
    step: "03",
  },
  {
    icon: Clock,
    title: "Pickup When Ready",
    description: "Get real-time updates and arrive exactly when your print is ready.",
    step: "04",
  },
]

export function ZaPrintHowItWorks() {
  return (
    <section id="how-it-works" className="w-full px-5 py-16 md:py-24">
      <div className="max-w-[1320px] mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-foreground text-3xl md:text-5xl font-semibold mb-4">How ZaPrint Works</h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Get your prints in 4 simple steps. No more waiting in queues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-all duration-300">
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <span className="text-primary text-sm font-semibold">{step.step}</span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-foreground text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>

              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-primary/40 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Time estimation highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 p-6 md:p-8 rounded-2xl border border-primary/20 bg-primary/5 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Clock className="w-6 h-6 text-primary" />
            <span className="text-primary text-2xl md:text-3xl font-semibold">Real-time Print Estimation</span>
          </div>
          <p className="text-muted-foreground text-lg">
            Know exactly when your prints will be ready. Example:{" "}
            <span className="text-primary font-medium">&quot;Ready in 10 minutes&quot;</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
