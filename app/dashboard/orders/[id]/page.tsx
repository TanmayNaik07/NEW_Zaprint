
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { OrderReceiptView } from "@/components/dashboard/order-receipt-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { RetryPaymentButton } from "./retry-payment-button"

interface OrderPageProps {
  params: {
    id: string
  }
}

export default async function OrderDetailsPage({ params }: OrderPageProps) {
  const supabase = await createClient()
  const { id } = params

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch order
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id, created_at, status, total_amount, user_id, receipt_number, order_number,
      payment_status, print_amount, platform_fee, platform_fee_percentage,
      razorpay_order_id, razorpay_payment_id,
      shops:shop_id (
        id,
        shop_name,
        image_url,
        phone,
        location
      ),
      order_items (
        id,
        file_name,
        file_type,
        color_mode,
        copies,
        pages_per_sheet
      )
    `)
    .eq("id", id)
    .single()

  if (error || !order) {
    console.error("Error fetching order:", error)
    return notFound()
  }

  // Security check: ensure order belongs to user
  if (order.user_id !== user.id) {
    return notFound()
  }

  // Normalize shop data
  const normalizedOrder = {
    ...order,
    shops: Array.isArray(order.shops) ? order.shops[0] : order.shops
  }

  const needsPayment = order.status === 'pending' && order.payment_status !== 'paid'

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Order Details</h1>
      </div>

      {/* Payment Required Banner */}
      {needsPayment && (
        <div className="bg-[#fff7ed] border-2 border-[#fed7aa] rounded-sm p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#c2410c]/10 flex items-center justify-center">
              <span className="text-lg">💳</span>
            </div>
            <div>
              <h3 className="font-bold text-[#c2410c] text-sm">Payment Required</h3>
              <p className="text-xs text-[#9a3412]">Complete payment to start processing your order</p>
            </div>
          </div>
          <RetryPaymentButton
            orderId={order.id}
            shopName={normalizedOrder.shops?.shop_name || 'Print Shop'}
            totalAmount={order.total_amount}
          />
        </div>
      )}

      <div className="grid gap-6">
        <OrderReceiptView order={normalizedOrder} />
      </div>

    </div>
  )
}
