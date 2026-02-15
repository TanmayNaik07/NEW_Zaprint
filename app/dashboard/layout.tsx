import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="zaprint-theme min-h-screen bg-background flex">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden ml-[4rem]">
        <div className="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
