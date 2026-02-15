"use client"

import { useState, useEffect } from "react"
import { type RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { FileText, Clock, Store, CheckCircle2, XCircle, Printer, RefreshCw } from "lucide-react"
import { toast } from "sonner"
// import { OrderReceipt } from "./OrderReceipt" // Removed as we navigate to details page now
import Link from "next/link"

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
  order_number?: number // New field
}

interface OrdersListProps {
  initialOrders: Order[]
  userId: string
}

export function OrdersList({ initialOrders, userId }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const supabase = createClient()



  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`,
        },
        async (payload: RealtimePostgresChangesPayload<Order>) => {
          console.log('Realtime update:', payload)
          
          if (payload.eventType === 'INSERT') {
            // Fetch the new order with all relations
             const { data: newOrder, error } = await supabase
              .from('orders')
              .select(`
                *,
                order_number,
                shops:shop_id(shop_name, image_url, location, phone),
                order_items(*)
              `)
              .eq('id', payload.new.id)
              .single()

            if (!error && newOrder) {
                // Extract the first shop from the array if it exists
                const normalizedOrder: Order = {
                  ...newOrder,
                  shops: Array.isArray(newOrder.shops) ? newOrder.shops[0] : newOrder.shops
                }
                setOrders((current) => [normalizedOrder, ...current])
                toast.success('Check your order history', {
                    description: 'New order has been placed successfully!',
                })
            }
          } 
          else if (payload.eventType === 'UPDATE') {
              // Fetch fresh data for the updated order to ensure all relations and fields are up to date
              const { data: updatedOrder, error } = await supabase
              .from('orders')
              .select(`
                *,
                order_number,
                shops:shop_id(shop_name, image_url, location, phone),
                order_items(*)
              `)
              .eq('id', payload.new.id)
              .single()

             if (!error && updatedOrder) {
                 // Normalize the shop data from array to object
                 const normalizedOrder: Order = {
                   ...updatedOrder,
                   shops: Array.isArray(updatedOrder.shops) ? updatedOrder.shops[0] : updatedOrder.shops
                 }
                 
                 setOrders((current) =>
                    current.map((order) => {
                        if (order.id === payload.new.id) {
                            const statusChanged = order.status !== payload.new.status
                            if (statusChanged) {
                                if (payload.new.status === 'completed') {
                                     toast.success('Order Completed!', {
                                         description: `Order #${payload.new.id.slice(0, 8)} is ready for pickup/delivery.`,
                                         icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
                                     })
                                     // Play simple sound or just toast
                                 } else {
                                      toast.info('Order Update', {
                                         description: `Order status changed to ${payload.new.status}`,
                                     })
                                 }
                             }
                             return normalizedOrder
                        }
                        return order
                    })
                  )
             }
          } 
          else if (payload.eventType === 'DELETE') {
             setOrders((current) => current.filter((order) => order.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "processing":
      case "printing":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-white/5 text-muted-foreground"
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

  if (orders.length === 0) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium">No orders yet</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Start by placing your first print order
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <RefreshCw className="w-3 h-3" />
            <span>Updates automatically</span>
        </div>
      {orders.map((order) => (
        <Link href={`/dashboard/orders/${order.id}`} key={order.id} className="block group">
            <Card className="bg-white/5 border-white/10 group-hover:bg-white/[0.07] transition-all cursor-pointer">
            <CardHeader className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5">
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
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <Badge variant="outline" className={`border-0 gap-1.5 capitalize ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                    </Badge>
                </div>
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
                    <div className="flex flex-col">
                        <p className="text-xs text-muted-foreground font-mono">
                          Order ID: {order.order_number ? `#${order.order_number}` : order.id.slice(0, 8)}
                        </p>
                        {order.receipt_number && (
                            <p className="text-xs text-primary font-mono mt-1">Receipt #: {order.receipt_number}</p>
                        )}
                    </div>
                    <p className="text-lg font-bold">₹{order.total_amount}</p>
                </div>
            </CardContent>
            </Card>
        </Link>
      ))}
    </div>
  )
}
