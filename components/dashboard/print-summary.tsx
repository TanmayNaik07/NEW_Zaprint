"use client"

import { usePrintStore } from "@/lib/print-store"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export function PrintSummary() {
  const { file, specs } = usePrintStore()

  // Price calculation
  const pricePerPage = specs.colorMode === "color" ? 0.15 : 0.05
  const sizeMultiplier = specs.paperSize === "a3" ? 2 : 1
  const sidesDivisor = specs.printSides === "double" ? 2 : 1
  const pages = file?.pages || 0
  const totalPages = Math.ceil(pages / sidesDivisor) * specs.copies
  const totalPrice = totalPages * pricePerPage * sizeMultiplier

  // Estimated time (mock: 30 seconds per page, minimum 2 minutes)
  const estimatedMinutes = Math.max(2, Math.ceil((totalPages * 0.5) / 1))

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] sticky top-4">
      <h2 className="text-foreground text-lg font-semibold mb-6">Order Summary</h2>

      {/* Estimated Time */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-primary font-semibold">Estimated Ready Time</span>
        </div>
        <p className="text-foreground text-2xl font-bold">{file ? `${estimatedMinutes} minutes` : "Upload a file"}</p>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Color Mode</span>
          <span className="text-foreground">{specs.colorMode === "color" ? "Color" : "Black & White"}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Paper Size</span>
          <span className="text-foreground">{specs.paperSize.toUpperCase()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Print Sides</span>
          <span className="text-foreground">{specs.printSides === "double" ? "Double-sided" : "Single-sided"}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Pages</span>
          <span className="text-foreground">{pages}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Copies</span>
          <span className="text-foreground">{specs.copies}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Cost per page</span>
          <span className="text-foreground">${(pricePerPage * sizeMultiplier).toFixed(2)}</span>
        </div>

        <div className="h-px bg-white/10 my-4" />

        <div className="flex items-center justify-between">
          <span className="text-foreground font-semibold">Total</span>
          <span className="text-foreground text-2xl font-bold">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Link href={file ? "/dashboard/checkout" : "#"}>
        <Button
          disabled={!file}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Proceed to Payment
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>

      {!file && <p className="text-muted-foreground text-xs text-center mt-3">Please upload a document first</p>}
    </div>
  )
}
