"use client"

import { Suspense, useEffect } from "react"
import { Printer } from "lucide-react"
import AnimatedSignIn from "@/components/ui/animated-sign-in"
import { useNavigationLoading } from "@/components/providers/navigation-loading-provider"

function LoginLoading() {
  return (
    <div className="min-h-screen bg-[#f7f6f4] flex items-center justify-center">
      <div className="w-10 h-10 rounded-xl bg-[#0a1128] flex items-center justify-center animate-pulse">
        <Printer className="w-6 h-6 text-white" />
      </div>
    </div>
  )
}

function LoginContent() {
  const { stopLoading } = useNavigationLoading()

  useEffect(() => {
    // Stop loading when the page mounts
    stopLoading()
  }, [stopLoading])

  return <AnimatedSignIn />
}

export default function LoginPage() {
  return (
    <div className="zaprint-theme">
      <Suspense fallback={<LoginLoading />}>
        <LoginContent />
      </Suspense>
    </div>
  )
}
