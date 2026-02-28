"use client"

import { useRef, useEffect, useState } from "react"

export function MindfoldScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      const elementHeight = rect.height

      // Calculate progress: 0 when element enters viewport, 1 when it's fully scrolled past
      const progress = Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight)))
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Interpolate from tilted to flat
  const rotateX = 25 - scrollProgress * 25
  const scale = 0.85 + scrollProgress * 0.15
  const translateY = 80 - scrollProgress * 80

  return (
    <section ref={containerRef} className="bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <p className="text-4xl font-semibold text-[#0a1128]">
            Experience the future of
          </p>
          <p className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-[#0a1128]">
            Smart Printing
          </p>
        </div>

        {/* Scroll-driven 3D container */}
        <div
          style={{ perspective: "1200px" }}
          className="flex justify-center"
        >
          <div
            style={{
              transform: `rotateX(${rotateX}deg) scale(${scale}) translateY(${translateY}px)`,
              transition: "transform 0.1s ease-out",
              transformOrigin: "center bottom",
            }}
            className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-black/5"
          >
            <img
              src="/images/dashboard-preview.png"
              alt="Zaprint Dashboard Preview"
              className="w-full h-full rounded-2xl object-cover object-left-top"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
