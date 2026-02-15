import { createClient } from "@/lib/supabase/server"
import OrdersList from "./components/OrdersList"

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const supabase = await createClient()

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-semibold">Please log in to view your orders</h2>
      </div>
    )
  }

  // Fetch orders with items first (known to work)
  const { data: rawOrders, error: ordersError } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (ordersError) {
    console.error("Error fetching orders:", ordersError)
    return <div className="text-destructive">Error loading orders.</div>
  }

  // Manually fetch shops to avoid potential join issues
  let ordersWithShops = rawOrders || []
  const shopIds = Array.from(new Set(rawOrders?.map((o: any) => o.shop_id).filter(Boolean))) as string[]

  if (shopIds.length > 0) {
    const { data: shops, error: shopsError } = await supabase
      .from("shops")
      .select("id, shop_name, image_url")
      .in("id", shopIds)

    if (shopsError) {
      console.error("Error fetching shops:", shopsError)
      // Continue without shops info if this fails, rather than breaking the page
    } else {
      const shopMap = new Map(shops?.map(s => [s.id, s]))
      ordersWithShops = ordersWithShops.map((order: any) => ({
        ...order,
        shops: order.shop_id ? shopMap.get(order.shop_id) : null
      }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-foreground text-2xl md:text-3xl font-semibold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your print requests.</p>
      </div>

      <OrdersList initialOrders={ordersWithShops} />
    </div>
  )
}
