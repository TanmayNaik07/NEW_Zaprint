"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { FileText, Clock, Store, CheckCircle2, XCircle, Printer, RefreshCw } from "lucide-react"
import { toast } from "sonner"

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
                // Determine if we need to fetch fresh data (e.g. if relations usage changed, but here usually just status)
                // To be safe and keep UI in sync, we can just update the fields we have, 
                // OR re-fetch if we suspect other things changed.
                // For status updates, local update is fine, but let's be robust.
                
                const updatedOrder = payload.new as Order
                
                setOrders((prev) => prev.map((order) => {
                    if (order.id === updatedOrder.id) {
                        const isNowCompleted = (updatedOrder.status === 'completed' || updatedOrder.status === 'done')
                        const wasNotCompleted = (order.status !== 'completed' && order.status !== 'done')

                        if (isNowCompleted && wasNotCompleted) {
                            toast.success(`Order #${order.id.slice(0, 8)} is completed!`)
                            playNotificationSound()
                        }
                        
                        // Merge the new data. 
                        // Note: Realtime payload doesn't include relations (shops, order_items).
                        // So we preserve the existing relations from `order` and overwrite the scalar fields from `updatedOrder`.
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
            if (status === 'SUBSCRIBED') {
                // Optional: show a small indicator or log
            }
        })
    }

    setupRealtime()

    return () => {
      if (channel) {
        console.log("Cleaning up realtime setup")
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
    <div className="space-y-4">
      <div className="flex justify-end">
          <button onClick={() => window.location.reload()} className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="w-3 h-3" /> Refresh
          </button>
      </div>
      {orders.map((order) => (
        <Card key={order.id} className="bg-white/5 border-white/10 hover:bg-white/[0.07] transition-colors">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Store className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base">{order.shops?.shop_name || "Unknown Shop"}</h3>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(order.created_at), "PPP p")}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={`border-0 gap-1.5 capitalize ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {order.status}
            </Badge>
          </CardHeader>
          
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
                {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                         <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-white/5">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium line-clamp-1">{item.file_name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="capitalize">{item.color_mode === 'bw' ? 'B&W' : 'Color'}</span>
                                    <span>•</span>
                                    <span>{item.copies} Cop{item.copies > 1 ? 'ies' : 'y'}</span>
                                </div>
                            </div>
                         </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-2">
                 <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">Order ID: {order.id}</p>
                 <p className="text-lg font-bold">₹{order.total_amount}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
