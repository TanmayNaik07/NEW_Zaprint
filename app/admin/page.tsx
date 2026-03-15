"use client"

import { useState, useEffect } from "react"
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

  useEffect(() => {
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
    fetchStats()
  }, [])

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
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-white/40 mt-2">Loading analytics...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-[120px] rounded-2xl bg-white/5 animate-pulse border border-white/5"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[350px] rounded-2xl bg-white/5 animate-pulse border border-white/5" />
          <div className="h-[350px] rounded-2xl bg-white/5 animate-pulse border border-white/5" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-white/40 mt-2">
          Platform overview and analytics for Zaprint
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`relative rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.color} p-5 backdrop-blur-sm overflow-hidden group hover:scale-[1.02] transition-transform`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/50 text-sm font-medium tracking-wide uppercase">
                {card.label}
              </span>
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">
              {card.value}
            </p>
            {/* Glow effect */}
            <div
              className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full ${card.iconColor} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`}
            />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Trend Chart */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">
              Orders (Last 30 Days)
            </h2>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="orderGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                  tickFormatter={(val) => {
                    const d = new Date(val)
                    return `${d.getDate()}/${d.getMonth() + 1}`
                  }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  fill="url(#orderGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-white/30">
              No order data yet
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <IndianRupee className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">
              Revenue (Last 30 Days)
            </h2>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                  tickFormatter={(val) => {
                    const d = new Date(val)
                    return `${d.getDate()}/${d.getMonth() + 1}`
                  }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  formatter={(value: number) => [
                    `₹${value.toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                />
                <Bar
                  dataKey="revenue"
                  fill="url(#revenueGradient)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-white/30">
              No revenue data yet
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Order Status Pie + Shop Performance + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Distribution */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Order Status
          </h2>
          {pieData.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="text-white/50 text-xs">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-white/30">
              No orders yet
            </div>
          )}
        </div>

        {/* Shop Performance */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Shop Performance
          </h2>
          {shopPerformance.length > 0 ? (
            <div className="space-y-4">
              {shopPerformance.slice(0, 5).map((shop, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Store className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium truncate max-w-[120px]">
                        {shop.name}
                      </p>
                      <p className="text-white/40 text-xs">
                        {shop.orders} orders
                      </p>
                    </div>
                  </div>
                  <p className="text-emerald-400 text-sm font-semibold">
                    ₹{shop.revenue.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-white/30">
              No shop data yet
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Recent Orders
          </h2>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.slice(0, 5).map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      {order.order_items?.[0]?.file_name || "Order"}
                    </p>
                    <p className="text-white/40 text-xs">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                      {" · "}
                      {order.shops?.name || "Shop"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">
                      ₹{Number(order.total_amount).toLocaleString("en-IN")}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === "completed"
                          ? "bg-green-500/10 text-green-400"
                          : order.status === "pending"
                            ? "bg-orange-500/10 text-orange-400"
                            : order.status === "cancelled"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-white/30">
              No orders yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
