import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        {/* Mobile top padding for fixed header */}
        <div className="md:hidden h-16" />
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
