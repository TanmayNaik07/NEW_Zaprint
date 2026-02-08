import { OverviewCards } from "@/components/dashboard/overview-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardOverview() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-foreground text-2xl md:text-3xl font-semibold mb-2">Welcome back to Zaprint</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your printing activity.</p>
      </div>

      {/* Summary Cards */}
      <OverviewCards />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}
