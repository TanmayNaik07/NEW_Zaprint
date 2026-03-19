"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Payment is now handled directly in the order form via Razorpay
    // Redirect to orders page
    router.replace("/dashboard/orders")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#1a1408]/20 border-t-[#1a1408] rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Redirecting to your orders...</p>
      </div>
    </div>
  )
}
