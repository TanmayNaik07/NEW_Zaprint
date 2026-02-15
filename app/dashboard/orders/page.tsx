import { createClient } from "@/lib/supabase/server"
import { OrdersList } from "./components/OrdersList"

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
      id, created_at, status, total_amount, user_id, receipt_number, order_number,
      shops:shop_id (
        shop_name,
        image_url,
        location,
        phone
      ),
      order_items (
        id,
        file_name,
        file_type,
        color_mode,
        copies,
        pages_per_sheet
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10) // Reduced limit to prevent timeout

  if (error) {
    console.error("Error fetching orders:", error)
    // Return empty state instead of error to let page render
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-foreground text-2xl md:text-3xl font-semibold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your print requests.</p>
        </div>
        <div className="text-destructive bg-destructive/10 p-4 rounded-lg">
          Unable to load orders. Please check your connection and try again.
        </div>
      </div>
    )
  }


  // Normalize the data structure to ensure shops is an object, not an array
  const normalizedOrders = (orders || []).map(order => ({
    ...order,
    shops: Array.isArray(order.shops) ? order.shops[0] : order.shops
  }))

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-foreground text-2xl md:text-3xl font-semibold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your print requests.</p>
      </div>

      <OrdersList initialOrders={normalizedOrders} userId={user.id} />
    </div>
  )
}
