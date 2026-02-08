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

  // Fetch orders
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      shops (
        shop_name,
        image_url
      ),
      order_items (
        *
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return <div className="text-destructive">Error loading orders.</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-foreground text-2xl md:text-3xl font-semibold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your print requests.</p>
      </div>

      <OrdersList initialOrders={orders || []} />
    </div>
  )
}
