'use client'

import { SidebarNav } from './sidebar-nav'
import { SidebarLogo } from './sidebar-logo'
import { SidebarCredits } from './sidebar-credits'

type SidebarProps = {
  credits?: number
}

export function Sidebar({ credits = 0 }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow bg-sidebar border-r border-sidebar-border">
        <SidebarLogo />
        <SidebarNav />
        <SidebarCredits credits={credits} />
      </div>
    </aside>
  )
}
