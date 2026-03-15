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
  shops?: { shop_name: string }
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
        .select("*, order_items(file_name, copies, color_mode), shops:shop_id(shop_name)")
        .order("created_at", { ascending: false })
        .limit(100)

      if (error) {
        console.error("Error fetching admin orders:", error.message || JSON.stringify(error))
      } else if (data) {
        setOrders(data as any)
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
        (o.shops?.shop_name || "").toLowerCase().includes(q)
      )
    })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 bg-[#0a1128]/5 border border-[#0a1128]/10 text-[#0a1128] px-3 py-1 rounded-full text-[10px] tracking-widest font-bold uppercase w-fit mb-2">
            <span className="w-1.5 h-1.5 bg-[#0a1128] rounded-full animate-pulse" />
            Operations
          </div>
          <h1 className="text-4xl font-black text-[#0a1128] tracking-tight uppercase leading-none">
            ORDER <span className="text-[#0a1128]/40">HISTORY</span>
          </h1>
          <p className="text-[#5b637a] font-medium text-lg">Loading orders...</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-[100px] rounded-[2rem] bg-white/50 animate-pulse border border-black/5 shadow-sm"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 bg-[#0a1128]/5 border border-[#0a1128]/10 text-[#0a1128] px-3 py-1 rounded-full text-[10px] tracking-widest font-bold uppercase w-fit mb-2">
          <span className="w-1.5 h-1.5 bg-[#0a1128] rounded-full" />
          Operations
        </div>
        <h1 className="text-4xl font-black text-[#0a1128] tracking-tight uppercase leading-none">
          ORDER <span className="text-[#0a1128]/40">HISTORY</span>
        </h1>
        <p className="text-[#5b637a] font-medium text-lg">
          {orders.length} total orders across the platform.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0a1128]/30 group-focus-within:text-[#0a1128] transition-colors" />
          <input
            type="text"
            placeholder="Search by file name, shop, or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/5 text-[#0a1128] font-bold placeholder:text-[#0a1128]/20 focus:outline-none focus:border-[#0a1128]/20 focus:bg-white transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap p-1 bg-white/50 backdrop-blur-sm rounded-2xl border border-black/5">
          {["all", "pending", "processing", "printing", "completed", "cancelled"].map(
            (s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === s
                    ? "bg-[#0a1128] text-white shadow-lg"
                    : "text-[#0a1128]/40 hover:text-[#0a1128] hover:bg-black/5"
                }`}
              >
                {s}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="rounded-[3rem] border-2 border-dashed border-black/5 bg-black/5 p-20 text-center">
          <FileText className="h-16 w-16 text-[#0a1128]/10 mx-auto mb-4" />
          <p className="text-[#0a1128] font-black uppercase tracking-tight text-xl">No orders found</p>
          <p className="text-[#5b637a] font-medium mt-1">Try changing your filters or search term</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-8 py-6 rounded-[2.5rem] border border-black/5 bg-white/80 backdrop-blur-sm hover:translate-y-[-2px] hover:shadow-2xl transition-all shadow-xl shadow-black/[0.02] relative overflow-hidden"
            >
              {/* Order Item / File */}
              <div className="md:col-span-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0a1128]/5 flex items-center justify-center shrink-0">
                  <FileText className="h-7 w-7 text-[#0a1128]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[#0a1128] font-black uppercase tracking-tight text-lg truncate leading-none">
                    {order.order_items?.[0]?.file_name || "Unknown File"}
                  </p>
                  <p className="text-[#5b637a] text-[10px] font-bold mt-1 uppercase tracking-widest">
                    ID: {order.id.slice(0, 8)}
                    {(order.order_items?.length || 0) > 1 && ` · +${(order.order_items?.length || 0) - 1} more`}
                  </p>
                </div>
              </div>

              {/* Shop Info */}
              <div className="md:col-span-3 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/5">
                  <Store className="h-4 w-4 text-amber-600" />
                </div>
                <p className="text-[#0a1128] font-black uppercase tracking-tight text-sm truncate">
                  {order.shops?.shop_name || "Zaprint Partner"}
                </p>
              </div>

              {/* Status & Amount */}
              <div className="md:col-span-2 flex flex-col items-start md:items-center">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor(
                    order.status
                  )}`}
                >
                  {statusIcon(order.status)}
                  {order.status}
                </span>
              </div>

              <div className="md:col-span-1 text-left md:text-right">
                <p className="text-[#0a1128] font-black text-lg tracking-tighter">
                  ₹{Number(order.total_amount).toLocaleString("en-IN")}
                </p>
              </div>

              {/* Date */}
              <div className="md:col-span-2 text-left md:text-right">
                <p className="text-[#5b637a] text-[10px] uppercase font-black tracking-widest leading-tight">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </p>
                <p className="text-[#5b637a]/40 text-[10px] uppercase font-black tracking-widest mt-0.5">
                  {new Date(order.created_at).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>

              {/* Hover highlight bar */}
              <div className="absolute top-0 left-0 w-1 h-full bg-[#0a1128]/5 group-hover:bg-[#0a1128] transition-colors" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
