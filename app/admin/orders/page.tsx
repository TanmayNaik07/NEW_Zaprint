"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  FileText,
  Search,
  Store,
  Clock,
  CheckCircle2,
  XCircle,
  Printer,
  Loader2
} from "lucide-react"

interface Order {
  id: string
  user_id: string
  shop_id: string
  status: string
  total_amount: number
  created_at: string
  updated_at: string
  order_items?: { file_name: string; copies: number; color_mode: string }[]
  shops?: { name: string }
  profiles?: { full_name: string; email: string }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const supabase = createClient()

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(file_name, copies, color_mode), shops(name)")
        .order("created_at", { ascending: false })
        .limit(100)

      if (!error && data) {
        setOrders(data)
      }
      setIsLoading(false)
    }
    fetchOrders()
  }, [])

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />
      case "pending":
        return <Clock className="h-4 w-4 text-orange-400" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-400" />
      case "printing":
        return <Printer className="h-4 w-4 text-violet-400" />
      default:
        return <Clock className="h-4 w-4 text-white/40" />
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "pending":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "processing":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "printing":
        return "bg-violet-500/10 text-violet-400 border-violet-500/20"
      default:
        return "bg-white/5 text-white/40 border-white/10"
    }
  }

  const filtered = orders
    .filter((o) => statusFilter === "all" || o.status === statusFilter)
    .filter((o) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        o.id.toLowerCase().includes(q) ||
        o.order_items?.some((item) =>
          item.file_name.toLowerCase().includes(q)
        ) ||
        (o.shops?.name || "").toLowerCase().includes(q)
      )
    })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white">All Orders</h1>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-[80px] rounded-2xl bg-white/5 animate-pulse border border-white/5"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">All Orders</h1>
        <p className="text-white/40 mt-2">
          {orders.length} total orders across all users
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by file name, shop, or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "processing", "printing", "completed", "cancelled"].map(
            (s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                  statusFilter === s
                    ? "bg-white/15 text-white border border-white/20"
                    : "bg-white/5 text-white/50 border border-white/5 hover:bg-white/10"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <FileText className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No orders found</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-white/40 text-xs font-medium uppercase tracking-wider">
            <div className="col-span-3">File</div>
            <div className="col-span-2">Shop</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-3">Date</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/5">
            {filtered.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-white/[0.02] transition"
              >
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {order.order_items?.[0]?.file_name || "Unknown File"}
                    </p>
                    {(order.order_items?.length || 0) > 1 && (
                      <p className="text-white/30 text-xs">
                        +{(order.order_items?.length || 0) - 1} more files
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-span-2 flex items-center">
                  <div className="flex items-center gap-2">
                    <Store className="h-3.5 w-3.5 text-white/30 shrink-0" />
                    <p className="text-white/60 text-sm truncate">
                      {order.shops?.name || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="col-span-2 flex items-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor(
                      order.status
                    )}`}
                  >
                    {statusIcon(order.status)}
                    {order.status}
                  </span>
                </div>

                <div className="col-span-2 flex items-center">
                  <p className="text-white font-medium text-sm">
                    ₹{Number(order.total_amount).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="col-span-3 flex items-center">
                  <p className="text-white/40 text-sm">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
