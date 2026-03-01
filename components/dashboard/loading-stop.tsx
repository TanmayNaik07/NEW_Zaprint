"use client"

import { useEffect } from "react"
import { useNavigationLoading } from "@/components/providers/navigation-loading-provider"

export function DashboardLoadingStop() {
  const { stopLoading } = useNavigationLoading()

  useEffect(() => {
    stopLoading()
  }, [stopLoading])

  return null
}
