
"use client"

import { motion } from "framer-motion"
import { FileText, Clock, CheckCircle, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Order {
    id: string
    created_at: string
    status: string
    total_amount: number
    order_items: {
        file_name: string
        copies: number
        pages_per_sheet: number
    }[]
}

const statusConfig: Record<string, any> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-zinc-500",
    bgColor: "bg-zinc-500/10",
    iconClass: "",
  },
  processing: {
    label: "Processing",
    icon: Loader2,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    iconClass: "animate-spin",
  },
  printing: {
      label: "Printing",
      icon: Loader2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      iconClass: "animate-spin",
  },
  ready: {
    label: "Ready",
    icon: CheckCircle,
    color: "text-primary",
    bgColor: "bg-primary/10",
    iconClass: "",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    iconClass: "",
  },
  cancelled: {
      label: "Cancelled",
      icon: CheckCircle, // XCircle
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      iconClass: ""
  }
}

export function RecentActivity({ orders }: { orders: Order[] }) {
  if (!orders || orders.length === 0) {
      return (
          <div className="space-y-4">
               <h2 className="text-foreground text-xl font-semibold">Recent Activity</h2>
               <div className="p-8 text-center text-muted-foreground bg-white/5 rounded-xl border border-white/10">
                   No recent activity.
               </div>
          </div>
      )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-xl font-semibold">Recent Activity</h2>
        <a href="/dashboard/orders" className="text-primary text-sm font-medium hover:underline">
          View all
        </a>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-muted-foreground text-xs font-medium uppercase tracking-wider px-6 py-4">
                  Document
                </th>
                <th className="text-left text-muted-foreground text-xs font-medium uppercase tracking-wider px-6 py-4 hidden sm:table-cell">
                  Details
                </th>
                <th className="text-left text-muted-foreground text-xs font-medium uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="text-right text-muted-foreground text-xs font-medium uppercase tracking-wider px-6 py-4 hidden md:table-cell">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const status = statusConfig[order.status] || statusConfig['pending']
                const item = order.order_items[0] // Just show first item
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <span className="text-foreground text-sm font-medium truncate max-w-[180px]">
                          {item?.file_name || "Unknown File"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-muted-foreground text-sm">
                        {item ? `${item.copies} copies` : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bgColor}`}>
                        <status.icon className={`w-3.5 h-3.5 ${status.color} ${status.iconClass}`} />
                        <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right hidden md:table-cell">
                      <span className="text-muted-foreground text-sm">
                          {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
