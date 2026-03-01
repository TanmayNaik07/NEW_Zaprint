
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
    color: "text-[#6b5d45]",
    bgColor: "bg-[#6b5d45]/10",
    iconClass: "",
  },
  processing: {
    label: "Processing",
    icon: Loader2,
    color: "text-[#8B6914]",
    bgColor: "bg-[#8B6914]/10",
    iconClass: "animate-spin",
  },
  printing: {
    label: "Printing",
    icon: Loader2,
    color: "text-[#5a4a2a]",
    bgColor: "bg-[#5a4a2a]/10",
    iconClass: "animate-spin",
  },
  ready: {
    label: "Ready",
    icon: CheckCircle,
    color: "text-[#3a6b20]",
    bgColor: "bg-[#3a6b20]/10",
    iconClass: "",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-[#3a6b20]",
    bgColor: "bg-[#3a6b20]/10",
    iconClass: "",
  },
  cancelled: {
    label: "Cancelled",
    icon: CheckCircle,
    color: "text-[#8B2500]",
    bgColor: "bg-[#8B2500]/10",
    iconClass: ""
  }
}

export function RecentActivity({ orders }: { orders: Order[] }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="font-rubik-dirt text-[#1a1408] text-xl md:text-2xl tracking-tight">Recent Activity</h2>
        <div
          className="p-8 text-center text-[#6b5d45] bg-gradient-to-br from-[#f5e6c8] via-[#ede0c8] to-[#e8d5b0] rounded-sm shadow-[4px_4px_12px_rgba(0,0,0,0.1)]"
          style={{
            backgroundImage: `url('/images/paper-texture.png')`,
            backgroundSize: 'cover',
            backgroundBlendMode: 'multiply',
          }}
        >
          <p className="font-rubik-dirt text-lg">No recent activity.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-rubik-dirt text-[#1a1408] text-xl md:text-2xl tracking-tight">Recent Activity</h2>
        <a href="/dashboard/orders" className="text-[#3a3120] text-sm font-medium hover:underline underline-offset-4 transition-all">
          View all
        </a>
      </div>

      <div
        className="rounded-sm bg-gradient-to-br from-[#f5e6c8] via-[#ede0c8] to-[#e8d5b0] overflow-hidden shadow-[4px_4px_12px_rgba(0,0,0,0.1)]"
        style={{
          backgroundImage: `url('/images/paper-texture.png')`,
          backgroundSize: 'cover',
          backgroundBlendMode: 'multiply',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-dashed border-[#3a3120]/20">
                <th className="text-left text-[#6b5d45] text-xs font-rubik-dirt uppercase tracking-wider px-6 py-4">
                  Document
                </th>
                <th className="text-left text-[#6b5d45] text-xs font-rubik-dirt uppercase tracking-wider px-6 py-4 hidden sm:table-cell">
                  Details
                </th>
                <th className="text-left text-[#6b5d45] text-xs font-rubik-dirt uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="text-right text-[#6b5d45] text-xs font-rubik-dirt uppercase tracking-wider px-6 py-4 hidden md:table-cell">
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
                    className="border-b border-dashed border-[#3a3120]/10 last:border-0 hover:bg-[#3a3120]/[0.03] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#3a3120]/10 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-[#6b5d45]" />
                        </div>
                        <span className="text-[#1a1408] text-sm font-medium truncate max-w-[180px]">
                          {item?.file_name || "Unknown File"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-[#6b5d45] text-sm">
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
                      <span className="text-[#6b5d45] text-sm">
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
