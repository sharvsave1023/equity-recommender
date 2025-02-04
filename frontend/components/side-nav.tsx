import { Home, Layout, Info } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SideNav() {
  const isOnPlatform = typeof window !== 'undefined' && window.location.pathname === '/platform'

  return (
    <div className="fixed right-4 top-4 md:right-auto md:left-8 md:top-1/2 md:-translate-y-1/2 p-4 z-20">
      <nav className="flex md:flex-col gap-4 bg-black/20 backdrop-blur-sm p-3 rounded-[999px] border border-white/10">
        <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link href="/" aria-label="Home">
            <Home className="h-5 w-5" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Link href="/platform" aria-label="Platform">
            <Layout className="h-5 w-5" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Link href="/about" aria-label="About">
            <Info className="h-5 w-5" />
          </Link>
        </Button>
      </nav>
    </div>
  )
}

