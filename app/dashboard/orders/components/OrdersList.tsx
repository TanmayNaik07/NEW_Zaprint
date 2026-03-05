"use client"

import { useState, useEffect } from "react"
import { type RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { FileText, Clock, Store, CheckCircle2, XCircle, Printer, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export interface OrderItem {
  id: string
  file_name: string
  file_type?: string
  color_mode: string
  copies: number
  pages_per_sheet?: number
}

export interface Shop {
  shop_name: string
  image_url: string
  location?: string
  phone?: string
}

export interface Order {
  id: string
  created_at: string
  status: string
  total_amount: number
  user_id: string
  shops?: Shop
  order_items?: OrderItem[]
  receipt_number?: string
  order_number?: number
}

interface OrdersListProps {
  initialOrders: Order[]
  userId: string
}

export function OrdersList({ initialOrders, userId }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const supabase = createClient()

  const playNotificationSound = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3")
    audio.volume = 0.5
    audio.play().catch(e => console.error("Error playing sound:", e))
  }

  // Handle Realtime Updates
  useEffect(() => {
    let channel: any

    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      console.log(`OrdersList: Setting up realtime for user ${user.id}`)

      channel = supabase
        .channel('orders-realtime-main')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${user.id}`,
          },
          async (payload) => {
            console.log('Realtime change received:', payload)

            if (payload.eventType === 'INSERT') {
              const { data: newOrder, error } = await supabase
                .from('orders')
                .select(`
                        *,
                        shops (
                            shop_name,
                            image_url
                        ),
                        order_items (
                            *
                        )
                    `)
                .eq('id', payload.new.id)
                .single()

              if (newOrder && !error) {
                setOrders((prev) => [newOrder, ...prev])
                toast.success("New order received!")
                playNotificationSound()
              }
            } else if (payload.eventType === 'UPDATE') {
              const updatedOrder = payload.new as Order

              setOrders((prev) => prev.map((order) => {
                if (order.id === updatedOrder.id) {
                  const isNowCompleted = (updatedOrder.status === 'completed' || updatedOrder.status === 'done')
                  const wasNotCompleted = (order.status !== 'completed' && order.status !== 'done')

                  if (isNowCompleted && wasNotCompleted) {
                    toast.success(`Order #${order.id.slice(0, 8)} is completed!`)
                    playNotificationSound()
                  }

                  return {
                    ...order,
                    ...updatedOrder,
                    shops: order.shops,
                    order_items: order.order_items
                  }
                }
                return order
              }))
            } else if (payload.eventType === 'DELETE') {
              setOrders((prev) => prev.filter(order => order.id !== payload.old.id))
            }
          }
        )
        .subscribe((status) => {
          console.log(`Realtime subscription status:`, status)
        })
    }

    setupRealtime()

    return () => {
      if (channel) {
        console.log("Cleaning up realtime setup")
        supabase.removeChannel(channel)
      }
    }
  }, [userId])


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-[#f5e6c8] text-[#8B6914] border-[#d4b96a]"
      case "processing":
      case "printing":
        return "bg-[#dce8f5] text-[#2563EB] border-[#93b4e0]"
      case "completed":
        return "bg-[#d5f0db] text-[#166534] border-[#86d99a]"
      case "cancelled":
        return "bg-[#fde2e2] text-[#991B1B] border-[#f5a3a3]"
      default:
        return "bg-[#ece9e4] text-[#5b637a] border-[#c9c5be]"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-3.5 h-3.5" />
      case "processing":
      case "printing":
        return <Printer className="w-3.5 h-3.5" />
      case "completed":
        return <CheckCircle2 className="w-3.5 h-3.5" />
      case "cancelled":
        return <XCircle className="w-3.5 h-3.5" />
      default:
        return <RefreshCw className="w-3.5 h-3.5" />
    }
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="ticket-stub" style={{ minHeight: '160px' }}>
        <div className="ticket-scallop-left" />
        <div className="ticket-scallop-right" />
        <div className="ticket-stub-inner flex flex-col items-center justify-center py-10">
          <FileText className="w-12 h-12 text-[#6b5d45]/40 mx-auto mb-4" />
          <h3 className="font-rubik-dirt text-[#1a1408] text-lg">No orders yet</h3>
          <p className="text-[#6b5d45] text-sm mt-1">Your print orders will appear here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => window.location.reload()} className="text-xs flex items-center gap-1 text-[#6b5d45] hover:text-[#1a1408] transition-colors font-medium tracking-wide uppercase">
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>
      {orders.map((order) => (
        <div key={order.id} className="ticket-stub group transition-shadow duration-300 hover:shadow-[4px_4px_16px_rgba(0,0,0,0.12)]">
          {/* Scalloped edge overlays */}
          <div className="ticket-scallop-left" />
          <div className="ticket-scallop-right" />

          <div className="ticket-stub-inner">
            {/* Header row: Shop name + Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f5e6c8] border border-[#d4c5a0] flex items-center justify-center">
                  <Store className="w-5 h-5 text-[#3a3120]" />
                </div>
                <div>
                  <h3 className="font-rubik-dirt text-[#1a1408] text-base md:text-lg leading-tight">
                    {order.shops?.shop_name || "Unknown Shop"}
                  </h3>
                  <p className="text-xs text-[#6b5d45] mt-0.5">
                    {format(new Date(order.created_at), "PPP p")}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={`border gap-1.5 capitalize text-xs font-semibold px-3 py-1 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {order.status}
              </Badge>
            </div>

            {/* Dashed divider */}
            <div className="border-t-[2px] border-dashed border-[#1a1408]/30 my-3" />

            {/* Order items */}
            <div className="space-y-2">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-[#f7f6f4] border border-[#ece9e4] p-3 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-white border border-[#dbd7d1]">
                      <FileText className="w-4 h-4 text-[#3a3120]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1a1408] line-clamp-1">{item.file_name}</p>
                      <div className="flex items-center gap-2 text-xs text-[#6b5d45]">
                        <span className="capitalize">{item.color_mode === 'bw' ? 'B&W' : 'Color'}</span>
                        <span>•</span>
                        <span>{item.copies} Cop{item.copies > 1 ? 'ies' : 'y'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dashed divider */}
            <div className="border-t-[2px] border-dashed border-[#1a1408]/30 my-3" />

            {/* Footer: Order ID + Total */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#6b5d45] font-mono truncate max-w-[200px]">
                Order ID: {order.id.slice(0, 8)}...
              </p>
              <p className="font-rubik-dirt text-[#1a1408] text-xl md:text-2xl">₹{order.total_amount}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
