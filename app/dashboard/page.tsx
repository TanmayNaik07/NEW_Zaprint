
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export default async function DashboardOverview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let activeJobs = 0
  let completed = 0
  let recentOrders: any[] = []

  if (user) {
    // 1. Fetch recent orders (limit 5) for activity list
    const { data: orders } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          file_name,
          copies,
          pages_per_sheet
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
    
    recentOrders = orders || []

    // 2. Fetch stats
    // Active: status != completed and != cancelled
    const { count: activeCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .not('status', 'in', '("completed","cancelled")')
    
    activeJobs = activeCount || 0

    // Completed: status == completed
    const { count: completedCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed')
    
    completed = completedCount || 0
  }

  const stats = {
      activeJobs,
      completedMonth: completed, // Assuming total completed for now
      avgTime: "5 min" // Static for now, hard to calculate without completed_at column
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-foreground text-2xl md:text-3xl font-semibold mb-2">Welcome back to Zaprint</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your printing activity.</p>
      </div>

      {/* Summary Cards */}
      <OverviewCards stats={stats} />

      {/* Recent Activity */}
      <RecentActivity orders={recentOrders} />
    </div>
  )
}
