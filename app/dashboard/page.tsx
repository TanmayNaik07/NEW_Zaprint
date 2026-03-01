"use client"

import { useState, useEffect } from "react"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { createClient } from "@/lib/supabase/client"

export default function DashboardOverview() {
  const [stats, setStats] = useState({ activeJobs: 0, completedMonth: 0, avgTime: "5 min" })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsLoading(false)
        return
      }

      // Fetch all data in parallel for speed
      const [ordersRes, activeRes, completedRes] = await Promise.all([
        supabase
          .from('orders')
          .select(`*, order_items (file_name, copies, pages_per_sheet)`)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .not('status', 'in', '("completed","cancelled")'),
        supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'completed'),
      ])

      setRecentOrders(ordersRes.data || [])
      setStats({
        activeJobs: activeRes.count || 0,
        completedMonth: completedRes.count || 0,
        avgTime: "5 min",
      })
      setIsLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header with Kent Printed font style */}
      <div className="relative">
        <h1 className="font-rubik-dirt text-[#1a1408] text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
          Welcome back to Zaprint
        </h1>
        <p className="text-[#6b5d45] text-sm md:text-base mt-2 tracking-wide">
          Here&apos;s an overview of your printing activity.
        </p>

        {/* Dashed separator line */}
        <div className="mt-6 border-t-[3px] border-dashed border-[#1a1408]/70 w-full" />
      </div>

      {/* Summary Cards - Sticky Note Style */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative bg-gradient-to-br from-[#f5e6c8] via-[#ede0c8] to-[#e8d5b0] rounded-sm p-7 h-40 animate-pulse shadow-[4px_4px_12px_rgba(0,0,0,0.1)]"
              style={{
                transform: `rotate(${i === 1 ? '-2deg' : i === 2 ? '1deg' : '-1deg'})`,
              }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#d4c5a0]/60 rounded-sm" />
              <div className="h-4 w-20 bg-[#3a3120]/10 rounded mb-4 mt-4" />
              <div className="h-10 w-24 bg-[#3a3120]/10 rounded mb-3" />
              <div className="h-3 w-28 bg-[#3a3120]/10 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <OverviewCards stats={stats} />
      )}

      {/* Dashed separator line */}
      <div className="border-t-[3px] border-dashed border-[#1a1408]/70 w-full" />

      {/* Recent Activity */}
      {isLoading ? (
        <div className="rounded-sm bg-gradient-to-br from-[#f5e6c8] via-[#ede0c8] to-[#e8d5b0] p-6 animate-pulse shadow-[4px_4px_12px_rgba(0,0,0,0.1)]">
          <div className="h-6 w-40 bg-[#3a3120]/10 rounded mb-6" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 py-4 border-b border-[#3a3120]/10 last:border-0">
              <div className="w-10 h-10 rounded-lg bg-[#3a3120]/10" />
              <div className="flex-1">
                <div className="h-4 w-40 bg-[#3a3120]/10 rounded mb-2" />
                <div className="h-3 w-24 bg-[#3a3120]/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <RecentActivity orders={recentOrders} />
      )}
    </div>
  )
}
