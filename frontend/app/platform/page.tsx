'use client'

import { SideNav } from "@/components/side-nav"

export default function PlatformPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
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
          <h1 className="text-2xl font-extralight tracking-tight text-white">
            Trade<span className="text-green-400">X</span>
          </h1>
        </div>

        <div className="px-4 pb-4 md:px-12 md:pb-12">
          <div className="mx-4 md:mx-0 md:ml-[120px] w-[calc(100%-32px)] md:w-[calc(100%-120px)] h-[calc(100vh-180px)] rounded-3xl bg-black/20 backdrop-blur-sm border border-white/10">
          </div>
        </div>
      </div>

    </div>
  )
}

