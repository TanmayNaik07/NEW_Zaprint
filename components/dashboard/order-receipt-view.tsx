
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { Store, FileText, CheckCircle2, Clock, Printer, XCircle, RefreshCw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OrderReceiptViewProps {
  order: any // Type this properly if possible, but for now strict checking might be overkill for this snippet
}

export function OrderReceiptView({ order }: OrderReceiptViewProps) {
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-500/10 text-yellow-500"
      case "processing":
      case "printing": return "bg-blue-500/10 text-blue-500"
      case "completed": return "bg-green-500/10 text-green-500"
      case "cancelled": return "bg-red-500/10 text-red-500"
      default: return "bg-white/5 text-muted-foreground"
    }
  }

  return (
    <Card className="bg-white max-w-md mx-auto text-black overflow-hidden print:max-w-none print:shadow-none print:border-0">
        <div className="bg-zinc-950 text-white p-6 text-center print:bg-black print:text-black">
            <h2 className="text-xl font-bold uppercase tracking-widest">Zaprint Receipt</h2>
            <p className="text-zinc-400 text-sm mt-1">{format(new Date(order.created_at), "PPP p")}</p>
        </div>
        
        <CardContent className="p-6 space-y-6">
            {/* Status & ID */}
            <div className="text-center space-y-2">
                 <Badge variant="outline" className={`capitalize border-0 ${getStatusColor(order.status)}`}>
                    {order.status}
                </Badge>
                <div className="text-sm text-zinc-500">
                    Order ID: <span className="font-mono text-zinc-700">{order.order_number ? `#${order.order_number}` : order.id}</span>
                </div>
            </div>

            <Separator className="bg-zinc-200" />

            {/* Shop Details */}
            <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center">
                    <Store className="w-5 h-5 text-zinc-600" />
                </div>
                <div>
                     <p className="text-xs text-zinc-500 font-medium uppercase">Shop</p>
                     <p className="font-semibold">{order.shops?.shop_name || "Unknown Shop"}</p>
                </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
                <p className="text-xs text-zinc-500 font-medium uppercase">Order Items</p>
                {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                        <div className="flex-1">
                            <p className="font-medium text-zinc-800 line-clamp-2">{item.file_name}</p>
                            <p className="text-zinc-500 text-xs mt-0.5">
                                {item.color_mode === 'bw' ? 'B&W' : 'Color'} • {item.copies} Cop{item.copies > 1 ? 'is' : 'y'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <Separator className="bg-zinc-200" />

            {/* Total */}
            <div className="flex justify-between items-center">
                <p className="font-bold text-lg">Total Amount</p>
                <p className="font-bold text-2xl">₹{order.total_amount}</p>
            </div>

            {/* Verification Code */}
            {order.receipt_number && (
                <div className="bg-zinc-100 border-2 border-dashed border-zinc-300 rounded-xl p-4 text-center mt-4">
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2">Verification Code</p>
                    <p className="text-3xl font-mono font-bold tracking-widest text-zinc-900">{order.receipt_number}</p>
                    <p className="text-xs text-zinc-400 mt-2">Show this code to the shopkeeper</p>
                </div>
            )}
        </CardContent>
    </Card>
  )
}
