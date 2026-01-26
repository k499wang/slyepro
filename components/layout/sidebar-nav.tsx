'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Sparkles, Clock, Coins } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Generate', href: '/dashboard/generate', icon: Sparkles },
  { name: 'History', href: '/dashboard/history', icon: Clock },
  { name: 'Credits', href: '/dashboard/credits', icon: Coins },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 px-4 py-6 space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
            )}
          >
            <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-200")} />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
