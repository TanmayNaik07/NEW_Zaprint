"use client"

import { Twitter, Github, Linkedin, Printer } from "lucide-react"
import Link from "next/link"

export function ZaprintFooter() {
  return (
    <footer className="w-full max-w-[1320px] mx-auto px-5 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0 py-10 md:py-16">
      {/* Left Section */}
      <div className="flex flex-col justify-start items-start gap-6 p-4 md:p-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Printer className="w-5 h-5 text-primary" />
          </div>
          <span className="text-foreground text-xl font-semibold">Zaprint</span>
        </Link>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-xs">
          Print smarter, skip the queue. Your documents, ready when you are.
        </p>
        <div className="flex justify-start items-start gap-4">
          <a
            href="#"
            aria-label="Twitter"
            className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
          >
            <Twitter className="w-full h-full" />
          </a>
          <a
            href="#"
            aria-label="GitHub"
            className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="w-full h-full" />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
          >
            <Linkedin className="w-full h-full" />
          </a>
        </div>
      </div>

      {/* Right Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 p-4 md:p-8 w-full md:w-auto">
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-sm font-medium leading-5">Product</h3>
          <div className="flex flex-col justify-end items-start gap-2">
            <Link
              href="#features-section"
              className="text-foreground text-sm font-normal leading-5 hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing-section"
              className="text-foreground text-sm font-normal leading-5 hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#how-it-works"
              className="text-foreground text-sm font-normal leading-5 hover:text-primary transition-colors"
            >
              How It Works
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-sm font-medium leading-5">Company</h3>
          <div className="flex flex-col justify-center items-start gap-2">
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:text-primary transition-colors">
              About Us
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:text-primary transition-colors">
              Contact
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:text-primary transition-colors">
              Careers
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-sm font-medium leading-5">Legal</h3>
          <div className="flex flex-col justify-center items-start gap-2">
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:text-primary transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
