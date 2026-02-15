"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { FileText, Clock, Store, CheckCircle2, XCircle, Printer, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { MorphingCardStack } from "@/components/ui/morphing-card-stack"

interface OrderItem {
  id: string
  file_name: string
  color_mode: string
  copies: number
}

interface Shop {
  shop_name: string
  image_url: string
}

interface Order {
  id: string
  created_at: string
  status: string
  total_amount: number
  user_id: string
  shops?: Shop
  order_items?: OrderItem[]
}

interface OrdersListProps {
  initialOrders: any[]
}

export default function OrdersList({ initialOrders }: OrdersListProps) {
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
              // Fetch the new order with relations
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
                    // Preserve relations if they exist on the old object
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
          if (status === 'SUBSCRIBED') {
            // Optional: show a small indicator or log
          }
        })
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])


  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
      case "processing": return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
      case "printing": return "bg-purple-500/20 text-purple-500 hover:bg-purple-500/30"
      case "completed": return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
      case "cancelled": return "bg-red-500/20 text-red-500 hover:bg-red-500/30"
      default: return "bg-zinc-500/20 text-zinc-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />
      case "processing": return <FileText className="w-4 h-4" />
      case "printing": return <Printer className="w-4 h-4" />
      case "completed": return <CheckCircle2 className="w-4 h-4" />
      case "cancelled": return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground">No orders yet</h3>
      </div>
    )
  }

  return (
    <div className="space-y-8 flex flex-col items-center">
      <div className="w-full max-w-md flex justify-end px-4">
        <button onClick={() => window.location.reload()} className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      <div className="w-full flex justify-center pb-8">
        <MorphingCardStack
          cards={orders.map(order => ({
            id: order.id,
            title: order.shops?.shop_name || "Unknown Shop",
            description: (
              <div className="space-y-3 pt-2 w-full">
                <div className="flex justify-between items-start w-full gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-1 rounded">#{order.id.slice(0, 8)}</span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{format(new Date(order.created_at), "MMM d, h:mm a")}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0.5 h-auto border-0 gap-1 capitalize whitespace-nowrap ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                </div>

                <div className="border-t border-white/5 pt-2 flex flex-col gap-1.5">
                  <div className="flex flex-col gap-1 w-full">
                    {order.order_items?.slice(0, 2).map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-black/20 p-1.5 rounded w-full">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <FileText className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span className="truncate font-medium">{item.file_name}</span>
                        </div>
                        <span className="text-muted-foreground shrink-0 text-[10px] ml-1">{item.copies}x</span>
                      </div>
                    ))}
                    {(order.order_items?.length || 0) > 2 && (
                      <div className="text-[10px] text-muted-foreground text-center bg-white/5 rounded py-0.5">
                        +{(order.order_items?.length || 0) - 2} more items
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">Total Amount</span>
                    <span className="text-sm font-bold text-foreground">₹{order.total_amount}</span>
                  </div>
                </div>
              </div>
            ),
            icon: order.shops?.image_url ? (
              <img src={order.shops.image_url} alt={order.shops.shop_name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Store className="w-5 h-5" />
            ),
            color: order.status === 'completed' ? 'rgba(34, 197, 94, 0.1)' : undefined
          }))}
          defaultLayout="stack"
          className="w-full max-w-3xl mx-auto"
        />
      </div>
    </div>
  )
}
