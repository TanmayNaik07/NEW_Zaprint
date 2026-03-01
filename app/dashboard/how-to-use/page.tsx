"use client"

import { Upload, Settings, CreditCard, Clock, MapPin, Bell, HelpCircle, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"

const steps = [
  {
    icon: Upload,
    title: "1. Upload Your Document",
    description:
      "Drag and drop your PDF, DOCX, or PPT file onto the upload area, or click to browse. We support files up to 50MB.",
  },
  {
    icon: Settings,
    title: "2. Choose Print Settings",
    description:
      "Select your preferred options: color or black & white, paper size (A4 or A3), single or double-sided, and number of copies.",
  },
  {
    icon: CreditCard,
    title: "3. Complete Payment",
    description:
      "Review your order summary with the estimated cost and proceed to secure checkout. We accept all major credit cards.",
  },
  {
    icon: Clock,
    title: "4. Get Estimated Time",
    description:
      "Once payment is confirmed, you'll see the exact time when your prints will be ready for pickup. No more guessing!",
  },
  {
    icon: MapPin,
    title: "5. Pick Up Your Prints",
    description:
      "Arrive at the pickup location at your scheduled time. Show your confirmation and collect your prints.",
  },
  {
    icon: Bell,
    title: "6. Stay Updated",
    description:
      "Receive notifications about your print status. We'll alert you when your prints are ready or if there's any delay.",
  },
]

const faqs = [
  {
    question: "How is the print time calculated?",
    answer:
      "Our print time estimation is based on the number of pages, print settings (color vs B&W, single vs double-sided), and current queue length. We factor in approximately 30 seconds per page plus queue processing time.",
  },
  {
    question: "What happens after I pay?",
    answer:
      "After successful payment, your print job enters our queue immediately. You'll receive a confirmation with your estimated pickup time. We'll also send you notifications as your print progresses.",
  },
  {
    question: "How does pickup work?",
    answer:
      "Simply arrive at the designated pickup location at your scheduled time. Show your confirmation (email or in-app) and our staff will hand over your prints. No waiting in line!",
  },
  {
    question: "Can I cancel or modify my order?",
    answer:
      "You can cancel your order within 2 minutes of payment for a full refund. Modifications are possible before printing starts. Contact support through the dashboard for assistance.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "We currently support PDF, DOCX, and PPT/PPTX files. For best results, we recommend uploading PDF files as they preserve formatting most accurately.",
  },
  {
    question: "What if I'm late for pickup?",
    answer:
      "No worries! We hold your prints for 24 hours after the scheduled pickup time. After that, prints are securely disposed of and you'll need to place a new order.",
  },
]

export default function HowToUsePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-[#0a1128] text-2xl md:text-3xl font-semibold mb-2">How to Use Zaprint</h1>
        <p className="text-[#5b637a]">A step-by-step guide to getting your prints done quickly and easily.</p>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="p-6 rounded-2xl border border-black/5 bg-white/70 backdrop-blur-sm shadow-sm hover:bg-white/90 transition-colors"
          >
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#0a1128]/10 flex items-center justify-center shrink-0">
                <step.icon className="w-6 h-6 text-[#0a1128]" />
              </div>
              <div>
                <h3 className="text-[#0a1128] text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-[#5b637a] leading-relaxed">{step.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#0a1128]" />
          <h2 className="text-[#0a1128] text-xl font-semibold">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              className="rounded-xl border border-black/5 bg-white/70 backdrop-blur-sm overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-black/[0.02] transition-colors"
              >
                <span className="text-[#0a1128] font-medium">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform",
                    openFaq === index && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openFaq === index ? "max-h-48" : "max-h-0",
                )}
              >
                <p className="px-6 pb-4 text-[#5b637a] leading-relaxed">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
