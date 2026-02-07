
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { FileText, Clock, Store, CheckCircle2, XCircle, Printer } from "lucide-react"

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
        name,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
      case "processing": return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
      case "printing": return "bg-purple-500/20 text-purple-500 hover:bg-purple-500/30"
      case "completed": return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
      case "cancelled": return "bg-red-500/20 text-red-500 hover:bg-red-500/30"
      default: return "bg-zinc-500/20 text-zinc-500"
    }
  }
  
   const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />
      case "processing": return <FileText className="w-4 h-4" />
      case "printing": return <Printer className="w-4 h-4" />
      case "completed": return <CheckCircle2 className="w-4 h-4" />
      case "cancelled": return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-foreground text-2xl md:text-3xl font-semibold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your print requests.</p>
      </div>

      <div className="space-y-4">
        {orders && orders.length > 0 ? (
          orders.map((order: any) => (
            <Card key={order.id} className="bg-white/5 border-white/10 hover:bg-white/[0.07] transition-colors">
              <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{order.shops?.name || "Unknown Shop"}</h3>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.created_at), "PPP p")}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={`border-0 gap-1.5 capitalize ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </Badge>
              </CardHeader>
              
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                    {order.order_items?.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                             <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-white/5">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium line-clamp-1">{item.file_name}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className="capitalize">{item.color_mode === 'bw' ? 'B&W' : 'Color'}</span>
                                        <span>•</span>
                                        <span>{item.copies} Cop{item.copies > 1 ? 'ies' : 'y'}</span>
                                    </div>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                     <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">Order ID: {order.id}</p>
                     <p className="text-lg font-bold">${order.total_amount}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No orders yet</h3>
          </div>
        )}
      </div>
    </div>
  )
}
