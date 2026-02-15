"use client"

import { Suspense, useEffect } from "react"
import { Printer } from "lucide-react"
import AnimatedSignIn from "@/components/ui/animated-sign-in"
import { useNavigationLoading } from "@/components/providers/navigation-loading-provider"

function LoginLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
        <Printer className="w-6 h-6 text-primary" />
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
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  )
}
