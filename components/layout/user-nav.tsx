'use client'

import { LogOut, Settings, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import type { UserSummary } from '@/types'

type UserNavProps = {
  user?: UserSummary | null
}

export function UserNav({ user }: UserNavProps) {
  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white/10 focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all">
          <Avatar className="h-8 w-8 ring-1 ring-white/10">
            <AvatarImage src={user?.avatar_url || undefined} />
            <AvatarFallback className="bg-zinc-900 text-zinc-400 text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-900">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{user?.full_name || 'User'}</span>
            <span className="text-xs text-zinc-500 font-normal">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-900" />
        <DropdownMenuItem asChild className="focus:bg-zinc-900 focus:text-white text-zinc-400">
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-900" />
        <DropdownMenuItem className="text-zinc-400 focus:text-red-400 focus:bg-red-950/20">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
