"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard } from "lucide-react"
import { toast } from "sonner"

interface RetryPaymentButtonProps {
  orderId: string
  shopName: string
  totalAmount: number
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function RetryPaymentButton({ orderId, shopName, totalAmount }: RetryPaymentButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)

    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please check your internet connection.")
        setLoading(false)
        return
      }

      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment order')
      }

      const options: RazorpayOptions = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Zaprint",
        description: `Print Order at ${shopName}`,
        order_id: data.orderId,
        handler: async (paymentResponse) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                order_id: orderId,
              }),
            })

            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              toast.success("Payment successful! Your order is being processed.")
              router.refresh()
            } else {
              toast.error("Payment verification failed. Please contact support.")
            }
          } catch {
            toast.error("Payment verification failed. Please contact support.")
          }
          setLoading(false)
        },
        theme: {
          color: "#1a1408",
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment was cancelled. You can retry anytime.")
            setLoading(false)
          },
          confirm_close: true,
        },
      }

      const rzp = new window.Razorpay!(options)
      rzp.on('payment.failed', () => {
        toast.error("Payment failed. Please try again.")
        setLoading(false)
      })
      rzp.open()

    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.message || "Payment initiation failed")
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className="w-full h-12 text-sm font-black tracking-widest uppercase bg-gradient-to-br from-[#c2410c] to-[#9a3412] hover:from-[#9a3412] hover:to-[#7c2d12] text-white rounded-sm shadow-lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Opening Payment...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay ₹{totalAmount.toFixed(2)} Now
        </>
      )}
    </Button>
  )
}
