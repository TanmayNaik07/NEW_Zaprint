"use client"

import { useState } from "react"
import { usePrintStore } from "@/lib/print-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, Lock, CheckCircle, Clock, FileText, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function CheckoutPage() {
  const router = useRouter()
  const { file, specs, reset } = usePrintStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Price calculation
  const pricePerPage = specs.colorMode === "color" ? 0.15 : 0.05
  const sizeMultiplier = specs.paperSize === "a3" ? 2 : 1
  const sidesDivisor = specs.printSides === "double" ? 2 : 1
  const pages = file?.pages || 0
  const totalPages = Math.ceil(pages / sidesDivisor) * specs.copies
  const totalPrice = totalPages * pricePerPage * sizeMultiplier

  // Estimated time
  const estimatedMinutes = Math.max(2, Math.ceil((totalPages * 0.5) / 1))

  const handlePayment = async () => {
    setIsProcessing(true)
    // Mock payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setIsComplete(true)
  }

  const handleNewPrint = () => {
    reset()
    router.push("/dashboard/print")
  }

  if (!file) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-muted-foreground mb-4">No print job found. Please upload a document first.</p>
        <Link href="/dashboard/print">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
            Go to Print Page
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Back Button */}
            <Link
              href="/dashboard/print"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Print
            </Link>

            <h1 className="text-foreground text-2xl md:text-3xl font-semibold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Form */}
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-foreground text-lg font-semibold">Payment Details</h2>
                </div>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <Label className="text-foreground text-sm font-medium">Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      className="h-11 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm font-medium">Expiry Date</Label>
                      <Input
                        placeholder="MM/YY"
                        className="h-11 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm font-medium">CVV</Label>
                      <Input
                        placeholder="123"
                        className="h-11 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground text-sm font-medium">Cardholder Name</Label>
                    <Input
                      placeholder="John Doe"
                      className="h-11 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground text-xs pt-2">
                    <Lock className="w-3 h-3" />
                    <span>Your payment information is encrypted and secure</span>
                  </div>

                  <Button
                    type="button"
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium shadow-lg shadow-primary/25 mt-4"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay $${totalPrice.toFixed(2)}`
                    )}
                  </Button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <h2 className="text-foreground text-lg font-semibold mb-6">Order Summary</h2>

                {/* File Info */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium truncate">{file.name}</p>
                    <p className="text-muted-foreground text-sm">{file.pages} pages</p>
                  </div>
                </div>

                {/* Specifications */}
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
                    <span className="text-foreground">
                      {specs.printSides === "double" ? "Double-sided" : "Single-sided"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Copies</span>
                    <span className="text-foreground">{specs.copies}</span>
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-primary font-semibold">Estimated Ready Time</span>
                  </div>
                  <p className="text-foreground text-2xl font-bold">{estimatedMinutes} minutes</p>
                </div>

                <div className="h-px bg-white/10 mb-4" />

                <div className="flex items-center justify-between">
                  <span className="text-foreground font-semibold">Total</span>
                  <span className="text-foreground text-2xl font-bold">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <h1 className="text-foreground text-2xl md:text-3xl font-semibold mb-4">Payment Successful!</h1>

            <p className="text-muted-foreground text-lg mb-8">
              Your print will be ready in <span className="text-primary font-semibold">{estimatedMinutes} minutes</span>
              .
              <br />
              Please arrive for pickup.
            </p>

            <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold">Estimated Pickup Time</span>
              </div>
              <p className="text-foreground text-3xl font-bold">
                {new Date(Date.now() + estimatedMinutes * 60000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={handleNewPrint}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
              >
                Start New Print
              </Button>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-foreground hover:bg-white/5 rounded-full px-8">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
