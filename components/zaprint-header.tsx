"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Printer } from "lucide-react"
import Link from "next/link"
import { LoadingLink } from "@/components/ui/loading-link"

export function ZaprintHeader() {
  const navItems = [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Features", href: "#features-section" },
    { name: "Pricing", href: "#pricing-section" },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0a1128] flex items-center justify-center shrink-0 p-1.5">
               <img src="/Zaprint_Logo.png" alt="Zaprint Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-foreground text-xl font-semibold">Zaprint</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-full font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LoadingLink href="/login" className="hidden md:block">
            <Button variant="ghost" className="text-foreground hover:bg-white/5 px-5 py-2 rounded-full font-medium">
              Login
            </Button>
          </LoadingLink>
          <LoadingLink href="/signup" className="hidden md:block">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-full font-medium shadow-lg shadow-primary/20">
              Start Printing
            </Button>
          </LoadingLink>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-7 w-7" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-background border-t border-border text-foreground">
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-semibold text-foreground">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)}
                    className="text-muted-foreground hover:text-foreground justify-start text-lg py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                <LoadingLink href="/login" className="w-full mt-2">
                  <Button
                    variant="ghost"
                    className="w-full text-foreground hover:bg-white/5 py-2 rounded-full font-medium"
                  >
                    Login
                  </Button>
                </LoadingLink>
                <LoadingLink href="/signup" className="w-full">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-full font-medium">
                    Start Printing
                  </Button>
                </LoadingLink>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
