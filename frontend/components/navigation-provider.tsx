'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { TransitionLoader } from './transition-loader'

const NavigationContext = createContext({ isNavigating: false })

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Don't show transition loader on first load
    if (typeof window !== 'undefined' && !localStorage.getItem('hasVisited')) {
      return
    }

    setIsNavigating(true)
    const timer = setTimeout(() => {
      setIsNavigating(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <NavigationContext.Provider value={{ isNavigating }}>
      {isNavigating && <TransitionLoader />}
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigation = () => useContext(NavigationContext)

