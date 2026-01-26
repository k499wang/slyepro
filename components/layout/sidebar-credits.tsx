import Link from 'next/link'
import { Coins, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type SidebarCreditsProps = {
  credits: number
}

export function SidebarCredits({ credits }: SidebarCreditsProps) {
  return (
    <div className="p-4 border-t border-zinc-800">
      <div className="bg-zinc-900 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <Coins className="h-4 w-4" />
            <span className="text-sm">Credits</span>
          </div>
          <span className="text-lg font-bold text-white">{credits}</span>
        </div>
        <Button asChild size="sm" className="w-full" variant="secondary">
          <Link href="/dashboard/credits">
            <Plus className="h-4 w-4 mr-1" />
            Buy Credits
          </Link>
        </Button>
      </div>
    </div>
  )
}
