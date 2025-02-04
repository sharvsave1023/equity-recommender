'use client'

import { Button } from "@/components/ui/button"
import { SideNav } from "@/components/side-nav"
import { ScrollingTickers } from "@/components/scrolling-tickers"
import { Preloader } from "@/components/preloader"
import { useEffect, useState } from 'react'

export default function Page() {
  const [isFirstVisit, setIsFirstVisit] = useState(true)

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited')
    setIsFirstVisit(!hasVisited)
  }, [])

  const baseDelay = isFirstVisit ? 3.5 : 1
  
  return (
    <>
      <Preloader />
      <div className="fixed inset-0 min-h-screen w-full overflow-hidden bg-black opacity-0 animate-fade-in" style={{ animationDelay: `${baseDelay}s` }}>
        <div className="absolute inset-0 w-full h-full z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-30"
          >
            <source 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/31251-385265625_small-I8P33QBfpLSdc5y3dAnk9RWCw5GEyQ.mp4" 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
        </div>

        <SideNav />

        <div className="relative z-10 w-full h-full flex flex-col">
          <div className="p-12 pr-24 sm:pr-12">
            <h1 className="text-2xl font-extralight tracking-tight text-white opacity-0 animate-fade-in" style={{ animationDelay: `${baseDelay + 0.3}s` }}>
              Trade<span className="text-green-400">X</span>
            </h1>
          </div>

          <div className="flex-1 flex flex-col justify-center px-12 pr-24 sm:pr-12 space-y-12 -mt-48 md:-mt-32">
            <div className="space-y-4 max-w-4xl md:ml-[240px]">
              <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extralight tracking-wide leading-tight bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent opacity-0 animate-fade-in" style={{ animationDelay: `${baseDelay + 0.5}s` }}>
                Elevate your <span className="text-green-400">wealth</span>, amplify your future
              </h2>
              <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-extralight text-white/80 tracking-wider opacity-0 animate-fade-in" style={{ animationDelay: `${baseDelay + 0.7}s` }}>
                Where AI meets <span className="text-green-400">financial excellence</span>
              </p>
              <div className="pt-4 opacity-0 animate-fade-in" style={{ animationDelay: `${baseDelay + 0.9}s` }}>
                <Button 
                  variant="ghost" 
                  size="lg"
                  className="text-lg sm:text-xl md:text-3xl font-extralight text-white bg-black/20 backdrop-blur-sm rounded-[999px] hover:bg-white/10 px-6 py-4 h-auto border border-white/10 transition-all duration-300 hover:scale-105"
                >
                  Try now
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-12 left-12 pr-24 sm:pr-12 z-20">
          <p className="text-2xl text-white/80 font-extralight tracking-wide opacity-0 animate-fade-in" style={{ animationDelay: `${baseDelay + 1.1}s` }}>
            Your portfolio, <span className="text-green-400">reimagined</span>
          </p>
        </div>

        <ScrollingTickers />
      </div>
    </>
  )
}

