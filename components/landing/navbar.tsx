import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-1.5 bg-white rounded-md shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-shadow group-hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]">
              <Sparkles className="h-4 w-4 text-black fill-black" />
            </div>
            <span className="text-lg font-medium tracking-tight text-white">{APP_NAME}</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Button asChild className="bg-white text-black hover:bg-zinc-200 font-medium px-6 rounded-full">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
