import type React from "react"
import type { Metadata } from "next"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { createClient } from "@/lib/supabase/server"

import { OnboardingModal } from "@/components/dashboard/onboarding-modal"
import { DashboardLoadingStop } from "@/components/dashboard/loading-stop"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Dashboard — Zaprint",
  robots: {
    index: false,
    follow: false,
  },
}

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
    <div className="zaprint-theme min-h-screen bg-[#f7f6f4] flex relative">
      {/* Paper texture background overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: "url('/images/paper-texture.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          mixBlendMode: "multiply",
        }}
      />
      <DashboardSidebar />
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative z-[1]">
        <DashboardLoadingStop />
        <OnboardingModal isOpen={showOnboarding} />
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

