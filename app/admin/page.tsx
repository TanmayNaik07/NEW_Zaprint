"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  ShoppingCart,
  Store,
  Users,
  IndianRupee,
  TrendingUp,
  MessageSquareText,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface StatsData {
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  cancelledOrders: number
  totalShops: number
  totalUsers: number
  totalRevenue: number
  totalFeedback: number
}

interface ChartDataPoint {
  date: string
  orders: number
  revenue: number
}

interface ShopPerformance {
  name: string
  orders: number
  revenue: number
}

export default function AdminOverview() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [shopPerformance, setShopPerformance] = useState<ShopPerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchStats()

    // Realtime subscription for orders
    const ordersChannel = supabase
      .channel('overview-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async (payload) => {
          console.log('Overview: Order change received:', payload)
          // For simplicity, we can just re-fetch everything to keep charts in sync
          // but for a truly "fast" feel, we'd update specific stats local state.
          // Let's re-fetch to ensure data integrity for complex charts.
          fetchStats()
        }
      )
      .subscribe()

    // Realtime subscription for feedback
    const feedbackChannel = supabase
      .channel('overview-feedback-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'feedback' },
        () => fetchStats()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(feedbackChannel)
    }
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats")
      if (!res.ok) throw new Error("Failed to fetch stats")
      const data = await res.json()
      setStats(data.stats)
      setChartData(data.chartData)
      setRecentOrders(data.recentOrders)
      setShopPerformance(data.shopPerformance)
    } catch (err) {
      console.error("Error fetching admin stats:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = stats
    ? [
        {
          label: "Total Revenue",
          value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
          icon: IndianRupee,
          color: "from-emerald-500/20 to-emerald-600/5",
          iconColor: "text-emerald-400",
          borderColor: "border-emerald-500/20",
        },
        {
          label: "Total Orders",
          value: stats.totalOrders.toLocaleString(),
          icon: ShoppingCart,
          color: "from-blue-500/20 to-blue-600/5",
          iconColor: "text-blue-400",
          borderColor: "border-blue-500/20",
        },
        {
          label: "Total Users",
          value: stats.totalUsers.toLocaleString(),
          icon: Users,
          color: "from-violet-500/20 to-violet-600/5",
          iconColor: "text-violet-400",
          borderColor: "border-violet-500/20",
        },
        {
          label: "Print Shops",
          value: stats.totalShops.toLocaleString(),
          icon: Store,
          color: "from-amber-500/20 to-amber-600/5",
          iconColor: "text-amber-400",
          borderColor: "border-amber-500/20",
        },
        {
          label: "Completed",
          value: stats.completedOrders.toLocaleString(),
          icon: CheckCircle2,
          color: "from-green-500/20 to-green-600/5",
          iconColor: "text-green-400",
          borderColor: "border-green-500/20",
        },
        {
          label: "Pending",
          value: stats.pendingOrders.toLocaleString(),
          icon: Clock,
          color: "from-orange-500/20 to-orange-600/5",
          iconColor: "text-orange-400",
          borderColor: "border-orange-500/20",
        },
        {
          label: "Cancelled",
          value: stats.cancelledOrders.toLocaleString(),
          icon: XCircle,
          color: "from-red-500/20 to-red-600/5",
          iconColor: "text-red-400",
          borderColor: "border-red-500/20",
        },
        {
          label: "Feedback",
          value: stats.totalFeedback.toLocaleString(),
          icon: MessageSquareText,
          color: "from-pink-500/20 to-pink-600/5",
          iconColor: "text-pink-400",
          borderColor: "border-pink-500/20",
        },
      ]
    : []

  const pieData = stats
    ? [
        { name: "Completed", value: stats.completedOrders, color: "#22c55e" },
        { name: "Pending", value: stats.pendingOrders, color: "#f97316" },
        { name: "Cancelled", value: stats.cancelledOrders, color: "#ef4444" },
        {
          name: "Processing",
          value:
            stats.totalOrders -
            stats.completedOrders -
            stats.pendingOrders -
            stats.cancelledOrders,
          color: "#3b82f6",
        },
      ].filter((d) => d.value > 0)
    : []

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 bg-[#0a1128]/5 border border-[#0a1128]/10 text-[#0a1128] px-3 py-1 rounded-full text-[10px] tracking-widest font-bold uppercase w-fit mb-2">
            <span className="w-1.5 h-1.5 bg-[#0a1128] rounded-full animate-pulse" />
            Analytics
          </div>
          <h1 className="text-4xl font-black text-[#0a1128] tracking-tight uppercase leading-none">
            DASHBOARD <span className="text-[#0a1128]/40">OVERVIEW</span>
          </h1>
          <p className="text-[#5b637a] font-medium text-lg">Loading analytics data...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-[140px] rounded-[2rem] bg-white/50 animate-pulse border border-black/5 shadow-sm"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 bg-[#0a1128]/5 border border-[#0a1128]/10 text-[#0a1128] px-3 py-1 rounded-full text-[10px] tracking-widest font-bold uppercase w-fit mb-2">
          <span className="w-1.5 h-1.5 bg-[#0a1128] rounded-full" />
          Analytics
        </div>
        <h1 className="text-4xl font-black text-[#0a1128] tracking-tight uppercase leading-none">
          DASHBOARD <span className="text-[#0a1128]/40">OVERVIEW</span>
        </h1>
        <p className="text-[#5b637a] font-medium text-lg">
          Platform performance and system health for Zaprint.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="relative rounded-[2rem] border border-black/5 bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-black/[0.02] group transition-all hover:translate-y-[-2px] hover:shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl bg-[#0a1128]/5 text-[#0a1128]`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-black text-[#0a1128]/30">
                  {card.label}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-[#0a1128] tracking-tighter">
                  {card.value}
                </p>
              </div>
              {/* Subtle accent bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#0a1128]/5 group-hover:bg-[#0a1128] transition-colors" />
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders Trend Chart */}
        <div className="rounded-[2.5rem] border border-black/5 bg-white/80 backdrop-blur-sm p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-black text-[#0a1128] uppercase tracking-tight">
                Order <span className="text-[#0a1128]/40">Trend</span>
              </h2>
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#5b637a"
                  tick={{ fontSize: 11, fontWeight: 600 }}
                  tickFormatter={(val) => {
                    const d = new Date(val)
                    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#5b637a"
                  tick={{ fontSize: 11, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.05)",
                    borderRadius: "16px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    fontWeight: 600
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  fill="url(#orderGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-[#5b637a]/40 bg-black/5 rounded-[2rem] border border-dashed border-black/10">
              <ShoppingCart className="w-8 h-8 mb-2 opacity-20" />
              <p className="font-bold text-sm tracking-tight">No data available for this period</p>
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="rounded-[2.5rem] border border-black/5 bg-white/80 backdrop-blur-sm p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <IndianRupee className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-[#0a1128] uppercase tracking-tight">
                Revenue <span className="text-[#0a1128]/40">Analytics</span>
              </h2>
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#5b637a"
                  tick={{ fontSize: 11, fontWeight: 600 }}
                  tickFormatter={(val) => {
                    const d = new Date(val)
                    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#5b637a"
                  tick={{ fontSize: 11, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.05)",
                    borderRadius: "16px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    fontWeight: 600
                  }}
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#0a1128"
                  radius={[8, 8, 8, 8]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-[#5b637a]/40 bg-black/5 rounded-[2rem] border border-dashed border-black/10">
              <IndianRupee className="w-8 h-8 mb-2 opacity-20" />
              <p className="font-bold text-sm tracking-tight">No data available for this period</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Status Distribution */}
        <div className="rounded-[2.5rem] border border-black/5 bg-white/80 backdrop-blur-sm p-8 shadow-xl">
          <h2 className="text-xl font-black text-[#0a1128] uppercase tracking-tight mb-8">
            Order <span className="text-[#0a1128]/40">Status</span>
          </h2>
          {pieData.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "none",
                      borderRadius: "16px",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      fontWeight: 600
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-3 p-3 rounded-2xl bg-black/5">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: d.color }}
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-black text-[#0a1128]/40">{d.name}</span>
                      <span className="text-sm font-black text-[#0a1128]">{d.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] font-bold text-[#5b637a]/40 bg-black/5 rounded-[2rem] border border-dashed border-black/10">
              No orders yet
            </div>
          )}
        </div>

        {/* Shop Performance */}
        <div className="rounded-[2.5rem] border border-black/5 bg-white/80 backdrop-blur-sm p-8 shadow-xl">
          <h2 className="text-xl font-black text-[#0a1128] uppercase tracking-tight mb-8">
            Shop <span className="text-[#0a1128]/40">Performance</span>
          </h2>
          {shopPerformance.length > 0 ? (
            <div className="space-y-4">
              {shopPerformance.slice(0, 5).map((shop, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-black/5 bg-white/50 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Store className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[#0a1128] text-sm font-black uppercase tracking-tight truncate max-w-[120px]">
                        {shop.name}
                      </p>
                      <p className="text-[#5b637a] text-xs font-medium">
                        {shop.orders} orders
                      </p>
                    </div>
                  </div>
                  <p className="text-emerald-600 text-sm font-black">
                    ₹{shop.revenue.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] font-bold text-[#5b637a]/40 bg-black/5 rounded-[2rem] border border-dashed border-black/10">
              No shop data yet
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="rounded-[2.5rem] border border-black/5 bg-white/80 backdrop-blur-sm p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-[#0a1128] uppercase tracking-tight">
              Recent <span className="text-[#0a1128]/40">Activity</span>
            </h2>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order: any) => (
                <div
                  key={order.id}
                  className="group flex items-center justify-between p-4 rounded-2xl border border-black/5 bg-white/50 hover:bg-white hover:border-[#0a1128]/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      order.status === 'completed' ? 'bg-green-500/10' : 'bg-blue-500/10'
                    }`}>
                      <ShoppingCart className={`h-4 w-4 ${
                        order.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-[#0a1128] text-sm font-black uppercase tracking-tight truncate max-w-[150px]">
                        {order.order_items?.[0]?.file_name || "Order"}
                      </p>
                      <p className="text-[#5b637a] text-[10px] font-bold">
                        {order.shops?.shop_name || "Shop"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#0a1128] text-sm font-black">
                      ₹{Number(order.total_amount).toLocaleString("en-IN")}
                    </p>
                    <p className="text-[#5b637a]/50 text-[10px] font-bold uppercase tracking-widest">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] font-bold text-[#5b637a]/40 bg-black/5 rounded-[2rem] border border-dashed border-black/10">
              No orders yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
