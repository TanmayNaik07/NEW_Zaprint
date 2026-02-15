import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardTopBar } from "@/components/dashboard/top-bar"

import { createClient } from "@/lib/supabase/server"

import { OnboardingModal } from "@/components/dashboard/onboarding-modal"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  // Check if profile is complete
  const { data: profile } = await supabase
    .from('profiles')
    .select('phone_number, pincode')
    .eq('id', user.id)
    .single()

  // Show modal if phone or pincode is missing
  const showOnboarding = !profile?.phone_number || !profile?.pincode

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <OnboardingModal isOpen={showOnboarding} />
        <div className="hidden md:block">
          <DashboardTopBar />
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}

