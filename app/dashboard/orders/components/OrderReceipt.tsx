"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { Printer, MapPin, Phone, FileText, Receipt, CheckCircle2 } from "lucide-react"
import type { Order } from "./OrdersList"
import { Separator } from "@/components/ui/separator"

interface OrderReceiptProps {
  order: Order
}

export function OrderReceipt({ order }: OrderReceiptProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-white/5 border-white/10 hover:bg-white/10">
          <Receipt className="w-4 h-4" />
          View Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-zinc-950 border-white/10 text-foreground">
        <DialogHeader>
            <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
            </div>
          <DialogTitle className="text-center text-xl font-bold">Order Receipt</DialogTitle>
          <p className="text-center text-muted-foreground text-sm">
            Please show this receipt at the shop
          </p>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6 py-4">
                {/* Order Details */}
                <div className="space-y-2 text-center">
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono text-lg font-semibold tracking-wider">{order.id.split('-')[0].toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">{order.id}</p>
                </div>

                <Separator className="bg-white/10" />

                {/* Shop Details */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Printer className="w-4 h-4" /> Shop Details
                    </h4>
                    <div className="bg-white/5 p-4 rounded-lg space-y-2">
                        <p className="font-semibold">{order.shops?.shop_name || "Unknown Shop"}</p>
                        {order.shops?.location && (
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>{order.shops.location}</span>
                            </div>
                        )}
                        {order.shops?.phone && (
                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 shrink-0" />
                                <span>{order.shops.phone}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items */}
                 <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Order Items
                    </h4>
                    <div className="space-y-2">
                        {order.order_items?.map((item) => (
                            <div key={item.id} className="flex justify-between items-start bg-white/5 p-3 rounded-lg text-sm">
                                <div>
                                    <p className="font-medium line-clamp-1">{item.file_name}</p>
                                    <p className="text-muted-foreground text-xs mt-1">
                                        {item.color_mode === 'bw' ? 'Black & White' : 'Color'} • {item.copies} Cop{item.copies > 1 ? 'ies' : 'y'}
                                        {item.pages_per_sheet && item.pages_per_sheet > 1 ? ` • ${item.pages_per_sheet} pgs/sheet` : ''}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="bg-white/10" />
                
                {/* Total */}
                <div className="flex items-center justify-between pt-2">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="text-2xl font-bold">₹{order.total_amount}</span>
                </div>

                {/* Date */}
                <p className="text-center text-xs text-muted-foreground pt-4">
                    Order placed on {format(new Date(order.created_at), "PPP p")}
                </p>
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
