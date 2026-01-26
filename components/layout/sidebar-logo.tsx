import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'

export function SidebarLogo() {
  return (
    <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
      <Link href="/dashboard" className="flex items-center gap-3">
        <div className="p-1.5 bg-white rounded-md shadow-sm shadow-white/10">
          <Sparkles className="h-4 w-4 text-black fill-black" />
        </div>
        <span className="text-lg font-medium tracking-tight text-white">{APP_NAME}</span>
      </Link>
    </div>
  )
}
