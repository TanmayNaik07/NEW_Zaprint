import React from "react"
import { Button } from "@/components/ui/button"
import { ZaPrintHeader } from "./zaprint-header"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"

export function ZaPrintHero() {
  return (
    <section
      className="flex flex-col items-center text-center relative mx-auto rounded-2xl overflow-hidden my-6 py-0 px-4
         w-full h-[480px] md:w-[1220px] md:h-[680px] lg:h-[810px] md:px-0"
    >
      {/* SVG Background with blue/violet gradient */}
      <div className="absolute inset-0 z-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1220 810"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <g clipPath="url(#clip0_zaprint)">
            <mask
              id="mask0_zaprint"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="10"
              y="-1"
              width="1200"
              height="812"
            >
              <rect x="10" y="-0.84668" width="1200" height="811.693" fill="url(#paint0_linear_zaprint)" />
            </mask>
            <g mask="url(#mask0_zaprint)">
              {/* Grid pattern */}
              {[...Array(35)].map((_, i) => (
                <React.Fragment key={`row-${i}`}>
                  {[...Array(22)].map((_, j) => (
                    <rect
                      key={`cell-${i}-${j}`}
                      x={-20.0891 + i * 36}
                      y={9.2 + j * 36}
                      width="35.6"
                      height="35.6"
                      stroke="hsl(var(--foreground))"
                      strokeOpacity="0.08"
                      strokeWidth="0.4"
                      strokeDasharray="2 2"
                    />
                  ))}
                </React.Fragment>
              ))}
              {/* Highlighted cells */}
              <rect x="699.711" y="81" width="36" height="36" fill="hsl(var(--primary))" fillOpacity="0.1" />
              <rect x="195.711" y="153" width="36" height="36" fill="hsl(var(--primary))" fillOpacity="0.08" />
              <rect x="1023.71" y="153" width="36" height="36" fill="hsl(var(--primary))" fillOpacity="0.08" />
              <rect x="123.711" y="225" width="36" height="36" fill="hsl(var(--foreground))" fillOpacity="0.06" />
              <rect x="951.711" y="297" width="36" height="36" fill="hsl(var(--primary))" fillOpacity="0.06" />
              <rect x="519.711" y="405" width="36" height="36" fill="hsl(var(--primary))" fillOpacity="0.08" />
            </g>

            {/* Gradient glow effects */}
            <g filter="url(#filter0_f_zaprint)">
              <path
                d="M1447.45 -87.0203V-149.03H1770V1248.85H466.158V894.269C1008.11 894.269 1447.45 454.931 1447.45 -87.0203Z"
                fill="url(#paint1_linear_zaprint)"
              />
            </g>

            <g filter="url(#filter1_f_zaprint)">
              <path
                d="M1383.45 -151.02V-213.03H1706V1184.85H402.158V830.269C944.109 830.269 1383.45 390.931 1383.45 -151.02Z"
                fill="url(#paint2_linear_zaprint)"
                fillOpacity="0.69"
              />
            </g>

            <g style={{ mixBlendMode: "lighten" }} filter="url(#filter2_f_zaprint)">
              <path
                d="M1567.45 -231.02V-293.03H1890V1104.85H586.158V750.269C1128.11 750.269 1567.45 310.931 1567.45 -231.02Z"
                fill="url(#paint3_linear_zaprint)"
              />
            </g>
          </g>

          <rect
            x="0.5"
            y="0.5"
            width="1219"
            height="809"
            rx="15.5"
            stroke="hsl(var(--foreground))"
            strokeOpacity="0.06"
          />

          <defs>
            <filter
              id="filter0_f_zaprint"
              x="147.369"
              y="-467.818"
              width="1941.42"
              height="2035.46"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="159.394" result="effect1_foregroundBlur" />
            </filter>
            <filter
              id="filter1_f_zaprint"
              x="-554.207"
              y="-1169.39"
              width="3216.57"
              height="3310.61"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="478.182" result="effect1_foregroundBlur" />
            </filter>
            <filter
              id="filter2_f_zaprint"
              x="426.762"
              y="-452.424"
              width="1622.63"
              height="1716.67"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="79.6969" result="effect1_foregroundBlur" />
            </filter>
            <linearGradient
              id="paint0_linear_zaprint"
              x1="35.0676"
              y1="23.6807"
              x2="903.8"
              y2="632.086"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="hsl(var(--foreground))" stopOpacity="0" />
              <stop offset="1" stopColor="hsl(var(--muted-foreground))" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_zaprint"
              x1="1118.08"
              y1="-149.03"
              x2="1118.08"
              y2="1248.85"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="hsl(var(--foreground))" />
              <stop offset="0.578125" stopColor="hsl(var(--primary-light))" />
              <stop offset="1" stopColor="hsl(var(--primary))" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_zaprint"
              x1="1054.08"
              y1="-213.03"
              x2="1054.08"
              y2="1184.85"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="hsl(var(--foreground))" />
              <stop offset="0.578125" stopColor="hsl(var(--primary-light))" />
              <stop offset="1" stopColor="hsl(var(--primary))" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_zaprint"
              x1="1238.08"
              y1="-293.03"
              x2="1238.08"
              y2="1104.85"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="hsl(var(--foreground))" />
              <stop offset="0.578125" stopColor="hsl(var(--primary-light))" />
              <stop offset="1" stopColor="hsl(var(--primary))" />
            </linearGradient>
            <clipPath id="clip0_zaprint">
              <rect width="1220" height="810" rx="16" fill="hsl(var(--foreground))" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <ZaPrintHeader />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 space-y-5 md:space-y-6 lg:space-y-7 mb-6 md:mb-8 lg:mb-10 max-w-md md:max-w-[540px] lg:max-w-[640px] mt-20 md:mt-[130px] lg:mt-[170px] px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-primary text-sm font-medium">Save time, skip the queue</span>
        </div>

        <h1 className="text-foreground text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight text-balance">
          Print Smarter. Skip the Queue.
        </h1>
        <p className="text-muted-foreground text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-lg mx-auto text-pretty">
          Upload your documents, choose print settings, pay online, and pick up your prints exactly when they&apos;re
          ready.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
        <Link href="/signup">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-medium text-base shadow-lg shadow-primary/25 ring-1 ring-primary/30 flex items-center gap-2">
            Start Printing
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link href="#how-it-works">
          <Button
            variant="ghost"
            className="text-foreground hover:bg-white/5 px-6 py-3 rounded-full font-medium text-base"
          >
            How It Works
          </Button>
        </Link>
      </div>
    </section>
  )
}
