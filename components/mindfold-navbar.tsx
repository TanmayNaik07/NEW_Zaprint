"use client"

import type React from "react"
import { Printer, Menu, X } from "lucide-react"
import Link from "next/link"
import { LoadingLink } from "@/components/ui/loading-link"
import { useState, useEffect } from "react"

export function MindfoldNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Reviews", href: "#reviews" },
    { name: "Pricing", href: "#pricing" },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileOpen(false)
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4">
      <nav
        className={`max-w-5xl mx-auto bg-white/95 backdrop-blur-lg border border-black/5 shadow-sm rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300 ${scrolled ? "shadow-md" : ""
          }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-[#0a1128] text-white p-2 rounded-xl">
            <Printer className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#0a1128] leading-tight">Zaprint</span>
            <span className="text-[10px] text-[#5b637a] font-medium leading-tight">Smart Printing</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className="text-sm font-medium text-[#5b637a] hover:text-[#0a1128] transition-colors relative"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right Auth Buttons */}
        <div className="flex items-center gap-3">
          <LoadingLink href="/login" className="hidden sm:block">
            <span className="text-sm font-medium text-[#5b637a] hover:text-[#0a1128] transition-colors cursor-pointer">
              Log In
            </span>
          </LoadingLink>
          <LoadingLink href="/signup">
            <span className="text-sm font-semibold bg-black/5 text-[#0a1128] border border-black/10 px-5 py-2.5 rounded-full hover:bg-[#0a1128] hover:text-white transition-colors cursor-pointer inline-block">
              Get Started
            </span>
          </LoadingLink>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden ml-1 p-2 text-[#0a1128]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 max-w-5xl mx-auto bg-white/95 backdrop-blur-lg border border-black/5 shadow-lg rounded-3xl p-6 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className="text-base font-medium text-[#5b637a] hover:text-[#0a1128] transition-colors py-2"
              >
                {item.name}
              </a>
            ))}
            <hr className="border-black/5" />
            <LoadingLink href="/login">
              <span className="text-base font-medium text-[#5b637a] hover:text-[#0a1128] transition-colors py-2 block">
                Log In
              </span>
            </LoadingLink>
            <LoadingLink href="/signup">
              <span className="text-sm font-semibold bg-[#0a1128] text-white px-5 py-3 rounded-full hover:bg-black transition-colors cursor-pointer inline-block text-center w-full">
                Get Started
              </span>
            </LoadingLink>
          </div>
        </div>
      )}
    </header>
  )
}
