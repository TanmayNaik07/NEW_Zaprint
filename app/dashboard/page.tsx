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

      {/* Summary Cards - Clean Paper + Tape Style */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative rounded-[2px] p-7 h-[180px] animate-pulse overflow-visible"
              style={{
                backgroundImage: `url('/images/new-paper.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '2px 3px 10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
                transform: `rotate(${i === 1 ? '-1.5deg' : i === 2 ? '0.8deg' : '-0.5deg'})`,
              }}
            >
              {/* Masking tape at top center */}
              <img
                src="/images/tape.svg"
                alt=""
                className="absolute top-0 left-1/2 w-14 h-14 object-contain opacity-90 drop-shadow-sm pointer-events-none z-20"
                style={{ transform: 'translateX(-50%) translateY(-40%)' }}
              />
              <div className="h-4 w-20 bg-[#3a3120]/10 rounded mb-4 mt-6" />
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
        <div
          className="rounded-[2px] p-6 animate-pulse relative overflow-visible"
          style={{
            backgroundImage: `url('/images/new-paper.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '2px 3px 10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          {/* Masking tape at top-left corner */}
          <img
            src="/images/tape.svg"
            alt=""
            className="absolute top-0 left-0 w-14 h-14 object-contain opacity-90 drop-shadow-sm pointer-events-none z-20"
            style={{ transform: 'rotate(-35deg) translateY(-50%) translateX(-30%)' }}
          />
          {/* Masking tape at top-right corner */}
          <img
            src="/images/tape.svg"
            alt=""
            className="absolute top-0 right-2 w-14 h-14 object-contain opacity-90 drop-shadow-sm pointer-events-none z-20"
            style={{ transform: 'rotate(25deg) translateY(-40%)' }}
          />
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
