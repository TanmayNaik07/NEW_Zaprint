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
        <h2 className="text-2xl font-semibold">Please log in to view your orders</h2>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-[#0a1128] text-2xl md:text-3xl font-semibold mb-2">My Orders</h1>
        <p className="text-[#5b637a]">Track and manage your print requests.</p>
      </div>

      {error && (
        <div className="text-destructive bg-destructive/10 p-4 rounded-lg">
          Unable to load orders. Please check your connection and try again.
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-2xl border border-black/5 bg-white/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-black/5" />
              <div className="flex-1">
                <div className="h-4 w-48 bg-black/5 rounded mb-2" />
                <div className="h-3 w-32 bg-black/5 rounded" />
              </div>
              <div className="h-6 w-20 bg-black/5 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        !error && <OrdersList initialOrders={orders} userId={userId} />
      )}
    </div>
  )
}
