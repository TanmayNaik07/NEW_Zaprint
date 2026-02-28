"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function MindfoldHero() {
  return (
    <section className="bg-[#f7f6f4] pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-transparent border border-black/80 text-black px-4 py-1.5 rounded-full text-[10px] tracking-widest font-semibold uppercase mb-10">
          <span className="w-1.5 h-1.5 bg-black rounded-full" />
          SMART DOCUMENT PRINTING
        </div>

        {/* Main Heading */}
        <h1 className="text-7xl sm:text-8xl md:text-[8rem] font-black tracking-tight text-[#0a1128] max-w-6xl mx-auto leading-none uppercase">
          PRINT SMARTER
          <br />
          <span className="text-[#0a1128]/40">SKIP THE QUEUE</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-lg sm:text-xl text-[#5b637a] font-medium max-w-2xl mx-auto leading-relaxed">
          Upload your documents, choose print settings, pay online, and pick up your prints exactly when they&apos;re ready. No more waiting in lines.
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          {/* Primary CTA with handdrawn arrow */}
          <div className="relative">
            {/* Handdrawn arrow annotation - desktop only */}
            <div className="hidden md:block absolute -left-[140px] -top-6 pointer-events-none opacity-90">
              <svg
                width="150"
                height="120"
                viewBox="0 0 150 120"
                fill="none"
                className="overflow-visible"
              >
                <path
                  d="M20,95 C20,30 70,30 140,30"
                  stroke="#0a1128"
                  strokeWidth="3.5"
                  strokeDasharray="8 8"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Arrowhead */}
                <polygon points="132,22 144,30 132,38" fill="#0a1128" />
              </svg>
              <span
                className="absolute top-[100px] -left-8 text-[28px] font-medium text-[#0a1128] whitespace-nowrap"
                style={{ transform: "rotate(-12deg)" }}
              >
                Click here
              </span>
            </div>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#0a1128] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-black transition-colors"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Secondary CTA */}
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="inline-flex items-center gap-2 bg-white text-[#0a1128] border border-black/10 px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-gray-50 hover:border-black/20 transition-all shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#0a1128" strokeWidth="1.5" />
              <polygon points="6.5,5 11,8 6.5,11" fill="#0a1128" />
            </svg>
            Watch Demo
          </a>
        </div>
      </div>
    </section>
  )
}
