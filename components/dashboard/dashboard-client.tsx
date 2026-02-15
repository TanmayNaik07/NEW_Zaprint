'use client'

import { useEffect, ReactNode } from 'react'
import { useNavigationLoading } from '@/components/providers/navigation-loading-provider'

export function DashboardClient({ children }: { children: ReactNode }) {
  const { stopLoading } = useNavigationLoading()

  useEffect(() => {
    // Stop loading when the dashboard mounts
    stopLoading()
  }, [stopLoading])

  return <>{children}</>
}
