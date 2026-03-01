'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

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

function TopProgressBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]">
      <div
        className="h-full bg-[#0a1128] animate-progress-bar"
        style={{
          animation: 'progressBar 1.5s ease-in-out infinite',
        }}
      />
      <style jsx>{`
        @keyframes progressBar {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  )
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
      {isLoading && <TopProgressBar />}
      {children}
    </NavigationLoadingContext.Provider>
  )
}
