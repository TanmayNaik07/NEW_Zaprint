'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import CubeLoader from '@/components/ui/cube-loader'

interface NavigationLoadingContextType {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType>({
  isLoading: false,
  startLoading: () => { },
  stopLoading: () => { },
})

export function useNavigationLoading() {
  return useContext(NavigationLoadingContext)
}

export function NavigationLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)

  const startLoading = useCallback(() => {
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <NavigationLoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {isLoading && <CubeLoader />}
      {children}
    </NavigationLoadingContext.Provider>
  )
}
