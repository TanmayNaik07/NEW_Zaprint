"use client"

import { Printer } from "lucide-react"
import Link from "next/link"

export function MindfoldFooter() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-[#f7f6f4] text-[#0a1128] border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1 - Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <div className="bg-[#0a1128] text-white p-2 rounded-xl">
                <Printer className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-[#0a1128] leading-tight">Zaprint</span>
                <span className="text-[10px] text-[#5b637a] font-medium leading-tight">Smart Printing</span>
              </div>
            </Link>
            <p className="text-sm font-medium text-[#5b637a] leading-relaxed max-w-xs">
              Upload your documents, choose print settings, pay online, and pick up your prints when they&apos;re ready. Smart printing for everyone.
            </p>
          </div>

          {/* Column 2 - Product */}
          <div>
            <h3 className="font-bold mb-6 text-[#0a1128]">Product</h3>
            <ul className="space-y-4 text-sm font-medium text-[#5b637a]">
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleScroll(e, "#features")}
                  className="hover:text-black transition-colors block"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleScroll(e, "#pricing")}
                  className="hover:text-black transition-colors block"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleScroll(e, "#how-it-works")}
                  className="hover:text-black transition-colors block"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  onClick={(e) => handleScroll(e, "#reviews")}
                  className="hover:text-black transition-colors block"
                >
                  Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div>
            <h3 className="font-bold mb-6 text-[#0a1128]">Company</h3>
            <ul className="space-y-4 text-sm font-medium text-[#5b637a]">
              <li>
                <a href="#" className="hover:text-black transition-colors block">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors block">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors block">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Support */}
          <div>
            <h3 className="font-bold mb-6 text-[#0a1128]">Support</h3>
            <ul className="space-y-4 text-sm font-medium text-[#5b637a]">
              <li>
                <a href="#" className="hover:text-black transition-colors block">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors block">
                  Print Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors block">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-black/5 text-center font-medium text-sm text-[#5b637a]">
          © {new Date().getFullYear()} Zaprint. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
