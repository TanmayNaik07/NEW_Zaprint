"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { OrdersList } from "./components/OrdersList"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [userId, setUserId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setIsLoading(false)
        return
      }

      setUserId(user.id)

      const { data: rawOrders, error: ordersError } = await supabase
        .from("orders")
        .select(`
          id, created_at, status, total_amount, user_id, receipt_number, order_number,
          payment_status, print_amount, platform_fee, platform_fee_percentage,
          razorpay_order_id, razorpay_payment_id,
          shops:shop_id (
            shop_name,
            image_url,
            location,
            phone
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
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (ordersError) {
        console.error("Error fetching orders:", ordersError)
        setError(true)
        setIsLoading(false)
        return
      }

      // Normalize the data structure
      const normalizedOrders = (rawOrders || []).map(order => ({
        ...order,
        shops: Array.isArray(order.shops) ? order.shops[0] : order.shops
      }))

      setOrders(normalizedOrders)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  if (!isLoading && !userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="font-rubik-dirt text-[#1a1408] text-2xl">Please log in to view your orders</h2>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header with distressed font style matching dashboard */}
      <div className="relative">
        <h1 className="font-rubik-dirt text-[#1a1408] text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
          My Orders
        </h1>
        <p className="text-[#6b5d45] text-sm md:text-base mt-2 tracking-wide">
          Track and manage your print requests.
        </p>

        {/* Dashed separator line */}
        <div className="mt-6 border-t-[3px] border-dashed border-[#1a1408]/70 w-full" />
      </div>

      {error && (
        <div className="text-destructive bg-destructive/10 p-4 rounded-lg">
          Unable to load orders. Please check your connection and try again.
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ticket-stub" style={{ minHeight: '120px' }}>
              <div className="ticket-scallop-left" />
              <div className="ticket-scallop-right" />
              <div className="ticket-stub-inner">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1a1408]/10" />
                  <div className="flex-1">
                    <div className="h-4 w-48 bg-[#1a1408]/10 rounded mb-2" />
                    <div className="h-3 w-32 bg-[#1a1408]/10 rounded" />
                  </div>
                  <div className="h-6 w-20 bg-[#1a1408]/10 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !error && <OrdersList initialOrders={orders} userId={userId} />
      )}
    </div>
  )
}
