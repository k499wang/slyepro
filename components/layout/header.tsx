import { MobileNav } from './mobile-nav'
import { UserNav } from './user-nav'
import type { UserSummary } from '@/types'

type HeaderProps = {
  user?: UserSummary | null
  credits?: number
}

export function Header({ user, credits = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <MobileNav credits={credits} />
        <div className="flex-1" />
        <UserNav user={user} />
      </div>
    </header>
  )
}
