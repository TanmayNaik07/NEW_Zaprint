import { createClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/admin"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Fetch all stats in parallel
  const [
    ordersRes,
    completedOrdersRes,
    pendingOrdersRes,
    cancelledOrdersRes,
    paidOrdersRes,
    inQueueOrdersRes,
    processingOrdersRes,
    printingOrdersRes,
    readyOrdersRes,
    shopsRes,
    profilesRes,
    revenueRes,
    recentOrdersRes,
    feedbackRes,
    monthlyOrdersRes,
  ] = await Promise.all([
    // Total orders
    supabase.from("orders").select("*", { count: "exact", head: true }),
    // Completed orders
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed"),
    // Pending orders
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    // Cancelled orders
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "cancelled"),
    // Paid orders
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "paid"),
    // In Queue orders
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_queue"),
    // Processing orders
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "processing"),
    // Printing orders
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "printing"),
    // Ready orders
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "ready"),
    // Total shops
    supabase.from("shops").select("*", { count: "exact", head: true }),
    // Total users
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    // Total revenue (sum of completed orders)
    supabase
      .from("orders")
      .select("total_amount")
      .eq("status", "completed"),
    // Recent orders (last 10)
    supabase
      .from("orders")
      .select("*, order_items(file_name, copies), shops:shop_id(shop_name)")
      .order("created_at", { ascending: false })
      .limit(10),
    // Total feedback
    supabase.from("feedback").select("*", { count: "exact", head: true }),
    // Orders in last 30 days grouped by day
    supabase
      .from("orders")
      .select("created_at, total_amount, status")
      .gte(
        "created_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      )
      .order("created_at", { ascending: true }),
  ])

  // Calculate total revenue
  const totalRevenue =
    revenueRes.data?.reduce(
      (sum, order) => sum + Number(order.total_amount),
      0
    ) || 0

  // Group orders by day for chart data
  const dailyData: Record<
    string,
    { date: string; orders: number; revenue: number }
  > = {}
  monthlyOrdersRes.data?.forEach((order) => {
    const date = new Date(order.created_at).toISOString().split("T")[0]
    if (!dailyData[date]) {
      dailyData[date] = { date, orders: 0, revenue: 0 }
    }
    dailyData[date].orders++
    if (order.status === "completed") {
      dailyData[date].revenue += Number(order.total_amount)
    }
  })

  // Group orders by shop for shop performance
  const shopOrders: Record<string, { name: string; orders: number; revenue: number }> = {}
  recentOrdersRes.data?.forEach((order: any) => {
    const shopName = order.shops?.shop_name || "Unknown Shop"
    const shopId = order.shop_id
    if (!shopOrders[shopId]) {
      shopOrders[shopId] = { name: shopName, orders: 0, revenue: 0 }
    }
    shopOrders[shopId].orders++
    if (order.status === "completed") {
      shopOrders[shopId].revenue += Number(order.total_amount)
    }
  })

  return NextResponse.json({
    stats: {
      totalOrders: ordersRes.count || 0,
      completedOrders: completedOrdersRes.count || 0,
      pendingOrders: pendingOrdersRes.count || 0,
      cancelledOrders: cancelledOrdersRes.count || 0,
      paidOrders: paidOrdersRes.count || 0,
      inQueueOrders: inQueueOrdersRes.count || 0,
      processingOrders: processingOrdersRes.count || 0,
      printingOrders: printingOrdersRes.count || 0,
      readyOrders: readyOrdersRes.count || 0,
      totalShops: shopsRes.count || 0,
      totalUsers: profilesRes.count || 0,
      totalRevenue,
      totalFeedback: feedbackRes.count || 0,
    },
    chartData: Object.values(dailyData),
    recentOrders: recentOrdersRes.data || [],
    shopPerformance: Object.values(shopOrders),
  })
}
