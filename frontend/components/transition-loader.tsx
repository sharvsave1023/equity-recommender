'use client'

import { useEffect, useState } from 'react'

export function TransitionLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative">
        <div className="w-16 h-16">
          <div className="absolute inset-0 border-2 border-green-500/30 rounded-full animate-spin-slow" />
          <div className="absolute inset-0 border-t-2 border-green-400 rounded-full animate-spin" style={{ animationDuration: '0.5s' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-light text-white/70">
            Trade<span className="text-green-400">X</span>
          </span>
        </div>
      </div>
    </div>
  )
}

