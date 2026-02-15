"use client"

import { useEffect } from "react"
import AnimatedSignUp from "@/components/ui/animated-sign-up"
import { useNavigationLoading } from "@/components/providers/navigation-loading-provider"

export default function SignupPage() {
  const { stopLoading } = useNavigationLoading()

  useEffect(() => {
    // Stop loading when the page mounts
    stopLoading()
  }, [stopLoading])

  return (
    <div className="zaprint-theme">
      <AnimatedSignUp />
    </div>
  )
}
