'use client'

import { useEffect, useState } from 'react'

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [shouldShow, setShouldShow] = useState(true)

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisited')
    if (hasVisited) {
      setShouldShow(false)
      return
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
      localStorage.setItem('hasVisited', 'true')
    }, 3800)

    const counter = setInterval(() => {
      setCount(prev => (prev < 100 ? prev + 1 : prev))
    }, 35)

    return () => {
      clearTimeout(timer)
      clearInterval(counter)
    }
  }, [])

  if (!isLoading || !shouldShow) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 pointer-events-none" style={{ opacity: count === 100 ? 0 : 1 }}>
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border border-white/10 rounded-full animate-expand"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </div>
      </div>

      <div className="relative flex flex-col items-center">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-green-500/50 to-transparent" />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border border-green-500/30 animate-morph" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-light text-white/70 tabular-nums">
                  {count.toString().padStart(3, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 overflow-hidden">
          <div className="flex items-baseline space-x-1 text-2xl font-extralight">
            <span className="inline-block text-white/90 animate-reveal" style={{ animationDelay: '0.15s' }}>
              Trade
            </span>
            <span className="inline-block text-green-400 animate-reveal-x" style={{ animationDelay: '0.3s' }}>
              X
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px">
          <div 
            className="h-full bg-gradient-to-r from-transparent via-green-500 to-transparent transition-all duration-300"
            style={{ width: `${count}%`, opacity: count < 100 ? 1 : 0 }}
          />
        </div>
      </div>
    </div>
  )
}

