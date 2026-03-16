
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
          className="relative p-8 text-center text-[#6b5d45] rounded-[2px] overflow-visible"
          style={{
            backgroundImage: `url('/images/new-paper.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '2px 3px 10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          {/* Masking tape at top-left corner */}
          <img
            src="/images/tape.svg"
            alt=""
            className="absolute top-0 left-0 w-14 h-14 object-contain opacity-90 drop-shadow-sm pointer-events-none z-20"
            style={{ transform: 'rotate(-35deg) translateY(-50%) translateX(-30%)' }}
          />
          {/* Masking tape at top-right corner */}
          <img
            src="/images/tape.svg"
            alt=""
            className="absolute top-0 right-2 w-14 h-14 object-contain opacity-90 drop-shadow-sm rotate-[25deg] pointer-events-none z-20"
            style={{ transform: 'rotate(25deg) translateY(-40%)' }}
          />
          <p className="font-rubik-dirt text-lg relative z-10">No recent activity.</p>
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
        className="rounded-[2px] overflow-visible relative"
        style={{
          backgroundImage: `url('/images/new-paper.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '2px 3px 10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        {/* Masking tape at top-left corner */}
        <img
          src="/images/tape.svg"
          alt=""
          className="absolute top-0 left-0 w-8 h-8 md:w-14 md:h-14 object-contain opacity-90 drop-shadow-sm pointer-events-none z-20"
          style={{ transform: 'rotate(-35deg) translateY(-40%) translateX(-20%)' }}
        />
        {/* Masking tape at top-right corner - matching the design PNG */}
        <img
          src="/images/tape.svg"
          alt=""
          className="absolute top-0 right-2 w-8 h-8 md:w-14 md:h-14 object-contain opacity-90 drop-shadow-sm pointer-events-none z-20"
          style={{ transform: 'rotate(25deg) translateY(-30%)' }}
        />

        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#0a1128] text-white">
                <th className="text-left text-[10px] md:text-xs font-rubik-dirt uppercase tracking-widest px-4 md:px-6 py-3 min-w-[140px]">
                  Document
                </th>
                <th className="text-left text-[10px] md:text-xs font-rubik-dirt uppercase tracking-widest px-4 md:px-6 py-3 hidden sm:table-cell">
                  Details
                </th>
                <th className="text-left text-[10px] md:text-xs font-rubik-dirt uppercase tracking-widest px-4 md:px-6 py-3 min-w-[100px]">
                  Status
                </th>
                <th className="text-right text-[10px] md:text-xs font-rubik-dirt uppercase tracking-widest px-4 md:px-6 py-3 hidden md:table-cell">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-[#3a3120]/10">
              {orders.map((order, index) => {
                const status = statusConfig[order.status] || statusConfig['pending']
                const item = order.order_items[0] // Just show first item
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-black/[0.02] transition-colors"
                  >
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#3a3120]/10 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 md:w-5 md:h-5 text-[#6b5d45]" />
                        </div>
                        <span className="text-[#1a1408] text-sm font-medium truncate max-w-[120px] md:max-w-[200px]">
                          {item?.file_name || "Unknown File"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                      <span className="text-[#6b5d45] text-xs md:text-sm">
                        {item ? `${item.copies} copies` : "-"}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bgColor}`}>
                        <status.icon className={`w-3 h-3 md:w-3.5 md:h-3.5 ${status.color} ${status.iconClass}`} />
                        <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wide ${status.color}`}>{status.label}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right hidden md:table-cell">
                      <span className="text-[#6b5d45] text-xs md:text-sm">
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
